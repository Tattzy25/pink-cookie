import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { coordinates, zoom = 13, width = 600, height = 400, markers = [] } = await request.json()

    // Use server-side token only
    const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

    if (!MAPBOX_TOKEN) {
      return NextResponse.json({ error: "Mapbox configuration missing" }, { status: 500 })
    }

    // Build the static map URL
    let url = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/`

    // Add markers if provided
    if (markers && markers.length > 0) {
      const markerString = markers
        .map((marker: any) => {
          const color = marker.color.replace("#", "")
          return `pin-s+${color}(${marker.coordinates[0]},${marker.coordinates[1]})`
        })
        .join(",")

      url += `${markerString}/`
    }

    // Add center coordinates and zoom
    const [lng, lat] = coordinates
    url += `${lng},${lat},${zoom}`

    // Add dimensions
    url += `/${width}x${height}`

    // Add access token
    url += `?access_token=${MAPBOX_TOKEN}`

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error generating static map:", error)
    return NextResponse.json({ error: "Failed to generate map" }, { status: 500 })
  }
}
