import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  page: {
    fontFamily: "'DM Sans', sans-serif",
    background: "#fff",
    color: "#111",
    minHeight: "100vh",
  },

  // ── Hero ──────────────────────────────────────────────
  hero: {
    background: "#111",
    padding: "40px 40px 48px",
    borderBottom: "3px solid #FEE12B",
  },
  heroBack: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: "#FEE12B",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: 16,
    background: "none",
    border: "none",
    fontFamily: "inherit",
  },
  heroH1: {
    fontSize: 44,
    fontWeight: 700,
    color: "#fff",
    lineHeight: 1.1,
    marginBottom: 10,
  },
  heroSub: { fontSize: 15, color: "#888" },

  // ── Body ──────────────────────────────────────────────
  body: { padding: "48px 40px", maxWidth: 900, margin: "0 auto" },

  // ── Info Cards ────────────────────────────────────────
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
    marginBottom: 32,
  },
  card: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: "22px 24px",
    transition: "border-color 0.2s, box-shadow 0.2s",
    cursor: "default",
  },
  cardIcon: {
    width: 42,
    height: 42,
    background: "#FEE12B1a",
    border: "1px solid #FEE12B44",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#999",
    marginBottom: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: 600, color: "#111", marginBottom: 4 },
  cardValue: { fontSize: 14, color: "#111", fontWeight: 500 },
  cardSub: { fontSize: 13, color: "#888", marginTop: 3 },

  // ── WhatsApp Banner ───────────────────────────────────
  waBanner: {
    background: "#25D36610",
    border: "1px solid #25D36630",
    borderRadius: 12,
    padding: "18px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 32,
  },
  waLeft: { display: "flex", alignItems: "center", gap: 14 },
  waIconBox: {
    width: 42,
    height: 42,
    background: "#25D366",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  waTitle: { fontSize: 14, fontWeight: 600, color: "#111" },
  waSub: { fontSize: 13, color: "#666", marginTop: 2 },
  waBtn: {
    background: "#25D366",
    color: "#fff",
    fontFamily: "inherit",
    fontSize: 13,
    fontWeight: 700,
    padding: "10px 20px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  // ── Divider ───────────────────────────────────────────
  divider: { height: 1, background: "#eee", marginBottom: 32 },

  // ── Form ──────────────────────────────────────────────
  formWrap: {
    background: "#fff",
    border: "1px solid #eee",
    borderRadius: 12,
    padding: "32px",
  },
  formTitle: { fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 24 },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16,
    marginBottom: 16,
  },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 },
  label: {
    fontSize: 12,
    fontWeight: 700,
    color: "#666",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  input: {
    background: "#fafafa",
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 14,
    color: "#111",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s",
  },
  textarea: {
    background: "#fafafa",
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 14,
    color: "#111",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
    minHeight: 110,
    transition: "border-color 0.2s",
  },
  select: {
    background: "#fafafa",
    border: "1px solid #e5e5e5",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 14,
    color: "#111",
    fontFamily: "inherit",
    outline: "none",
    cursor: "pointer",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f9f9f9",
    border: "1px solid #eee",
    borderRadius: 8,
    padding: "12px 16px",
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    background: "#22c55e",
    borderRadius: "50%",
    flexShrink: 0,
    boxShadow: "0 0 0 3px #22c55e22",
  },
  statusText: { fontSize: 13, color: "#555" },
  submitBtn: {
    background: "#FEE12B",
    color: "#111",
    fontFamily: "inherit",
    fontSize: 14,
    fontWeight: 700,
    padding: "13px 28px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "opacity 0.15s",
  },
  successMsg: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: 8,
    padding: "16px 20px",
    color: "#166534",
    fontSize: 14,
    fontWeight: 500,
    marginTop: 16,
  },
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const IconEmail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#111">
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);
const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#111">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
);
const IconLocation = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#111">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const IconClock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#111">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
  </svg>
);
const IconSend = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="#111">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);
const IconWA = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#FEE12B">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

// ── InfoCard ──────────────────────────────────────────────────────────────────
function InfoCard({ icon, label, title, value, sub }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        ...styles.card,
        borderColor: hovered ? "#FEE12B" : "#eee",
        boxShadow: hovered ? "0 2px 16px #FEE12B18" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardIcon}>{icon}</div>
      <div style={styles.cardLabel}>{label}</div>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardValue}>{value}</div>
      {sub && <div style={styles.cardSub}>{sub}</div>}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Contact() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    // TODO: wire up to your backend / emailService here
    console.log("Contact form submitted:", form);
    setSubmitted(true);
    setForm({ name: "", email: "", phone: "", topic: "", message: "" });
  };

  const focusStyle = (field) =>
    focusedField === field ? { borderColor: "#FEE12B" } : {};

  return (
    <div style={styles.page}>
      {/* Hero */}
      <div style={styles.hero}>
        <button style={styles.heroBack} onClick={() => navigate(-1)}>
          <IconBack /> RouterKart
        </button>
        <h1 style={styles.heroH1}>Contact Us</h1>
        <p style={styles.heroSub}>
          Questions, orders, or just want to say hi — we're here.
        </p>
      </div>

      <div style={styles.body}>
        {/* Info Cards */}
        <div style={styles.cardsGrid}>
          <InfoCard
            icon={<IconEmail />}
            label="Email us"
            title="General Inquiries"
            value="admin@routerkart.in"
            sub="We reply within 24 hours"
          />
          <InfoCard
            icon={<IconPhone />}
            label="Call us"
            title="Phone Support"
            value="+91 80739 19667"
            sub="Mon–Sat, 10am–7pm IST"
          />
          <InfoCard
            icon={<IconLocation />}
            label="Visit us"
            title="Our Location"
            value="#132, Ramanna Garden, New Mission Road"
            sub="Chamaraj Pet, Bangalore, Karnataka - 560027"
          />
          <InfoCard
            icon={<IconClock />}
            label="Response time"
            title="Business Hours"
            value="Mon – Sat"
            sub="10:00 AM – 7:00 PM IST"
          />
        </div>

        {/* WhatsApp Banner */}
        <div style={styles.waBanner}>
  <div style={styles.waLeft}>
    <div style={styles.waIconBox}>
      <IconWA />
    </div>

    <div>
      <div style={styles.waTitle}>Chat on WhatsApp</div>

      <div style={styles.waSub}>
        Fastest way to reach us — usually reply in minutes
      </div>
    </div>
  </div>
<button
  style={styles.waBtn}
  onClick={() => {
    window.location.href =
      "https://api.whatsapp.com/send?phone=918073919667&text=Hi%20RouterKart!%20I%20need%20help%20with%20a%20product.";
  }}
>
NEW WHATSAPP BUTTON</button>
</div>

        <div style={styles.divider} />

        
        </div>
     </div>
  );
}