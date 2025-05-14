"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Pencil, Trash2, Eye, Image as ImageIcon } from "lucide-react"
import AdminImageUploader from "@/components/admin-image-uploader"
import dynamic from "next/dynamic"

// Import the rich text editor with SSR disabled
const RichTextEditor = dynamic(() => import("@/components/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-64 border rounded-md bg-gray-50 flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
    </div>
  ),
})

interface BlogPost {
  id?: string
  title: string
  slug: string
  content: string
  author?: string // Assuming author might be linked to a user or a simple string
  published_at?: string | null
  meta_description?: string
  featured_image_url?: string
  created_at?: string
  updated_at?: string
  is_published: boolean
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null)
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState<BlogPost>({
    title: "",
    slug: "",
    content: "",
    author: "", // Default or fetch current admin user
    meta_description: "",
    featured_image_url: "",
    is_published: true,
  })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BlogPost, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error: any) {
      console.error("Error fetching blog posts:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to load blog posts",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    if (formErrors[name as keyof BlogPost]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      })
    }
  }

  const handleContentChange = (content: string) => {
    setFormData({
      ...formData,
      content,
    })
    if (formErrors.content) {
      setFormErrors({
        ...formErrors,
        content: null,
      })
    }
  }

  const handleImageUploaded = (url: string) => {
    setFormData({
      ...formData,
      featured_image_url: url,
    })
    if (formErrors.featured_image_url) {
      setFormErrors({
        ...formErrors,
        featured_image_url: null,
      })
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word chars with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setFormData(prev => ({
        ...prev,
        title: newTitle,
        slug: generateSlug(newTitle)
    }));
    if (formErrors.title) {
        setFormErrors(prev => ({ ...prev, title: null }));
    }
    if (formErrors.slug) {
        setFormErrors(prev => ({ ...prev, slug: null }));
    }
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof BlogPost, string>> = {}
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.slug.trim()) errors.slug = "Slug is required"
    if (!formData.content.trim()) errors.content = "Content is required"
    // Add other validations as needed, e.g., for author or featured image
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    try {
      const postData = {
        ...formData,
        published_at: formData.is_published ? new Date().toISOString() : null,
      }

      if (currentPost) {
        const { data, error } = await supabase.from("blog_posts").update(postData).eq("id", currentPost.id).select()
        if (error) throw error
        toast({ title: "Success", description: "Blog post updated successfully" })
      } else {
        const { data, error } = await supabase.from("blog_posts").insert([postData]).select()
        if (error) throw error
        toast({ title: "Success", description: "Blog post created successfully" })
      }
      setIsDialogOpen(false)
      fetchPosts()
    } catch (error: any) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save blog post",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const openNewPostDialog = () => {
    setCurrentPost(null)
    setFormData({
      title: "",
      slug: "",
      content: "",
      author: "", // Set default author if applicable
      meta_description: "",
      featured_image_url: "",
      is_published: true,
    })
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const openEditPostDialog = (post: BlogPost) => {
    setCurrentPost(post)
    setFormData({
        ...post,
        published_at: post.published_at || null, // Ensure published_at is handled
    })
    setFormErrors({})
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (post: BlogPost) => {
    setPostToDelete(post)
    setIsDeleteDialogOpen(true)
  }

  const handleDeletePost = async () => {
    if (!postToDelete) return
    setSubmitting(true)
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", postToDelete.id)
      if (error) throw error
      toast({ title: "Success", description: "Blog post deleted successfully" })
      setIsDeleteDialogOpen(false)
      fetchPosts()
    } catch (error: any) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete blog post",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Blog Posts</h2>
        <Button onClick={openNewPostDialog} className="bg-rose-600 hover:bg-rose-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Post
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Published At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No blog posts found.
                  </TableCell>
                </TableRow>
              )}
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${post.is_published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {post.is_published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>{post.published_at ? new Date(post.published_at).toLocaleDateString() : "-"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditPostDialog(post)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(post)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for Add/Edit Post */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{currentPost ? "Edit" : "Add New"} Blog Post</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 flex-grow overflow-y-auto p-1 pr-3">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input id="title" name="title" value={formData.title} onChange={handleTitleChange} placeholder="Enter post title" />
              {formErrors.title && <p className="text-xs text-red-500 mt-1">{formErrors.title}</p>}
            </div>
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <Input id="slug" name="slug" value={formData.slug} onChange={handleInputChange} placeholder="post-slug-here" />
              {formErrors.slug && <p className="text-xs text-red-500 mt-1">{formErrors.slug}</p>}
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <RichTextEditor value={formData.content} onChange={handleContentChange} />
              {formErrors.content && <p className="text-xs text-red-500 mt-1">{formErrors.content}</p>}
            </div>
            <div>
              <label htmlFor="featured_image_url" className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              <AdminImageUploader onImageUploaded={handleImageUploaded} currentImageUrl={formData.featured_image_url} bucketName="blog_images" />
              {formData.featured_image_url && (
                <div className="mt-2">
                  <img src={formData.featured_image_url} alt="Featured image preview" className="max-h-40 rounded" />
                </div>
              )}
              {formErrors.featured_image_url && <p className="text-xs text-red-500 mt-1">{formErrors.featured_image_url}</p>}
            </div>
            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">Meta Description (SEO)</label>
              <Textarea id="meta_description" name="meta_description" value={formData.meta_description || ''} onChange={handleInputChange} placeholder="Short summary for search engines" rows={3} />
            </div>
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author (Optional)</label>
              <Input id="author" name="author" value={formData.author || ''} onChange={handleInputChange} placeholder="Author's name" />
            </div>
            <div className="flex items-center space-x-2">
                <input type="checkbox" id="is_published" name="is_published" checked={formData.is_published} onChange={handleInputChange} className="h-4 w-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500" />
                <label htmlFor="is_published" className="text-sm font-medium text-gray-700">Publish Post</label>
            </div>
          </form>
          <DialogFooter className="mt-auto pt-4 border-t">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button type="submit" form="dialog-form" onClick={handleSubmit} disabled={submitting} className="bg-rose-600 hover:bg-rose-700">
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (currentPost ? "Save Changes" : "Create Post")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the post "{postToDelete?.title}"? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}