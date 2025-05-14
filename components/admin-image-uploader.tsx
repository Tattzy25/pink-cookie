"use client"

import { useState, useEffect } from "react"
import { Upload, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

export default function AdminImageUploader({ onImageUploaded, existingImage = null }) {
  const [preview, setPreview] = useState(existingImage)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (existingImage) {
      setPreview(existingImage)
    }
  }, [existingImage])

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Upload failed")
      }

      const data = await response.json()

      if (data.url) {
        setPreview(data.url)
        onImageUploaded(data.url)
        toast({
          title: "Upload successful",
          description: "Your image has been uploaded successfully.",
        })
      } else {
        throw new Error("Upload failed: No URL returned")
      }
    } catch (error) {
      // console.error removed for production readiness
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    onImageUploaded("")
  }

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
          onClick={() => document.getElementById("admin-file-upload").click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium">Click to upload an image</p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (max. 2MB)</p>
            </div>
            <input
              id="admin-file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <div className="aspect-video relative">
            <Image
              src={preview || "/placeholder.svg"}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                e.target.onerror = null
                (e.target as HTMLImageElement).src = "/placeholder.svg"
              }}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              size="icon"
              variant="destructive"
              onClick={clearImage}
              className="h-8 w-8 rounded-full bg-white text-gray-700 hover:text-red-600 hover:bg-white"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs truncate">
            {preview.split("/").pop()}
          </div>
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">Uploading...</span>
        </div>
      )}
    </div>
  )
}
