import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Create a singleton Supabase client for client components
export const supabaseClient = createClientComponentClient()

// Login with email and password
export async function loginWithEmail(email: string, password: string) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Register with email and password
export async function registerWithEmail(email: string, password: string, metadata?: any) {
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
  const { error } = await supabaseClient.auth.signOut()
  if (error) throw error
}

// Get current session
export async function getCurrentSession() {
  const { data, error } = await supabaseClient.auth.getSession()
  if (error) throw error
  return data.session
}

// Get current user
export async function getCurrentUser() {
  const { data, error } = await supabaseClient.auth.getUser()
  if (error) throw error
  return data.user
}
