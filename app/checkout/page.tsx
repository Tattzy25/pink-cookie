"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, ShoppingBag, Check, MapPin, Truck } from "lucide-react"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import Link from "next/link"
import DeliveryAddressVerification from "@/components/delivery-address-verification"

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("paypal")
  const [deliveryMethod, setDeliveryMethod] = useState("shipping")

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 39 ? 0 : 5.99
  const taxRate = 0.0975 // 9.75% tax rate
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax

  useEffect(() => {
    // Fetch cart items from local storage
    const fetchCart = async () => {
      try {
        const storedCart = localStorage.getItem("cart")

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart)

          // Validate cart data structure
          if (
            Array.isArray(parsedCart) &&
            parsedCart.every(
              (item) =>
                typeof item === "object" &&
                item !== null &&
                "id" in item &&
                "name" in item &&
                "price" in item &&
                "quantity" in item,
            )
          ) {
            setCartItems(parsedCart)
          } else {
            console.error("Invalid cart data structure")
            setCartItems([])
          }
        } else {
          // No cart data found
          setCartItems([])
        }

        // Also check for cart data in session storage as fallback
        if (cartItems.length === 0) {
          const sessionCart = sessionStorage.getItem("cart")
          if (sessionCart) {
            try {
              const parsedSessionCart = JSON.parse(sessionCart)
              if (Array.isArray(parsedSessionCart) && parsedSessionCart.length > 0) {
                setCartItems(parsedSessionCart)
              }
            } catch (e) {
              console.error("Error parsing session cart:", e)
            }
          }
        }
      } catch (error) {
        console.error("Error fetching cart:", error)
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchCart()

    // Add event listener for cart updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart" && e.newValue) {
        try {
          setCartItems(JSON.parse(e.newValue))
        } catch (error) {
          console.error("Error parsing updated cart:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const initiatePayPalCheckout = async () => {
    try {
      setProcessingPayment(true)

      // Create a PayPal order using our API
      const response = await fetch("/api/paypal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: total.toFixed(2),
          description: `Dessert Print Inc. Order - ${cartItems.length} items`,
          items: cartItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create PayPal order")
      }

      // Find the approval URL to redirect the user
      const approvalUrl = data.links.find((link) => link.rel === "approve").href

      // Redirect to PayPal for payment
      window.location.href = approvalUrl
    } catch (error) {
      console.error("Payment error:", error)
      alert("There was an error processing your payment. Please try again.")
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (paymentMethod === "paypal") {
      await initiatePayPalCheckout()
    }
  }

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container px-4 md:px-6 py-12 text-center">
        <div className="inline-block p-6 bg-rose-50 rounded-full mb-6">
          <ShoppingBag className="h-12 w-12 text-rose-600" />
        </div>
        <h2 className="text-2xl font-bold text-rose-800 mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Link href="/shop">
          <Button className="bg-rose-600 hover:bg-rose-700">Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tighter text-rose-800 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-rose-800">Delivery Method</h2>

              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-4">
                <div
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${deliveryMethod === "shipping" ? "border-rose-500 bg-rose-50" : "border-gray-200"}`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="shipping" id="shipping" />
                    <Label htmlFor="shipping" className="flex items-center gap-2 cursor-pointer">
                      <Truck className="h-5 w-5" />
                      <span>Standard Shipping</span>
                    </Label>
                  </div>
                  {deliveryMethod === "shipping" && <Check className="h-5 w-5 text-rose-600" />}
                </div>

                <div
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${deliveryMethod === "delivery" ? "border-rose-500 bg-rose-50" : "border-gray-200"}`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer">
                      <MapPin className="h-5 w-5" />
                      <span>Local Delivery {subtotal >= 39 && "(Free)"}</span>
                    </Label>
                  </div>
                  {deliveryMethod === "delivery" && <Check className="h-5 w-5 text-rose-600" />}
                </div>
              </RadioGroup>

              {deliveryMethod === "delivery" && (
                <div className="mt-6">
                  <div className="p-4 bg-rose-50 rounded-lg text-sm mb-4">
                    <p>
                      <span className="font-medium">Delivery areas:</span> Within 15 miles of Glendale, CA or 20 miles
                      of Panorama City, CA.
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Free delivery:</span> On orders of $39 or more.
                    </p>
                  </div>

                  <DeliveryAddressVerification />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-rose-800">Payment Method</h2>

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${paymentMethod === "paypal" ? "border-rose-500 bg-rose-50" : "border-gray-200"}`}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                      <Image src="/paypal-logo.png" alt="PayPal" width={80} height={20} />
                      <span>Pay with PayPal</span>
                    </Label>
                  </div>
                  {paymentMethod === "paypal" && <Check className="h-5 w-5 text-rose-600" />}
                </div>
              </RadioGroup>

              <div className="mt-8">
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="w-full btn-luxury text-white py-6 text-lg font-bold"
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Complete Payment
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] sticky top-24">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6 text-rose-800">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (9.75%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>By completing your purchase, you agree to our</p>
                <div className="flex justify-center gap-1">
                  <Link href="/policies" className="text-rose-600 hover:underline">
                    Terms of Service
                  </Link>
                  <span>&</span>
                  <Link href="/policies" className="text-rose-600 hover:underline">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
