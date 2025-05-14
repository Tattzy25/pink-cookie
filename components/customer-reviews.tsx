"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ReviewImage {
  image_url: string
}

interface Review {
  id: string
  product_id: string
  name: string
  email: string
  rating: number
  comment: string
  created_at: string
  verified: boolean
  review_images?: ReviewImage[]
  avatar?: string
}

interface CustomerReviewsProps {
  productId: string
  initialReviews?: Review[]
}

export default function CustomerReviews({ productId, initialReviews = [] }: CustomerReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Only fetch from API if no initial reviews were provided
    if (initialReviews.length === 0) {
      fetchReviews()
    }
  }, [productId, initialReviews])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews)
      } else {
        // Potentially add a toast notification here if user feedback is desired for fetch errors
        // For now, removing the console.error for production readiness
      }
    } catch (error) {
      // Potentially add a toast notification here
    } finally {
      setIsLoading(false)
    }
  }

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          name,
          email,
          rating,
          comment,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // In a real app, we might not add the review immediately since it needs approval
        // But for demo purposes, we'll add it with a "pending" note
        const newReview: Review = {
          id: data.review.id,
          product_id: productId,
          name,
          email,
          rating,
          comment,
          created_at: new Date().toISOString(),
          verified: false,
          avatar: "/abstract-user-icon.png",
        }

        setReviews([newReview, ...reviews])
        setName("")
        setEmail("")
        setRating(5)
        setComment("")
        setShowForm(false)

        toast({
          title: "Review submitted",
          description: "Thank you for your feedback! Your review will be visible after approval.",
        })
      } else {
        throw new Error(data.error || "Failed to submit review")
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "There was a problem submitting your review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0"

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="space-y-6">
      <h1 className="font-great-vibes text-h1-mobile md:text-h1-desktop text-center mb-8">Customer Reviews</h1>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(Number.parseFloat(averageRating))
                        ? "text-amber-500 fill-amber-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{averageRating}</span>
              <span className="text-muted-foreground">({reviews.length} reviews)</span>
            </div>
          )}
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-rose-600 hover:bg-rose-700">
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showForm && (
        <Card className="rounded-[20px] border-0 shadow-[10px_10px_20px_#6d2849,-10px_-10px_20px_#f25aa3]">
          <CardHeader>
            <CardTitle className="text-rose-800">Write Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                      <Star
                        className={`h-8 w-8 ${star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Your Review</Label>
                <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} required />
              </div>

              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="rounded-[20px] border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {(review.avatar || review.review_images?.[0]?.image_url) && (
                      <div className="relative h-10 w-10 rounded-full overflow-hidden">
                        <Image
                          src={review.avatar || review.review_images?.[0]?.image_url || "/abstract-user-icon.png"}
                          alt={review.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="font-bold">{review.name}</div>
                      <div className="text-sm text-muted-foreground">{formatDate(review.created_at)}</div>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3">{review.comment}</p>
                {review.verified && <div className="mt-2 text-sm text-green-600 font-medium">✓ Verified Purchase</div>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 border rounded-lg">
          <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  )
}
