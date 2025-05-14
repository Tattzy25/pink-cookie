import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    // Only allow this endpoint to be called in development or with a special key
    if (process.env.NODE_ENV !== "development" && request.headers.get("x-admin-key") !== process.env.ADMIN_SETUP_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient()

    // Check if admin user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(1)

    if (checkError) {
      console.error("Error checking for existing admin:", checkError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ message: "Admin user already exists" }, { status: 200 })
    }

    // Create admin user using RPC function
    const { data, error } = await supabase.rpc("create_admin_user", {
      email,
      password,
      full_name: fullName,
    })

    if (error) {
      console.error("Error creating admin user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: data,
    })
  } catch (error) {
    console.error("Admin setup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
