import { NextRequest, NextResponse } from "next/server"
import { adminAuthMiddleware, createErrorResponse } from "@/lib/admin-auth"

/**
 * Admin API endpoint for external admin dashboard integration
 * This route provides secure access to site data for the external admin dashboard
 */

export async function GET(request: NextRequest) {
  // Authenticate admin user
  const { user, supabase, error, status } = await adminAuthMiddleware(request)
  
  if (error) {
    return createErrorResponse(error, status)
  }
  
  // Get the requested resource type from query params
  const { searchParams } = new URL(request.url)
  const resource = searchParams.get("resource")
  
  try {
    // Handle different resource types
    switch (resource) {
      case "products":
        const { data: products } = await supabase.from("products").select("*")
        return NextResponse.json({ products })
        
      case "orders":
        const { data: orders } = await supabase.from("orders").select("*")
        return NextResponse.json({ orders })
        
      case "users":
        const { data: users } = await supabase.from("users").select("id, email, created_at")
        return NextResponse.json({ users })
        
      case "stats":
        // Get basic site statistics
        const [productsCount, ordersCount, usersCount] = await Promise.all([
          supabase.from("products").select("id", { count: "exact" }),
          supabase.from("orders").select("id", { count: "exact" }),
          supabase.from("users").select("id", { count: "exact" })
        ])
        
        return NextResponse.json({
          stats: {
            products: productsCount.count || 0,
            orders: ordersCount.count || 0,
            users: usersCount.count || 0
          }
        })
        
      default:
        return createErrorResponse("Invalid resource type", 400)
    }
  } catch (error) {
    console.error("Admin API error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function POST(request: NextRequest) {
  // Authenticate admin user
  const { user, supabase, error, status } = await adminAuthMiddleware(request)
  
  if (error) {
    return createErrorResponse(error, status)
  }
  
  // Get the requested resource type from query params
  const { searchParams } = new URL(request.url)
  const resource = searchParams.get("resource")
  
  try {
    // Parse request body
    const body = await request.json()
    
    // Handle different resource types
    switch (resource) {
      case "products":
        if (body.id) {
          // Update existing product
          const { data, error } = await supabase
            .from("products")
            .update(body)
            .eq("id", body.id)
            .select()
          
          if (error) throw error
          return NextResponse.json({ product: data[0] })
        } else {
          // Create new product
          const { data, error } = await supabase
            .from("products")
            .insert(body)
            .select()
          
          if (error) throw error
          return NextResponse.json({ product: data[0] })
        }
        
      case "orders":
        if (body.id) {
          // Update order status
          const { data, error } = await supabase
            .from("orders")
            .update({ status: body.status })
            .eq("id", body.id)
            .select()
          
          if (error) throw error
          return NextResponse.json({ order: data[0] })
        }
        return createErrorResponse("Invalid order operation", 400)
        
      default:
        return createErrorResponse("Invalid resource type", 400)
    }
  } catch (error) {
    console.error("Admin API error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}

export async function DELETE(request: NextRequest) {
  // Authenticate admin user
  const { user, supabase, error, status } = await adminAuthMiddleware(request)
  
  if (error) {
    return createErrorResponse(error, status)
  }
  
  // Get the requested resource type and ID from query params
  const { searchParams } = new URL(request.url)
  const resource = searchParams.get("resource")
  const id = searchParams.get("id")
  
  if (!id) {
    return createErrorResponse("Missing resource ID", 400)
  }
  
  try {
    // Handle different resource types
    switch (resource) {
      case "products":
        const { error: deleteError } = await supabase
          .from("products")
          .delete()
          .eq("id", id)
        
        if (deleteError) throw deleteError
        return NextResponse.json({ success: true })
        
      default:
        return createErrorResponse("Invalid resource type", 400)
    }
  } catch (error) {
    console.error("Admin API error:", error)
    return createErrorResponse("Internal server error", 500)
  }
}