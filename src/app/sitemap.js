const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://routerhub-backend.onrender.com/api";

export default async function sitemap() {
  const baseUrl = "https://routerkart.in";

  // Core static pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/return-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cancellation`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Fetch product items from backend API
  let productRoutes = [];
  try {
    const endpoint = API_BASE.endsWith("/api")
      ? `${API_BASE}/products`
      : `${API_BASE.replace(/\/$/, "")}/api/products`;

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const products = await res.json();
      if (Array.isArray(products)) {
        productRoutes = products
          .filter((p) => p && p._id && typeof p._id === "string")
          .map((p) => ({
            url: `${baseUrl}/product/${p._id}`,
            lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          }));
      }
    }
  } catch (err) {
    console.error("Failed to fetch products for sitemap:", err);
  }

  return [...staticRoutes, ...productRoutes];
}
