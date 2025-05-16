import { getClientComponentClient } from "@/lib/supabase-client"

// Use the standardized Supabase client implementation
const getSupabaseClient = () => getClientComponentClient()

// Login with email and password
export async function loginWithEmail(email: string, password: string) {
  const supabaseClient = getSupabaseClient()
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Register with email and password
export async function registerWithEmail(email: string, password: string, metadata?: any) {
  const supabaseClient = getSupabaseClient()
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })

  if (error) throw error
  return data
}

// Sign out
export async function signOut() {
  const supabaseClient = getSupabaseClient()
  const { error } = await supabaseClient.auth.signOut()
  if (error) throw error
}

// Get current session
export async function getCurrentSession() {
  const supabaseClient = getSupabaseClient()
  const { data, error } = await supabaseClient.auth.getSession()
  if (error) throw error
  return data.session
}

// Get current user
export async function getCurrentUser() {
  const supabaseClient = getSupabaseClient()
  const { data, error } = await supabaseClient.auth.getUser()
  if (error) throw error
  return data.user
}
