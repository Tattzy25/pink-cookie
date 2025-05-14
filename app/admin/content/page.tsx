"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import AddContentForm from "@/components/admin/add-content-form"
import EditContentForm from "@/components/admin/edit-content-form" // We will create this next

interface ContentItem {
  id: string
  title: string
  slug: string // Assuming content has a slug
  created_at: string
  body: string | null; // Added body for editing
  // Add other relevant content fields here (e.g., author, type)
}

export default function AdminContentPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null) // State to hold the content item being edited


  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setLoading(true)
    // Assuming you have a 'content' table in Supabase
    const { data, error } = await supabase.from("content").select("*").order("created_at", { ascending: false })
    if (error) {
      console.error("Error fetching content:", error)
    } else {
      setContentItems(data || [])
    }
    setLoading(false)
  }

  const handleDeleteContent = async (id: string) => {
    if (confirm("Are you sure you want to delete this content item?")) {
      const { error } = await supabase.from("content").delete().eq("id", id)
      if (error) {
        console.error("Error deleting content:", error)
      } else {
        fetchContent() // Refresh the list
      }
    }
  }

   const handleEditClick = (item: ContentItem) => {
    setEditingContent(item)
    setShowAddForm(false) // Hide add form if editing
  }

  const handleEditSuccess = () => {
    setEditingContent(null) // Close edit form
    fetchContent() // Refresh list after editing
  }

  const handleEditCancel = () => {
    setEditingContent(null) // Close edit form
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
         {!editingContent && ( // Only show Add button if not editing
           <Button onClick={() => setShowAddForm(true)}>Add New Content</Button>
         )}
      </div>

      {showAddForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Content</h2>
          <AddContentForm onSuccess={() => {
            setShowAddForm(false)
            fetchContent() // Refresh list after adding
          }} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

       {editingContent && (
         <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Edit Content</h2>
          <EditContentForm
            contentItem={editingContent}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      )}


      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contentItems.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.slug}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClick(item)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteContent(item.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
