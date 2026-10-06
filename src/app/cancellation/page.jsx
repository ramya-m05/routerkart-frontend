import Link from "next/link";

export default function Cancellation() {
  return (
    <div style={{ background: "#F7F7F5", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#111", padding: "32px 24px", borderBottom: "4px solid #FEE12B" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <Link href="/" style={{ color: "#FEE12B", textDecoration: "none", fontSize: "13px", fontWeight: "700" }}>← RouterKart</Link>
          <h1 style={{ color: "white", fontSize: "32px", fontWeight: "900", margin: "12px 0 0" }}>Cancellation Policy</h1>
        </div>
      </div>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ background: "white", borderRadius: "12px", padding: "32px", border: "1px solid #eee", lineHeight: "1.8" }}>
          <p>Orders can be cancelled before shipping by contacting customer support.</p>
          <p>Once shipped, cancellation is not possible. You may initiate a return after delivery.</p>
          <p>Refunds for cancelled orders are processed in 5–7 business days.</p>
          <div style={{ marginTop: "24px" }}>
            <Link href="/" style={{ padding: "10px 20px", background: "#FEE12B", color: "#111", fontWeight: "800", borderRadius: "8px", textDecoration: "none", display: "inline-block" }}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
