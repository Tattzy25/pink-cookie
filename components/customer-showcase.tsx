import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { H1Card } from "@/components/h1-card"

export default function CustomerShowcase() {
  const showcaseItems = [
    {
      image: "/personalized-wedding-treats.png",
      description: "Wedding cookies with couple's names",
    },
    {
      image: "/expecting-joy-cookies.png",
      description: "Baby shower cookies with ultrasound image",
    },
    {
      image: "/placeholder.svg?key=ssk5h",
      description: "Graduation celebration cookies",
    },
    {
      image: "/branded-chocolate-stacks.png",
      description: "Corporate event chocolate bars",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-[#e783bd]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="space-y-2">
            <div className="flex justify-center">
              <H1Card>Guest Inspirations</H1Card>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {showcaseItems.map((item, index) => (
            <Card
              key={index}
              className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]"
            >
              <CardContent className="p-0">
                <div className="relative h-64 w-full">
                  <Image src={item.image || "/placeholder.svg"} alt={item.description} fill className="object-cover" />
                </div>
                <div className="p-4 text-center">
                  <p className="text-sm font-medium text-rose-800">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
