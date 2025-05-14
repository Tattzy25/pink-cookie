import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST() {
  try {
    // Check if the bucket exists
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some((bucket) => bucket.name === "designs")

    return NextResponse.json({
      success: true,
      bucketExists,
      message: bucketExists
        ? "Storage bucket exists and is ready to use"
        : "Storage bucket does not exist, will use local storage fallback",
    })
  } catch (error) {
    console.error("Error checking bucket:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error checking bucket status",
      message: "Will use local storage fallback",
    })
  }
}
