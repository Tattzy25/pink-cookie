/**
 * Mapbox API Integration
 *
 * This file contains functions to interact with the Mapbox API
 * for maps, geocoding, and location services.
 */

// Server actions are imported directly where needed, e.g., in API routes or server components.
// Do not re-export them from here to avoid potential bundling issues.

// Client-side functions have been moved to lib/mapbox-client.ts

/**
 * Generates a static map URL from Mapbox
 * @param coordinates - The center coordinates of the map [longitude, latitude]
 * @param zoom - The zoom level of the map
 * @param width - The width of the map in pixels
 * @param height - The height of the map in pixels
 * @param markers - An array of markers to display on the map
 * @returns The static map URL
 */
export function getStaticMapUrl(
  coordinates: [number, number],
  zoom = 13,
  width = 600,
  height = 400,
  markers: Array<{ coordinates: [number, number]; color: string }> = [],
): string {
  const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

  if (!MAPBOX_TOKEN) {
    console.warn("Mapbox token not found")
    return ""
  }

  let url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/`

  if (markers.length > 0) {
    const markerString = markers
      .map((marker) => {
        const [lng, lat] = marker.coordinates
        return `pin-s+${marker.color.replace("#", "")}(${lng},${lat})`
      })
      .join(",")

    url += `${markerString}/`
  }

  const [lng, lat] = coordinates
  url += `${lng},${lat},${zoom}/${width}x${height}?access_token=${MAPBOX_TOKEN}`

  return url
}
