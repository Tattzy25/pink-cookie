"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface MapDisplayProps {
  address?: string
  coordinates?: [number, number]
  zoom?: number
  width?: number
  height?: number
}

export default function MapDisplay({
  address,
  coordinates: initialCoordinates,
  zoom = 14,
  width = 600,
  height = 400,
}: MapDisplayProps) {
  const [mapUrl, setMapUrl] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadMap() {
      try {
        setLoading(true)

        // If we have coordinates, use them directly
        if (initialCoordinates) {
          const [lng, lat] = initialCoordinates
          const params = {
            lng,
            lat,
            zoom,
            width,
            height,
            markers: [{ lng, lat, color: "#e783bd" }],
          }

          const response = await fetch(
            `/api/mapbox?endpoint=staticmap&query=${encodeURIComponent(JSON.stringify(params))}`,
          )
          const data = await response.json()

          if (data.url) {
            setMapUrl(data.url)
          } else {
            setError("Failed to generate map URL")
          }
        }
        // Otherwise geocode the address
        else if (address) {
          const response = await fetch(`/api/mapbox?endpoint=geocoding&query=${encodeURIComponent(address)}`)
          const data = await response.json()

          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center

            // Now get the static map URL
            const params = {
              lng,
              lat,
              zoom,
              width,
              height,
              markers: [{ lng, lat, color: "#e783bd" }],
            }

            const mapResponse = await fetch(
              `/api/mapbox?endpoint=staticmap&query=${encodeURIComponent(JSON.stringify(params))}`,
            )
            const mapData = await mapResponse.json()

            if (mapData.url) {
              setMapUrl(mapData.url)
            } else {
              setError("Failed to generate map URL")
            }
          } else {
            setError("Address not found")
          }
        } else {
          setError("No address or coordinates provided")
        }
      } catch (err) {
        console.error("Error loading map:", err)
        setError("Failed to load map")
      } finally {
        setLoading(false)
      }
    }

    loadMap()
  }, [address, initialCoordinates, zoom, width, height])

  if (loading) {
    return <div className="flex justify-center items-center h-[400px] bg-gray-100">Loading map...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-[400px] bg-gray-100 text-red-500">{error}</div>
  }

  return (
    <div className="relative rounded-lg overflow-hidden shadow-lg">
      {mapUrl && (
        <Image
          src={mapUrl || "/placeholder.svg"}
          alt={address || "Map location"}
          width={width}
          height={height}
          className="w-full h-auto"
        />
      )}
    </div>
  )
}
