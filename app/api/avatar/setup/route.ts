import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/direct-upload"

export async function GET() {
  try {
    // Check if avatars bucket exists
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets()

    if (bucketsError) {
      throw bucketsError
    }

    const bucketExists = buckets?.some((bucket) => bucket.name === "avatars")

    if (!bucketExists) {
      // Create avatars bucket
      const { error: createError } = await supabaseAdmin.storage.createBucket("avatars", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })

      if (createError) {
        throw createError
      }

      // Create RLS policies for the bucket
      await supabaseAdmin.rpc("create_storage_policy", {
        bucket_name: "avatars",
        policy_name: "avatars_public_select",
        definition: `bucket_id = 'avatars'`,
        operation: "SELECT",
      })

      await supabaseAdmin.rpc("create_storage_policy", {
        bucket_name: "avatars",
        policy_name: "avatars_auth_insert",
        definition: `bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid`,
        operation: "INSERT",
      })

      await supabaseAdmin.rpc("create_storage_policy", {
        bucket_name: "avatars",
        policy_name: "avatars_auth_update",
        definition: `bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid`,
        operation: "UPDATE",
      })

      await supabaseAdmin.rpc("create_storage_policy", {
        bucket_name: "avatars",
        policy_name: "avatars_auth_delete",
        definition: `bucket_id = 'avatars' AND auth.uid() = (storage.foldername(name))[1]::uuid`,
        operation: "DELETE",
      })

      return NextResponse.json({
        success: true,
        message: "Avatars bucket created successfully with policies",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Avatars bucket already exists",
    })
  } catch (error: any) {
    console.error("Error setting up avatars bucket:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to set up avatars bucket",
      },
      { status: 500 },
    )
  }
}
