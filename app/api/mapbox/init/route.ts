import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Use server-side token only
    const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

    if (!MAPBOX_TOKEN) {
      return NextResponse.json({ error: "Mapbox configuration missing" }, { status: 500 })
    }

    // Return only what's needed for client initialization
    return NextResponse.json({
      token: MAPBOX_TOKEN,
      style: "mapbox://styles/mapbox/streets-v11",
    })
  } catch (error) {
    console.error("Error initializing Mapbox:", error)
    return NextResponse.json({ error: "Failed to initialize Mapbox" }, { status: 500 })
  }
}
