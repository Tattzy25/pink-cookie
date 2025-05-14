import { type NextRequest, NextResponse } from "next/server"
import { calculateDistance } from "@/lib/geo-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address } = body

    if (!address) {
      return NextResponse.json({ error: "Address is required" }, { status: 400 })
    }

    // Use only the server-side token
    const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

    if (!MAPBOX_TOKEN) {
      return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
    }

    // Use the v6 endpoint
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(address)}&proximity=ip&access_token=${MAPBOX_TOKEN}`

    const response = await fetch(url)
    const data = await response.json()

    // Extract the first result's coordinates if available
    if (!data.features || data.features.length === 0) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    const feature = data.features[0]
    const coordinates = feature.geometry.coordinates // [longitude, latitude]

    // Store locations
    const locations = [
      {
        name: "Glendale Store",
        coordinates: [-118.254947, 34.146288], // [longitude, latitude]
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
        coordinates[1], // latitude
        coordinates[0], // longitude
        location.coordinates[1], // latitude
        location.coordinates[0], // longitude
      )

      if (distance < shortestDistance) {
        shortestDistance = distance
        closestStore = location
      }
    }

    const isEligible = shortestDistance <= closestStore.radius

    return NextResponse.json({
      eligible: isEligible,
      distance: shortestDistance.toFixed(1),
      location: closestStore,
      coordinates: coordinates,
      name: feature.properties.name,
      fullAddress: feature.properties.full_address,
      message: isEligible
        ? `Your address is within our delivery area (${shortestDistance.toFixed(1)} miles from ${closestStore.name})`
        : `Sorry, your address is outside our delivery area (${shortestDistance.toFixed(1)} miles from ${closestStore.name}, max ${closestStore.radius} miles)`,
    })
  } catch (error) {
    console.error("Error in delivery check API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
