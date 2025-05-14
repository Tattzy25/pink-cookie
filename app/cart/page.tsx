"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, CreditCard, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CartPage() {
  // Mock cart data
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Chocolate Cookie - Birthday Design",
      price: 10.0,
      quantity: 12,
      image: "/birthday-chocolate-cookie.png",
      discount: 0.1, // 10% discount for 12 cookies
    },
    {
      id: 2,
      name: "Dark Chocolate Bar - Custom Logo",
      price: 18.0,
      quantity: 2,
      image: "/placeholder.svg?key=mjgsn",
      discount: 0,
    },
  ])

  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const promoDiscount = promoApplied ? 0.1 : 0 // 10% discount if promo is applied

  const handleQuantityChange = (id: number, change: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change)

          // Update discount based on quantity
          let newDiscount = 0
          if (item.name.includes("Cookie")) {
            if (newQuantity >= 24) {
              newDiscount = 0.2 // 20% off for 24+ cookies
            } else if (newQuantity >= 18) {
              newDiscount = 0.15 // 15% off for 18+ cookies
            } else if (newQuantity >= 12) {
              newDiscount = 0.1 // 10% off for 12+ cookies
            }
          } else if (item.name.includes("Chocolate Bar")) {
            if (newQuantity >= 4) {
              newDiscount = 0.1 // 10% off for 4+ chocolate bars
            }
          }

          return { ...item, quantity: newQuantity, discount: newDiscount }
        }
        return item
      }),
    )
  }

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "welcome10") {
      setPromoApplied(true)
    } else {
      alert("Invalid promo code")
    }
  }

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    const itemTotal = item.price * item.quantity
    const itemDiscount = itemTotal * item.discount
    return total + (itemTotal - itemDiscount)
  }, 0)

  // Calculate promo discount
  const promoDiscountAmount = subtotal * promoDiscount

  // Calculate shipping (free over $50)
  const shipping = subtotal > 50 ? 0 : 5.99

  // Calculate total
  const total = subtotal - promoDiscountAmount + shipping

  return (
    <div className="container px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tighter text-rose-800 mb-8">Your Cart</h1>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
              <CardHeader>
                <CardTitle>Shopping Cart ({cartItems.length} items)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {cartItems.map((item) => {
                  const itemTotal = item.price * item.quantity
                  const itemDiscount = itemTotal * item.discount
                  const finalPrice = itemTotal - itemDiscount

                  return (
                    <div key={item.id} className="flex flex-col md:flex-row gap-4">
                      <div className="relative h-24 w-24 rounded-md overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold">{item.name}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          <p className="text-rose-600 font-bold">${item.price.toFixed(2)} each</p>
                          {item.discount > 0 && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                              {(item.discount * 100).toFixed(0)}% off
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-bold">${finalPrice.toFixed(2)}</p>
                            <button
                              className="text-gray-500 hover:text-rose-600"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/shop">
                  <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Promo Discount (WELCOME10)</span>
                      <span>-${promoDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <Button
                      variant="outline"
                      className="border-rose-600 text-rose-600 hover:bg-rose-50 whitespace-nowrap"
                      onClick={handleApplyPromo}
                      disabled={promoApplied || !promoCode}
                    >
                      Apply
                    </Button>
                  </div>
                  {promoApplied && <p className="text-green-600 text-sm">Promo code WELCOME10 applied successfully!</p>}
                </div>

                <Button className="w-full bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white py-6 text-lg font-bold">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Checkout
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  <p>We accept PayPal and all major credit cards</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="inline-block p-6 bg-rose-50 rounded-full mb-6">
            <ShoppingBag className="h-12 w-12 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-rose-800 mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/shop">
            <Button className="bg-rose-600 hover:bg-rose-700">Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
