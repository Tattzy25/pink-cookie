import type React from "react"
import { ClientLayout } from "./clientLayout"

export const metadata = {
  title: {
    default: "Dessert Print Inc - Luxury Edible Image Printing",
    template: "%s | Dessert Print Inc",
  },
  description:
    "Indulge in the art of custom cookies and chocolate bars. Elevate your celebrations with our delicious and visually stunning treats.",
  keywords: [
    "custom cookies",
    "edible printing",
    "custom chocolate",
    "personalized desserts",
    "edible images",
    "custom treats",
    "birthday cookies",
    "wedding cookies",
    "corporate gifts",
  ],
  authors: [{ name: "Dessert Print Inc" }],
  creator: "Dessert Print Inc",
  publisher: "Dessert Print Inc",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dessertprint.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dessert Print Inc - Luxury Edible Image Printing",
    description:
      "Indulge in the art of custom cookies and chocolate bars. Elevate your celebrations with our delicious and visually stunning treats.",
    url: "https://dessertprint.com",
    siteName: "Dessert Print Inc",
    images: [
      {
        url: "/images/dessert-print-og-image.png",
        width: 1200,
        height: 630,
        alt: "Dessert Print Inc - Custom Edible Printing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Dessert Print Inc - Luxury Edible Image Printing",
    description:
      "Indulge in the art of custom cookies and chocolate bars. Elevate your celebrations with our delicious and visually stunning treats.",
    creator: "@dessertprint",
    images: ["/images/dessert-print-og-image.png"],
  },
  verification: {
    google: "google-site-verification-code", // Replace with your actual verification code
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'