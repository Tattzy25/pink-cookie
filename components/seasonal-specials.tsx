import { ArrowRight, Calendar, Star } from "lucide-react"
import Image from "next/image"

export default function SeasonalSpecials() {
  // Get current month to determine which seasonal items to highlight
  const currentMonth = new Date().getMonth()

  // Define seasonal specials based on time of year
  const seasonalItems = [
    {
      title: "Spring Celebration",
      description: "Floral designs and pastel colors for spring events",
      image: "/whimsical-garden-cookies.png",
      featured: currentMonth >= 2 && currentMonth <= 4, // March-May
    },
    {
      title: "Summer Fun",
      description: "Bright, colorful treats perfect for summer parties",
      image: "/colorful-birthday-cookie-platter.png",
      featured: currentMonth >= 5 && currentMonth <= 7, // June-August
    },
    {
      title: "Fall Favorites",
      description: "Warm autumn colors and festive Halloween designs",
      image: "/spooky-carved-pumpkin.png",
      featured: currentMonth >= 8 && currentMonth <= 9, // September-October
    },
    {
      title: "Holiday Magic",
      description: "Festive Christmas and winter holiday designs",
      image: "/christmas-cookies.png",
      featured: currentMonth >= 10 || currentMonth <= 1, // November-February
    },
  ]

  // Find the currently featured seasonal item
  const featuredItem = seasonalItems.find((item) => item.featured) || seasonalItems[0]

  return (
    <section className="w-full py-16 bg-gradient-to-b from-white to-pink-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-pink-100 text-pink-600 mb-4">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">LIMITED TIME OFFERS</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Seasonal Specials</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Celebrate every season with our limited-time designs and flavors
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          <div className="lg:col-span-3 relative">
            <div className="relative overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={featuredItem.image || "/placeholder.svg"}
                alt={featuredItem.title}
                width={800}
                height={500}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8">
                <div className="inline-flex items-center bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-medium mb-3 w-fit">
                  <Star className="w-4 h-4 mr-1 fill-yellow-900" />
                  FEATURED NOW
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{featuredItem.title}</h3>
                <p className="text-white/90 mb-4">{featuredItem.description}</p>
                <a
                  href="/shop/seasonal"
                  className="inline-flex items-center px-5 py-2.5 rounded-full bg-white text-pink-600 font-medium hover:bg-pink-50 transition-colors w-fit"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {seasonalItems
              .filter((item) => item !== featuredItem)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row lg:flex-row items-center bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="w-full sm:w-1/3 lg:w-1/3">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                  <div className="p-4 w-full sm:w-2/3 lg:w-2/3">
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    <a
                      href={`/shop/seasonal/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-pink-600 text-sm font-medium inline-flex items-center"
                    >
                      View Collection
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}
