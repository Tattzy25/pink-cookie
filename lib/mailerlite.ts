/**
 * MailerLite API Integration
 *
 * This file contains functions to interact with the MailerLite API
 * for newsletter subscriptions and email marketing.
 */

// Base URL for MailerLite API v2
const MAILERLITE_API_URL = "https://api.mailerlite.com/api/v2"
const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY

/**
 * Add a subscriber to MailerLite
 *
 * @param email - Subscriber's email address
 * @param name - Subscriber's name (optional)
 * @param fields - Additional fields (optional)
 * @returns Promise with the API response
 */
export async function addSubscriber(email: string, name?: string, fields?: Record<string, any>) {
  try {
    if (!MAILERLITE_API_KEY) {
      throw new Error("MailerLite API key is not defined")
    }

    const response = await fetch(`${MAILERLITE_API_URL}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
      },
      body: JSON.stringify({
        email,
        name,
        fields,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`MailerLite API error: ${errorData.error.message || "Unknown error"}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding subscriber to MailerLite:", error)
    throw error
  }
}

/**
 * Get subscriber information from MailerLite
 *
 * @param email - Subscriber's email address
 * @returns Promise with the subscriber data
 */
export async function getSubscriber(email: string) {
  try {
    if (!MAILERLITE_API_KEY) {
      throw new Error("MailerLite API key is not defined")
    }

    const response = await fetch(`${MAILERLITE_API_URL}/subscribers/${email}`, {
      headers: {
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
      },
    })

    if (response.status === 404) {
      return null // Subscriber not found
    }

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`MailerLite API error: ${errorData.error.message || "Unknown error"}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting subscriber from MailerLite:", error)
    throw error
  }
}

/**
 * Create a campaign in MailerLite
 *
 * @param subject - Email subject
 * @param content - HTML content of the email
 * @param groupIds - Array of group IDs to send to
 * @returns Promise with the campaign data
 */
export async function createCampaign(subject: string, content: string, groupIds: number[]) {
  try {
    if (!MAILERLITE_API_KEY) {
      throw new Error("MailerLite API key is not defined")
    }

    const response = await fetch(`${MAILERLITE_API_URL}/campaigns`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
      },
      body: JSON.stringify({
        subject,
        groups: groupIds,
        type: "regular",
        html: content,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`MailerLite API error: ${errorData.error.message || "Unknown error"}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating campaign in MailerLite:", error)
    throw error
  }
}

/**
 * Add a subscriber to a group in MailerLite
 *
 * @param email - Subscriber's email address
 * @param groupId - Group ID to add the subscriber to
 * @returns Promise with the API response
 */
export async function addSubscriberToGroup(email: string, groupId: number) {
  try {
    if (!MAILERLITE_API_KEY) {
      throw new Error("MailerLite API key is not defined")
    }

    const response = await fetch(`${MAILERLITE_API_URL}/groups/${groupId}/subscribers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-MailerLite-ApiKey": MAILERLITE_API_KEY,
      },
      body: JSON.stringify({
        email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`MailerLite API error: ${errorData.error.message || "Unknown error"}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error adding subscriber to group in MailerLite:", error)
    throw error
  }
}
