import Link from "next/link";

export default function Refund() {
  return (
    <div style={{ background: "#F7F7F5", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#111", padding: "32px 24px", borderBottom: "4px solid #FEE12B" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <Link href="/" style={{ color: "#FEE12B", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}>← RouterKart</Link>
          <h1 style={{ color: "white", fontSize: "32px", fontWeight: "900", margin: "12px 0 0" }}>Refund Policy</h1>
        </div>
      </div>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "32px", border: "1px solid #eee", lineHeight: "1.8" }}>
          <p>RouterKart accepts refund requests in the following cases:</p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li>Defective or damaged product</li>
            <li>Wrong product delivered</li>
          </ul>
          <p>Refunds are processed in 5–7 business days to the original payment method.</p>
          <div style={{ marginTop: "24px" }}>
            <Link href="/" style={{ padding: "10px 20px", background: "#FEE12B", color: "#111", fontWeight: "800", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
