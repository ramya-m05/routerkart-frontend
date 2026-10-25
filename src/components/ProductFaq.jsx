"use client";

import { useState } from "react";
import Link from "next/link";
import { useIsMobile } from "../hooks/useIsMobile";

export default function ProductFaq({ product }) {
  const isMobile = useIsMobile();
  const [openIdx, setOpenIdx] = useState(null);

  if (!product) return null;

  const productName = product.name || "Product";
  const category = product.category || "item";
  const isNew = product.condition?.toLowerCase() === "new";
  const inStock = (product.stock ?? 0) > 0;
  const deliveryDays = product.deliveryDays || 5;

  // Build factual, verified questions
  const faqs = [];

  // 1. Condition
  faqs.push({
    q: `Is this ${productName} brand new or refurbished?`,
    a: isNew
      ? `This ${productName} is in brand-new, unused condition in its original manufacturer packaging.`
      : `This ${productName} is certified refurbished. Every refurbished device is professionally tested, cleaned, and verified for full functionality by RouterKart technicians before dispatch.`,
  });

  // 2. Compatibility & Network
  faqs.push({
    q: `How do I know if this ${category} is compatible with my ISP or network?`,
    a: `Compatibility depends on your specific Internet Service Provider (such as Airtel, Jio, BSNL, ACT, or local ISP networks) and technical requirements (e.g. GPON, EPON, fiber mode, or Ethernet specifications). Please check the specifications listed above or contact RouterKart support on WhatsApp (+91 80739 19667) with your connection details for guidance before ordering.`,
  });

  // 3. Included Accessories
  faqs.push({
    q: "What accessories are included in the box?",
    a: "Standard box contents and accessories are outlined in the product specifications and description above. For confirmation on specific accessories (such as power adapters, mounting brackets, or fiber patch cables), please consult the listing or contact our support team.",
  });

  // 4. Warranty & Authenticity
  faqs.push({
    q: `What warranty coverage applies to this ${category}?`,
    a: isNew
      ? `RouterKart supplies 100% genuine products. For brand-new equipment, manufacturer warranty applies as provided by the brand. Please check the product description for specific warranty details, or reach out to support.`
      : `All refurbished units undergo rigorous multi-point testing to ensure full performance. Please consult the product listing details above or contact admin@routerkart.in for specific warranty or testing coverage applicable to this unit.`,
  });

  // 5. Stock & Delivery
  faqs.push({
    q: "When will this product be delivered, and is delivery free?",
    a: inStock
      ? `This product is currently in stock. Orders are typically delivered within ${deliveryDays} working days across India, with dispatch tracking details sent via email. RouterKart offers FREE delivery on orders ₹499 and above.`
      : `This product is currently out of stock. Please check back later or contact customer support to inquire about availability and restocking dates.`,
  });

  // 6. Return & Replacement
  let returnAnswer = "";
  if (product.returnEligible) {
    returnAnswer = `This product is eligible for return within ${
      product.returnWindowDays || 7
    } days of delivery${
      product.replacementEligible ? " and is also eligible for replacement" : ""
    }, provided it is in original condition with all packaging and accessories intact.`;
    if (product.policyNotes) {
      returnAnswer += ` ${product.policyNotes}`;
    }
  } else if (product.replacementEligible) {
    returnAnswer = `This product is eligible for replacement within ${
      product.returnWindowDays || 7
    } days of delivery in case of verified transit damage or defect.`;
    if (product.policyNotes) {
      returnAnswer += ` ${product.policyNotes}`;
    }
  } else if (product.policyNotes) {
    returnAnswer = product.policyNotes;
  } else {
    returnAnswer =
      "Standard return and replacement eligibility depends on the item category and condition. Please refer to our Return Policy or contact support at admin@routerkart.in / WhatsApp for specific return questions regarding this listing.";
  }

  faqs.push({
    q: "What is the return or replacement policy for this product?",
    a: returnAnswer,
  });

  // 7. Payment & COD
  faqs.push({
    q: "Is Cash on Delivery (COD) available for this product?",
    a: product.advancePayment
      ? `Yes, Cash on Delivery is available with a required advance of ₹${
          product.advanceAmount || 150
        } paid online at checkout to confirm the order, with the remaining balance collected upon delivery.`
      : "Yes, Cash on Delivery is available for most locations across India with a ₹150 advance paid at checkout to confirm the order, with the remaining balance payable upon delivery.",
  });

  return (
    <div
      style={{
        background: "white",
        borderRadius: "16px",
        padding: isMobile ? "20px 16px" : "28px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: "1px solid #ececec",
        marginBottom: "24px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "18px",
          paddingBottom: "14px",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "10px",
              fontWeight: "700",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#aaa",
              margin: "0 0 4px",
            }}
          >
            Questions & Answers
          </p>
          <h2
            style={{
              fontWeight: "900",
              fontSize: isMobile ? "18px" : "22px",
              color: "#111",
              margin: 0,
              letterSpacing: "-0.5px",
            }}
          >
            Frequently Asked Questions
          </h2>
        </div>
        <Link
          href="/faq"
          style={{
            fontSize: "13px",
            fontWeight: "700",
            color: "#111",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            padding: "6px 12px",
            borderRadius: "6px",
            background: "#FFF9E6",
            border: "1px solid #FEE12B",
          }}
        >
          View all store FAQs →
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          const buttonId = `prod-faq-btn-${i}`;
          const panelId = `prod-faq-panel-${i}`;

          return (
            <div
              key={i}
              style={{
                borderRadius: "10px",
                border: `1px solid ${isOpen ? "#FEE12B" : "#eee"}`,
                background: isOpen ? "#FFFDF5" : "#fafafa",
                overflow: "hidden",
                transition: "all 0.15s ease",
              }}
            >
              <button
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIdx(isOpen ? null : i)}
                style={{
                  width: "100%",
                  padding: isMobile ? "14px 14px" : "16px 18px",
                  background: "transparent",
                  border: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span
                  style={{
                    fontWeight: "700",
                    fontSize: isMobile ? "13px" : "14px",
                    color: "#111",
                    flex: 1,
                    lineHeight: 1.4,
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
                      ? "0 14px 14px"
                      : "0 18px 16px",
                    borderTop: "1px solid #f0f0f0",
                  }}
                >
                  <p
                    style={{
                      fontSize: isMobile ? "13px" : "14px",
                      color: "#555",
                      lineHeight: "1.75",
                      margin: "12px 0 0",
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
    </div>
  );
}
