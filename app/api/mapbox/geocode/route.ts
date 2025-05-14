import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const address = searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address parameter is required" }, { status: 400 })
    }

    // Use server-side token only
    const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

    if (!MAPBOX_TOKEN) {
      return NextResponse.json({ error: "Mapbox configuration missing" }, { status: 500 })
    }

    // Call Mapbox Geocoding API
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_TOKEN}`,
    )

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error geocoding address:", error)
    return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
  }
}
