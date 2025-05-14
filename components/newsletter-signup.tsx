"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, AlertCircle } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState<{ email?: string; firstName?: string }>({})

  const validateInputs = (): boolean => {
    const newErrors: { email?: string; firstName?: string } = {}

    // Email validation
    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = "Invalid email address"
    }

    // First name validation (optional but validate if provided)
    if (firstName && firstName.length > 50) {
      newErrors.firstName = "First name must be less than 50 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateInputs()) return

    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, firstName }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Thank you for subscribing to our newsletter!")
        setEmail("")
        setFirstName("")
        setErrors({})

        // Track conversion
        if (typeof window !== "undefined" && "gtag" in window) {
          // @ts-ignore
          window.gtag("event", "newsletter_signup", {
            event_category: "engagement",
            event_label: "Newsletter Signup",
          })
        }
      } else {
        // Handle specific error cases
        if (data.error === "already_subscribed") {
          setStatus("error")
          setMessage("This email is already subscribed to our newsletter.")
        } else if (data.error === "invalid_email") {
          setStatus("error")
          setMessage("Please provide a valid email address.")
        } else {
          throw new Error(data.error || "Failed to subscribe")
        }
      }
    } catch (error: any) {
      setStatus("error")
      setMessage(error.message || "Something went wrong. Please try again.")
      console.error("Newsletter subscription error:", error)
    }
  }

  return (
    <div className="rounded-[49px] overflow-hidden bg-gradient-to-r from-rose-600 to-amber-500 p-1 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
      <div className="bg-white rounded-[48px] p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="bg-rose-100 p-3 rounded-full mb-4">
            <Mail className="h-6 w-6 text-rose-600" />
          </div>
          <h3 className="text-2xl font-bold text-rose-800">Subscribe to Our Newsletter</h3>
          <p className="text-muted-foreground mt-2">
            Get exclusive offers, design inspiration, and sweet updates delivered to your inbox
          </p>
        </div>

        {status === "success" ? (
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-green-600 font-medium">{message}</p>
            <Button className="mt-4" variant="outline" onClick={() => setStatus("idle")}>
              Subscribe Another Email
            </Button>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-red-600 font-medium">{message}</p>
            <Button className="mt-4" variant="outline" onClick={() => setStatus("idle")}>
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="First Name (Optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full ${errors.firstName ? "border-red-500 focus:ring-red-500" : ""}`}
                aria-invalid={errors.firstName ? "true" : "false"}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Your Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`}
                  aria-invalid={errors.email ? "true" : "false"}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <Button type="submit" className="btn-luxury text-white" disabled={status === "loading"}>
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              By subscribing, you agree to receive marketing emails from us. You can unsubscribe at any time.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
