import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { sendNewOrderNotification, sendOrderConfirmation, sendLowStockAlert } from "@/lib/email-service"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Process based on event type
    switch (body.event) {
      case "order.created":
        await handleNewOrder(body.data)
        break
      case "product.low_stock":
        await handleLowStock(body.data)
        break
      default:
        return NextResponse.json({ message: "Event type not supported" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function handleNewOrder(orderData: any) {
  try {
    // Get full order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("id", orderData.id)
      .single()

    if (orderError) throw orderError

    // Get customer details
    const { data: customer, error: customerError } = await supabase
      .from("users")
      .select("*")
      .eq("id", order.user_id)
      .single()

    if (customerError) throw customerError

    // Send notifications
    await Promise.all([sendNewOrderNotification(order), sendOrderConfirmation(order, customer)])

    // Update product stock levels
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", item.product_id)
          .single()

        if (productError) continue

        const newStock = product.stock - item.quantity

        await supabase.from("products").update({ stock: newStock }).eq("id", item.product_id)

        // Check if stock is low
        if (newStock <= 10) {
          await sendLowStockAlert(product)
        }
      }
    }

    return true
  } catch (error) {
    console.error("Error handling new order:", error)
    throw error
  }
}

async function handleLowStock(productData: any) {
  try {
    // Get full product details
    const { data: product, error } = await supabase.from("products").select("*").eq("id", productData.id).single()

    if (error) throw error

    // Send low stock alert
    await sendLowStockAlert(product)

    return true
  } catch (error) {
    console.error("Error handling low stock:", error)
    throw error
  }
}
