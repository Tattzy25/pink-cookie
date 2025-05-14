"use client"

import type React from "react"

import { createClient } from "@supabase/supabase-js"
import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "@/components/ui/use-toast"

// Create a singleton Supabase client for the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export type User = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at?: string
}

export type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (data: Partial<User>) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authInitialized, setAuthInitialized] = useState(false)

  // Simplified session refresh function that won't crash the app
  const refreshSession = async () => {
    try {
      // First check if there's an existing session before trying to refresh
      const { data: sessionData } = await supabase.auth.getSession()

      // If no session exists, just return false without attempting to refresh
      if (!sessionData?.session) {
        console.log("No active session to refresh")
        setUser(null)
        return false
      }

      try {
        // Only attempt to refresh if we have an existing session
        const { data, error } = await supabase.auth.refreshSession()

        if (error) {
          console.error("Session refresh error:", error)
          setUser(null)
          return false
        }

        if (data?.session) {
          try {
            // Get user profile
            const { data: profile } = await supabase.from("users").select("*").eq("id", data.session.user.id).single()

            setUser({
              id: data.session.user.id,
              email: data.session.user.email || "",
              full_name: profile?.full_name,
              avatar_url: profile?.avatar_url,
              created_at: profile?.created_at,
            })
            return true
          } catch (profileError) {
            console.error("Error fetching user profile during refresh:", profileError)
            // Still set basic user info even if profile fetch fails
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || "",
            })
            return true
          }
        } else {
          setUser(null)
          return false
        }
      } catch (refreshError) {
        console.error("Error during session refresh:", refreshError)
        setUser(null)
        return false
      }
    } catch (error) {
      console.error("Fatal error during session handling:", error)
      setUser(null)
      return false
    }
  }

  // Simplified useEffect that won't crash the app
  useEffect(() => {
    // Wrap in try/catch to prevent white screen
    try {
      const checkSession = async () => {
        try {
          const { data } = await supabase.auth.getSession()

          if (data?.session?.user) {
            try {
              // Get user profile from the users table
              const { data: profile } = await supabase.from("users").select("*").eq("id", data.session.user.id).single()

              if (profile) {
                setUser({
                  id: data.session.user.id,
                  email: data.session.user.email || "",
                  full_name: profile.full_name,
                  avatar_url: profile.avatar_url,
                  created_at: profile.created_at,
                })
              } else {
                // If no profile exists, use basic user data
                setUser({
                  id: data.session.user.id,
                  email: data.session.user.email || "",
                })
              }
            } catch (error) {
              console.error("Error fetching user profile:", error)
              // Set basic user info on error
              setUser({
                id: data.session.user.id,
                email: data.session.user.email || "",
              })
            }
          } else {
            setUser(null)
          }
        } catch (error) {
          console.error("Session check error:", error)
          setUser(null)
        } finally {
          setLoading(false)
          setAuthInitialized(true)
        }
      }

      checkSession()

      // Auth state change listener
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === "SIGNED_IN" && session) {
          // Handle sign in
          try {
            const getUserProfile = async () => {
              try {
                const { data: profile } = await supabase.from("users").select("*").eq("id", session.user.id).single()

                if (profile) {
                  setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                    full_name: profile.full_name,
                    avatar_url: profile.avatar_url,
                    created_at: profile.created_at,
                  })
                } else {
                  setUser({
                    id: session.user.id,
                    email: session.user.email || "",
                  })
                }
              } catch (error) {
                console.error("Error fetching user profile on auth change:", error)
                setUser({
                  id: session.user.id,
                  email: session.user.email || "",
                })
              } finally {
                setLoading(false)
              }
            }

            getUserProfile()
          } catch (error) {
            console.error("Error handling sign in:", error)
            setLoading(false)
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null)
          setLoading(false)
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (error) {
      console.error("Critical auth initialization error:", error)
      setLoading(false)
      setAuthInitialized(true)
      return () => {}
    }
  }, [])

  // Simplified auth methods that won't crash the app
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
    } catch (error: any) {
      console.error("Error signing in:", error)
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true)

      // Direct Supabase signup instead of using API route
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (error) throw error

      if (data?.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
        })

        if (profileError) {
          console.error("Error creating user profile:", profileError)
        }

        toast({
          title: "Account created!",
          description: "Your account has been successfully created.",
        })
      }
    } catch (error: any) {
      console.error("Error signing up:", error)
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      setUser(null)
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error: any) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      toast({
        title: "Password reset email sent",
        description: "Check your email for a password reset link.",
      })
    } catch (error: any) {
      console.error("Error resetting password:", error)
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred during password reset.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true)

      if (!user) throw new Error("No user logged in")

      // Update the users table
      const { error } = await supabase.from("users").update(data).eq("id", user.id)

      if (error) throw error

      // Update local state
      setUser({ ...user, ...data })

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast({
        title: "Profile update failed",
        description: error.message || "An error occurred while updating your profile.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // If auth isn't initialized yet, render a simple loading state
  if (!authInitialized && loading) {
    return <div className="min-h-screen flex items-center justify-center">Initializing...</div>
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  }

  // Wrap in try/catch to prevent white screen
  try {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  } catch (error) {
    console.error("Error rendering AuthProvider:", error)
    return <>{children}</>
  }
}
