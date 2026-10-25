"use client";

import Link from "next/link";
import { useIsMobile } from "../hooks/useIsMobile";

export default function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer
      style={{
        marginTop: "40px",
        background: "#111",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "32px 20px 24px" : "44px 40px 28px",
        }}
      >
        {/* TOP ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexDirection: isMobile ? "column" : "row",
            gap: "32px",
            marginBottom: "32px",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: "280px" }}>
            <h3
              style={{
                fontSize: "22px",
                fontWeight: "900",
                color: "white",
                letterSpacing: "-0.5px",
                margin: "0 0 6px",
              }}
            >
              Router<span style={{ color: "#FEE12B" }}>Kart</span>
            </h3>
            <p
              style={{
                color: "#555",
                fontSize: "13px",
                margin: "0 0 16px",
                lineHeight: 1.6,
              }}
            >
              India&apos;s trusted source for networking gear — routers, fiber
              tools, security systems and more.
            </p>
            <a
              href="mailto:admin@routerkart.in"
              style={{
                color: "#FEE12B",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: "700",
              }}
            >
              admin@routerkart.in
            </a>
          </div>

          {/* Links grid */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? "24px" : "48px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  color: "white",
                  fontWeight: "800",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                }}
              >
                Shop
              </p>
              {[
                { label: "All Products", to: "/store" },
                { label: "Routers", to: "/store?category=Router" },
                { label: "Fiber Cables", to: "/store?category=Fiber+Cable" },
                { label: "Security", to: "/store?category=Security" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.to}
                  style={{
                    display: "block",
                    color: "#555",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#FEE12B")}
                  onMouseLeave={(e) => (e.target.style.color = "#555")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <p
                style={{
                  color: "white",
                  fontWeight: "800",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                }}
              >
                Company
              </p>
              {[
                { label: "About Us", to: "/about" },
                { label: "FAQs", to: "/faq" },
                { label: "Privacy Policy", to: "/privacy-policy" },
                { label: "Return Policy", to: "/return-policy" },
                { label: "Terms", to: "/terms" },
                { label: "Support", to: "/support" },
                { label: "Contact Us", to: "/contact" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.to}
                  style={{
                    display: "block",
                    color: "#555",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#FEE12B")}
                  onMouseLeave={(e) => (e.target.style.color = "#555")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <div>
              <p
                style={{
                  color: "white",
                  fontWeight: "800",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  margin: "0 0 12px",
                }}
              >
                Account
              </p>
              {[
                { label: "My Orders", to: "/orders" },
                { label: "My Profile", to: "/profile" },
                { label: "Wishlist", to: "/wishlist" },
                { label: "Cart", to: "/cart" },
              ].map((l) => (
                <Link
                  key={l.label}
                  href={l.to}
                  style={{
                    display: "block",
                    color: "#555",
                    textDecoration: "none",
                    fontSize: "13px",
                    fontWeight: "500",
                    marginBottom: "8px",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#FEE12B")}
                  onMouseLeave={(e) => (e.target.style.color = "#555")}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* TRUST BADGES */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            paddingBottom: "24px",
            borderBottom: "1px solid #1e1e1e",
          }}
        >
          {[
            "🚚 Free delivery on ₹499+",
            "🔒 Secure Razorpay checkout",
            "✅ Genuine products",
            "🔄 7-day returns",
            "💬 WhatsApp support",
          ].map((t, i) => (
            <span
              key={i}
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: "#444",
                padding: "5px 12px",
                borderRadius: "20px",
                border: "1px solid #222",
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* BOTTOM ROW */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: isMobile ? "column" : "row",
            gap: "12px",
            paddingTop: "20px",
          }}
        >
          <p style={{ color: "#333", fontSize: "12px", margin: 0 }}>
            © 2026 RouterKart. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Privacy Policy", to: "/privacy-policy" },
              { label: "Terms", to: "/terms" },
              { label: "Return Policy", to: "/return-policy" },
              { label: "Refund", to: "/refund" },
              { label: "Cancellation", to: "/cancellation" },
              { label: "FAQs", to: "/faq" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.to}
                style={{
                  color: "#333",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#FEE12B")}
                onMouseLeave={(e) => (e.target.style.color = "#333")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
