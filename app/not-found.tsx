"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const [suggestions, setSuggestions] = useState<string[]>(["/shop", "/customization-suite", "/about", "/contact"])

  // Error tracking
  useEffect(() => {
    // Log 404 error to your analytics or error tracking service
    const trackError = async () => {
      try {
        // In a real app, you'd send this to your analytics service
        console.error("404 Error:", {
          path: typeof window !== "undefined" ? window.location.pathname : "unknown",
          referrer: typeof document !== "undefined" ? document.referrer : "unknown",
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
          timestamp: new Date().toISOString(),
        })
      } catch (err) {
        console.error("Failed to track 404 error:", err)
      }
    }

    trackError()
  }, [])

  // Countdown to redirect
  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = "https://dessertprint.com"
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-rose-50 to-white p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-extrabold text-rose-600 mb-2">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            We couldn't find the page you were looking for. It might have been moved or deleted.
          </p>
        </div>

        <Card className="border-rose-200 shadow-lg">
          <CardContent className="pt-6">
            <p className="font-medium text-gray-800 mb-4">
              You'll be redirected to our homepage in {countdown} seconds...
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button
                onClick={() => (window.location.href = "https://dessertprint.com")}
                className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2"
              >
                <Home size={18} />
                Go to Homepage
              </Button>

              <Button
                onClick={() => router.back()}
                variant="outline"
                className="border-rose-600 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">You might be looking for:</h3>
          <div className="grid gap-3">
            {suggestions.map((path) => (
              <Link
                key={path}
                href={path}
                className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-rose-50 hover:border-rose-200 transition-colors flex items-center justify-between"
              >
                <span className="font-medium">{path.charAt(0).toUpperCase() + path.slice(1).replace("/", " ")}</span>
                <ArrowLeft size={16} className="transform rotate-180" />
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <Search size={18} className="text-gray-500" />
            <span className="text-gray-600">Can't find what you're looking for? Try searching our site.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
