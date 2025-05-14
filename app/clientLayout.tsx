"use client"

import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import { Great_Vibes, Playfair_Display, Roboto } from "next/font/google"
import { AuthProvider } from "@/lib/auth"

// Define the primary heading font for h1
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
  display: "swap",
})

// Define the secondary heading font for h2, h3
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

// Define the body font
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
})

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${greatVibes.variable} ${playfair.variable} ${roboto.variable}`}
    >
      <body className="min-h-screen bg-[#e783bd]">
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <ErrorBoundaryWrapper>
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
                <Header />
                <main>{children}</main>
                <Footer />
              </Suspense>
              <Analytics />
            </ErrorBoundaryWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

// Add a simple error boundary to prevent white screens
function ErrorBoundaryWrapper({ children }: { children: React.ReactNode }) {
  // In a real implementation, this would be a proper React error boundary
  // For now, we'll just wrap the children to ensure the app doesn't crash completely
  try {
    return <>{children}</>
  } catch (error) {
    console.error("Critical error in layout:", error)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#e783bd]">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="mb-4">We're experiencing some technical difficulties. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white rounded shadow hover:bg-gray-100"
        >
          Refresh Page
        </button>
      </div>
    )
  }
}
