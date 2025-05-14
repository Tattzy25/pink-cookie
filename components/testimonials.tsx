"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { H1Card } from "@/components/h1-card"
import Image from "next/image"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Birthday Party Host",
      content:
        "OMG these cookies were the highlight of my daughter's birthday! Everyone was blown away by the custom designs. Will definitely order again!",
      rating: 5,
      image: "/happy-customer-testimonial.png",
    },
    {
      name: "Michael Rodriguez",
      role: "Corporate Event Planner",
      content:
        "Our clients were absolutely stunned by the chocolate bars with our company logo. The quality was exceptional and the taste was even better!",
      rating: 5,
      image: "/confident-businessman-testimonial.png",
    },
    {
      name: "Jennifer Lee",
      role: "Wedding Coordinator",
      content:
        "The custom wedding cookies were a perfect addition to our gift bags. The designs were flawless and they tasted amazing!",
      rating: 5,
      image: "/joyful-couple-testimonial.png",
    },
    {
      name: "David Thompson",
      role: "Satisfied Customer",
      content:
        "I was skeptical about how the image would look on a cookie, but WOW! The detail was incredible and they tasted fantastic. 10/10 would recommend!",
      rating: 5,
      image: "/confident-testimonial.png",
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="w-full py-12 md:py-24 bg-[#e783bd]">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="flex justify-center">
            <H1Card>Testimonials</H1Card>
          </div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="rounded-[49px] overflow-hidden bg-gradient-to-r from-rose-600 to-amber-500 p-1 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
            <Card className="rounded-[48px] border-0">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-rose-200">
                    <Image
                      src={testimonials[currentIndex].image || "/placeholder.svg"}
                      alt={testimonials[currentIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: testimonials[currentIndex].rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-medium italic text-rose-800">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                  <div>
                    <p className="font-bold text-rose-700">{testimonials[currentIndex].name}</p>
                    <p className="text-sm text-rose-600">{testimonials[currentIndex].role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white rounded-full shadow-lg hover:bg-rose-50"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6 text-rose-800" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white rounded-full shadow-lg hover:bg-rose-50"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6 text-rose-800" />
            <span className="sr-only">Next</span>
          </Button>
        </div>
      </div>
    </section>
  )
}
