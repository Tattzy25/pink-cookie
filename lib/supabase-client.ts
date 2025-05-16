import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/supabase"

// Environment variable validation
function validateEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL or Anon Key is missing")
    throw new Error("Supabase credentials are missing")
  }

  return { supabaseUrl, supabaseAnonKey }
}

// Create a singleton Supabase client for client components
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function getClientComponentClient() {
  if (typeof window === "undefined") {
    throw new Error("Client component client should only be used in browser environment")
  }
  
  if (!clientInstance) {
    clientInstance = createClientComponentClient<Database>()
  }
  
  return clientInstance
}

// Create a singleton Supabase client for server components and API routes
let serverInstance: ReturnType<typeof createSupabaseClient<Database>> | null = null

export function getServerClient() {
  const { supabaseUrl, supabaseAnonKey } = validateEnvVars()
  
  // In server environments, create a new instance each time for isolation
  return createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Create a service role client for admin operations (should only be used server-side)
export function getServiceRoleClient() {
  const { supabaseUrl } = validateEnvVars()
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    console.error("Supabase Service Role Key is missing")
    throw new Error("Supabase service role credentials are missing")
  }
  
  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// For backward compatibility - client-side only
export const supabase = typeof window !== "undefined" ? getClientComponentClient() : getServerClient()