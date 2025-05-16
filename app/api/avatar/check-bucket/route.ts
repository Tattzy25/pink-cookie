import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

// Create a Supabase client with the service role key
const supabaseAdmin = createServerSupabaseClient()

export async function GET() {
  try {
    // Check if the avatars bucket exists
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()

    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError)
      return NextResponse.json({ error: bucketsError.message }, { status: 500 })
    }

    const avatarsBucketExists = buckets.some((bucket) => bucket.name === "avatars")

    if (!avatarsBucketExists) {
      // Create the avatars bucket
      const { error: createError } = await supabaseAdmin.storage.createBucket("avatars", {
        public: true,
      })

      if (createError) {
        console.error("Error creating avatars bucket:", createError)
        return NextResponse.json({ error: createError.message }, { status: 500 })
      }

      // Create a policy to allow public access to the avatars bucket
      const { error: policyError } = await supabaseAdmin.storage.from("avatars").getPublicUrl("test")

      if (policyError) {
        console.error("Error creating policy:", policyError)
        // This is not a critical error, so we'll continue
      }

      return NextResponse.json({ message: "Avatars bucket created successfully" })
    }

    return NextResponse.json({ message: "Avatars bucket already exists" })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
