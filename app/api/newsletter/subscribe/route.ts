import { NextResponse } from "next/server"
import { addSubscriber } from "@/lib/mailerlite"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Add to MailerLite
    try {
      const name = firstName && lastName ? `${firstName} ${lastName}` : firstName || ""
      await addSubscriber(email, name, { firstName, lastName })
    } catch (error: any) {
      console.error("MailerLite API error:", error)
      // Continue even if MailerLite fails, we'll still save to our database
    }

    // Save to our database
    const { data, error } = await supabase.from("subscribers").insert([
      {
        email,
        first_name: firstName || null,
      },
    ])

    if (error) {
      if (error.code === "23505") {
        // Unique violation
        return NextResponse.json({ message: "You are already subscribed!" }, { status: 200 })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to our newsletter!",
    })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe to newsletter" }, { status: 500 })
  }
}
