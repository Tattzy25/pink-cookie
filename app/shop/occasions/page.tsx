import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { H1Card } from "@/components/h1-card"
import Image from "next/image"
import Link from "next/link"

export default function OccasionsPage() {
  // All occasions with images
  const allOccasions = [
    {
      id: "birthday",
      name: "Birthday",
      image: "/birthday-chocolate-treats.png",
      description: "Make their special day unforgettable with custom birthday treats",
    },
    {
      id: "baby",
      name: "Baby",
      image: "/sweet-arrival-treats.png",
      description: "Sweet treats to welcome the newest arrival",
    },
    {
      id: "wedding",
      name: "Wedding",
      image: "/elegant-wedding-cookie-display.png",
      description: "Elegant custom desserts for your perfect day",
    },
    {
      id: "engagement",
      name: "Engagement",
      image: "/intertwined-hearts.png",
      description: "Celebrate your commitment with custom treats",
    },
    {
      id: "anniversary",
      name: "Anniversary",
      image: "/intertwined-promise.png",
      description: "Commemorate your special milestone together",
    },
    {
      id: "graduation",
      name: "Graduation",
      image: "/celebratory-cookie-caps.png",
      description: "Celebrate academic achievements with custom cookies",
    },
    {
      id: "thank-you",
      name: "Thank You",
      image: "/placeholder.svg?key=uoso2",
      description: "Express gratitude with delicious custom treats",
    },
    {
      id: "corporate",
      name: "Corporate",
      image: "/custom-logo-cookie.png",
      description: "Impress clients and colleagues with branded desserts",
    },
    {
      id: "bachelorette",
      name: "Bachelorette",
      image: "/placeholder.svg?key=qo9sd",
      description: "Fun and elegant treats for the bride-to-be",
    },
    {
      id: "valentines",
      name: "Valentine's Day",
      image: "/placeholder.svg?key=or2se",
      description: "Sweet expressions of love for Valentine's Day",
    },
    {
      id: "superbowl",
      name: "Super Bowl",
      image: "/placeholder.svg?key=bakog",
      description: "Game day treats for the ultimate fan experience",
    },
    {
      id: "stpatricks",
      name: "St. Patrick's Day",
      image: "/clover-cookie.png",
      description: "Lucky treats for your St. Patrick's Day celebration",
    },
    {
      id: "easter",
      name: "Easter",
      image: "/placeholder.svg?key=rr2ci",
      description: "Festive treats for your Easter celebration",
    },
    {
      id: "mothers-day",
      name: "Mother's Day",
      image: "/placeholder.svg?key=0g9j3",
      description: "Show mom how special she is with custom treats",
    },
    {
      id: "fathers-day",
      name: "Father's Day",
      image: "/placeholder.svg?key=2a71q",
      description: "Celebrate dad with his favorite custom treats",
    },
    {
      id: "july4",
      name: "4th of July",
      image: "/placeholder.svg?key=eolgz",
      description: "Patriotic treats for your Independence Day celebration",
    },
    {
      id: "halloween",
      name: "Halloween",
      image: "/spooky-carved-pumpkin.png",
      description: "Spooky treats for your Halloween festivities",
    },
    {
      id: "thanksgiving",
      name: "Thanksgiving",
      image: "/placeholder.svg?key=xbx7q",
      description: "Grateful treats for your Thanksgiving table",
    },
    {
      id: "christmas",
      name: "Christmas",
      image: "/festive-cookie-display.png",
      description: "Festive treats for your holiday celebration",
    },
    {
      id: "new-years",
      name: "New Year's",
      image: "/placeholder.svg?key=pekbk",
      description: "Ring in the New Year with custom celebration treats",
    },
    {
      id: "baby-shower",
      name: "Baby Shower",
      image: "/pastel-baby-shower-sweets.png",
      description: "Adorable treats for welcoming the little one",
    },
    {
      id: "custom",
      name: "Custom Order",
      image: "/custom-cookie-art.png",
      description: "Create your own unique design for any occasion",
    },
  ]

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <H1Card>Occasions</H1Card>
        <h2 className="max-w-[700px] text-black text-xl md:text-2xl lg:text-2xl font-medium">
          Transform Any Occasion into a Delicious Celebration
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allOccasions.map((occasion) => (
          <Link href={`/shop/occasion/${occasion.id}`} key={occasion.id}>
            <div
              className="h-full rounded-xl"
              style={{
                borderRadius: "16px",
                background: "#e783bd",
                boxShadow: "12px 12px 24px #c06d9d, -12px -12px 24px #c06d9d",
                transition: "all 0.3s ease",
              }}
            >
              <Card className="h-full border-0 bg-transparent overflow-hidden">
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
                    <p className="text-sm md:text-base text-black mb-3 flex-grow font-semibold text-center">
                      {occasion.description}
                    </p>
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
                      {occasion.name}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
