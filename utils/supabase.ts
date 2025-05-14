import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// For singleton pattern on client side
let supabaseInstance: ReturnType<typeof createSupabaseClient> | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    throw new Error("Supabase credentials are missing")
  }

  // In browser environments, maintain a singleton instance
  if (typeof window !== "undefined") {
    if (!supabaseInstance) {
      supabaseInstance = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
    }
    return supabaseInstance
  }

  // In server environments, create a new instance each time
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
}

// For backward compatibility
export const supabase = createClient()
