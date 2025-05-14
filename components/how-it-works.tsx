import { ArrowRight, Printer, Truck, Palette, ShoppingBag } from "lucide-react"

export default function HowItWorks() {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-pink-50 to-white">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-pink-600 mb-4">How DessertPrint Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            From design to delivery, see how we bring your custom dessert ideas to life with our cutting-edge printing
            technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-full mb-4">
              <Palette className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">1. Design</h3>
            <p className="text-gray-600 text-center">Create your custom design or choose from our templates</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-full mb-4">
              <ShoppingBag className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">2. Order</h3>
            <p className="text-gray-600 text-center">Select your dessert type, quantity, and submit your order</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-full mb-4">
              <Printer className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">3. Print</h3>
            <p className="text-gray-600 text-center">We print your design on fresh-baked desserts with food-safe ink</p>
          </div>

          <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="w-16 h-16 flex items-center justify-center bg-pink-100 rounded-full mb-4">
              <Truck className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">4. Deliver</h3>
            <p className="text-gray-600 text-center">
              Your custom treats are carefully packaged and delivered to your door
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-12">
          <a
            href="/design"
            className="inline-flex items-center px-6 py-3 rounded-full bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors"
          >
            Start Designing Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
