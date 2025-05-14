import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Check } from "lucide-react"
import { H1Card } from "@/components/h1-card"

export default function Subscription() {
  const subscriptionPlans = [
    {
      name: "Muse Mystery Box",
      price: "$39",
      description: "Indulge in a monthly delivery of exclusive, Premium-Designed treats",
      features: ["Seasonal designs", "Local pick up"],
    },
    {
      name: "Velvet Mystery Box",
      price: "$69",
      description: "Get a hand-picked selection of mouthwatering mystery, delivered to your door",
      features: ["Everything in Velvet Mystery", "Exclusive seasonal flavors", "local delivery"],
      popular: true,
    },
    {
      name: "Black Label Mystery Box",
      price: "$99",
      description: "Treat yourself to a surprise box of deliciously unique, limited-edition flavors every month",
      features: [
        "Everything in Velvet Mystery",
        "Early access to new designs",
        "Limited edition flavors",
        "local delivery",
      ],
    },
  ]

  // Function to get the display name without the prefix
  const getDisplayName = (fullName) => {
    if (fullName.startsWith("Muse ")) {
      return "Mystery Box"
    } else if (fullName.startsWith("Velvet ")) {
      return "Mystery Box"
    } else if (fullName.startsWith("Black Label ")) {
      return "Mystery Box"
    }
    return fullName
  }

  // Function to get the prefix for display above the title
  const getPrefix = (fullName) => {
    if (fullName.startsWith("Muse ")) {
      return "Muse"
    } else if (fullName.startsWith("Velvet ")) {
      return "Velvet"
    } else if (fullName.startsWith("Black Label ")) {
      return "Black Label"
    }
    return ""
  }

  return (
    <section className="w-full py-12 md:py-24 bg-[#e783bd]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="flex justify-center">
            <H1Card>The Mystery Club</H1Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan, index) => (
            <div key={index} className="relative">
              {plan.popular && (
                <div
                  className="absolute top-0 right-0 -mt-4 -mr-4 px-4 py-1 rounded-full font-bold z-10 text-black"
                  style={{
                    background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
                    boxShadow: "0px 4px 10px rgba(186, 143, 33, 0.5)",
                  }}
                >
                  Most Popular
                </div>
              )}
              <Card
                className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] text-black"
                style={
                  plan.name === "Velvet Mystery Box"
                    ? { background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)" }
                    : plan.name === "Muse Mystery Box" || plan.name === "Black Label Mystery Box"
                      ? { background: "#e783bd" }
                      : {}
                }
              >
                <CardHeader className="pt-8 pb-4">
                  <div className="flex justify-center mb-4">
                    <Gift className="h-12 w-12 text-black" />
                  </div>
                  <div className="font-great-vibes text-3xl mb-1 text-black text-center">{getPrefix(plan.name)}</div>
                  <CardTitle className="text-2xl text-center text-black">{getDisplayName(plan.name)}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-4">
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-black">{plan.price}</span>
                    <span className="text-black/80">/month</span>
                  </div>
                  <p className="mb-6 text-black/80">{plan.description}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center">
                        <Check className="h-5 w-5 mr-1 text-black flex-shrink-0" />
                        <span className="text-black text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-0 pb-8">
                  <Button
                    className="w-full text-black font-bold rounded-lg"
                    style={
                      plan.name === "Muse Mystery Box" || plan.name === "Black Label Mystery Box"
                        ? {
                            background: "linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C)",
                            boxShadow: "0px 4px 8px rgba(186, 143, 33, 0.3)",
                            color: "black",
                          }
                        : {
                            background: "linear-gradient(to right, #e6a9a9, #f8cdba, #e6c9c9, #f0b2a6, #e6a9a9)",
                            boxShadow: "0px 4px 8px rgba(230, 169, 169, 0.3)",
                            color: "black",
                          }
                    }
                  >
                    Subscribe Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
