"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Facebook, Linkedin, Mail, LinkIcon, X, Share2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SocialShareProps {
  title?: string
  description?: string
  imageUrl?: string
  url?: string
}

export function SocialShare({
  title = "Check out my custom cookie design!",
  description = "I just created this amazing custom cookie design at DessertPrint.com",
  imageUrl = "",
  url = typeof window !== "undefined" ? window.location.href : "",
}: SocialShareProps) {
  const [showShareOptions, setShowShareOptions] = useState(false)

  const shareData = {
    title,
    text: description,
    url: url,
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast({
          title: "Shared successfully!",
          description: "Your design has been shared.",
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      setShowShareOptions(!showShareOptions)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard.",
    })
    setTimeout(() => setShowShareOptions(false), 500)
  }

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank")
  }

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(description)}&url=${encodeURIComponent(url)}`,
      "_blank",
    )
  }

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank")
  }

  const shareByEmail = () => {
    window.open(
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description} ${url}`)}`,
      "_blank",
    )
  }

  return (
    <div className="relative">
      <Button
        onClick={handleNativeShare}
        className="bg-gradient-to-r from-rose-400 to-rose-600 hover:from-rose-500 hover:to-rose-700 text-white border-0 shadow-[5px_5px_10px_rgba(212,160,170,0.3),-5px_-5px_10px_rgba(255,204,216,0.3)]"
        size="sm"
      >
        <Share2 className="mr-2 h-4 w-4" />
        Share Design
      </Button>

      {showShareOptions && (
        <Card className="absolute z-50 mt-2 right-0 w-64 animate-in fade-in-50 zoom-in-95 slide-in-from-top-5 duration-200">
          <CardContent className="p-2">
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={shareToFacebook}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 border-0"
              >
                <Facebook className="h-5 w-5" />
              </Button>
              <Button
                onClick={shareToTwitter}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-black text-white hover:bg-gray-800 border-0"
              >
                <X className="h-5 w-5" />
              </Button>
              <Button
                onClick={shareToLinkedIn}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-blue-700 text-white hover:bg-blue-800 border-0"
              >
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button
                onClick={shareByEmail}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full bg-red-500 text-white hover:bg-red-600 border-0"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </div>
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="w-full mt-2 flex items-center justify-center"
            >
              <LinkIcon className="mr-2 h-4 w-4" />
              Copy Link
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
