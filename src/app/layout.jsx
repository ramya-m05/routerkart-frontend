import "./globals.css";
import Providers from "./providers";
import WhatsAppButton from "../components/WhatsAppButton";
import Script from "next/script";

export const metadata = {
  title: "RouterKart | Buy Refurbished Routers & Networking Equipment Online",
  description: "India's trusted source for refurbished networking gear — GPON routers, fiber tools, security systems and accessories.",
  metadataBase: new URL("https://routerkart.in"),
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
