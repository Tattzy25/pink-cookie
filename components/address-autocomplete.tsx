"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { geocodeAddress } from "@/lib/mapbox-client"

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, coordinates?: [number, number]) => void
  placeholder?: string
  className?: string
  defaultValue?: string
  required?: boolean
}

export default function AddressAutocomplete({
  onAddressSelect,
  placeholder = "Enter your address",
  className,
  defaultValue = "",
  required = false,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch suggestions when query changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query || query.length < 3) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        // Use our secure geocoding function
        const data = await geocodeAddress(query)

        if (data && data.features) {
          setSuggestions(data.features.slice(0, 5))
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(() => {
      fetchSuggestions()
    }, 300)

    return () => clearTimeout(debounce)
  }, [query])

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setSuggestions([])
        setFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelectAddress = (suggestion: any) => {
    const fullAddress = suggestion.place_name || suggestion.text
    setQuery(fullAddress)
    setSuggestions([])
    onAddressSelect(fullAddress, suggestion.center)
  }

  const clearInput = () => {
    setQuery("")
    setSuggestions([])
    onAddressSelect("")
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          className={cn("pl-10", className)}
          required={required}
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={clearInput}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}

      {suggestions.length > 0 && focused && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <ul className="py-1 max-h-60 overflow-auto">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="px-4 py-2 hover:bg-rose-50 cursor-pointer text-sm"
                onClick={() => handleSelectAddress(suggestion)}
              >
                <div className="font-medium">{suggestion.text}</div>
                <div className="text-xs text-gray-500">{suggestion.place_name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
