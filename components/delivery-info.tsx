import { Truck, Clock, Calendar, CheckCircle } from "lucide-react"
import { DeliveryRadiusMap } from "./delivery-radius-map"

export default function DeliveryInfo() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">Delivery Information</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            We ensure your custom desserts arrive fresh and perfect for your special occasion
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[400px]">
              <DeliveryRadiusMap />
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-pink-100 rounded-full mr-4">
                <Truck className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Delivery Areas</h3>
                <p className="text-gray-600">
                  We currently deliver to select areas within a 25-mile radius of our bakery. Check the map to see if
                  your location is covered.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-pink-100 rounded-full mr-4">
                <Clock className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Delivery Times</h3>
                <p className="text-gray-600">
                  Standard delivery: 2-3 business days
                  <br />
                  Express delivery: Next-day (order by 12pm)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-pink-100 rounded-full mr-4">
                <Calendar className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Advance Ordering</h3>
                <p className="text-gray-600">
                  For special occasions, we recommend placing your order at least 7 days in advance to ensure
                  availability.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-pink-100 rounded-full mr-4">
                <CheckCircle className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Freshness Guarantee</h3>
                <p className="text-gray-600">
                  All our desserts are baked fresh and delivered in temperature-controlled packaging to ensure quality.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-pink-50 rounded-xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2">Not in our delivery area?</h3>
              <p className="text-gray-600">
                We offer nationwide shipping for select items. Contact us for more information.
              </p>
            </div>
            <a
              href="/contact"
              className="px-6 py-3 bg-pink-600 text-white font-medium rounded-full hover:bg-pink-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
