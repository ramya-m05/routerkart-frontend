"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

/* ── Pages where the prompt should never appear ── */
const SUPPRESSED_PREFIXES = [
  "/login",
  "/signup",
  "/register",
  "/checkout",
  "/admin",
  "/forgot-password",
  "/reset-password",
];

const SESSION_KEY = "rk_signin_prompt_dismissed";

/**
 * Dismissible sign-in invitation shown once per session to
 * unauthenticated visitors after a random 30–45 s delay.
 *
 * Rules:
 * - Never shown to signed-in users
 * - Never shown on auth/checkout/admin pages
 * - At most once per browser session (sessionStorage)
 * - Timer cleaned up to avoid duplicates in Strict Mode
 */
export default function SignInPrompt() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch { /* storage unavailable */ }
  }, []);

  useEffect(() => {
    // SSR guard
    if (typeof window === "undefined") return;

    // Already dismissed this session?
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch { /* storage unavailable — skip prompt */ return; }

    // Already signed in?
    const token = localStorage.getItem("token");
    if (token) return;

    // Suppressed page?
    const lower = (pathname || "").toLowerCase();
    if (SUPPRESSED_PREFIXES.some((p) => lower.startsWith(p))) return;

    // Schedule with random 30–45 s delay
    const delay = 30000 + Math.random() * 15000;
    timerRef.current = setTimeout(() => {
      // Re-check conditions at fire time
      const stillNoToken = !localStorage.getItem("token");
      let stillNotDismissed = true;
      try { stillNotDismissed = sessionStorage.getItem(SESSION_KEY) !== "1"; } catch {}

      if (stillNoToken && stillNotDismissed) {
        setVisible(true);
      }
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={dismiss}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 9998,
          animation: "rkFadeIn 0.25s ease",
        }}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to RouterKart"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          left: "24px",
          maxWidth: "400px",
          marginLeft: "auto",
          background: "#111",
          borderRadius: "16px",
          padding: "28px 24px 24px",
          zIndex: 9999,
          boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
          fontFamily: "'DM Sans', sans-serif",
          animation: "rkSlideUp 0.3s ease",
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          aria-label="Close"
          style={{
            position: "absolute",
            top: "12px",
            right: "14px",
            background: "none",
            border: "none",
            color: "#666",
            fontSize: "20px",
            cursor: "pointer",
            padding: "4px",
            lineHeight: 1,
          }}
          onFocus={(e) => (e.target.style.outline = "2px solid #FEE12B")}
          onBlur={(e) => (e.target.style.outline = "none")}
        >
          ✕
        </button>

        {/* Icon */}
        <div
          style={{
            width: "40px",
            height: "40px",
            background: "#FEE12B",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "900",
            fontSize: "15px",
            color: "#111",
            marginBottom: "16px",
          }}
        >
          RK
        </div>

        <h3
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "800",
            margin: "0 0 6px",
            letterSpacing: "-0.3px",
          }}
        >
          Welcome to RouterKart
        </h3>
        <p
          style={{
            color: "#888",
            fontSize: "13px",
            lineHeight: "1.55",
            margin: "0 0 20px",
          }}
        >
          Sign in for order tracking, saved addresses, and faster checkout.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              dismiss();
              router.push("/login");
            }}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "#FEE12B",
              color: "#111",
              border: "none",
              borderRadius: "8px",
              fontWeight: "800",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5d400")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#FEE12B")}
            onFocus={(e) => (e.target.style.outline = "2px solid #FEE12B")}
            onBlur={(e) => (e.target.style.outline = "none")}
          >
            Sign in
          </button>
          <button
            onClick={dismiss}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "transparent",
              color: "#999",
              border: "1px solid #333",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#555";
              e.currentTarget.style.color = "#ccc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#333";
              e.currentTarget.style.color = "#999";
            }}
            onFocus={(e) => (e.target.style.outline = "2px solid #FEE12B")}
            onBlur={(e) => (e.target.style.outline = "none")}
          >
            Later
          </button>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes rkFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes rkSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
