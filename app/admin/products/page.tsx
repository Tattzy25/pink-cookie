// File: app/admin/products/page.tsx
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import AddProductForm  from "@/components/admin/add-product-form"
import EditProductForm from "@/components/admin/edit-product-form"

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null) // State to hold the product being edited

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("products").select("*")
    if (error) {
      console.error("Error fetching products:", error)
    } else {
      setProducts(data || [])
    }
    setLoading(false)
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const { error } = await supabase.from("products").delete().eq("id", id)
      if (error) {
        console.error("Error deleting product:", error)
      } else {
        fetchProducts() // Refresh the list
      }
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingProduct(product)
    setShowAddForm(false) // Hide add form if editing
  }

  const handleEditSuccess = () => {
    setEditingProduct(null) // Close edit form
    fetchProducts() // Refresh list after editing
  }

  const handleEditCancel = () => {
    setEditingProduct(null) // Close edit form
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
        <h1 className="text-2xl font-bold">Product Management</h1>
        {!editingProduct && ( // Only show Add button if not editing
          <Button onClick={() => setShowAddForm(true)}>Add New Product</Button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <AddProductForm onSuccess={() => {
            setShowAddForm(false)
            fetchProducts() // Refresh list after adding
          }} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {editingProduct && (
         <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          <EditProductForm
            product={editingProduct}
            onSuccessAction={handleEditSuccess} // Renamed prop
            onCancelAction={handleEditCancel}   // Renamed prop
          />
        </div>
      )}


      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-10 w-10 rounded-md object-cover" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 text-sm">No Image</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <Button variant="outline" size="sm" className="mr-2" onClick={() => handleEditClick(product)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
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
