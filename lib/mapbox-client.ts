/**
 * Mapbox Client-Side Utilities
 *
 * This file contains functions intended for use on the client-side,
 * such as generating static map URLs or getting public configuration.
 */

// Client-safe function that doesn't expose the token
export function getPublicMapboxConfig() {
  return {
    mapStyle: "mapbox://styles/mapbox/streets-v11",
  }
}

// Client-side function for static maps that uses the API endpoint
export async function getStaticMapUrl(
  coordinates: [number, number],
  zoom = 13,
  width = 600,
  height = 400,
  markers: Array<{ coordinates: [number, number]; color: string }> = [],
): Promise<string> {
  try {
    // Use the secure API endpoint to generate the map URL
    const response = await fetch("/api/mapbox/static-map", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates,
        zoom,
        width,
        height,
        markers,
      }),
    })

    if (!response.ok) {
      console.error("Error fetching static map URL")
      return ""
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error generating static map URL:", error)
    return ""
  }
}

// Client-side function for geocoding that uses the API endpoint
export async function geocodeAddress(address: string) {
  try {
    const response = await fetch(`/api/mapbox/geocode?address=${encodeURIComponent(address)}`)

    if (!response.ok) {
      throw new Error(`Geocoding error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error geocoding address:", error)
    return null
  }
}
