import { type NextRequest, NextResponse } from "next/server"

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

    const result = await fetch(url)

    if (!result.ok) {
      return NextResponse.json({ error: "Failed to geocode address" }, { status: 500 })
    }

    const data = await result.json()

    if (!data.features || data.features.length === 0) {
      return NextResponse.json({ error: "Could not geocode address" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in geocode API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
