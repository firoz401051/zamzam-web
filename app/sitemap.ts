import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://zamzamfashionstore.in";

  const routes = [
    "",
    "/about",
    "/contact",
    "/discount",
    "/faq",
    "/faqs",
    "/help",
    "/location",
    "/privacy",
    "/returns",
    "/terms",
    "/blog",
    "/brands",
    "/category",
    "/products",
    "/deal",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}