import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="container px-4 md:px-6 py-12 flex items-center justify-center min-h-[60vh]">
      <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="inline-block p-6 bg-rose-50 rounded-full mb-6">
            <XCircle className="h-12 w-12 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-rose-800 mb-2">Payment Cancelled</h2>
          <p className="text-muted-foreground mb-6">
            Your payment process was cancelled. Your cart items are still saved if you'd like to complete your purchase.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/checkout">
              <Button className="bg-rose-600 hover:bg-rose-700">Return to Checkout</Button>
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
