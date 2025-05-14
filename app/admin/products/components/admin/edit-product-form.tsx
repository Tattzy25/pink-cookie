// File: components/admin/edit-product-form.tsx
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
}

interface EditProductFormProps {
  product: Product
  onSuccess: () => void
  onCancel: () => void
}

export default function EditProductForm({ product, onSuccess, onCancel }: EditProductFormProps) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description || "")
  const [price, setPrice] = useState(product.price.toString())
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(product.image_url)

  useEffect(() => {
    // Update form state if the product prop changes (e.g., if editing a different product)
    setName(product.name)
    setDescription(product.description || "")
    setPrice(product.price.toString())
    setImageFile(null) // Clear selected file
    setCurrentImageUrl(product.image_url)
    setError(null)
  }, [product])


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0])
      setCurrentImageUrl(null); // Clear current image preview when a new file is selected
    } else {
      setImageFile(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    let imageUrl: string | null = currentImageUrl // Start with the current image URL

    // If a new image file is selected, upload it
    if (imageFile) {
      // Optional: Delete the old image from storage if it exists
      if (currentImageUrl) {
         try {
            const oldFileName = currentImageUrl.split('/').pop();
             if(oldFileName) {
                // Assuming the path structure is product_images/filename
                const oldFilePath = `product_images/${oldFileName}`;
                const { error: deleteError } = await supabase.storage
                  .from("product-images")
                  .remove([oldFilePath]);

                if (deleteError) {
                  console.error("Error deleting old image:", deleteError);
                  // Decide if you want to stop here or continue with the new upload
                }
             }
         } catch (e) {
            console.error("Error parsing old image URL:", e);
         }
      }


      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `product_images/${fileName}`

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("product-images") // Make sure you have a storage bucket named 'product-images'
        .upload(filePath, imageFile)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        setError("Failed to upload new image.")
        setLoading(false)
        return
      }

      // Get the public URL of the newly uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
    }

    // Update the product in the database
    const { error: updateError } = await supabase
      .from("products")
      .update({
        name,
        description,
        price: parseFloat(price),
        image_url: imageUrl,
      })
      .eq("id", product.id) // Update the specific product by ID

    if (updateError) {
      console.error("Update error:", updateError)
      setError("Failed to update product.")
    } else {
      onSuccess() // Call success callback to close form and refresh list
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Product Name</Label>
        <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="edit-price">Price</Label>
        <Input id="edit-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-image">Product Image</Label>
        <Input id="edit-image" type="file" accept="image/*" onChange={handleFileChange} />
        {currentImageUrl && !imageFile && (
            <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                <img src={currentImageUrl} alt="Current product image" className="h-20 w-20 rounded-md object-cover" />
            </div>
        )}
         {imageFile && (
            <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">New Image Preview:</p>
                 {/* Basic preview for the newly selected file */}
                <img src={URL.createObjectURL(imageFile)} alt="New product image preview" className="h-20 w-20 rounded-md object-cover" />
            </div>
         )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>
    </form>
  )
}
