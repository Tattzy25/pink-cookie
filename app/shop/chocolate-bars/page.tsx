import { Products } from "@/components/products"
import DeliveryAddressVerification from "@/components/delivery-address-verification"
import { H1Card } from "@/components/h1-card"

export const metadata = {
  title: "Chocolate Bars | Dessert Print Inc",
  description: "Browse our selection of customizable chocolate bars for any occasion",
}

export default function ChocolateBarsPage() {
  return (
    <div className="min-h-screen">
      <div className="container px-4 md:px-6 py-12">
        <div className="flex justify-center mb-8">
          <H1Card>Custom Printed Chocolate Bars</H1Card>
        </div>

        <p className="text-lg text-center max-w-3xl mx-auto mb-12">
          Our premium chocolate bars can be customized with your designs, photos, or logos. Perfect for gifts,
          promotions, weddings, and special events!
        </p>

        {/* Product listings */}
        <Products category="chocolate-bars" />

        {/* Delivery verification */}
        <div className="mt-16 bg-white p-8 rounded-[49px] shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
          <h2 className="text-2xl font-bold text-center mb-6">Check Delivery Availability</h2>
          <DeliveryAddressVerification />
        </div>
      </div>
    </div>
  )
}
