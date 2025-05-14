import Image from "next/image"
import { ArrowRight, Building, Gift, Users, Award } from "lucide-react"

export default function CorporateGifting() {
  return (
    <section className="w-full py-16 bg-gradient-to-r from-blue-50 to-pink-50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-4 py-1.5 bg-blue-100 rounded-full text-blue-700 font-medium text-sm mb-4">
              CORPORATE SOLUTIONS
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Impress Clients & Boost Team Morale</h2>
            <p className="text-lg text-gray-600 mb-6">
              Custom-printed desserts for corporate events, client gifts, and employee appreciation. Add your logo,
              brand colors, or personalized messages.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-pink-100 rounded-full mr-4">
                  <Building className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold">Brand Consistency</h3>
                  <p className="text-gray-600">Perfect brand representation on every treat</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-pink-100 rounded-full mr-4">
                  <Gift className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold">Bulk Ordering</h3>
                  <p className="text-gray-600">Special pricing for large corporate orders</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-pink-100 rounded-full mr-4">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <h3 className="font-bold">Dedicated Account Manager</h3>
                  <p className="text-gray-600">Personalized service for corporate clients</p>
                </div>
              </div>
            </div>

            <a
              href="/corporate"
              className="inline-flex items-center px-6 py-3 rounded-full bg-pink-600 text-white font-medium hover:bg-pink-700 transition-colors"
            >
              Request Corporate Package
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>

          <div className="relative">
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-yellow-100 rounded-full z-0"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-pink-100 rounded-full z-0"></div>

            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/branded-chocolate-assortment.png"
                  alt="Corporate branded chocolates"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg mt-8">
                <Image
                  src="/branded-treats.png"
                  alt="Corporate branded cookies"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg">
                <Image
                  src="/custom-logo-cookie.png"
                  alt="Custom logo cookies"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-2xl shadow-lg mt-8">
                <Image
                  src="/branded-chocolate-stacks.png"
                  alt="Branded chocolate stacks"
                  width={300}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-full shadow-xl z-20">
              <Award className="w-12 h-12 text-pink-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
