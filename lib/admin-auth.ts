import { NextRequest, NextResponse } from "next/server"
import { getServiceRoleClient } from "./supabase-client"

/**
 * Verifies if a user has admin privileges
 * @param userId The user ID to check
 * @returns Boolean indicating if the user is an admin
 */
async function verifyAdminUser(userId: string) {
  const supabase = getServiceRoleClient()
  
  // First check profiles table
  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()
  
  if (profileData?.role === "admin") return true
  
  // Then check users table
  const { data: userData } = await supabase
    .from("users")
    .select("is_admin")
    .eq("id", userId)
    .single()
  
  return userData?.is_admin === true
}

/**
 * Middleware for admin authentication
 * This function can be reused across all admin API routes
 * 
 * @param request The NextRequest object
 * @returns Object containing user and supabase client if authenticated, or error information if not
 */
export async function adminAuthMiddleware(request: NextRequest) {
  const supabase = getServiceRoleClient()
  
  // Get user from session to verify admin status
  const authHeader = request.headers.get("Authorization")
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Unauthorized", status: 401 }
  }
  
  const token = authHeader.split(" ")[1]
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  
  if (authError || !user) {
    return { error: "Unauthorized", status: 401 }
  }
  
  // Verify admin status
  const isAdmin = await verifyAdminUser(user.id)
  if (!isAdmin) {
    return { error: "Forbidden: Admin access required", status: 403 }
  }
  
  return { user, supabase }
}

/**
 * Helper function to create a standard error response
 * @param message Error message
 * @param status HTTP status code
 * @returns NextResponse with error details
 */
export function createErrorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}