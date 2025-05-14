"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  name: string
  description: string
  price: string
  image: string
  category: string
}

export default function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<Product[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])

  // Mock products data - in a real app, this would come from an API or database
  useEffect(() => {
    // This would be replaced with a fetch call to your API
    const products: Product[] = [
      {
        id: "chocolate-cookie",
        name: "Chocolate Cookie",
        description: "Rich chocolate cookies with your custom design",
        price: "$10.00",
        image: "/printed-cookie.png",
        category: "cookies",
      },
      {
        id: "orange-cookie",
        name: "Orange Cookie",
        description: "Zesty orange-flavored cookies with your design",
        price: "$10.00",
        image: "/printed-orange-cookie.png",
        category: "cookies",
      },
      {
        id: "lemon-cookie",
        name: "Lemon Cookie",
        description: "Refreshing lemon cookies with your design",
        price: "$10.00",
        image: "/printed-lemon-cookie.png",
        category: "cookies",
      },
      {
        id: "sugar-cookie",
        name: "Sugar Cookie",
        description: "Classic sugar cookies with your design",
        price: "$10.00",
        image: "/personalized-cookie.png",
        category: "cookies",
      },
      {
        id: "dark-chocolate",
        name: "Dark Chocolate Bar",
        description: "Rich dark chocolate with your custom design",
        price: "$18.00",
        image: "/patterned-chocolate-bar.png",
        category: "chocolate",
      },
      {
        id: "milk-chocolate",
        name: "Milk Chocolate Bar",
        description: "Creamy milk chocolate with your custom design",
        price: "$18.00",
        image: "/patterned-chocolate-bar.png",
        category: "chocolate",
      },
      {
        id: "white-chocolate",
        name: "White Chocolate Bar",
        description: "Sweet white chocolate with your custom design",
        price: "$18.00",
        image: "/printed-white-chocolate.png",
        category: "chocolate",
      },
      {
        id: "hemp-chocolate",
        name: "Hemp Seed Chocolate",
        description: "130g rich milk chocolate with hemp seeds",
        price: "$15.00",
        image: "/hemp-seed-chocolate-bar.png",
        category: "chocolate",
      },
      {
        id: "birthday-gift-box",
        name: "Birthday Gift Box",
        description: "Assorted cookies and chocolate bars for birthdays",
        price: "$45.00",
        image: "/birthday-chocolate-treats.png",
        category: "gift-sets",
      },
      {
        id: "wedding-favor-set",
        name: "Wedding Favor Set",
        description: "Elegant cookies and chocolate bars for wedding favors",
        price: "$60.00",
        image: "/elegant-wedding-cookie-display.png",
        category: "gift-sets",
      },
    ]

    setAllProducts(products)
  }, [])

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)

    // Filter products based on search term
    const results = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    // Simulate API delay
    setTimeout(() => {
      setSearchResults(results)
      setIsSearching(false)
    }, 300)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search for cookies, chocolate bars, or gift sets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="rounded-full"
        />
        <Button onClick={handleSearch} className="rounded-full bg-rose-600 hover:bg-rose-700" disabled={isSearching}>
          <Search className="h-4 w-4 mr-2" />
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {searchResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Search Results ({searchResults.length})</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {searchResults.map((product) => (
              <Card key={product.id} className="overflow-hidden rounded-[20px] border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="relative h-40 w-full">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-bold text-rose-600">{product.price}</span>
                      <Link href={`/shop/product/${product.id}`}>
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchTerm && searchResults.length === 0 && !isSearching && (
        <div className="mt-6 text-center py-8">
          <p className="text-muted-foreground">No products found matching "{searchTerm}"</p>
          <Button variant="link" className="text-rose-600" onClick={() => setSearchTerm("")}>
            Clear search
          </Button>
        </div>
      )}
    </div>
  )
}
