"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Star, ShoppingCart, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import CustomerReviews from "@/components/customer-reviews"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedFlavor, setSelectedFlavor] = useState("chocolate")
  const [selectedShape, setSelectedShape] = useState("circle")

  // This would normally fetch from a database based on the ID
  const product = {
    id: params.id,
    name: "Chocolate Cookie with Custom Design",
    description:
      "Rich chocolate cookies with your custom design. Perfect for birthdays, weddings, corporate events, and more. Each cookie is handcrafted with premium ingredients and printed with high-quality edible ink.",
    price: 10.0,
    rating: 4.8,
    reviewCount: 124,
    image: "/custom-cookie-art.png",
    gallery: [
      "/single-chocolate-cookie-overhead.png",
      "/angled-chocolate-cookie.png",
      "/three-chocolate-cookies.png",
      "/angled-chocolate-cookie.png",
    ],
    flavors: [
      { id: "chocolate", name: "Chocolate", color: "bg-amber-900" },
      { id: "orange", name: "Orange", color: "bg-orange-500" },
      { id: "lemon", name: "Lemon", color: "bg-yellow-400" },
      { id: "sugar", name: "Sugar", color: "bg-amber-100" },
    ],
    shapes: [
      { id: "circle", name: "Circle", image: "/classic-round-cookies.png" },
      { id: "heart", name: "Heart", image: "/classic-heart-cookie.png" },
      { id: "crown", name: "Crown", image: "/golden-crown-cookies.png" },
      { id: "bunny", name: "Bunny", image: "/bunny-cookie-cutter.png" },
    ],
    details: [
      "Made with premium ingredients",
      "High-quality edible ink printing",
      "Customizable with your own images or text",
      "Available in multiple flavors and shapes",
      "Individually wrapped for freshness",
      "Shelf life of 2-3 weeks",
    ],
    relatedProducts: [
      {
        id: "related-1",
        name: "Dark Chocolate Bar",
        price: "$18.00",
        image: "/rich-dark-chocolate.png",
      },
      {
        id: "related-2",
        name: "Orange Cookie",
        price: "$10.00",
        image: "/citrus-swirl.png",
      },
      {
        id: "related-3",
        name: "Birthday Gift Box",
        price: "$45.00",
        image: "/assorted-cookie-gift.png",
      },
    ],
    type: "cookie",
  }

  // Update the calculatePrice function to reflect the correct pricing structure
  const calculatePrice = () => {
    const basePrice = product.price
    let totalPrice = basePrice * quantity

    // Apply discounts based on product type and quantity
    if (product.type === "cookie") {
      if (quantity >= 24) {
        totalPrice = totalPrice * 0.8 // 20% off
      } else if (quantity >= 18) {
        totalPrice = totalPrice * 0.85 // 15% off
      } else if (quantity >= 12) {
        totalPrice = totalPrice * 0.9 // 10% off
      }
    } else if (product.type === "chocolate") {
      if (quantity >= 12) {
        totalPrice = totalPrice * 0.8 // 20% off
      } else if (quantity >= 8) {
        totalPrice = totalPrice * 0.85 // 15% off
      } else if (quantity >= 4) {
        totalPrice = totalPrice * 0.9 // 10% off
      }
    }

    return totalPrice.toFixed(2)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="rounded-[49px] overflow-hidden bg-gradient-to-r from-rose-600 to-amber-500 p-1 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
            <div className="relative aspect-square rounded-[48px] overflow-hidden bg-white">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.gallery.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden border-2 border-rose-200 cursor-pointer hover:border-rose-500"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-heading mb-2">
            {product.name}
          </h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          <p className="text-2xl font-bold text-rose-600 mb-4">${calculatePrice()}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <Separator className="my-6" />

          {/* Flavor Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Choose Flavor</h3>
            <RadioGroup value={selectedFlavor} onValueChange={setSelectedFlavor} className="flex flex-wrap gap-3">
              {product.flavors.map((flavor) => (
                <div key={flavor.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={flavor.id} id={`flavor-${flavor.id}`} className="sr-only" />
                  <Label
                    htmlFor={`flavor-${flavor.id}`}
                    className={`px-4 py-2 rounded-full border-2 cursor-pointer flex items-center gap-2 ${
                      selectedFlavor === flavor.id ? "border-rose-500 bg-rose-50" : "border-rose-200"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${flavor.color}`}></div>
                    <span>{flavor.name}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Shape Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Choose Shape</h3>
            <div className="grid grid-cols-4 gap-3">
              {product.shapes.map((shape) => (
                <div
                  key={shape.id}
                  className={`relative w-16 h-16 rounded-lg border-2 cursor-pointer overflow-hidden ${
                    selectedShape === shape.id ? "border-rose-500 ring-2 ring-rose-500" : "border-rose-200"
                  }`}
                  onClick={() => setSelectedShape(shape.id)}
                >
                  <Image src={shape.image || "/placeholder.svg"} alt={shape.name} fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Quantity</h3>
            <div className="flex flex-wrap gap-3">
              {product.type === "cookie"
                ? [1, 6, 12, 18, 24].map((qty) => (
                    <Button
                      key={qty}
                      variant={quantity === qty ? "default" : "outline"}
                      className={quantity === qty ? "bg-rose-600 hover:bg-rose-700" : "border-rose-200"}
                      onClick={() => setQuantity(qty)}
                    >
                      {qty === 1 ? `${qty} cookie` : `${qty} cookies`}
                    </Button>
                  ))
                : [1, 4, 6, 8, 12, 14].map((qty) => (
                    <Button
                      key={qty}
                      variant={quantity === qty ? "default" : "outline"}
                      className={quantity === qty ? "bg-rose-600 hover:bg-rose-700" : "border-rose-200"}
                      onClick={() => setQuantity(qty)}
                    >
                      {qty === 1 ? `${qty} bar` : `${qty} bars`}
                    </Button>
                  ))}
            </div>
            {product.type === "cookie" && quantity >= 12 && (
              <p className="text-sm text-green-600 mt-2">
                {quantity >= 24
                  ? "20% bulk discount applied!"
                  : quantity >= 18
                    ? "15% bulk discount applied!"
                    : "10% bulk discount applied!"}
              </p>
            )}
            {product.type === "chocolate" && quantity >= 4 && (
              <p className="text-sm text-green-600 mt-2">
                {quantity >= 12
                  ? "20% bulk discount applied!"
                  : quantity >= 8
                    ? "15% bulk discount applied!"
                    : "10% bulk discount applied!"}
              </p>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button className="flex-1 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white py-6 text-lg font-bold">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
            <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
              <Heart className="mr-2 h-5 w-5" />
              Save
            </Button>
            <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
              <Share2 className="mr-2 h-5 w-5" />
              Share
            </Button>
          </div>

          <Link href="/design">
            <Button className="w-full bg-rose-100 text-rose-800 hover:bg-rose-200 py-6">
              Design Your Own Custom Cookie
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3] mb-16">
        <CardContent className="p-6 md:p-8">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="details" className="text-lg">
                Product Details
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg">
                Reviews
              </TabsTrigger>
              <TabsTrigger value="shipping" className="text-lg">
                Shipping & Returns
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <h3 className="text-xl font-bold text-rose-800">Product Details</h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-rose-600 mr-2">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-rose-800">Customer Reviews</h3>
                <Button className="bg-rose-600 hover:bg-rose-700">Write a Review</Button>
              </div>

              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border-b border-gray-200 pb-6 last:border-0">
                    <div className="flex justify-between mb-2">
                      <div className="font-bold">Happy Customer {i + 1}</div>
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`h-4 w-4 ${j < 5 - i ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">April {15 + i}, 2025</div>
                    <p>
                      These cookies were absolutely amazing! The design came out perfectly and they tasted delicious.
                      Everyone at the party loved them. Will definitely order again.
                    </p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full border-rose-600 text-rose-600 hover:bg-rose-50">
                Load More Reviews
              </Button>
            </TabsContent>

            <TabsContent value="shipping" className="space-y-4">
              <h3 className="text-xl font-bold text-rose-800">Shipping Information</h3>
              <p>
                We ship our cookies and chocolate bars nationwide. All orders are carefully packaged to ensure they
                arrive in perfect condition.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  <span>Standard Shipping: 3-5 business days</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  <span>Express Shipping: 1-2 business days (additional fee)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-rose-600 mr-2">•</span>
                  <span>Free shipping on orders over $50</span>
                </li>
              </ul>

              <h3 className="text-xl font-bold text-rose-800 mt-6">Return Policy</h3>
              <p>
                Due to the perishable nature of our products, we do not accept returns. If your order arrives damaged or
                incorrect, please contact us within 24 hours of delivery and we will make it right.
              </p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold text-rose-800 mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {product.relatedProducts.map((relatedProduct) => (
            <Card
              key={relatedProduct.id}
              className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]"
            >
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={relatedProduct.image || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{relatedProduct.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-rose-600">From {relatedProduct.price}</p>
                    <Link href={`/shop/product/${relatedProduct.id}`}>
                      <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <CustomerReviews
          productId={params.id}
          initialReviews={[
            {
              id: "review-1",
              productId: params.id,
              name: "Sarah Johnson",
              email: "sarah@example.com",
              rating: 5,
              comment:
                "These cookies were absolutely perfect for my daughter's birthday party! Everyone loved the custom designs and they tasted amazing too.",
              date: "2023-04-15",
              verified: true,
              avatar: "/happy-customer-testimonial.png",
            },
            {
              id: "review-2",
              productId: params.id,
              name: "Michael Thompson",
              email: "michael@example.com",
              rating: 4,
              comment:
                "Great quality product. The design came out exactly as I uploaded it. Would order again for special occasions.",
              date: "2023-03-22",
              verified: true,
              avatar: "/confident-businessman-testimonial.png",
            },
          ]}
        />
      </div>
    </main>
  )
}
