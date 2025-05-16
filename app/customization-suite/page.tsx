"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { supabase } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Upload, Save, Image as ImageIcon, Shapes, Text, Download, Trash2 } from "lucide-react"

// Types
type DesignElement = {
  id: string
  type: "image" | "text" | "shape"
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  zIndex: number
}

type SavedDesign = {
  id: string
  name: string
  elements: DesignElement[]
  preview_url: string
  created_at: string
  updated_at: string
}

export default function CustomizationSuite() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const designId = searchParams.get("design")
  
  const { user, loading: authLoading } = useAuth()
  
  const [designName, setDesignName] = useState("My Design")
  const [elements, setElements] = useState<DesignElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("images")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [userImages, setUserImages] = useState<{url: string, path: string}[]>([])
  const [templateImages, setTemplateImages] = useState<{url: string, category: string}[]>([])
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/auth/login?redirect=/customization-suite")
    }
  }, [user, router, authLoading])
  
  // Load existing design if designId is provided
  useEffect(() => {
    if (designId && user) {
      loadDesign(designId)
    }
  }, [designId, user])
  
  // Load user's uploaded images
  useEffect(() => {
    if (user) {
      loadUserImages()
      loadTemplateImages()
    }
  }, [user])
  
  const loadDesign = async (id: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from("saved_designs")
        .select("*")
        .eq("id", id)
        .eq("user_id", user?.id)
        .single()
      
      if (error) throw error
      
      if (data) {
        setDesignName(data.name)
        setElements(data.elements || [])
        toast({
          title: "Design loaded",
          description: "Your saved design has been loaded successfully."
        })
      }
    } catch (error) {
      console.error("Error loading design:", error)
      toast({
        title: "Error",
        description: "Failed to load your design. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const loadUserImages = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("user-uploads")
        .list(user?.id)
      
      if (error) throw error
      
      if (data) {
        const imageUrls = await Promise.all(
          data.map(async (file) => {
            const { data: urlData } = supabase.storage
              .from("user-uploads")
              .getPublicUrl(`${user?.id}/${file.name}`)
            
            return {
              url: urlData.publicUrl,
              path: `${user?.id}/${file.name}`
            }
          })
        )
        
        setUserImages(imageUrls)
      }
    } catch (error) {
      console.error("Error loading user images:", error)
    }
  }
  
  const loadTemplateImages = async () => {
    try {
      // This would typically fetch from a templates collection
      // For now, we'll use some placeholder images
      setTemplateImages([
        { url: "/cookie-shapes/circle.png", category: "shapes" },
        { url: "/cookie-shapes/heart.png", category: "shapes" },
        { url: "/cookie-shapes/star.png", category: "shapes" },
        { url: "/cookie-shapes/square.png", category: "shapes" },
        { url: "/chocolate-shapes/circle.png", category: "chocolates" },
        { url: "/chocolate-shapes/heart.png", category: "chocolates" },
      ])
    } catch (error) {
      console.error("Error loading template images:", error)
    }
  }
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !user) return
    
    const file = files[0]
    
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, WebP, or SVG image.",
        variant: "destructive"
      })
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      })
      return
    }
    
    setIsLoading(true)
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
      
      // Generate a unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false
        })
      
      if (error) throw error
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from("user-uploads")
        .getPublicUrl(filePath)
      
      // Add to userImages state
      setUserImages([...userImages, { url: urlData.publicUrl, path: filePath }])
      
      // Complete progress
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      toast({
        title: "Upload successful",
        description: "Your image has been uploaded and is ready to use."
      })
      
      // Reset after 1 second
      setTimeout(() => {
        setIsLoading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (err: any) {
      console.error("Error uploading image:", err)
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      })
      setIsLoading(false)
      setUploadProgress(0)
    }
  }
  
  const addImageElement = (imageUrl: string) => {
    const newElement: DesignElement = {
      id: uuidv4(),
      type: "image",
      content: imageUrl,
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      rotation: 0,
      zIndex: elements.length
    }
    
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }
  
  const addTextElement = () => {
    const newElement: DesignElement = {
      id: uuidv4(),
      type: "text",
      content: "Double click to edit",
      x: 50,
      y: 50,
      width: 200,
      height: 50,
      rotation: 0,
      zIndex: elements.length
    }
    
    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }
  
  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el))
  }
  
  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    setSelectedElement(null)
  }
  
  const saveDesign = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save designs.",
        variant: "destructive"
      })
      return
    }
    
    setIsSaving(true)
    
    try {
      // Generate a preview image (in a real app, this would create an actual image)
      // For now, we'll just use a placeholder or the first image element
      let previewUrl = "/placeholder.svg"
      const imageElement = elements.find(el => el.type === "image")
      if (imageElement) {
        previewUrl = imageElement.content
      }
      
      const designData = {
        name: designName,
        elements,
        preview_url: previewUrl,
        user_id: user.id,
        updated_at: new Date().toISOString()
      }
      
      if (designId) {
        // Update existing design
        const { error } = await supabase
          .from("saved_designs")
          .update(designData)
          .eq("id", designId)
          .eq("user_id", user.id)
        
        if (error) throw error
        
        toast({
          title: "Design updated",
          description: "Your design has been updated successfully."
        })
      } else {
        // Create new design
        const { error } = await supabase
          .from("saved_designs")
          .insert({
            ...designData,
            id: uuidv4(),
            created_at: new Date().toISOString()
          })
        
        if (error) throw error
        
        toast({
          title: "Design saved",
          description: "Your design has been saved successfully."
        })
      }
    } catch (err: any) {
      console.error("Error saving design:", err)
      toast({
        title: "Save failed",
        description: err.message || "Failed to save your design. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  // If still loading auth state or not logged in, show loading
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-rose-600" />
          <p className="text-lg">Loading design studio...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Design Canvas */}
        <div className="lg:w-2/3">
          <Card className="rounded-[20px] overflow-hidden border-0 shadow-[10px_10px_20px_#6d2849,-10px_-10px_20px_#f25aa3]">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <Input
                    value={designName}
                    onChange={(e) => setDesignName(e.target.value)}
                    className="max-w-[200px] font-bold"
                  />
                  <Button
                    onClick={saveDesign}
                    className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Design
                      </>
                    )}
                  </Button>
                </div>
                <Link href="/account?tab=designs">
                  <Button variant="outline" className="border-rose-600 text-rose-600">
                    My Saved Designs
                  </Button>
                </Link>
              </div>
              
              <div 
                className="bg-white border-2 border-dashed border-gray-200 rounded-lg relative"
                style={{ height: "500px" }}
              >
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
                    <p className="ml-2">Loading design...</p>
                  </div>
                ) : elements.length === 0 ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                    <Shapes className="h-16 w-16 mb-4" />
                    <p className="text-lg">Your canvas is empty</p>
                    <p className="text-sm">Add images, text, or shapes from the panel on the right</p>
                  </div>
                ) : (
                  elements.map((element) => (
                    <div
                      key={element.id}
                      className={`absolute cursor-move ${selectedElement === element.id ? 'ring-2 ring-rose-500' : ''}`}
                      style={{
                        left: `${element.x}px`,
                        top: `${element.y}px`,
                        width: `${element.width}px`,
                        height: `${element.height}px`,
                        transform: `rotate(${element.rotation}deg)`,
                        zIndex: element.zIndex,
                      }}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      {element.type === 'image' && (
                        <Image
                          src={element.content}
                          alt="Design element"
                          fill
                          className="object-contain"
                        />
                      )}
                      {element.type === 'text' && (
                        <div className="w-full h-full flex items-center justify-center text-center"
                             style={{ fontSize: `${Math.min(element.width / 10, 24)}px` }}>
                          {element.content}
                        </div>
                      )}
                      {selectedElement === element.id && (
                        <button
                          className="absolute -top-3 -right-3 bg-rose-600 text-white rounded-full p-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteElement(element.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Element Controls */}
          {selectedElement && (
            <Card className="mt-4 rounded-[20px] overflow-hidden border-0 shadow-[10px_10px_20px_#6d2849,-10px_-10px_20px_#f25aa3]">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-4">Element Properties</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="element-width">Width</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="element-width"
                        min={10}
                        max={400}
                        step={1}
                        value={[elements.find(el => el.id === selectedElement)?.width || 100]}
                        onValueChange={(value) => {
                          updateElement(selectedElement, { width: value[0] })
                        }}
                      />
                      <span className="w-12 text-right">
                        {elements.find(el => el.id === selectedElement)?.width}px
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="element-height">Height</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="element-height"
                        min={10}
                        max={400}
                        step={1}
                        value={[elements.find(el => el.id === selectedElement)?.height || 100]}
                        onValueChange={(value) => {
                          updateElement(selectedElement, { height: value[0] })
                        }}
                      />
                      <span className="w-12 text-right">
                        {elements.find(el => el.id === selectedElement)?.height}px
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="element-rotation">Rotation</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="element-rotation"
                        min={0}
                        max={360}
                        step={1}
                        value={[elements.find(el => el.id === selectedElement)?.rotation || 0]}
                        onValueChange={(value) => {
                          updateElement(selectedElement, { rotation: value[0] })
                        }}
                      />
                      <span className="w-12 text-right">
                        {elements.find(el => el.id === selectedElement)?.rotation}°
                      </span>
                    </div>
                  </div>
                  {elements.find(el => el.id === selectedElement)?.type === 'text' && (
                    <div className="col-span-2">
                      <Label htmlFor="element-text">Text Content</Label>
                      <Input
                        id="element-text"
                        value={elements.find(el => el.id === selectedElement)?.content || ''}
                        onChange={(e) => {
                          updateElement(selectedElement, { content: e.target.value })
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Design Elements Panel */}
        <div className="lg:w-1/3">
          <Card className="rounded-[20px] overflow-hidden border-0 shadow-[10px_10px_20px_#6d2849,-10px_-10px_20px_#f25aa3]">
            <CardContent className="p-6">
              <Tabs defaultValue="images" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="images" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Images
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="flex items-center gap-2">
                    <Shapes className="h-4 w-4" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <Text className="h-4 w-4" />
                    Text
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="images">
                  <div className="mb-4">
                    <Label htmlFor="image-upload" className="block mb-2">Upload Image</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        className="border-rose-600 text-rose-600"
                        disabled={isLoading}
                        onClick={() => document.getElementById("image-upload")?.click()}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {isLoading && (
                      <div className="mt-2 w-full">
                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1">{uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-bold mb-2">Your Uploaded Images</h3>
                  {userImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {userImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square border rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => addImageElement(image.url)}
                        >
                          <Image
                            src={image.url}
                            alt={`User uploaded image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">You haven't uploaded any images yet.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="templates">
                  <h3 className="text-lg font-bold mb-2">Cookie Shapes</h3>
                  <div className="grid grid-cols-3 gap-2 mb-6">
                    {templateImages
                      .filter(img => img.category === "shapes")
                      .map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square border rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => addImageElement(image.url)}
                        >
                          <Image
                            src={image.url}
                            alt={`Template shape ${index + 1}`}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      ))}
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">Chocolate Shapes</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {templateImages
                      .filter(img => img.category === "chocolates")
                      .map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square border rounded-md overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => addImageElement(image.url)}
                        >
                          <Image
                            src={image.url}
                            alt={`Template chocolate ${index + 1}`}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="text">
                  <div className="text-center py-6">
                    <Button
                      onClick={addTextElement}
                      className="bg-rose-600 hover:bg-rose-700 flex items-center gap-2"
                    >
                      <Text className="h-4 w-4" />
                      Add Text Element
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click to add text to your design. You can edit the content after adding.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="mt-4 rounded-[20px] overflow-hidden border-0 shadow-[10px_10px_20px_#6d2849,-10px_-10px_20px_#f25aa3]">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4">Design Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-rose-600 text-rose-600 flex items-center gap-2"
                  onClick={() => {
                    // In a real app, this would generate and download the design
                    toast({
                      title: "Feature coming soon",
                      description: "Download functionality will be available in the next update."
                    })
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  className="border-rose-600 text-rose-600 flex items-center gap-2"
                  onClick={() => {
                    // In a real app, this would proceed to order
                    toast({
                      title: "Feature coming soon",
                      description: "Order functionality will be available in the next update."
                    })
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Order Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}