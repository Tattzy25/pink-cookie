import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

export default function ShopByOccasionPage() {
  const occasions = [
    { name: "All", value: "all" },
    { name: "Birthday", value: "birthday" },
    { name: "Wedding", value: "wedding" },
    { name: "Baby Shower", value: "baby-shower" },
    { name: "Graduation", value: "graduation" },
    { name: "Corporate", value: "corporate" },
    { name: "Holiday", value: "holiday" },
  ]

  const products = [
    {
      name: "Birthday Celebration Cookies",
      description: "Personalized cookies perfect for birthday celebrations",
      price: "$60.00",
      image: "/personalized-birthday-treats.png",
      category: "birthday",
    },
    {
      name: "Wedding Favor Chocolates",
      description: "Elegant chocolate bars for wedding favors",
      price: "$90.00",
      image: "/gilded-wedding-chocolates.png",
      category: "wedding",
    },
    {
      name: "Baby Shower Cookie Set",
      description: "Adorable cookies for baby showers",
      price: "$60.00",
      image: "/pastel-baby-shower-sweets.png",
      category: "baby-shower",
    },
    {
      name: "Graduation Cap Cookies",
      description: "Celebrate academic achievements with custom cookies",
      price: "$60.00",
      image: "/celebratory-cookie-caps.png",
      category: "graduation",
    },
    {
      name: "Corporate Logo Cookies",
      description: "Custom cookies featuring your company logo",
      price: "$120.00",
      image: "/branded-treats.png",
      category: "corporate",
    },
    {
      name: "Holiday Cookie Collection",
      description: "Festive cookies for holiday celebrations",
      price: "$75.00",
      image: "/festive-cookie-display.png",
      category: "holiday",
    },
    {
      name: "Birthday Chocolate Bars",
      description: "Custom chocolate bars for birthday celebrations",
      price: "$90.00",
      image: "/birthday-chocolate-treats.png",
      category: "birthday",
    },
    {
      name: "Wedding Cake Cookies",
      description: "Beautiful wedding cake shaped cookies",
      price: "$75.00",
      image: "/elegant-wedding-cookie-display.png",
      category: "wedding",
    },
    {
      name: "Baby Announcement Chocolates",
      description: "Chocolate bars to announce your new arrival",
      price: "$90.00",
      image: "/sweet-arrival-treats.png",
      category: "baby-shower",
    },
    {
      name: "Graduation Party Pack",
      description: "Mix of cookies and chocolates for graduation parties",
      price: "$120.00",
      image: "/placeholder.svg?key=feg57",
      category: "graduation",
    },
    {
      name: "Corporate Gift Box",
      description: "Premium gift box with logo cookies and chocolates",
      price: "$150.00",
      image: "/placeholder.svg?key=9ks0b",
      category: "corporate",
    },
    {
      name: "Christmas Cookie Set",
      description: "Festive Christmas themed cookies",
      price: "$75.00",
      image: "/christmas-cookies.png",
      category: "holiday",
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <h1 className="font-great-vibes text-h1-mobile md:text-h1-desktop">Shop by Occasion</h1>
        <p className="max-w-[700px] text-rose-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Find the perfect custom treats for your special events
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex flex-wrap justify-center mb-8 bg-transparent">
          {occasions.map((occasion) => (
            <TabsTrigger
              key={occasion.value}
              value={occasion.value}
              className="data-[state=active]:bg-rose-600 data-[state=active]:text-white rounded-full px-6 py-2 m-1"
            >
              {occasion.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {occasions.map((occasion) => (
          <TabsContent key={occasion.value} value={occasion.value} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products
                .filter((product) => occasion.value === "all" || product.category === occasion.value)
                .map((product, index) => (
                  <Card
                    key={index}
                    className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]"
                  >
                    <CardContent className="p-0">
                      <div className="relative h-48 w-full">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-lg font-bold text-rose-600">From {product.price}</p>
                          <Link href={`/shop/${product.name.toLowerCase().replace(/\s+/g, "-")}`}>
                            <Button size="sm" className="btn-luxury text-white">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
