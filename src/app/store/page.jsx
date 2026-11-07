import StoreClient from "./StoreClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://routerhub-backend.onrender.com/api";

async function getProducts() {
  try {
    const endpoint = API_BASE.endsWith("/api")
      ? `${API_BASE}/products`
      : `${API_BASE.replace(/\/$/, "")}/api/products`;

    const res = await fetch(endpoint, {
      next: { revalidate: 60, tags: ["products"] },
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Server fetch products error on store page:", err);
    return [];
  }
}

export default async function StorePage() {
  const products = await getProducts();

  return <StoreClient initialProducts={products} />;
}
