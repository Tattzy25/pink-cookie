"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { checkDeliveryRadius } from "@/lib/mapbox-actions"
import AddressAutocomplete from "./address-autocomplete"
import DeliveryRadiusMap from "./delivery-radius-map"

export default function EnhancedDeliveryVerification() {
  const [address, setAddress] = useState("")
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  // Store locations (same as in mapbox-actions.ts)
  const storeLocations = [
    {
      name: "Glendale Store",
      coordinates: [-118.254947, 34.146288] as [number, number],
      radius: 15, // miles
    },
    {
      name: "Panorama City Store",
      coordinates: [-118.442757, 34.227078] as [number, number],
      radius: 20, // miles
    },
  ]

  const verifyAddress = async () => {
    if (!address) {
      alert("Please enter an address")
      return
    }

    setLoading(true)
    try {
      // First try the server action
      try {
        const deliveryCheck = await checkDeliveryRadius(address)
        if (deliveryCheck) {
          setResult(deliveryCheck)
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
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error verifying address:", error)
      setResult({
        eligible: false,
        message: "Error verifying address. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSelect = (selectedAddress: string, coords?: [number, number]) => {
    setAddress(selectedAddress)
    if (coords) {
      setCoordinates(coords)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="rounded-[30px] overflow-hidden border-0 shadow-[20px_20px_60px_#d4a0aa,-20px_-20px_60px_#ffccd8]">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="address" className="text-lg font-medium text-rose-800">
                Check Delivery Availability
              </Label>
              <div className="mt-2">
                <AddressAutocomplete
                  onAddressSelect={handleAddressSelect}
                  placeholder="Enter your full address"
                  className="bg-white"
                />
              </div>
            </div>

            <Button
              onClick={verifyAddress}
              className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-md"
              disabled={loading || !address}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Checking...
                </>
              ) : (
                "Check Delivery Availability"
              )}
            </Button>
          </div>

          {/* Map showing delivery radius */}
          <div className="pt-4">
            <h3 className="text-lg font-medium text-rose-800 mb-4">Delivery Areas</h3>
            <DeliveryRadiusMap locations={storeLocations} customerLocation={coordinates || undefined} height={300} />
            <p className="text-sm text-rose-600 mt-2 text-center">
              Free delivery on orders over $39 within the highlighted areas
            </p>
          </div>

          {result && (
            <div
              className={`p-4 rounded-lg mt-4 ${
                result.eligible ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
              }`}
            >
              <p className="font-medium">{result.message}</p>
              {result.eligible && (
                <p className="text-sm mt-2">
                  Free delivery on orders over $39! Your address is approximately {result.distance} miles from our{" "}
                  {result.location?.name}.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
