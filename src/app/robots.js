export default function robots() {
  const baseUrl = "https://routerkart.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/store",
          "/product/",
          "/about",
          "/contact",
          "/support",
          "/terms",
          "/privacy-policy",
          "/return-policy",
          "/cancellation",
          "/refund",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/cart",
          "/checkout",
          "/checkout/*",
          "/profile",
          "/profile/*",
          "/orders",
          "/orders/*",
          "/order-history",
          "/order-history/*",
          "/forgot-password",
          "/login",
          "/signup",
          "/wishlist",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
