"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, CreditCard, User, Settings, ShoppingBag, Heart, LogOut, Loader2, Upload, Camera } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/auth"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

// Types for our data
type Order = {
  id: string
  date: string
  status: string
  total: string
  items: {
    name: string
    quantity: number
    image: string
  }[]
}

type SavedDesign = {
  id: string
  name: string
  preview: string
  date: string
}

type FavoriteProduct = {
  id: string
  name: string
  image: string
  price: string
}

type Subscription = {
  plan: string
  nextDelivery: string
  status: string
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [birthday, setBirthday] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([])
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isNewUser, setIsNewUser] = useState(false)
  const [profileCreated, setProfileCreated] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !authLoading) {
      router.push("/auth/login?redirect=/account")
    }
  }, [user, router, authLoading])

  // Set avatar URL from user data
  useEffect(() => {
    if (user?.avatar_url) {
      setAvatarUrl(user.avatar_url)
    }
  }, [user])

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return

      setIsLoading(true)
      setError(null)

      try {
        // First, check if the user exists in the auth.users table
        const { data: authUser, error: authError } = await supabase.auth.getUser()

        if (authError) {
          throw authError
        }

        if (!authUser || !authUser.user) {
          throw new Error("User not found in auth system")
        }

        // Now check if the user has a profile in the users table
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .maybeSingle()

        // Only handle real errors, not "no rows returned"
        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        if (!profile) {
          // User doesn't have a profile yet
          setIsNewUser(true)

          // Show welcome message for new users
          toast({
            title: "Welcome to Dessert Print!",
            description: "Please complete your profile to get started.",
          })

          // Set default values
          setFullName(user.user_metadata?.full_name || "")
        } else {
          // User has a profile, set form values
          setFullName(profile.full_name || "")
          setPhone(profile.phone || "")
          setBirthday(profile.birthday ? new Date(profile.birthday).toISOString().split("T")[0] : "")
          setAddress(profile.address || "")
          setCity(profile.city || "")
          setState(profile.state || "")
          setZip(profile.zip || "")
          setProfileCreated(true)

          // Fetch additional user data
          await fetchUserOrders()
          await fetchUserDesigns()
          await fetchUserFavorites()
          await fetchUserSubscription()
        }
      } catch (err: any) {
        console.error("Error fetching user data:", err)
        setError("We're having trouble loading your account data. Please refresh the page to try again.")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchUserOrders = async () => {
      try {
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (ordersError && ordersError.code !== "PGRST116") {
          console.warn("Error fetching orders:", ordersError)
          return
        }

        if (ordersData && ordersData.length > 0) {
          const formattedOrders = ordersData.map((order) => ({
            id: order.id,
            date: new Date(order.created_at).toLocaleDateString(),
            status: order.status,
            total: `$${order.total.toFixed(2)}`,
            items: order.order_items.map((item) => ({
              name: item.product_name,
              quantity: item.quantity,
              image: item.product_image || "/placeholder.svg",
            })),
          }))

          setOrders(formattedOrders)
        }
      } catch (error) {
        console.warn("Error fetching orders:", error)
      }
    }

    const fetchUserDesigns = async () => {
      try {
        const { data: designsData, error: designsError } = await supabase
          .from("saved_designs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (designsError && designsError.code !== "PGRST116") {
          console.warn("Error fetching designs:", designsError)
          return
        }

        if (designsData && designsData.length > 0) {
          const formattedDesigns = designsData.map((design) => ({
            id: design.id,
            name: design.name,
            preview: design.preview_url || "/placeholder.svg",
            date: new Date(design.created_at).toLocaleDateString(),
          }))

          setSavedDesigns(formattedDesigns)
        }
      } catch (error) {
        console.warn("Error fetching designs:", error)
      }
    }

    const fetchUserFavorites = async () => {
      try {
        const { data: favoritesData, error: favoritesError } = await supabase
          .from("favorites")
          .select("*, products(*)")
          .eq("user_id", user.id)

        if (favoritesError && favoritesError.code !== "PGRST116") {
          console.warn("Error fetching favorites:", favoritesError)
          return
        }

        if (favoritesData && favoritesData.length > 0) {
          const formattedFavorites = favoritesData.map((favorite) => ({
            id: favorite.product_id,
            name: favorite.products.name,
            image: favorite.products.image_url || "/placeholder.svg",
            price: `$${favorite.products.price.toFixed(2)}`,
          }))

          setFavorites(formattedFavorites)
        }
      } catch (error) {
        console.warn("Error fetching favorites:", error)
      }
    }

    const fetchUserSubscription = async () => {
      try {
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle()

        if (subscriptionError && subscriptionError.code !== "PGRST116") {
          console.warn("Error fetching subscription:", subscriptionError)
          return
        }

        if (subscriptionData) {
          setSubscription({
            plan: subscriptionData.plan_name,
            nextDelivery: new Date(subscriptionData.next_delivery_date).toLocaleDateString(),
            status: subscriptionData.status,
          })
        }
      } catch (error) {
        console.warn("Error fetching subscription:", error)
      }
    }

    if (user) {
      fetchUserData()
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // If this is a new user, we need to create the profile
      if (isNewUser && !profileCreated) {
        const { error: createError } = await supabase.from("users").insert([
          {
            id: user.id,
            email: user.email,
            full_name: fullName,
            phone,
            birthday: birthday || null,
            address,
            city,
            state,
            zip,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (createError) {
          // If the error is a duplicate key error, the profile might already exist
          if (createError.code === "23505") {
            // PostgreSQL unique violation code
            console.log("Profile already exists, updating instead...")

            // Try to update instead
            const { error: updateError } = await supabase
              .from("users")
              .update({
                full_name: fullName,
                phone,
                birthday: birthday || null,
                address,
                city,
                state,
                zip,
                updated_at: new Date().toISOString(),
              })
              .eq("id", user.id)

            if (updateError) throw updateError
          } else {
            throw createError
          }
        }

        setProfileCreated(true)
        setIsNewUser(false)

        toast({
          title: "Profile created",
          description: "Your profile has been successfully created. Welcome to Dessert Print!",
        })
      } else {
        // Update existing profile
        const { error } = await supabase
          .from("users")
          .update({
            full_name: fullName,
            phone,
            birthday: birthday || null,
            address,
            city,
            state,
            zip,
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        if (error) throw error

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        })
      }
    } catch (err: any) {
      console.error("Error updating profile:", err)
      setError("Failed to update your profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarClick = () => {
    // Trigger file input click
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !user) return

    const file = files[0]

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, GIF, or WebP image.",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 2MB.",
        variant: "destructive",
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

      // Create form data for the API request
      const formData = new FormData()
      formData.append("file", file)
      formData.append("userId", user.id)

      // Use the server-side API route to handle the upload
      const response = await fetch("/api/avatar/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to upload avatar")
      }

      const data = await response.json()

      // Update local state with the new avatar URL
      setAvatarUrl(data.avatarUrl)

      // Complete progress
      clearInterval(progressInterval)
      setUploadProgress(100)

      toast({
        title: "Avatar updated",
        description: "Your profile picture has been updated successfully.",
      })

      // Refresh the user session to get the updated avatar
      await supabase.auth.refreshSession()

      // Reset after 1 second
      setTimeout(() => {
        setIsUploading(false)
        setUploadProgress(0)
      }, 1000)
    } catch (err: any) {
      console.error("Error uploading avatar:", err)
      toast({
        title: "Upload failed",
        description: err.message || "Failed to upload profile picture. Please try again.",
        variant: "destructive",
      })
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (err) {
      console.error("Error signing out:", err)
    }
  }

  // If still loading auth state or not logged in, show loading
  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-rose-600" />
          <p className="text-lg">Loading your account...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 md:px-6 py-12">
      {isNewUser && (
        <Alert className="mb-6 bg-rose-50 border-rose-200">
          <AlertDescription className="text-rose-800">
            Welcome to Dessert Print! Please take a moment to complete your profile information below.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
            <CardHeader className="pb-4">
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <Avatar
                    className="h-24 w-24 mb-4 cursor-pointer group-hover:opacity-80 transition-opacity"
                    onClick={handleAvatarClick}
                  >
                    <AvatarImage
                      src={avatarUrl || user.avatar_url || "/placeholder.svg"}
                      alt={user.full_name || user.email}
                    />
                    <AvatarFallback className="bg-rose-600 text-white text-xl">
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={handleAvatarClick}
                  >
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleAvatarChange}
                  />

                  {isUploading && (
                    <div className="mt-2 w-24">
                      <Progress value={uploadProgress} className="h-1" />
                    </div>
                  )}
                </div>

                <CardTitle className="text-xl text-center">{user.full_name || user.email}</CardTitle>
                <CardDescription className="text-center">
                  Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : "today"}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <button
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === "profile"
                      ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600"
                      : "hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  onClick={() => setActiveTab("profile")}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === "orders"
                      ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600"
                      : "hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>Orders</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === "designs"
                      ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600"
                      : "hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  onClick={() => setActiveTab("designs")}
                >
                  <Package className="h-5 w-5" />
                  <span>Saved Designs</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === "favorites"
                      ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600"
                      : "hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  onClick={() => setActiveTab("favorites")}
                >
                  <Heart className="h-5 w-5" />
                  <span>Favorites</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === "subscription"
                      ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600"
                      : "hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  onClick={() => setActiveTab("subscription")}
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Subscription</span>
                </button>
                <button
                  className={`flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                    activeTab === "settings"
                      ? "bg-rose-50 text-rose-600 border-l-4 border-rose-600"
                      : "hover:bg-rose-50 hover:text-rose-600"
                  }`}
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-rose-50 hover:text-rose-600 text-gray-500"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="md:w-3/4">
          <Card className="rounded-[49px] overflow-hidden border-0 shadow-[27px_27px_54px_#6d2849,-27px_-27px_54px_#f25aa3]">
            <CardContent className="p-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-rose-800">
                    {isNewUser ? "Complete Your Profile" : "My Profile"}
                  </h2>

                  <div className="mb-8 flex flex-col items-center md:items-start">
                    <h3 className="text-lg font-medium mb-4">Profile Picture</h3>
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <Avatar
                          className="h-20 w-20 cursor-pointer group-hover:opacity-80 transition-opacity"
                          onClick={handleAvatarClick}
                        >
                          <AvatarImage
                            src={avatarUrl || user.avatar_url || "/placeholder.svg"}
                            alt={user.full_name || user.email}
                          />
                          <AvatarFallback className="bg-rose-600 text-white text-xl">
                            {user.full_name
                              ? user.full_name.charAt(0).toUpperCase()
                              : user.email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          onClick={handleAvatarClick}
                        >
                          <div className="bg-black bg-opacity-50 rounded-full p-2">
                            <Camera className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                          onClick={handleAvatarClick}
                          disabled={isUploading}
                        >
                          <Upload className="h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload Photo"}
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, GIF or WebP (max. 2MB)</p>
                      </div>
                    </div>

                    {isUploading && (
                      <div className="mt-2 w-full max-w-xs">
                        <Progress value={uploadProgress} className="h-1" />
                        <p className="text-xs text-muted-foreground mt-1 text-right">{uploadProgress}%</p>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user.email} disabled={true} className="bg-gray-50" />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthday">Birthday</Label>
                        <Input
                          id="birthday"
                          type="date"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <h3 className="text-xl font-bold mb-4 text-rose-800">Shipping Address</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          placeholder="123 Main St"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          placeholder="NY"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input
                          id="zip"
                          placeholder="10001"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button type="submit" className="bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {isNewUser && !profileCreated ? "Creating Profile..." : "Saving..."}
                          </>
                        ) : isNewUser && !profileCreated ? (
                          "Create Profile"
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === "orders" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-rose-800">My Orders</h2>
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between mb-4">
                              <div>
                                <p className="font-bold">Order #{order.id}</p>
                                <p className="text-sm text-muted-foreground">{order.date}</p>
                              </div>
                              <div className="mt-2 md:mt-0">
                                <Badge
                                  className={
                                    order.status === "delivered"
                                      ? "bg-green-500"
                                      : order.status === "processing"
                                        ? "bg-amber-500"
                                        : order.status === "shipped"
                                          ? "bg-blue-500"
                                          : "bg-gray-500"
                                  }
                                >
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                                <p className="text-sm font-bold mt-1">{order.total}</p>
                              </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="space-y-4">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                  <div className="relative h-16 w-16 rounded-md overflow-hidden">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 flex justify-end">
                              <Link href={`/orders/${order.id}`}>
                                <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
                                  View Order Details
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">You haven&apos;t placed any orders yet.</p>
                      <Link href="/shop">
                        <Button className="bg-rose-600 hover:bg-rose-700">Start Shopping</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Saved Designs Tab */}
              {activeTab === "designs" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-rose-800">Saved Designs</h2>
                  {savedDesigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedDesigns.map((design) => (
                        <Card key={design.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <div className="relative h-24 w-24 rounded-md overflow-hidden">
                                <Image
                                  src={design.preview || "/placeholder.svg"}
                                  alt={design.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold">{design.name}</h3>
                                <p className="text-sm text-muted-foreground">Saved on {design.date}</p>
                                <div className="flex gap-2 mt-4">
                                  <Link href={`/customization-suite?design=${design.id}`}>
                                    <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                                      Edit Design
                                    </Button>
                                  </Link>
                                  <Link href={`/order?design=${design.id}`}>
                                    <Button size="sm" variant="outline" className="border-rose-600 text-rose-600">
                                      Order Now
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">You haven&apos;t saved any designs yet.</p>
                      <Link href="/customization-suite">
                        <Button className="bg-rose-600 hover:bg-rose-700">Create a Design</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Favorites Tab */}
              {activeTab === "favorites" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-rose-800">My Favorites</h2>
                  {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favorites.map((product) => (
                        <Card key={product.id} className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex gap-4">
                              <div className="relative h-24 w-24 rounded-md overflow-hidden">
                                <Image
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-bold">{product.name}</h3>
                                <p className="text-rose-600 font-bold">{product.price}</p>
                                <div className="flex gap-2 mt-4">
                                  <Button
                                    size="sm"
                                    className="bg-rose-600 hover:bg-rose-700"
                                    onClick={() => {
                                      // This would add to cart
                                      toast({
                                        title: "Added to cart",
                                        description: `${product.name} has been added to your cart.`,
                                      })
                                    }}
                                  >
                                    Add to Cart
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-rose-600 text-rose-600"
                                    onClick={async () => {
                                      try {
                                        await supabase
                                          .from("favorites")
                                          .delete()
                                          .eq("user_id", user.id)
                                          .eq("product_id", product.id)

                                        // Update local state
                                        setFavorites(favorites.filter((fav) => fav.id !== product.id))

                                        toast({
                                          title: "Removed from favorites",
                                          description: `${product.name} has been removed from your favorites.`,
                                        })
                                      } catch (err) {
                                        console.error("Error removing favorite:", err)
                                        toast({
                                          title: "Error",
                                          description: "Failed to remove from favorites.",
                                          variant: "destructive",
                                        })
                                      }
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">You haven&apos;t added any favorites yet.</p>
                      <Link href="/shop">
                        <Button className="bg-rose-600 hover:bg-rose-700">Browse Products</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === "subscription" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-rose-800">My Subscription</h2>
                  {subscription ? (
                    <div className="space-y-6">
                      <Card className="overflow-hidden bg-gradient-to-r from-rose-600 to-amber-500 text-white">
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row justify-between">
                            <div>
                              <h3 className="text-xl font-bold">{subscription.plan}</h3>
                              <p className="opacity-90">Status: {subscription.status}</p>
                              <p className="opacity-90">Next Delivery: {subscription.nextDelivery}</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                              <Button
                                className="bg-white text-rose-600 hover:bg-rose-50"
                                onClick={() => {
                                  // This would navigate to subscription management
                                  router.push("/subscription/manage")
                                }}
                              >
                                Manage Subscription
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <h3 className="text-xl font-bold mt-8 mb-4 text-rose-800">Delivery History</h3>
                      <div className="space-y-4">
                        <Card className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-bold">April Box</p>
                                <p className="text-sm text-muted-foreground">Delivered on April 15, 2025</p>
                              </div>
                              <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="overflow-hidden">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-bold">March Box</p>
                                <p className="text-sm text-muted-foreground">Delivered on March 15, 2025</p>
                              </div>
                              <Button variant="outline" className="border-rose-600 text-rose-600 hover:bg-rose-50">
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground mb-4">You don&apos;t have an active subscription.</p>
                      <Link href="/subscription">
                        <Button className="bg-rose-600 hover:bg-rose-700">Browse Subscription Plans</Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-rose-800">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" disabled={isLoading} />
                        </div>
                        <Button
                          className="bg-rose-600 hover:bg-rose-700"
                          onClick={async () => {
                            // This would update password
                            toast({
                              title: "Password updated",
                              description: "Your password has been successfully updated.",
                            })
                          }}
                          disabled={isLoading}
                        >
                          Update Password
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Email Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="order-updates" className="rounded text-rose-600" defaultChecked />
                          <Label htmlFor="order-updates">Order updates and shipping notifications</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="promotions" className="rounded text-rose-600" defaultChecked />
                          <Label htmlFor="promotions">Promotions and special offers</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="newsletter" className="rounded text-rose-600" defaultChecked />
                          <Label htmlFor="newsletter">Newsletter and blog updates</Label>
                        </div>
                        <Button
                          className="bg-rose-600 hover:bg-rose-700"
                          onClick={() => {
                            // This would save email preferences
                            toast({
                              title: "Preferences saved",
                              description: "Your email preferences have been updated.",
                            })
                          }}
                          disabled={isLoading}
                        >
                          Save Preferences
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-destructive">Delete Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                            // This would delete the account
                            toast({
                              title: "Account deleted",
                              description: "Your account has been successfully deleted.",
                            })
                            router.push("/")
                          }
                        }}
                        disabled={isLoading}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
