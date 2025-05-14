import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/secure-admin/", "/api/"],
    },
    sitemap: "https://dessertprint.com/sitemap.xml",
  }
}
