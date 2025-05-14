"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ImageIcon, CuboidIcon as Cube, Scissors, Maximize, Square, Share2 } from "lucide-react"
import Link from "next/link"
import { H1Card } from "@/components/h1-card"

export default function CustomTreatCreator() {
  return (
    <section style={{ background: "#e783bd" }}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center mb-12 mt-12">
          <H1Card>Design Your Taste Buds</H1Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card
            className="rounded-[50px] overflow-hidden border-none transition-all duration-300"
            style={{
              background: "linear-gradient(145deg, #d076aa, #f78cca)",
              boxShadow: "25px 25px 50px #c06d9d, -25px -25px 50px #ff99dd",
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 text-white">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gold-gradient">
                <ImageIcon className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">Image Generation</h3>
              <p className="text-black">
                Upload any image to create a custom cookie or chocolate design—whether it's your logo, a personal photo,
                or something unique.
              </p>
            </CardContent>
          </Card>

          <Card
            className="rounded-[50px] overflow-hidden border-none transition-all duration-300"
            style={{
              background: "linear-gradient(145deg, #d076aa, #f78cca)",
              boxShadow: "25px 25px 50px #c06d9d, -25px -25px 50px #ff99dd",
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 text-white">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gold-gradient">
                <Cube className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">3D Rendering</h3>
              <p className="text-black">
                Preview your design in 3D before it's made, so you can visualize every detail.
              </p>
            </CardContent>
          </Card>

          <Card
            className="rounded-[50px] overflow-hidden border-none transition-all duration-300"
            style={{
              background: "linear-gradient(145deg, #d076aa, #f78cca)",
              boxShadow: "25px 25px 50px #c06d9d, -25px -25px 50px #ff99dd",
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 text-white">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gold-gradient">
                <Scissors className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">Background Removal</h3>
              <p className="text-black">Remove unwanted backgrounds for a clean, crisp design.</p>
            </CardContent>
          </Card>

          <Card
            className="rounded-[50px] overflow-hidden border-none transition-all duration-300"
            style={{
              background: "linear-gradient(145deg, #d076aa, #f78cca)",
              boxShadow: "25px 25px 50px #c06d9d, -25px -25px 50px #ff99dd",
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 text-white">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gold-gradient">
                <Maximize className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">Image Upscaling</h3>
              <p className="text-black">Ensure your image is sharp and high-quality with our upscaling tool.</p>
            </CardContent>
          </Card>

          <Card
            className="rounded-[50px] overflow-hidden border-none transition-all duration-300"
            style={{
              background: "linear-gradient(145deg, #d076aa, #f78cca)",
              boxShadow: "25px 25px 50px #c06d9d, -25px -25px 50px #ff99dd",
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 text-white">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gold-gradient">
                <Square className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">Custom Shapes and Sizes</h3>
              <p className="text-black">
                Choose your favorite cookie or chocolate shape from a variety of options, and make it your own.
              </p>
            </CardContent>
          </Card>

          <Card
            className="rounded-[50px] overflow-hidden border-none transition-all duration-300"
            style={{
              background: "linear-gradient(145deg, #d076aa, #f78cca)",
              boxShadow: "25px 25px 50px #c06d9d, -25px -25px 50px #ff99dd",
            }}
          >
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4 text-white">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gold-gradient">
                <Share2 className="w-8 h-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold text-black">Share Your Creations</h3>
              <p className="text-black">
                Show off your custom cookies and chocolates! Share your designs with friends on social media directly
                from our platform.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center">
          <Link href="/design-tool">
            <Button className="bg-gold-gradient text-black font-bold px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Start Designing Now!
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
