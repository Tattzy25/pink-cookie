import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { OCCASIONS } from "@/lib/constants"
import Image from "next/image"
import Link from "next/link"
import { H1Card } from "@/components/h1-card"

export default function ShopByOccasion() {
  // Featured occasions with images
  const featuredOccasions = [
    {
      id: "birthdays",
      name: "Birthdays",
      image: "/birthday-chocolate-treats.png",
      description: " Make your special day Unforgettable ",
    },
    {
      id: "weddings",
      name: "Weddings",
      image: "/elegant-wedding-cookie-display.png",
      description: "Elegant custom desserts for your perfect day",
    },
    {
      id: "baby",
      name: "Baby Showers",
      image: "/sweet-arrival-treats.png",
      description: "Sweet treats to welcome the newest arrival",
    },
    {
      id: "corporate",
      name: "Corporate Events",
      image: "/custom-logo-cookie.png",
      description: "Impress clients and colleagues with custom branded desserts",
    },
  ]

  // Filter out New Year's from occasions
  const filteredOccasions = OCCASIONS.filter((occasion) => occasion.name !== "New Year's")

  return (
    <section className="w-full py-12 md:py-16 bg-[#e783bd] mt-[-1px]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <H1Card>Shop by Occasion</H1Card>
        </div>

        {/* Featured occasions */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-12">
          {featuredOccasions.map((occasion) => (
            <Link href={`/shop/occasion/${occasion.id}`} key={occasion.id}>
              <div
                className="h-full rounded-xl"
                style={{
                  borderRadius: "16px",
                  background: "linear-gradient(145deg, #f8d7e3, #e783bd)",
                  boxShadow: "12px 12px 24px #d077a8",
                  transition: "all 0.3s ease",
                }}
              >
                <Card className="h-full border-0 bg-transparent text-white overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-40 w-full">
                      <Image
                        src={occasion.image || "/placeholder.svg"}
                        alt={occasion.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col h-[160px]">
                      <h3 className="text-lg font-bold mb-1 text-gray-800">Weddings</h3>
                      <p className="text-xs text-gray-700 mb-3 flex-grow">{occasion.description}</p>
                      <Button
                        className="w-full mt-auto"
                        style={{
                          background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
                          boxShadow: "0px 4px 8px rgba(186, 143, 33, 0.3)",
                          color: "#000",
                          fontWeight: "bold",
                          borderRadius: "8px",
                          height: "40px",
                        }}
                      >
                        Shop Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          ))}
        </div>

        {/* All occasions */}
        <div className="max-w-4xl mx-auto text-center mt-8">
          <Link href="/shop/occasions">
            <Button
              className="px-8 py-3"
              style={{
                background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
                boxShadow: "0px 4px 8px rgba(186, 143, 33, 0.3)",
                color: "#000",
                fontWeight: "bold",
                borderRadius: "8px",
              }}
            >
              View All Occasions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
