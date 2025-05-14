import { createClient } from "@/lib/supabase"
import { NextResponse, type NextRequest } from "next/server"

// Constants
const STATUS_OK = 200
const STATUS_INTERNAL_SERVER_ERROR = 500
const FEATURED_TRUE = "true"

// Fallback products data
const FALLBACK_PRODUCTS = [
  {
    id: "cookie-rich-premium",
    name: "Rich Premium Custom Cookies",
    category: "cookies",
    featured: true,
    description:
      " Handcrafted, photo-ready cookies baked to impress. Choose from4 delicious flavors and15 unique shapes. Each cookie is topped with your custom edible design—perfect for events, celebrations, and brand moments. Pick your shape, upload your image, and let the cookie magic begin.",
    basePrices: {
      "1": { price: 10, note: "Pickup only" },
      "6": 30,
      "12": { price: 60, discount: "10%" },
      "18": { price: 90, discount: "15%" },
      "24": { price: 120, discount: "20%" },
    },
    flavors: ["Chocolate", "Orange", "Lemon", "Sugar"],
    shapes: [
      "Circle",
      "Square",
      "Rectangle",
      "Heart",
      "Crown",
      "Star",
      "Flower",
      "Bunny Ears",
      "Clover",
      "Dinosaur",
      "Bear",
      "Mickey Head",
      "Onesie",
      "Balloon",
      "Cloud",
    ],
    imageUrl: "https://i.imgur.com/RX7nrK4.png",
    shapePreviewImage: "https://i.imgur.com/hmFPWHJ.png",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    // Validate query parameters
    if (category && typeof category !== "string") {
      return NextResponse.json({ error: "Invalid category parameter" }, { status: 400 })
    }
    if (featured && featured !== FEATURED_TRUE) {
      return NextResponse.json({ error: "Invalid featured parameter" }, { status: 400 })
    }

    // Try to get data from Supabase
    try {
      // Create Supabase client
      const supabase = createClient()

      // Build query
      let query = supabase.from("products").select("*")

      // Apply filters
      if (category) {
        query = query.eq("category", category)
      }

      if (featured === FEATURED_TRUE) {
        query = query.eq("featured", true)
      }

      // Execute query with timeout
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Database query timeout")), 5000),
      )

      const { data, error } = await Promise.race([query, timeoutPromise])

      if (error) throw error

      // Return data if available
      if (data && data.length > 0) {
        return NextResponse.json({ products: data }, { status: STATUS_OK })
      }
    } catch (dbError) {
      console.error("Database error:", dbError)
      // Continue to fallback data
    }

    // Filter fallback data if needed
    let filteredProducts = [...FALLBACK_PRODUCTS]

    if (category) {
      filteredProducts = filteredProducts.filter((product) => product.category === category)
    }

    if (featured === FEATURED_TRUE) {
      filteredProducts = filteredProducts.filter((product) => product.featured === true)
    }

    return NextResponse.json({ products: filteredProducts }, { status: STATUS_OK })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ products: FALLBACK_PRODUCTS }, { status: STATUS_INTERNAL_SERVER_ERROR })
  }
}
