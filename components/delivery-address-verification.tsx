"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { checkDeliveryRadius } from "@/lib/mapbox-actions"
import Image from "next/image"
import { AlertCircle, MapPin, CheckCircle } from "lucide-react"
import { getStaticMapUrl } from "@/lib/mapbox-client"

export default function DeliveryAddressVerification() {
  const [address, setAddress] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [mapUrl, setMapUrl] = useState<string | null>(null)

  const verifyAddress = async () => {
    if (!address.trim()) {
      setError("Please enter an address")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // First try the server action
      try {
        const deliveryCheck = await checkDeliveryRadius(address)
        if (deliveryCheck) {
          setResult(deliveryCheck)

          // Generate map URL using our secure client function
          if (deliveryCheck.coordinates) {
            const url = await getStaticMapUrl(deliveryCheck.coordinates as [number, number], 13, 600, 300, [
              { coordinates: deliveryCheck.coordinates as [number, number], color: "#e91e63" },
            ])
            setMapUrl(url)
          }

          setLoading(false)
          return
        }
      } catch (serverActionError) {
        console.error("Server action failed, trying API route:", serverActionError)
      }

      // If server action fails, try the API route as fallback
      const response = await fetch("/api/delivery-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `API error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)

      // Generate map URL using our secure client function
      if (data.coordinates) {
        const url = await getStaticMapUrl(data.coordinates as [number, number], 13, 600, 300, [
          { coordinates: data.coordinates as [number, number], color: "#e91e63" },
        ])
        setMapUrl(url)
      }
    } catch (error: any) {
      console.error("Error verifying address:", error)
      setError(error.message || "Error verifying address. Please try again.")
      setResult({
        eligible: false,
        message: "We couldn't verify your address. Please check and try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      verifyAddress()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-4">
        <div>
          <Label htmlFor="address" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> Check Delivery Availability
          </Label>
          <Input
            id="address"
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            className="mt-1"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "address-error" : undefined}
          />
          {error && (
            <div id="address-error" className="flex items-center gap-1 mt-1 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          )}
        </div>

        <Button onClick={verifyAddress} className="w-full bg-rose-600 hover:bg-rose-700" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Checking...
            </>
          ) : (
            "Check Delivery Availability"
          )}
        </Button>

        {result && (
          <div
            className={`p-4 rounded-lg mt-4 ${
              result.eligible ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start gap-2">
              {result.eligible ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${result.eligible ? "text-green-800" : "text-red-800"}`}>{result.message}</p>

                {result.eligible && <p className="text-sm text-green-700 mt-1">Free delivery on orders over $39!</p>}

                {!result.eligible && (
                  <p className="text-sm text-red-700 mt-1">
                    We currently deliver to areas within 15 miles of Glendale, CA or 20 miles of Panorama City, CA.
                  </p>
                )}
              </div>
            </div>

            {result.eligible && result.coordinates && mapUrl && (
              <div className="mt-4">
                <div className="relative w-full h-48 rounded-lg overflow-hidden mt-2">
                  <Image src={mapUrl || "/placeholder.svg"} alt="Delivery map" fill className="object-cover" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
