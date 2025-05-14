import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const productId = searchParams.get("productId")

  if (!productId) {
    return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
  }

  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("reviews")
      .select("*, review_images(image_url)")
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
      return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
    }

    return NextResponse.json({ reviews: data })
  } catch (error) {
    console.error("Error in reviews API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, name, email, rating, comment } = body

    if (!productId || !name || !email || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("reviews")
      .insert([
        {
          product_id: productId,
          name,
          email,
          rating,
          comment,
          status: "pending", // Reviews need approval before being displayed
        },
      ])
      .select()

    if (error) {
      console.error("Error submitting review:", error)
      return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
    }

    return NextResponse.json({ success: true, review: data[0] })
  } catch (error) {
    console.error("Error in reviews POST API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
