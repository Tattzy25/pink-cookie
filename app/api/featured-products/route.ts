import { NextResponse } from "next/server"


const FALLBACK_FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Chocolate Cookie",
    description: "Rich chocolate cookies with your custom design",
    price: 10,
    image_url: "/printed-cookie.png",
    category: "cookies",
    featured: true,
  },
  {
    id: "5",
    name: "White Chocolate Bar",
    description: "Sweet white chocolate with your custom design",
    price: 18,
    image_url: "/printed-white-chocolate.png",
    category: "chocolate-bars",
    featured: true,
  },
  {
    id: "3",
    name: "Lemon Cookie",
    description: "Refreshing lemon cookies with your design",
    price: 10,
    image_url: "/printed-lemon-cookie.png",
    category: "cookies",
    featured: true,
  },
]

export async function GET() {
  try {
   
    return NextResponse.json(
      {
        products: FALLBACK_FEATURED_PRODUCTS,
        source: "fallback",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Server error:", error)
    return NextResponse.json(
      {
        products: FALLBACK_FEATURED_PRODUCTS,
        source: "fallback",
        error: "Server error occurred",
      },
      { status: 200 }, 
    )
  }
}
