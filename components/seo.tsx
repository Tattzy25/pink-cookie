import Head from "next/head"

interface SEOProps {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  keywords?: string
  author?: string
  structuredData?: Record<string, any>
  noIndex?: boolean
}

export default function SEO({
  title = "Custom Edible Image Printing on Cookies & Chocolates",
  description = "Premium custom edible image printing on cookies and chocolate bars. Perfect for birthdays, weddings, corporate events, and special occasions.",
  canonical = "https://dessertprint.com",
  ogImage = "/images/dessert-print-og-image.png",
  ogType = "website",
  keywords = "custom cookies, edible printing, custom chocolate, personalized desserts, edible images, custom treats",
  author = "Dessert Print Inc",
  structuredData,
  noIndex = false,
}: SEOProps) {
  const siteTitle = title.includes("Dessert Print") ? title : `${title} | Dessert Print`

  return (
    <Head>
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonical} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Dessert Print" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Favicon */}
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </Head>
  )
}
