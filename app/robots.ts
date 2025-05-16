import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/secure-admin/", "/admin/"],
    },
    sitemap: "https://dessertprint.com/sitemap.xml",
  }
}
