"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const orderId = searchParams.get("token") || searchParams.get("orderId")

  useEffect(() => {
    const capturePayment = async () => {
      if (!orderId) {
        setError("No order ID found")
        setLoading(false)
        return
      }

      try {
        // Capture the payment using our API
        const response = await fetch(`/api/paypal?orderId=${orderId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to capture payment")
        }

        setOrderDetails(data)

        // Clear the cart after successful payment
        localStorage.removeItem("cart")

        // Here you would typically save the order to your database
        // For example: await saveOrderToDatabase(data)
      } catch (error) {
        console.error("Error capturing payment:", error)
        setError(error.message || "An error occurred processing your payment")
      } finally {
        setLoading(false)
      }
    }

    capturePayment()
  }, [orderId])

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 md:px-6 py-12 flex items-center justify-center min-h-[60vh]">
        <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="inline-block p-6 bg-red-50 rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-rose-800 mb-2">Payment Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout">
                <Button className="bg-rose-600 hover:bg-rose-700">Try Again</Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-rose-600 text-rose-600">
                  Contact Support
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="inline-block p-6 bg-green-50 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-rose-800 mb-2">Order Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>

          {orderDetails && (
            <div className="bg-rose-50 p-4 rounded-lg mb-6 text-left">
              <p className="font-medium">Order ID: {orderDetails.id}</p>
              <p>Status: {orderDetails.status}</p>
              {orderDetails.purchase_units && orderDetails.purchase_units[0] && (
                <p>Amount: ${orderDetails.purchase_units[0].amount.value}</p>
              )}
            </div>
          )}

          <p className="mb-6">We've sent a confirmation email with all the details of your order.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/account">
              <Button className="bg-rose-600 hover:bg-rose-700">Track Your Order</Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" className="border-rose-600 text-rose-600">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
