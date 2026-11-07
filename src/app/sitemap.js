const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://routerhub-backend.onrender.com/api";

export default async function sitemap() {
  const baseUrl = "https://routerkart.in";

  // Core static pages (lastModified omitted because static content has no verifiable database timestamp)
  const staticRoutes = [
    {
      url: baseUrl,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/store`,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/support`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/return-policy`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/cancellation`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund`,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${baseUrl}/faq`,
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
          .map((p) => {
            const entry = {
              url: `${baseUrl}/product/${p._id}`,
              changeFrequency: "weekly",
              priority: 0.8,
            };
            if (p.updatedAt) {
              entry.lastModified = new Date(p.updatedAt);
            } else if (p.createdAt) {
              entry.lastModified = new Date(p.createdAt);
            }
            return entry;
          });
      }
    }
  } catch (err) {
    console.error("Failed to fetch products for sitemap:", err);
  }

  return [...staticRoutes, ...productRoutes];
}
