import { CheckCircle } from "lucide-react"
import { H1Card } from "@/components/h1-card"

// Reusable gradient heading component that can be used throughout the site
export function GradientHeading({ children, className = "", as: Component = "h2", ...props }) {
  return (
    <Component
      className={`text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${className}`}
      style={{
        background: "linear-gradient(to right, #1a1a1a, #8B4513, #B87333, #4a3021, #2d1a12)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textShadow: "0px 2px 4px rgba(0,0,0,0.3)",
        animation: "shimmer 2.5s infinite linear",
        position: "relative",
        overflow: "hidden",
      }}
      {...props}
    >
      {children}
    </Component>
  )
}

export default function WhyUs() {
  const features = [
    {
      title: "Premium Ingredients",
      description: "Only the finest ingredients to create truly unforgettable treats.",
    },
    {
      title: " Free Delivery",
      description: "Quick and reliable delivery for fresh, perfect treats at your doorstep.",
    },
    {
      title: "Exceptional Service",
      description: "24/7 customer support to ensure an amazing experience every time.",
    },
    {
      title: "Customized with Care",
      description: "Choose your shape, upload your image, and let us create the perfect treat just for you.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-[#e783bd]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="flex justify-center">
              <H1Card>What Sets Us Apart</H1Card>
            </div>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 flex flex-col items-center text-center"
              style={{
                borderRadius: "50px",
                background: "linear-gradient(145deg, #d076aa, #f78cca)",
                boxShadow: "20px 20px 40px #c06d9d, -20px -20px 40px #ff99dd",
              }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-gold-gradient shadow-gold">
                <CheckCircle className="h-10 w-10 text-black" />
              </div>
              <h3 className="text-xl font-bold text-black">{feature.title}</h3>
              <p className="mt-2 text-black/90">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
