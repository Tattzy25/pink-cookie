'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { uploadFile } from '@/lib/storage-service'

// UI Components
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

// Types
type SavedDesign = {
  id: string
  name: string
  preview: string
  date: string
  elements?: any[]
}

type UserImage = {
  id: string
  url: string
  path: string
  filename: string
  uploaded_at: string
}

export default function UserDashboard() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  
  const [activeTab, setActiveTab] = useState('designs')
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([])
  const [userImages, setUserImages] = useState<UserImage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedDesign, setSelectedDesign] = useState<SavedDesign | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'design' | 'image'} | null>(null)

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      router.push('/auth/login?redirect=/dashboard')
    }
  }, [user, router, authLoading])

  // Load user's saved designs and uploaded images
  useEffect(() => {
    if (user) {
      fetchSavedDesigns()
      fetchUserImages()
    }
  }, [user])

  const fetchSavedDesigns = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('saved_designs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data && data.length > 0) {
        const formattedDesigns = data.map((design) => ({
          id: design.id,
          name: design.name,
          preview: design.preview_url || '/placeholder.svg',
          date: new Date(design.created_at).toLocaleDateString(),
          elements: design.elements
        }))

        setSavedDesigns(formattedDesigns)
      } else {
        setSavedDesigns([])
      }
    } catch (error) {
      console.error('Error fetching saved designs:', error)
      toast({
        title: 'Error',
        description: 'Failed to load your saved designs. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserImages = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.storage
        .from('user-uploads')
        .list(user?.id)

      if (error) throw error

      if (data && data.length > 0) {
        const imagePromises = data.map(async (file) => {
          const { data: urlData } = supabase.storage
            .from('user-uploads')
            .getPublicUrl(`${user?.id}/${file.name}`)

          return {
            id: file.id,
            url: urlData.publicUrl,
            path: `${user?.id}/${file.name}`,
            filename: file.name,
            uploaded_at: new Date(file.created_at || Date.now()).toLocaleDateString()
          }
        })

        const images = await Promise.all(imagePromises)
        setUserImages(images)
      } else {
        setUserImages([])
      }
    } catch (error) {
      console.error('Error fetching user images:', error)
      toast({
        title: 'Error',
        description: 'Failed to load your uploaded images. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !user) return
    
    const file = files[0]
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG, GIF, WebP, or SVG image.',
        variant: 'destructive'
      })
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB.',
        variant: 'destructive'
      })
      return
    }
    
    setIsUploading(true)
    setUploadProgress(0)
    
    try {
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 5
        })
      }, 100)
      
      // Upload the file
      const result = await uploadFile(file, 'design')
      
      if (!result.success) {
        throw new Error('Upload failed')
      }
      
      // Complete progress
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      toast({
        title: 'Upload successful',
        description: 'Your image has been uploaded and is ready to use.'
      })
      
      // Refresh the images list
      await fetchUserImages()
      
      // Reset after 1 second
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (err: any) {
      console.error('Error uploading image:', err)
      toast({
        title: 'Upload failed',
        description: err.message || 'Failed to upload your image. Please try again.',
        variant: 'destructive'
      })
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteItem = async () => {
    if (!itemToDelete) return
    
    setIsLoading(true)
    
    try {
      if (itemToDelete.type === 'design') {
        // Delete design
        const { error } = await supabase
          .from('saved_designs')
          .delete()
          .eq('id', itemToDelete.id)
          .eq('user_id', user?.id)
        
        if (error) throw error
        
        setSavedDesigns(savedDesigns.filter(design => design.id !== itemToDelete.id))
        
        toast({
          title: 'Design deleted',
          description: 'Your design has been deleted successfully.'
        })
      } else {
        // Delete image
        const imageToDelete = userImages.find(img => img.id === itemToDelete.id)
        
        if (imageToDelete) {
          const { error } = await supabase.storage
            .from('user-uploads')
            .remove([imageToDelete.path])
          
          if (error) throw error
          
          setUserImages(userImages.filter(img => img.id !== itemToDelete.id))
          
          toast({
            title: 'Image deleted',
            description: 'Your image has been deleted successfully.'
          })
        }
      }
    } catch (err: any) {
      console.error('Error deleting item:', err)
      toast({
        title: 'Delete failed',
        description: err.message || 'Failed to delete the item. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const openDesign = (designId: string) => {
    router.push(`/customization-suite?design=${designId}`)
  }

  const confirmDelete = (id: string, type: 'design' | 'image') => {
    setItemToDelete({ id, type })
    setDeleteDialogOpen(true)
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-10 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">My Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="designs">My Designs</TabsTrigger>
          <TabsTrigger value="images">My Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="designs" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Saved Designs</h2>
            <Button onClick={() => router.push('/customization-suite')}>
              Create New Design
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : savedDesigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedDesigns.map((design) => (
                <Card key={design.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">{design.name}</CardTitle>
                    <CardDescription>Created on {design.date}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                      <Image 
                        src={design.preview} 
                        alt={design.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between p-4">
                    <Button variant="outline" onClick={() => openDesign(design.id)}>
                      Edit Design
                    </Button>
                    <Button variant="destructive" onClick={() => confirmDelete(design.id, 'design')}>
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-xl font-medium mb-2">No saved designs yet</h3>
              <p className="text-muted-foreground mb-6">Create your first custom design in our design studio</p>
              <Button onClick={() => router.push('/customization-suite')}>
                Create a Design
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="images" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Uploaded Images</h2>
            <div>
              <Input
                type="file"
                id="image-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
              />
              <Label htmlFor="image-upload" asChild>
                <Button as="span" disabled={isUploading}>
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </Button>
              </Label>
            </div>
          </div>
          
          {isUploading && (
            <div className="mb-6">
              <Progress value={uploadProgress} className="h-2 mb-2" />
              <p className="text-sm text-muted-foreground text-right">{uploadProgress}%</p>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[200px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : userImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userImages.map((image) => (
                <Card key={image.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square w-full overflow-hidden bg-muted">
                      <Image 
                        src={image.url} 
                        alt={image.filename}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start gap-2 p-4">
                    <p className="text-sm truncate w-full" title={image.filename}>
                      {image.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded: {image.uploaded_at}
                    </p>
                    <div className="flex justify-between w-full mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(image.url, '_blank')}
                      >
                        View
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => confirmDelete(image.id, 'image')}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-xl font-medium mb-2">No uploaded images yet</h3>
              <p className="text-muted-foreground mb-6">Upload images to use in your custom designs</p>
              <Label htmlFor="image-upload" asChild>
                <Button as="span">
                  Upload Your First Image
                </Button>
              </Label>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}