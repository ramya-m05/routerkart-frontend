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
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
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
