import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()

    // Create the bucket if it doesn't exist
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      return NextResponse.json({ error: `Failed to list buckets: ${bucketsError.message}` }, { status: 500 })
    }

    const bucketName = "user-uploads"
    const bucketExists = buckets.some((bucket) => bucket.name === bucketName)

    if (!bucketExists) {
      const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10485760, // 10MB
      })

      if (createError) {
        return NextResponse.json({ error: `Failed to create bucket: ${createError.message}` }, { status: 500 })
      }
    }

    // Set public bucket policy
    const { error: policyError } = await supabase.storage.from(bucketName).createSignedUrl("dummy.txt", 1) // This is just to check if we have access

    if (policyError && !policyError.message.includes("not found")) {
      // Try to update the bucket policy
      const { error: updateError } = await supabase.rpc("update_bucket_policy", { bucket_name: bucketName })

      if (updateError) {
        console.warn("Could not update bucket policy:", updateError)
        // Continue anyway, as the bucket might still work
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error setting up storage bucket:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
