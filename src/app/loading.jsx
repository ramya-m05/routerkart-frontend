export default function Loading() {
  return (
    <div
      style={{
        background: "#F7F7F5",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "4px solid #eee",
          borderTop: "4px solid #FEE12B",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ color: "#aaa", fontSize: "14px" }}>Loading RouterKart...</p>
    </div>
  );
}
