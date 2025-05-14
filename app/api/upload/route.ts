import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { v4 as uuidv4 } from "uuid"

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

    // Check if storage bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const adminBucket = buckets?.find((bucket) => bucket.name === "admin-uploads")

    // Create bucket if it doesn't exist
    if (!adminBucket) {
      await supabase.storage.createBucket("admin-uploads", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })
    }

    // Parse the multipart form data
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 })
    }

    // Generate a unique filename
    const fileExt = file.name.split(".").pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `${fileName}`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("admin-uploads").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Supabase storage error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("admin-uploads").getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: filePath,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    )
  }
}
