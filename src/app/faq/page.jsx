"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { useIsMobile } from "../../hooks/useIsMobile";
import Footer from "../../components/Footer";

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "products", label: "Products" },
  { id: "orders", label: "Orders & Payments" },
  { id: "shipping", label: "Shipping & Delivery" },
  { id: "returns", label: "Returns & Refunds" },
  { id: "support", label: "Support & Account" },
];

const FAQ_DATA = [
  // ─── Products ───
  {
    category: "products",
    q: "Are RouterKart products brand new or refurbished?",
    a: "RouterKart specializes exclusively in refurbished networking equipment, including routers, ONTs, optical tools, and related accessories. We do not sell brand-new products. Please check each product page for its specific condition and details.",
  },
  {
    category: "products",
    q: "Are the networking products sold on RouterKart genuine?",
    a: "RouterKart offers refurbished networking products and related accessories. For details about a product's brand, model, condition, and specifications, please refer to its individual product page or contact our support team before purchasing.",
  },
  {
    category: "products",
    q: "Are refurbished products tested before dispatch?",
    a: "RouterKart offers refurbished networking equipment. Please refer to the individual product listing for condition details and available product information. Contact our support team if you need clarification about a specific item's condition before placing an order.",
  },
  {
    category: "products",
    q: "Do refurbished products come with a warranty?",
    a: "Warranty coverage may vary by product. Please check the individual product description for applicable warranty details or contact our support team before placing your order.",
  },
  {
    category: "products",
    q: "How can I verify if a router or ONT is compatible with my ISP?",
    a: "Compatibility depends on your internet service provider and network requirements, such as GPON, EPON, XPON, or Ethernet. Review the technical specifications on the product page, or contact us on WhatsApp at +91 80739 19667 with your ISP and connection details before purchasing.",
  },
  {
    category: "products",
    q: "What accessories are included with my product?",
    a: "Included accessories, such as power adapters or patch cords, depend on the individual product. Please check the product description for the listed box contents. Contact our support team if you need confirmation about a specific accessory before ordering.",
  },

  // ─── Orders & Payments ───
  {
    category: "orders",
    q: "What payment methods do you accept?",
    a: "RouterKart supports payment methods available through its checkout, which may include UPI, debit cards, credit cards, net banking, and Cash on Delivery (COD) for eligible orders. The payment options available to you will be displayed during checkout.",
  },
  {
    category: "orders",
    q: "How does Cash on Delivery (COD) work?",
    a: "Cash on Delivery is available on eligible orders. If you select COD at checkout, you must pay an advance amount before your order can be processed. The advance amount may vary depending on the order, and the applicable amount will be displayed during checkout. The remaining balance is payable upon delivery.",
  },
  {
    category: "orders",
    q: "How do I know my order is confirmed?",
    a: "After your order is successfully placed, you will see an order confirmation with your Order ID. A confirmation email may also be sent to your registered email address. You can check your order status from the My Orders section of your account.",
  },
  {
    category: "orders",
    q: "Can I cancel my order after placing it?",
    a: "Orders can be cancelled before dispatch by contacting customer support at admin@routerkart.in or through WhatsApp at +91 80739 19667. Once an order has been dispatched, cancellation may no longer be possible. Please contact support for guidance on the applicable return policy after delivery.",
  },
  {
    category: "orders",
    q: "Can I modify my shipping address after placing an order?",
    a: "Address changes may be possible before your order is handed over to the shipping courier. Contact us as soon as possible through WhatsApp or email at admin@routerkart.in, and include your Order ID and corrected address.",
  },

  // ─── Shipping & Delivery ───
  {
    category: "shipping",
    q: "Do you offer free shipping?",
    a: "RouterKart offers free standard delivery across India on orders of ₹499 and above. Orders below ₹499 may incur a delivery fee, which will be shown during checkout.",
  },
  {
    category: "shipping",
    q: "How long does shipping and delivery take?",
    a: "Standard delivery typically takes 3 to 7 working days, depending on your delivery pincode and location. Check your product page and dispatch confirmation for any available delivery estimates.",
  },
  {
    category: "shipping",
    q: "How do I track my shipment?",
    a: "After your order is dispatched, check your registered email and the My Orders section of your account for available shipment and tracking information.",
  },
  {
    category: "shipping",
    q: "Do you ship internationally outside India?",
    a: "RouterKart currently delivers to addresses within India and does not offer international shipping.",
  },

  // ─── Returns & Refunds ───
  {
    category: "returns",
    q: "What is your return policy?",
    a: "RouterKart offers a 7-day return window on eligible products. Return requests must be initiated within 7 days of delivery. Eligible items must meet the conditions in our return policy, including requirements for original condition, packaging, accessories, and documentation.",
  },
  {
    category: "returns",
    q: "Which products or situations are not eligible for return?",
    a: "Returns may be declined for products damaged due to misuse, physical impact, electrical surges, or improper installation, and for items returned without required original packaging, serial tags, or included accessories. Please review the full return policy for the applicable conditions.",
  },
  {
    category: "returns",
    q: "How do I initiate a return or replacement?",
    a: "To request a return or report a product that arrived damaged or defective, contact admin@routerkart.in or WhatsApp +91 80739 19667 within 7 days of delivery. Include your Order ID and clear photos or videos showing the issue. Eligibility is subject to the applicable return and replacement policy.",
  },
  {
    category: "returns",
    q: "How long does it take to receive a refund?",
    a: "After a returned item reaches our facility and passes inspection, eligible refunds are processed within 5 to 7 business days to the original payment method, subject to the applicable refund policy and payment provider processing.",
  },

  // ─── Support & Account ───
  {
    category: "support",
    q: "How can I contact RouterKart customer support?",
    a: "You can contact RouterKart through WhatsApp at +91 80739 19667 or email admin@routerkart.in. Our typical response time is 24 to 48 business hours.",
  },
  {
    category: "support",
    q: "Where is RouterKart located?",
    a: "RouterKart's registered office is listed at #132, Ramanna Garden, New Mission Road, O T C Road, Chamaraj Pet, Bangalore South, Wilson Garden, Bangalore, Karnataka - 560027.",
  },
  {
    category: "support",
    q: "How do I reset my account password?",
    a: "Go to the Login page and select Forgot Password. Follow the instructions shown to reset your password using the account recovery method available on the website.",
  },
];
export default function FaqPage() {
  const isMobile = useIsMobile();
  const [selectedCat, setSelectedCat] = useState("all");
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState(null);
  const baseId = useId();

  // Filter FAQs by category and search
  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchCategory =
      selectedCat === "all" || item.category === selectedCat;
    const matchQuery =
      search.trim() === "" ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchQuery;
  });

  // Schema.org FAQPage structured data that matches the visible FAQs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_DATA.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const safeJsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <div
      style={{
        background: "#F7F7F5",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Semantic Schema.org FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdString }}
      />

      {/* HEADER */}
      <header
        style={{
          background: "#111",
          padding: isMobile ? "24px 20px 20px" : "44px 40px 32px",
          borderBottom: "4px solid #FEE12B",
        }}
      >
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <Link
            href="/"
            style={{
              color: "#FEE12B",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            ← RouterKart
          </Link>
          <h1
            style={{
              color: "white",
              fontSize: isMobile ? "28px" : "clamp(32px, 5vw, 48px)",
              fontWeight: "900",
              letterSpacing: "-1.5px",
              margin: "12px 0 6px",
            }}
          >
            Frequently Asked Questions
          </h1>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
            Everything you need to know about our products, shipping, warranty,
            and returns
          </p>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: isMobile ? "24px 16px 40px" : "40px 24px 60px",
        }}
      >
        {/* SEARCH BAR */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "2px solid #e0e0e0",
            borderRadius: "12px",
            padding: "0 16px",
            background: "white",
            marginBottom: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
            transition: "border-color 0.2s",
          }}
        >
          <span
            aria-hidden="true"
            style={{ fontSize: "18px", color: "#888" }}
          >
            🔍
          </span>
          <input
            type="search"
            aria-label="Search frequently asked questions"
            placeholder="Search questions (e.g., return, delivery, refurbished, COD)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpenIdx(null);
            }}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              padding: "14px 0",
              fontSize: "14px",
              color: "#111",
              background: "transparent",
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
          {search && (
            <button
              type="button"
              aria-label="Clear search query"
              onClick={() => {
                setSearch("");
                setOpenIdx(null);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#888",
                fontSize: "18px",
                padding: "4px",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* CATEGORY TABS */}
        <div
          role="tablist"
          aria-label="FAQ Categories"
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "12px",
            marginBottom: "24px",
            scrollbarWidth: "none",
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setSelectedCat(cat.id);
                  setOpenIdx(null);
                }}
                style={{
                  padding: "8px 16px",
                  borderRadius: "20px",
                  border: isActive
                    ? "2px solid #111"
                    : "1px solid #dcdcdc",
                  background: isActive ? "#111" : "white",
                  color: isActive ? "#FEE12B" : "#444",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.15s ease",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ ACCORDION LIST */}
        <section aria-label="Questions and answers">
          {filteredFaqs.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                background: "white",
                borderRadius: "12px",
                border: "1px solid #eee",
              }}
            >
              <p style={{ fontSize: "32px", margin: "0 0 10px" }}>🔍</p>
              <h3
                style={{
                  fontWeight: "800",
                  color: "#111",
                  fontSize: "16px",
                  margin: "0 0 6px",
                }}
              >
                No matching questions found
              </h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "13px",
                  margin: "0 0 16px",
                }}
              >
                Try searching for different keywords, or check a different
                category.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCat("all");
                }}
                style={{
                  padding: "8px 16px",
                  background: "#111",
                  color: "#FEE12B",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: "700",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {filteredFaqs.map((faq, i) => {
                const isOpen = openIdx === i;
                const buttonId = `${baseId}-faq-btn-${i}`;
                const panelId = `${baseId}-faq-panel-${i}`;

                return (
                  <div
                    key={i}
                    style={{
                      background: "white",
                      borderRadius: "10px",
                      border: `1px solid ${
                        isOpen ? "#FEE12B" : "#e5e5e5"
                      }`,
                      boxShadow: isOpen
                        ? "0 4px 16px rgba(0,0,0,0.05)"
                        : "0 1px 3px rgba(0,0,0,0.02)",
                      overflow: "hidden",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                  >
                    <button
                      id={buttonId}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpenIdx(isOpen ? null : i)}
                      style={{
                        width: "100%",
                        padding: isMobile
                          ? "14px 16px"
                          : "18px 20px",
                        background: isOpen ? "#FFFDF5" : "transparent",
                        border: "none",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "14px",
                        cursor: "pointer",
                        textAlign: "left",
                        fontFamily: "'DM Sans', sans-serif",
                        transition: "background 0.15s",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "800",
                          fontSize: isMobile ? "14px" : "15px",
                          color: "#111",
                          flex: 1,
                          lineHeight: 1.45,
                        }}
                      >
                        {faq.q}
                      </span>
                      <span
                        aria-hidden="true"
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: isOpen ? "#111" : "#aaa",
                          flexShrink: 0,
                          lineHeight: 1,
                          transition: "transform 0.2s ease",
                          transform: isOpen ? "rotate(45deg)" : "none",
                        }}
                      >
                        +
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        style={{
                          padding: isMobile
                            ? "0 16px 16px"
                            : "0 20px 20px",
                          borderTop: "1px solid #f2f2f2",
                          background: "#FFFDF5",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            color: "#555",
                            lineHeight: "1.8",
                            margin: "14px 0 0",
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* STILL HAVE QUESTIONS CARD */}
        <div
          style={{
            marginTop: "36px",
            background: "white",
            borderRadius: "14px",
            padding: isMobile ? "20px 16px" : "28px",
            border: "1px solid #e0e0e0",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "flex-start" : "center",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "900",
                color: "#111",
                margin: "0 0 6px",
              }}
            >
              Still have questions?
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "#666",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              Can&apos;t find what you are looking for? Contact our customer
              support team on WhatsApp or email.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <a
              href="https://wa.me/918073919667?text=Hi%20RouterKart,%20I%20have%20a%20question%20about%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 18px",
                background: "#25D366",
                color: "white",
                textDecoration: "none",
                fontWeight: "800",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              💬 WhatsApp Us
            </a>
            <a
              href="mailto:admin@routerkart.in"
              style={{
                display: "inline-block",
                padding: "10px 18px",
                background: "#111",
                color: "white",
                textDecoration: "none",
                fontWeight: "800",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            >
              📧 Email Support
            </a>
          </div>
        </div>

        {/* BACK TO HOME NAVIGATION */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "24px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "11px 20px",
              background: "#FEE12B",
              color: "#111",
              textDecoration: "none",
              fontWeight: "800",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            ← Back to Home
          </Link>
          <Link
            href="/store"
            style={{
              display: "inline-block",
              padding: "11px 20px",
              background: "#111",
              color: "white",
              textDecoration: "none",
              fontWeight: "800",
              borderRadius: "8px",
              fontSize: "13px",
            }}
          >
            Explore Store →
          </Link>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
