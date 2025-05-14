import type { Metadata } from "next"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { H1Card } from "@/components/h1-card"
import EnhancedDeliveryVerification from "@/components/enhanced-delivery-verification"

export const metadata: Metadata = {
  title: "Contact Us | DessertPrint",
  description: "Get in touch with our team for custom orders, questions, or support.",
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex justify-center mb-12">
        <H1Card>Contact Us</H1Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" required />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject
              </label>
              <Input id="subject" name="subject" placeholder="How can we help you?" required />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Your Message
              </label>
              <Textarea id="message" name="message" placeholder="Tell us about your inquiry..." rows={5} required />
            </div>

            <Button type="submit" className="w-full">
              Send Message
            </Button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-pink-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:hello@dessertprint.com" className="text-pink-600 hover:underline">
                    hello@dessertprint.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 text-pink-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Phone</p>
                  <a href="tel:+12125551234" className="text-pink-600 hover:underline">
                    (212) 555-1234
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-pink-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Address</p>
                  <p>123 Sweet Street</p>
                  <p>New York, NY 10001</p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="h-6 w-6 text-pink-500 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Business Hours</p>
                  <p>Monday - Friday: 9am - 6pm</p>
                  <p>Saturday: 10am - 4pm</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg bg-gray-100 flex items-center justify-center">
            <div className="p-8 text-center">
              <MapPin className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Visit Our Store</h3>
              <p className="text-gray-600">
                We're located in the heart of New York City. <br />
                Come visit us for a sweet experience!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Areas Content */}
      <div className="mt-16 pt-16 border-t border-pink-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-8">
              <H1Card>Delivery Areas</H1Card>
            </div>
            <p className="text-lg text-rose-600 max-w-2xl mx-auto">
              We currently deliver to areas within Los Angeles County. Check if your address is eligible for our
              delivery service.
            </p>
          </div>

          <EnhancedDeliveryVerification />

          <div className="mt-16 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-rose-800 mb-4">Delivery Information</h2>
              <div className="bg-white rounded-xl shadow-md p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mr-3 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Glendale Store</p>
                      <p className="text-gray-600">Delivers within a 15-mile radius</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mr-3 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Panorama City Store</p>
                      <p className="text-gray-600">Delivers within a 20-mile radius</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-rose-800 mb-4">Delivery Policies</h2>
              <div className="bg-white rounded-xl shadow-md p-6">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-rose-600 mr-3">•</div>
                    <p>Free delivery on orders over $39 within our delivery areas</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-rose-600 mr-3">•</div>
                    <p>$5.99 delivery fee for orders under $39</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-rose-600 mr-3">•</div>
                    <p>Delivery times: Tuesday-Saturday, 10am-6pm</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-rose-600 mr-3">•</div>
                    <p>Same-day delivery available for orders placed before 11am (subject to availability)</p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 text-rose-600 mr-3">•</div>
                    <p>For addresses outside our delivery area, please consider our shipping options</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
