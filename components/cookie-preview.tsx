"use client"

import { useState } from "react"
import Image from "next/image"

export default function CookiePreview({ imageUrl, shape = "circle" }) {
  const [maskImage, setMaskImage] = useState("")

  // Map shape names to SVG files
  const shapePaths = {
    circle: "/cookie-shapes/circle.svg",
    heart: "/cookie-shapes/heart.svg",
    square: "/cookie-shapes/square.svg",
    star: "/cookie-shapes/star.svg",
    clover: "/cookie-shapes/clover.svg",
    crown: "/cookie-shapes/star.svg", // Fallback to star if crown is selected
  }

  // Get the correct SVG path for the selected shape
  const shapePath = shapePaths[shape] || shapePaths.circle

  return (
    <div className="w-full h-64 md:h-80 relative flex items-center justify-center">
      <div className="relative w-64 h-64 md:w-72 md:h-72">
        {/* Cookie shape as mask */}
        <div className="absolute inset-0 z-10">
          <Image
            src={shapePath || "/placeholder.svg"}
            alt={`${shape} cookie shape`}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Image inside cookie shape */}
        {imageUrl && (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                WebkitMaskImage: `url(${shapePath})`,
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                maskImage: `url(${shapePath})`,
                maskSize: "contain",
                maskPosition: "center",
                maskRepeat: "no-repeat",
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
