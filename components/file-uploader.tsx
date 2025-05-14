"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { uploadFile } from "@/lib/storage-service"
import { Upload, Check, AlertCircle } from "lucide-react"

interface FileUploaderProps {
  onUploadComplete: (fileUrl: string) => void
  context?: string
  accept?: string
  maxSize?: number // in MB
  className?: string
}

export function FileUploader({
  onUploadComplete,
  context = "product",
  accept = "image/*",
  maxSize = 5, // 5MB default
  className = "",
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]

    // Reset states
    setError(null)
    setSuccess(false)

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds the maximum allowed size of ${maxSize}MB`)
      return
    }

    // Start upload
    setIsUploading(true)

    // Simulate progress (in a real app, you'd get this from your upload API)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      const result = await uploadFile(file, context)

      clearInterval(progressInterval)

      if (!result.success) {
        throw new Error((result.error as string) || "Upload failed")
      }

      // Complete the progress
      setUploadProgress(100)
      setSuccess(true)

      // Call the callback with the file URL
      onUploadComplete(result.url)

      // Reset after 2 seconds
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 2000)
    } catch (err) {
      clearInterval(progressInterval)
      setError(err instanceof Error ? err.message : "Upload failed")
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className={`flex items-center justify-center px-4 py-2 rounded-md cursor-pointer transition-colors ${
            isUploading
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload File"}
        </label>
        {error && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="mr-1 h-4 w-4" />
            {error}
          </div>
        )}
        {success && (
          <div className="flex items-center text-green-500 text-sm">
            <Check className="mr-1 h-4 w-4" />
            Upload successful!
          </div>
        )}
      </div>

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2 w-full" />
          <p className="text-xs text-gray-500 text-right">{uploadProgress}%</p>
        </div>
      )}
    </div>
  )
}
