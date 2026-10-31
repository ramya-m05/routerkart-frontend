import "./globals.css";
import Providers from "./providers";
import WhatsAppButton from "../components/WhatsAppButton";
import Script from "next/script";

export const metadata = {
  metadataBase: new URL("https://routerkart.in"),
  title: {
    default: "RouterKart | Buy Refurbished Routers & Networking Equipment Online",
    template: "%s | RouterKart",
  },
  description:
    "India's trusted source for refurbished networking gear — GPON routers, fiber tools, security systems and accessories.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "RouterKart | Buy Refurbished Routers & Networking Equipment Online",
    description:
      "India's trusted source for refurbished networking gear — GPON routers, fiber tools, security systems and accessories.",
    url: "https://routerkart.in",
    siteName: "RouterKart",
    images: [
      {
        url: "/ROUTERKART_logo2.png",
        width: 800,
        height: 600,
        alt: "RouterKart Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RouterKart | Buy Refurbished Routers & Networking Equipment Online",
    description:
      "India's trusted source for refurbished networking gear — GPON routers, fiber tools, security systems and accessories.",
    images: ["/ROUTERKART_logo2.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "RouterKart",
    url: "https://routerkart.in",
    logo: "https://routerkart.in/ROUTERKART_logo2.png",
    description:
      "India's trusted source for refurbished networking gear — GPON routers, fiber tools, security systems and accessories.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "#132, Ramanna Garden, New Mission Road, O T C Road",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      postalCode: "560027",
      addressCountry: "IN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+91-80739-19667",
        contactType: "customer service",
        areaServed: "IN",
      },
    ],
    email: "admin@routerkart.in",
    sameAs: [],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "RouterKart",
    url: "https://routerkart.in",
  };

  const safeOrgJsonLd = JSON.stringify(organizationJsonLd).replace(
    /</g,
    "\\u003c"
  );
  const safeWebsiteJsonLd = JSON.stringify(websiteJsonLd).replace(
    /</g,
    "\\u003c"
  );

  return (
    <html lang="en-IN">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeOrgJsonLd }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeWebsiteJsonLd }}
        />
      </head>
      <body>
        <Providers>
          {children}
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
