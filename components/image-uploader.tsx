"use client"

import type React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";

interface ImageUploaderProps {
  onImageUploaded: (url: string | null) => void;
}

export default function ImageUploader({ onImageUploaded }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null); // For the main preview shown to the user
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This useEffect handles cleaning up the object URL
  useEffect(() => {
    // Store the current preview URL to use in the cleanup function
    const currentPreview = preview;
    return () => {
      // Clean up any object URLs to prevent memory leaks if it's an object URL
      if (currentPreview && currentPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentPreview);
      }
    };
  }, [preview]); // Depend on `preview` so it runs when preview changes

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      processFile(droppedFile);
    }
  }, [processFile]); // processFile will be memoized

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const processFile = useCallback(async (fileToProcess: File) => {
    if (!fileToProcess) return;

    // Check if file is an image
    if (!fileToProcess.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    // Create a preview immediately
    const objectUrl = URL.createObjectURL(fileToProcess);
    setPreview(objectUrl); // Use setPreview for the object URL

    // Simulate upload progress (replace with actual progress if available)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", fileToProcess);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      setUploadProgress(100);

      if (data.url) {
        // Don't set preview to data.url here if you want to keep the blob preview until a new image is selected
        // Or, if you want the uploaded URL to be the preview:
        // if (preview && preview.startsWith("blob:")) { URL.revokeObjectURL(preview); } 
        // setPreview(data.url);
        onImageUploaded(data.url);
        toast({
          title: "Upload successful",
          description: "Your image has been uploaded successfully.",
        });
      } else {
        throw new Error("Upload failed: No URL returned");
      }
    } catch (err: any) {
      clearInterval(progressInterval);

      setError(err.message || "There was an error uploading your image. Please try again.");
      toast({
        title: "Upload failed",
        description: err.message || "There was an error uploading your image. Please try again.",
        variant: "destructive",
      });
      
      // `objectUrl` is defined in the outer scope of this try/catch within processFile
      // Always revoke the object URL created in this specific call on error.
      URL.revokeObjectURL(objectUrl); 
      // Set preview to null if it was the one we just set for this failed attempt.
      setPreview(currentVal => (currentVal === objectUrl ? null : currentVal));
      onImageUploaded(null); // Notify parent about the failure
    } finally {
      setIsUploading(false);
      // Reset progress after a short delay or based on success/failure
      setTimeout(() => setUploadProgress(0), 1000);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  }, [onImageUploaded, toast]); // Removed `preview` from dependencies

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]); // Added preview to dependencies as it's used in cleanup

  // processFile and handleFileChange are now the primary methods for handling file uploads.

  const clearImage = useCallback(() => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onImageUploaded(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  }, [onImageUploaded, preview]); // Added preview to dependencies as it's used in cleanup

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          className="border-2 border-dashed border-rose-300 rounded-xl p-12 text-center cursor-pointer flex flex-col items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !isUploading && fileInputRef.current?.click()} // Prevent click during upload
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (!isUploading && (e.key === 'Enter' || e.key === ' ')) {
              fileInputRef.current?.click();
            }
          }}
          aria-label="Drag and drop or click to upload image"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-12 w-12 text-rose-400 animate-spin" />
              <h3 className="text-xl font-medium mt-4">Uploading...</h3>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-rose-400" />
              <div className="space-y-2 mt-4">
                <h3 className="text-xl font-medium">Drag & Drop Your Image</h3>
                <p className="text-sm text-muted-foreground">Or click to browse your files (JPG, PNG, SVG)</p>
              </div>
            </>
          )}
          <input 
            ref={fileInputRef}
            id="file-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            aria-label="Upload image"
            title="Choose an image file to upload"
            placeholder="Choose file"
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden border border-rose-200">
            <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button size="icon" variant="destructive" onClick={clearImage} disabled={isUploading}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div className="bg-rose-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
            </div>
          )}
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
        </div>
      )}
    </div>
  );
}
