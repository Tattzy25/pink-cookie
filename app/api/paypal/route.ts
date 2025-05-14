import { NextResponse } from "next/server"

// PayPal API integration
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Create PayPal order using the PayPal API
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: body.amount,
            },
            description: body.description || "Dessert Print Inc. Order",
          },
        ],
        application_context: {
          brand_name: "Dessert Print Inc.",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
          return_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal API error response:", data)
      throw new Error(data.message || "Failed to create PayPal order")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("PayPal API error:", error)
    return NextResponse.json({ error: "Failed to create PayPal payment" }, { status: 500 })
  }
}

// Capture payment after approval
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderId = searchParams.get("orderId")

  if (!orderId) {
    return NextResponse.json({ error: "Missing order ID" }, { status: 400 })
  }

  try {
    // Capture the approved PayPal order
    const response = await fetch(`${process.env.PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
        ).toString("base64")}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("PayPal capture error response:", data)
      throw new Error(data.message || "Failed to capture PayPal payment")
    }

    // Here you would update your database with the completed order
    // For example: await supabase.from("orders").insert([{ paypal_order_id: orderId, status: "completed", ... }])

    return NextResponse.json(data)
  } catch (error) {
    console.error("PayPal capture error:", error)
    return NextResponse.json({ error: "Failed to capture PayPal payment" }, { status: 500 })
  }
}

// Verify webhook events from PayPal
export async function PATCH(request: Request) {
  try {
    const { verified, body, error } = await verifyWebhookSignature(request)

    if (!verified) {
      console.error("Webhook verification failed:", error)
      return NextResponse.json({ error: "Invalid webhook signature" }, { status: 401 })
    }

    // Process different webhook event types
    switch (body.event_type) {
      case "PAYMENT.CAPTURE.COMPLETED":
        // Handle successful payment
        console.log("Payment completed:", body.resource.id)
        // Update order status in your database
        // Send confirmation email to customer
        break
      case "PAYMENT.CAPTURE.DENIED":
        // Handle denied payment
        console.log("Payment denied:", body.resource.id)
        // Update order status in your database
        break
      // Handle other event types as needed
    }

    return NextResponse.json({ status: "success" })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

// Add webhook signature verification function
async function verifyWebhookSignature(request) {
  try {
    const body = await request.text()
    const paypalSignature = request.headers.get("paypal-transmission-sig") || ""
    const paypalCertUrl = request.headers.get("paypal-cert-url") || ""
    const paypalTransmissionId = request.headers.get("paypal-transmission-id") || ""
    const paypalTransmissionTime = request.headers.get("paypal-transmission-time") || ""

    if (!paypalSignature || !paypalCertUrl || !paypalTransmissionId || !paypalTransmissionTime) {
      console.error("Missing required PayPal webhook headers")
      return { verified: false, error: "Missing required headers" }
    }

    // Verify the webhook signature using PayPal's API
    const verificationResponse = await fetch(
      `${process.env.PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`,
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          transmission_id: paypalTransmissionId,
          transmission_time: paypalTransmissionTime,
          cert_url: paypalCertUrl,
          auth_algo: "SHA256withRSA",
          transmission_sig: paypalSignature,
          webhook_id: process.env.PAYPAL_WEBHOOK_ID,
          webhook_event: JSON.parse(body),
        }),
      },
    )

    if (!verificationResponse.ok) {
      console.error("PayPal verification API error:", await verificationResponse.text())
      return { verified: false, error: "Verification API error" }
    }

    const verification = await verificationResponse.json()
    return {
      verified: verification.verification_status === "SUCCESS",
      body: JSON.parse(body),
      error: verification.verification_status !== "SUCCESS" ? "Invalid signature" : null,
    }
  } catch (error) {
    console.error("Webhook verification error:", error)
    return { verified: false, error: error.message }
  }
}
