"use client";

import Link from "next/link";
import { useIsMobile } from "../../hooks/useIsMobile";

const ReturnPolicy = () => {
  const isMobile = useIsMobile();

  return (
    <div style={{ background: "#F7F7F5", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#111", padding: isMobile ? "24px 20px 20px" : "44px 40px 32px", borderBottom: "4px solid #FEE12B" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <Link href="/" style={{ color: "#FEE12B", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}>← RouterKart</Link>
          <h1 style={{ color: "white", fontSize: isMobile ? "32px" : "clamp(32px,5vw,52px)", fontWeight: "900", letterSpacing: "-1.5px", margin: "12px 0 6px" }}>Return & Refund Policy</h1>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: isMobile ? "28px 20px 60px" : "48px 40px 80px" }}>
        <InfoBox>
          We offer a 7-day hassle-free return policy on all products. Please read the conditions below to ensure a smooth return process.
        </InfoBox>

        <Section title="Eligibility for Returns">
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "8px" }}>Item must be unused and in original condition</li>
            <li style={{ marginBottom: "8px" }}>Item must be returned with all accessories and original packaging</li>
            <li>Return request must be raised within 7 days of delivery</li>
          </ul>
        </Section>

        <Section title="Refund Process">
          <p>
            Once we receive and inspect the returned product, your refund will be processed within 5–7 business days. Refunds will be credited to the original payment method used during purchase.
          </p>
        </Section>

        <Section title="Non-Returnable Items">
          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "8px" }}>Products damaged due to misuse</li>
            <li>Items returned without original packaging or accessories</li>
          </ul>
        </Section>

        <Section title="Contact Us">
          <p>If you have any questions regarding your return, please reach out to us:</p>
          <ContactCard />
        </Section>

        <BackToHome />
      </div>
    </div>
  );
};

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <h2 style={{ fontSize: "19px", fontWeight: "900", color: "#111", margin: "0 0 12px", paddingBottom: "9px", borderBottom: "2px solid #FEE12B", display: "inline-block" }}>{title}</h2>
      <div style={{ fontSize: "14px", color: "#555", lineHeight: "1.85" }}>{children}</div>
    </div>
  );
}

function InfoBox({ children }) {
  return (
    <div style={{ background: "#FFF9E6", border: "2px solid #FEE12B", borderRadius: "10px", padding: "14px 18px", marginBottom: "28px", fontSize: "13px", color: "#555", fontWeight: "600", lineHeight: 1.6 }}>
      ℹ️ {children}
    </div>
  );
}

function ContactCard() {
  return (
    <div style={{ background: "#111", borderRadius: "10px", padding: "20px 24px", marginTop: "10px" }}>
      <p style={{ color: "white", fontWeight: "900", fontSize: "16px", margin: "0 0 10px" }}>Router<span style={{ color: "#FEE12B" }}>Kart</span></p>
      <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 4px" }}>📧 <a href="mailto:admin@routerkart.in" style={{ color: "#FEE12B", textDecoration: "none" }}>admin@routerkart.in</a></p>
      <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 4px" }}>🌐 <a href="https://routerkart.in" target="_blank" rel="noopener noreferrer" style={{ color: "#FEE12B", textDecoration: "none" }}>routerkart.in</a></p>
      <p style={{ color: "#aaa", fontSize: "13px", margin: "0 0 4px" }}>📍 #132, Ramanna Garden, New Mission Road, O T C Road, Chamaraj Pet, Bangalore South, Wilson Garden, Bangalore, Karnataka - 560027</p>
      <p style={{ color: "#aaa", fontSize: "13px", margin: 0 }}>📞 +91 80739 19667</p>
    </div>
  );
}

function BackToHome() {
  return (
    <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "8px" }}>
      <Link href="/" style={{ display: "inline-block", padding: "12px 24px", background: "#FEE12B", color: "#111", textDecoration: "none", fontWeight: "800", borderRadius: "8px", fontSize: "14px" }}>← Back to Home</Link>
    </div>
  );
}

export default ReturnPolicy;
