"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
}

// Fallback products in case fetch fails completely
const FALLBACK_PRODUCTS = [
  {
    id: "1",
    name: "Chocolate Cookie",
    description: "Rich chocolate cookies with your custom design",
    price: 10,
    image_url: "/printed-cookie.png",
    category: "cookies",
  },
  {
    id: "2",
    name: "Orange Cookie",
    description: "Zesty orange cookies with your custom design",
    price: 10,
    image_url: "/printed-orange-cookie.png",
    category: "cookies",
  },
  {
    id: "3",
    name: "Lemon Cookie",
    description: "Refreshing lemon cookies with your design",
    price: 10,
    image_url: "/printed-lemon-cookie.png",
    category: "cookies",
  },
  {
    id: "4",
    name: "Personalized Cookie",
    description: "Custom cookies with your personalized message",
    price: 12,
    image_url: "/personalized-cookie.png",
    category: "cookies",
  },
]

export function Products({ category }: { category?: string }) {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        // Construct URL with category parameter if provided
        const url = category ? `/api/products?category=${encodeURIComponent(category)}` : "/api/products"

        // Fetch products with a timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          cache: "no-store",
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.products && data.products.length > 0) {
          setProducts(data.products)
        }
      } catch (err) {
        console.error("Error fetching products:", err)
        // Don't set error state, just log it - we're already using fallback data
        // setError("Failed to load products. Please try again later.")

        // If category is provided, filter fallback products by category
        if (category) {
          setProducts(FALLBACK_PRODUCTS.filter((product) => product.category === category))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    )
  }

  if (error && products.length === 0) {
    return <div className="text-center p-4 bg-red-100 rounded-lg text-red-800 my-4">{error}</div>
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-lg">No products found in this category.</p>
        <Link href="/shop">
          <Button className="mt-4 bg-rose-600 hover:bg-rose-700">View All Products</Button>
        </Link>
      </div>
    )
  }

  return <>{/* Our Products section has been removed as requested */}</>
}

// Add default export
export default Products
