"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AddProductFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function AddProductForm({ onSuccess, onCancel }: AddProductFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImageFile(event.target.files[0])
    } else {
      setImageFile(null)
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    let imageUrl: string | null = null

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `product_images/${fileName}`

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("product-images") // Make sure you have a storage bucket named 'product-images'
        .upload(filePath, imageFile)

      if (uploadError) {
        console.error("Upload error:", uploadError)
        setError("Failed to upload image.")
        setLoading(false)
        return
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath)

      imageUrl = publicUrlData.publicUrl
    }

    const { error: insertError } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price: parseFloat(price),
          image_url: imageUrl,
        },
      ])

    if (insertError) {
      console.error("Insert error:", insertError)
      setError("Failed to add product.")
    } else {
      onSuccess() // Call success callback to close form and refresh list
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="image">Product Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Add Product
        </Button>
      </div>
    </form>
  )
}