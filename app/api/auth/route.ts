import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { email, password, action } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    let result

    if (action === "signup") {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      result = { user: data.user, session: data.session }
    } else if (action === "login") {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      result = { user: data.user, session: data.session }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: error.message || "Authentication failed" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get current session
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    return NextResponse.json({ session: data.session })
  } catch (error: any) {
    console.error("Session error:", error)
    return NextResponse.json({ error: error.message || "Failed to get session" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    // Sign out
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Sign out error:", error)
    return NextResponse.json({ error: error.message || "Failed to sign out" }, { status: 500 })
  }
}
