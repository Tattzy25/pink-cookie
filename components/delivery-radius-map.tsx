"\"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface DeliveryRadiusMapProps {
  center?: [number, number]
  zoom?: number
  locations: {
    name: string
    coordinates: [number, number]
    radius: number // in miles
  }[]
  customerLocation?: [number, number]
  height?: string | number
  width?: string | number
}

export default function DeliveryRadiusMap({
  center = [-118.3, 34.18], // Default to LA area
  zoom = 9.5,
  locations,
  customerLocation,
  height = 400,
  width = "100%",
}: DeliveryRadiusMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

    const initializeMap = () => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/streets-v11",
        center: center,
        zoom: zoom,
      })

      map.current.on("load", () => {
        locations.forEach((location, index) => {
          const radiusInMeters = location.radius * 1609.34 // Convert miles to meters

          // Add circle for delivery radius
          map.current!.addSource(`radius-${index}`, {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: location.coordinates,
              },
              properties: {
                radius: radiusInMeters,
              },
            },
          })

          map.current!.addLayer({
            id: `radius-${index}`,
            type: "circle",
            source: `radius-${index}`,
            paint: {
              "circle-radius": {
                stops: [
                  [0, 0],
                  [20, radiusInMeters / 0.3], // Adjust the divisor to scale the circle correctly
                ],
                base: 2,
              },
              "circle-color": "#e783bd",
              "circle-opacity": 0.2,
              "circle-stroke-width": 2,
              "circle-stroke-color": "#e783bd",
            },
          })

          // Add marker for store location
          new mapboxgl.Marker({ color: "#e783bd" })
            .setLngLat(location.coordinates)
            .setPopup(
              new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3><p>Delivery radius: ${location.radius} miles</p>`),
            )
            .addTo(map.current!)
        })

        // Add customer location marker if provided
        if (customerLocation) {
          new mapboxgl.Marker({ color: "#3b82f6" })
            .setLngLat(customerLocation)
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))
            .addTo(map.current!)
        }
      })
    }

    initializeMap()

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [center, zoom, locations, customerLocation])

  return <div ref={mapContainer} style={{ height: height, width: width }} />
}

export { DeliveryRadiusMap }
