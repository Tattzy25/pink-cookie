import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getServiceRoleClient } from "@/lib/supabase-client"

/**
 * Admin login endpoint
 * This route allows admin users to authenticate and receive a JWT token
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }
    
    // Create Supabase client
    const supabase = createClient()
    
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }
    
    // Verify admin status
    const serviceClient = getServiceRoleClient()
    
    // First check profiles table
    const { data: profileData } = await serviceClient
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single()
    
    if (profileData?.role === "admin") {
      return NextResponse.json({
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: "admin"
        }
      })
    }
    
    // Then check users table
    const { data: userData } = await serviceClient
      .from("users")
      .select("is_admin")
      .eq("id", data.user.id)
      .single()
    
    if (userData?.is_admin === true) {
      return NextResponse.json({
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: "admin"
        }
      })
    }
    
    // User is not an admin
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 403 }
    )
  } catch (error) {
    console.error("Admin login error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}