/**
 * Environment Variable Validation Utility
 * 
 * This utility ensures all required environment variables are properly set
 * before the application runs in production environments.
 */

type EnvVar = {
  name: string
  required: boolean
  description: string
}

const requiredEnvVars: EnvVar[] = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    required: true,
    description: "Supabase project URL",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    required: true,
    description: "Supabase anonymous key for client-side operations",
  },
  {
    name: "SUPABASE_SERVICE_ROLE_KEY",
    required: true,
    description: "Supabase service role key for admin operations (server-side only)",
  },
  {
    name: "NEXT_PUBLIC_APP_URL",
    required: true,
    description: "Public URL of the application",
  },
  {
    name: "PAYPAL_CLIENT_ID",
    required: true,
    description: "PayPal API client ID",
  },
  {
    name: "PAYPAL_CLIENT_SECRET",
    required: true,
    description: "PayPal API client secret",
  },
  {
    name: "PAYPAL_API_URL",
    required: true,
    description: "PayPal API URL (sandbox or production)",
  },
  {
    name: "PAYPAL_WEBHOOK_ID",
    required: false,
    description: "PayPal webhook ID for order notifications",
  },
  {
    name: "MAILERLITE_API_KEY",
    required: false,
    description: "MailerLite API key for newsletter functionality",
  },
  {
    name: "MAPBOX_ACCESS_TOKEN",
    required: false,
    description: "Mapbox access token for location services",
  },
]

/**
 * Validates that all required environment variables are set
 * @returns Object containing validation result and any missing variables
 */
export function validateEnv() {
  const isProd = process.env.NODE_ENV === "production"
  const missingVars: string[] = []

  // Only perform strict validation in production
  if (isProd) {
    requiredEnvVars.forEach((envVar) => {
      if (envVar.required && !process.env[envVar.name]) {
        missingVars.push(`${envVar.name} (${envVar.description})`)
      }
    })
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
  }
}

/**
 * Validates environment variables and throws an error if any required ones are missing in production
 * This should be called during app initialization
 */
export function validateEnvOrThrow() {
  const { isValid, missingVars } = validateEnv()

  if (!isValid) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join("\n")}\n\nPlease check your .env file and ensure all required variables are set.`
    )
  }
}