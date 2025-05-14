// File: components/admin/add-content-form.tsx
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface AddContentFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function AddContentForm({ onSuccess, onCancel }: AddContentFormProps) {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [body, setBody] = useState("") // Assuming content has a body field
  // Add state for other content fields as needed
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({}) // State for validation errors


  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!title.trim()) {
      errors.title = "Content title is required.";
    }
     if (!slug.trim()) {
      errors.slug = "Slug is required.";
    }
    // Add more validation rules as needed
    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) {
      return; // Stop if validation fails
    }

    setLoading(true)
    setError(null)

    // Assuming you have a 'content' table with 'title', 'slug', and 'body' columns
    const { error: insertError } = await supabase
      .from("content")
      .insert([
        {
          title,
          slug,
          body,
          // Add other content fields here
        },
      ])

    if (insertError) {
      console.error("Insert error:", insertError)
      setError("Failed to add content.")
    } else {
      onSuccess() // Call success callback to close form and refresh list
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Content Title</Label>
        <Input id="title" value={title} onChange={(e) => { setTitle(e.target.value); setValidationErrors({...validationErrors, title: ''}) }} required />
         {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
      </div>
      <div>
        <Label htmlFor="slug">Slug</Label>
        <Input id="slug" value={slug} onChange={(e) => { setSlug(e.target.value); setValidationErrors({...validationErrors, slug: ''}) }} required />
         {validationErrors.slug && <p className="text-red-500 text-sm mt-1">{validationErrors.slug}</p>}
      </div>
       <div>
        <Label htmlFor="body">Body</Label>
        <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={10} />
      </div>
      {/* Add input fields for other content properties here */}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Add Content
        </Button>
      </div>
    </form>
  )
}
