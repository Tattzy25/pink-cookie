import { supabase } from "./supabase"

/**
 * Uploads a file to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder to upload to (default: "media")
 * @returns The public URL of the uploaded file, or null if the upload failed
 */
export async function uploadMedia(file: File, folder = "media"): Promise<{ url: string; path: string } | null> {
  try {
    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Supported formats: JPG, PNG, SVG, GIF, WEBP")
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      throw new Error("File size exceeds 10MB limit")
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload the file to Supabase Storage
    const { data, error: uploadError } = await supabase.storage.from("assets").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      throw new Error(uploadError.message)
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = supabase.storage.from("assets").getPublicUrl(filePath)

    // Store metadata in the database
    const { error: dbError } = await supabase.from("media").insert({
      file_name: fileName,
      original_name: file.name,
      file_path: filePath,
      file_type: file.type,
      file_size: file.size,
      public_url: urlData.publicUrl,
    })

    if (dbError) {
      console.error("Error storing media metadata:", dbError)
      // We don't throw here as the file was uploaded successfully
    }

    return {
      url: urlData.publicUrl,
      path: filePath,
    }
  } catch (error) {
    console.error("Error in uploadMedia:", error)
    throw error
  }
}

/**
 * Deletes a file from Supabase Storage
 * @param url - The public URL of the file to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export async function deleteMedia(url: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    const bucketIndex = pathParts.findIndex((part) => part === "assets")

    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      throw new Error("Invalid file URL")
    }

    const filePath = pathParts.slice(bucketIndex + 1).join("/")

    // Delete the file from Supabase Storage
    const { error } = await supabase.storage.from("assets").remove([filePath])

    if (error) {
      console.error("Error deleting file:", error)
      return false
    }

    // Delete the metadata from the database
    const { error: dbError } = await supabase.from("media").delete().eq("public_url", url)

    if (dbError) {
      console.error("Error deleting media metadata:", dbError)
      // We don't return false here as the file was deleted successfully
    }

    return true
  } catch (error) {
    console.error("Error in deleteMedia:", error)
    return false
  }
}

/**
 * Gets all media files from the database
 * @returns An array of media files
 */
export async function getAllMedia(): Promise<any[]> {
  try {
    const { data, error } = await supabase.from("media").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching media:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error in getAllMedia:", error)
    return []
  }
}

/**
 * Gets a media file by its ID
 * @param id - The ID of the media file
 * @returns The media file, or null if not found
 */
export async function getMediaById(id: string): Promise<any | null> {
  try {
    const { data, error } = await supabase.from("media").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching media by ID:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Error in getMediaById:", error)
    return null
  }
}
