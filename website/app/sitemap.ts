import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/chrome-tab-preview-extension", "/find-lost-chrome-tab", "/onetab-alternative", "/workona-alternative", "/tab-manager-plus-alternative", "/privacy", "/changelog", "/support"];
  return routes.map((route, index) => ({
    url: `https://tab.show${route}`,
    lastModified: new Date("2026-07-22T00:00:00.000Z"),
    changeFrequency: index === 0 ? "weekly" : route === "/changelog" ? "weekly" : "monthly",
    priority: index === 0 ? 1 : route.includes("alternative") ? 0.7 : 0.8,
  }));
}
