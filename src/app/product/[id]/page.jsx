import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://routerhub-backend.onrender.com/api";

async function getProduct(id) {
  if (!id || typeof id !== "string") return null;

  try {
    const endpoint = API_BASE.endsWith("/api")
      ? `${API_BASE}/products/${id}`
      : `${API_BASE.replace(/\/$/, "")}/api/products/${id}`;

    const res = await fetch(endpoint, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching product for metadata:", err);
    return null;
  }
}

function getProductCondition(product) {
  const rawCondition = product?.condition?.trim().toLowerCase();
  if (rawCondition === "new") return "new";
  if (rawCondition === "refurbished") return "refurbished";
  if (product?.name?.toLowerCase().includes("refurbished")) return "refurbished";
  return null;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested networking product could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const condition = getProductCondition(product);

  const cleanDesc = product.description
    ? product.description
        .replace(/<[^>]*>?/gm, "")
        .replace(/[\r\n]+/gm, " ")
        .slice(0, 160)
        .trim()
    : condition === "refurbished"
    ? `Buy refurbished ${product.name} at RouterKart. Quality refurbished networking equipment with pan-India delivery.`
    : `Buy ${product.name} at RouterKart. Networking hardware and accessories with pan-India delivery.`;

  const primaryImage =
    (Array.isArray(product.images) && product.images[0]) ||
    product.image ||
    "/ROUTERKART_logo2.png";

  return {
    title: `${product.name} | Buy Online`,
    description: cleanDesc,
    alternates: {
      canonical: `/product/${product._id}`,
    },
    openGraph: {
      title: `${product.name} | RouterKart`,
      description: cleanDesc,
      url: `https://routerkart.in/product/${product._id}`,
      siteName: "RouterKart",
      images: [
        {
          url: primaryImage,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | RouterKart`,
      description: cleanDesc,
      images: [primaryImage],
    },
  };
}

export default async function ProductPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const condition = getProductCondition(product);
  let itemCondition;
  if (condition === "new") {
    itemCondition = "https://schema.org/NewCondition";
  } else if (condition === "refurbished") {
    itemCondition = "https://schema.org/RefurbishedCondition";
  }

  // Schema.org structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: Array.isArray(product.images) && product.images.length
      ? product.images
      : [product.image || "https://routerkart.in/ROUTERKART_logo2.png"],
    description: product.description
      ? product.description.replace(/<[^>]*>?/gm, "").replace(/[\r\n]+/gm, " ").trim()
      : product.name,
    sku: product.sku || product._id,
    brand: {
      "@type": "Brand",
      name: product.brand || "RouterKart",
    },
    offers: {
      "@type": "Offer",
      url: `https://routerkart.in/product/${product._id}`,
      priceCurrency: "INR",
      price: product.price,
      ...(itemCondition ? { itemCondition } : {}),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "RouterKart",
      },
    },
  };

  const safeJsonLdString = JSON.stringify(jsonLd).replace(
    /</g,
    "\\u003c"
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdString, }}
      />
      <ProductClient initialProduct={product} />
    </>
  );
}
