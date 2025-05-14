import { type NextRequest, NextResponse } from "next/server"
import { directUpload, supabaseAdmin } from "@/lib/direct-upload"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userId = formData.get("userId") as string

    if (!file || !userId) {
      return NextResponse.json({ error: "File and userId are required" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // Validate file size (max 2MB)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large" }, { status: 400 })
    }

    // Generate a unique filename
    const timestamp = Date.now()
    const fileExt = file.name.split(".").pop()
    const filePath = `${userId}/${timestamp}.${fileExt}`

    // Create the bucket if it doesn't exist and upload the file
    const bucketName = "avatars"

    // Upload directly using our utility
    const { publicUrl } = await directUpload(bucketName, filePath, file)

    // Update user metadata with new avatar URL
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        avatar_url: publicUrl,
      },
    })

    if (updateError) {
      console.error("Update error:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ avatarUrl: publicUrl })
  } catch (error: any) {
    console.error("Server error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
