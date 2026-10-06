"use client";

const WHATSAPP_NUMBER = "918073919667";
const WHATSAPP_MESSAGE = "Hi RouterKart! I need help with a product.";

export default function WhatsAppButton() {
  const handleClick = () => {
    const encoded = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 999,
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        background: "#25D366",
        border: "none",
        boxShadow: "0 4px 16px rgba(37,211,102,0.4)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(37,211,102,0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,211,102,0.4)";
      }}
    >
      <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.073-1.854-.424-1.488-.607-2.484-2.126-2.558-2.227-.074-.1-.611-.814-.611-1.554 0-.74.385-1.103.524-1.25.139-.148.303-.185.405-.185.102 0 .204.001.294.006.095.004.223-.036.348.266.13.313.444 1.083.483 1.162.039.08.065.172.012.277-.052.105-.078.172-.156.262-.078.09-.163.201-.233.27-.078.077-.16.161-.069.317.091.156.403.666.866 1.079.595.53 1.096.694 1.252.772.156.078.247.069.339-.036.092-.105.391-.456.495-.612.104-.156.208-.13.347-.078.139.052.883.416 1.035.492.152.076.253.113.29.176.037.063.037.368-.107.773z" />
      </svg>
    </button>
  );
}
