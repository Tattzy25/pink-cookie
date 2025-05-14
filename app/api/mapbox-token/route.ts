import { NextResponse } from "next/server"

export async function GET() {
  try {
    const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN

    // Return only public configuration, not the token itself
    return NextResponse.json({
      config: {
        mapStyle: "mapbox://styles/mapbox/streets-v11",
      },
    })
  } catch (error: any) {
    console.error("Error fetching Mapbox configuration:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch Mapbox configuration" }, { status: 500 })
  }
}
