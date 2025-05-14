import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function directUpload(bucketName: string, filePath: string, file: File): Promise<{ publicUrl: string }> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error } = await supabaseAdmin.storage.from(bucketName).upload(filePath, buffer, {
      contentType: file.type,
      upsert: true,
    })

    if (error) {
      throw error
    }

    const { data } = supabaseAdmin.storage.from(bucketName).getPublicUrl(filePath)

    return { publicUrl: data.publicUrl }
  } catch (error: any) {
    console.error("Direct upload error:", error)
    throw new Error(error.message || "Failed to upload file")
  }
}

export { supabaseAdmin, directUpload }
