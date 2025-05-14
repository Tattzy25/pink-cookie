import type React from "react"
import { Card } from "@/components/ui/card"

interface H1CardProps {
  children: React.ReactNode
  className?: string
}

export function H1Card({ children, className = "" }: H1CardProps) {
  return (
    <div className="flex justify-center w-full">
      <Card
        className={`px-12 py-5 inline-block ${className}`}
        style={{
          background: "#e783bd",
          boxShadow: "27px 27px 54px #6d2849",
          borderRadius: "49px",
          border: "none",
        }}
      >
        <h1 className={`font-great-vibes text-center text-[36px] md:text-[72px]`} style={{ margin: 0 }}>
          {children}
        </h1>
      </Card>
    </div>
  )
}
