import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        background: "#F7F7F5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "40px 20px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>😕</div>
        <h1
          style={{
            fontWeight: "900",
            fontSize: "28px",
            color: "#111",
            margin: "0 0 8px",
          }}
        >
          Page Not Found
        </h1>
        <p style={{ color: "#888", marginBottom: "24px", fontSize: "14px" }}>
          The page you are looking for does not exist or has moved.
        </p>
        <Link
          href="/store"
          style={{
            display: "inline-block",
            padding: "13px 28px",
            background: "#FEE12B",
            color: "#111",
            textDecoration: "none",
            fontWeight: "800",
            borderRadius: "8px",
            fontSize: "14px",
          }}
        >
          ← Go to Store
        </Link>
      </div>
    </div>
  );
}
