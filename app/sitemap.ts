import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dessertprint.com"

  // Static routes
  const routes = [
    "",
    "/shop",
    "/shop/occasions",
    "/about",
    "/contact",
    "/blog",
    "/policies",
    "/customization-suite",
    "/knowledge-base",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  return routes
}
