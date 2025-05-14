// File: components/admin/edit-content-form.tsx
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface ContentItem {
  id: string
  title: string
  slug: string
  body: string | null;
  // Add other relevant content fields here
}

interface EditContentFormProps {
  contentItem: ContentItem
  onSuccess: () => void
  onCancel: () => void
}

export default function EditContentForm({ contentItem, onSuccess, onCancel }: EditContentFormProps) {
  const [title, setTitle] = useState(contentItem.title)
  const [slug, setSlug] = useState(contentItem.slug)
  const [body, setBody] = useState(contentItem.body || "")
  // Add state for other content fields as needed
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({}) // State for validation errors


  useEffect(() => {
    // Update form state if the contentItem prop changes
    setTitle(contentItem.title)
    setSlug(contentItem.slug)
    setBody(contentItem.body || "")
    // Update state for other content fields
    setError(null)
    setValidationErrors({}); // Clear validation errors
  }, [contentItem])

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
    setLoading(true)
    setError(null)

     if (!validateForm()) {
      return; // Stop if validation fails
    }


    // Update the content item in the database
    const { error: updateError } = await supabase
      .from("content")
      .update({
        title,
        slug,
        body,
        // Add other content fields here
      })
      .eq("id", contentItem.id) // Update the specific content item by ID

    if (updateError) {
      console.error("Update error:", updateError)
      setError("Failed to update content.")
    } else {
      onSuccess() // Call success callback to close form and refresh list
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Content Title</Label>
        <Input id="edit-title" value={title} onChange={(e) => { setTitle(e.target.value); setValidationErrors({...validationErrors, title: ''}) }} required />
         {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
      </div>
      <div>
        <Label htmlFor="edit-slug">Slug</Label>
        <Input id="edit-slug" value={slug} onChange={(e) => { setSlug(e.target.value); setValidationErrors({...validationErrors, slug: ''}) }} required />
         {validationErrors.slug && <p className="text-red-500 text-sm mt-1">{validationErrors.slug}</p>}
      </div>
       <div>
        <Label htmlFor="edit-body">Body</Label>
        <Textarea id="edit-body" value={body} onChange={(e) => setBody(e.target.value)} rows={10} />
      </div>
      {/* Add input fields for other content properties here */}

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
