"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { H1Card } from "@/components/h1-card"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  featured: boolean
  badge?: string
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
    featured: true,
    badge: "Best Seller",
  },
  {
    id: "5",
    name: "White Chocolate Bar",
    description: "Sweet white chocolate with your custom design",
    price: 18,
    image_url: "/printed-white-chocolate.png",
    category: "chocolate-bars",
    featured: true,
    badge: "Popular",
  },
  {
    id: "3",
    name: "Lemon Cookie",
    description: "Refreshing lemon cookies with your design",
    price: 10,
    image_url: "/printed-lemon-cookie.png",
    category: "cookies",
    featured: true,
    badge: "New",
  },
]

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)

        // Fetch featured products from API with a timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

        const response = await fetch("/api/featured-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: controller.signal,
          next: { revalidate: 3600 }, // Cache for 1 hour
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          console.warn(`API returned status: ${response.status}`)
          // Don't throw, just use fallback data
          return
        }

        const data = await response.json()

        if (data.products && data.products.length > 0) {
          // Add badge property if it doesn't exist
          const productsWithBadges = data.products.map((product: Product, index: number) => ({
            ...product,
            badge: product.badge || (index === 0 ? "Best Seller" : index === 1 ? "Popular" : "New"),
          }))
          setProducts(productsWithBadges)
        }
      } catch (err) {
        console.error("Error fetching featured products:", err)
        // Don't set error state, just log it - we're already using fallback data
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    try {
      // Get existing cart from localStorage
      const existingCart = localStorage.getItem("cart")
      const cart = existingCart ? JSON.parse(existingCart) : []

      // Check if product already exists in cart
      const existingProductIndex = cart.findIndex((item: any) => item.id === product.id)

      if (existingProductIndex >= 0) {
        // Increment quantity if product already in cart
        cart[existingProductIndex].quantity += 1
      } else {
        // Add new product to cart
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image_url,
        })
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(cart))

      // Dispatch custom event for cart update
      window.dispatchEvent(new Event("cartUpdated"))

      // Show success message (could be implemented with a toast notification)
      alert(`${product.name} added to cart!`)
    } catch (err) {
      console.error("Error adding to cart:", err)
      alert("Failed to add product to cart. Please try again.")
    }
  }

  if (loading) {
    return (
      <section className="w-full py-12 md:py-24 bg-[#e783bd]">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="flex justify-center">
              <H1Card>Featured Products</H1Card>
            </div>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-12 md:py-24 bg-[#e783bd]">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <div className="flex justify-center">
            <H1Card>Featured Products</H1Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <Card
              key={index}
              className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]"
            >
              <CardContent className="p-0">
                <div className="relative">
                  <Link href={`/shop/product/${product.id}`}>
                    <div className="relative h-64 w-full">
                      <Image
                        src={
                          product.image_url ||
                          `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name) || "/placeholder.svg"}`
                        }
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-rose-600 hover:bg-rose-700">{product.badge || "Featured"}</Badge>
                  </div>
                </div>
                <div className="p-6">
                  <Link href={`/shop/product/${product.id}`}>
                    <h3 className="text-xl font-bold mb-2 hover:text-rose-600 transition-colors">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-rose-600">${product.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      className="bg-rose-600 hover:bg-rose-700"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
