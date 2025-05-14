"use server"

import { calculateDistance } from "./geo-utils"

// Server-side only functions for Mapbox API
export async function getMapboxData(address: string) {
  // Use only the server-side token
  const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

  if (!MAPBOX_TOKEN) {
    console.error("Mapbox token not found in environment variables")
    return null
  }

  // Use the v6 endpoint as shown in the example
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(address)}&proximity=ip&access_token=${MAPBOX_TOKEN}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    // Extract the first result's coordinates if available
    if (data.features && data.features.length > 0) {
      const feature = data.features[0]
      return {
        coordinates: feature.geometry.coordinates, // [longitude, latitude]
        name: feature.properties.name,
        fullAddress: feature.properties.full_address,
      }
    }

    return null
  } catch (error) {
    console.error("Error geocoding address:", error)
    return null
  }
}

// Update the checkDeliveryRadius function to handle errors better
export async function checkDeliveryRadius(address: string) {
  try {
    const geocodeResult = await getMapboxData(address)

    if (!geocodeResult) {
      return {
        eligible: false,
        message: "Could not verify address. Please check and try again.",
      }
    }

    // Rest of the function remains the same...
    // Store locations
    const locations = [
      {
        name: "Glendale Store",
        coordinates: [-118.254947, 34.146288], // [longitude, latitude] from your example
        radius: 15, // miles
      },
      {
        name: "Panorama City Store",
        coordinates: [-118.442757, 34.227078], // [longitude, latitude]
        radius: 20, // miles
      },
    ]

    // Find closest store and check if within radius
    let closestStore = null
    let shortestDistance = Number.POSITIVE_INFINITY

    for (const location of locations) {
      const distance = calculateDistance(
        geocodeResult.coordinates[1], // latitude
        geocodeResult.coordinates[0], // longitude
        location.coordinates[1], // latitude
        location.coordinates[0], // longitude
      )

      if (distance < shortestDistance) {
        shortestDistance = distance
        closestStore = location
      }
    }

    const isEligible = closestStore ? shortestDistance <= closestStore.radius : false

    return {
      eligible: isEligible,
      distance: shortestDistance.toFixed(1),
      location: closestStore,
      coordinates: geocodeResult.coordinates,
      message: isEligible
        ? `Your address is within our delivery area (${shortestDistance.toFixed(1)} miles from ${closestStore?.name ?? "nearest store"})`
        : `Sorry, your address is outside our delivery area (${shortestDistance.toFixed(1)} miles from ${closestStore?.name ?? "nearest store"}, max ${closestStore?.radius ?? 0} miles)`,
    }
  } catch (error) {
    console.error("Error checking delivery radius:", error)
    return {
      eligible: false,
      message: "Error checking delivery radius. Please try again later.",
    }
  }
}
