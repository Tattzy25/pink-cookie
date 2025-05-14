import { type NextRequest, NextResponse } from "next/server"

// Server-side token (not exposed to client)
const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

// This is a server-side API route that proxies requests to Mapbox
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const endpoint = searchParams.get("endpoint")
  const query = searchParams.get("query")

  if (!MAPBOX_TOKEN) {
    return NextResponse.json({ error: "Mapbox token not configured" }, { status: 500 })
  }

  if (!endpoint || !query) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
  }

  try {
    // Example for geocoding endpoint
    if (endpoint === "geocoding") {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}`,
      )

      const data = await response.json()
      return NextResponse.json(data)
    }

    // Example for static map endpoint
    if (endpoint === "staticmap") {
      const params = JSON.parse(query)
      const { lng, lat, zoom, width, height, markers } = params

      // Build the static map URL
      let url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/`

      // Add markers if provided
      if (markers && markers.length > 0) {
        const markerString = markers
          .map((marker: any) => {
            return `pin-s+${marker.color.replace("#", "")}(${marker.lng},${marker.lat})`
          })
          .join(",")

        url += `${markerString}/`
      }

      // Add center coordinates and zoom
      url += `${lng},${lat},${zoom}`

      // Add dimensions
      url += `/${width}x${height}`

      // Add access token
      url += `?access_token=${MAPBOX_TOKEN}`

      // Return the URL (client will use this URL directly in an img src)
      return NextResponse.json({ url })
    }

    return NextResponse.json({ error: "Invalid endpoint" }, { status: 400 })
  } catch (error) {
    console.error("Mapbox API error:", error)
    return NextResponse.json({ error: "Failed to fetch from Mapbox API" }, { status: 500 })
  }
}
