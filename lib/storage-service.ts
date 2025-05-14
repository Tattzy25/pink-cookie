import { supabase } from "./supabase"

// Define allowed file types and their corresponding folders
const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  spreadsheet: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
}

// Define storage buckets
const STORAGE_BUCKETS = {
  products: "products",
  blog: "blog",
  designs: "designs",
  documents: "documents",
  avatars: "avatars",
}

// Helper to get the appropriate bucket based on file type and context
function getBucket(fileType: string, context: string): string {
  if (ALLOWED_FILE_TYPES.image.includes(fileType)) {
    if (context === "product") return STORAGE_BUCKETS.products
    if (context === "blog") return STORAGE_BUCKETS.blog
    if (context === "design") return STORAGE_BUCKETS.designs
    if (context === "avatar") return STORAGE_BUCKETS.avatars
  }

  if (ALLOWED_FILE_TYPES.document.includes(fileType) || ALLOWED_FILE_TYPES.spreadsheet.includes(fileType)) {
    return STORAGE_BUCKETS.documents
  }

  return STORAGE_BUCKETS.products // Default bucket
}

// Generate a unique filename
function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 10)
  const extension = originalFilename.split(".").pop()
  return `${timestamp}-${randomString}.${extension}`
}

// Upload a file to storage
export async function uploadFile(file: File, context = "product") {
  try {
    // Validate file type
    let isAllowedType = false
    for (const types of Object.values(ALLOWED_FILE_TYPES)) {
      if (types.includes(file.type)) {
        isAllowedType = true
        break
      }
    }

    if (!isAllowedType) {
      throw new Error(`File type ${file.type} is not allowed`)
    }

    // Get the appropriate bucket
    const bucket = getBucket(file.type, context)

    // Generate a unique filename
    const filename = generateUniqueFilename(file.name)

    // Upload the file
    const { data, error } = await supabase.storage.from(bucket).upload(filename, file)

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filename)

    return {
      success: true,
      url: urlData.publicUrl,
      filename,
      bucket,
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      error,
    }
  }
}

// Delete a file from storage
export async function deleteFile(filename: string, bucket: string) {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filename])

    if (error) throw error

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    return {
      success: false,
      error,
    }
  }
}

// List files in a bucket
export async function listFiles(bucket: string, folder = "") {
  try {
    const { data, error } = await supabase.storage.from(bucket).list(folder)

    if (error) throw error

    return {
      success: true,
      files: data,
    }
  } catch (error) {
    console.error("Error listing files:", error)
    return {
      success: false,
      error,
    }
  }
}
