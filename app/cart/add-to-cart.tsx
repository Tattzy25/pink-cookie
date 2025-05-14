"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

interface AddToCartProps {
  product: {
    id: string | number
    name: string
    price: number
    image: string
  }
  quantity?: number
  className?: string
  showIcon?: boolean
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function AddToCart({
  product,
  quantity = 1,
  className = "",
  showIcon = true,
  variant = "default",
  size = "default",
}: AddToCartProps) {
  const [isAdding, setIsAdding] = useState(false)
  const router = useRouter()

  const addToCart = () => {
    setIsAdding(true)

    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart")
    const cart = existingCart ? JSON.parse(existingCart) : []

    // Check if product already exists in cart
    const existingProductIndex = cart.findIndex((item) => item.id === product.id)

    if (existingProductIndex >= 0) {
      // Update quantity if product exists
      cart[existingProductIndex].quantity += quantity
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
      })
    }

    // Save updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Show success feedback
    setTimeout(() => {
      setIsAdding(false)
      router.refresh() // Refresh the page to update cart count if displayed in header
    }, 500)
  }

  return (
    <Button onClick={addToCart} disabled={isAdding} variant={variant} size={size} className={className}>
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          Adding...
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="mr-2 h-4 w-4" />}
          Add to Cart
        </>
      )}
    </Button>
  )
}
