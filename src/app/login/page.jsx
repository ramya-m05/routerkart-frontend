"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import API from "../../services/api";
import toast from "react-hot-toast";
import { useIsMobile } from "../../hooks/useIsMobile";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const isValidPhone = (v) => /^\d{10}$/.test(v.trim());

/* Allowlist of internal paths that returnTo may redirect to */
const SAFE_RETURN_PREFIXES = [
  "/checkout",
  "/store",
  "/cart",
  "/orders",
  "/wishlist",
  "/account",
  "/p/",
  "/product/",
];

function getSafeReturnTo(raw) {
  if (!raw || typeof raw !== "string") return null;
  const decoded = decodeURIComponent(raw);
  // Must start with / and not // (no protocol-relative URLs)
  if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
  // Must match an allowed prefix
  const lower = decoded.toLowerCase();
  if (SAFE_RETURN_PREFIXES.some((p) => lower.startsWith(p))) return decoded;
  return null;
}

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile();

  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));

  const [identifier, setIdentifier] = useState(""); // email or phone
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputErr, setInputErr] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const user = (() => {
      try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    })();
    if (token && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push(returnTo || "/store");
      }
    }
  }, [router, returnTo]);

  const handleLogin = async () => {
    const val = identifier.trim();

    if (!val) {
      toast.error("Please enter your email or phone number");
      return;
    }

    // Detect type
    const isEmail = isValidEmail(val);
    const isPhone = isValidPhone(val);

    if (!isEmail && !isPhone) {
      setInputErr("Enter a valid email address or 10-digit phone number");
      return;
    }

    if (!password.trim()) {
      toast.error("Please enter your password");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/login", {
        identifier: isPhone ? val : val.toLowerCase(),
        password: password.trim(),
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: res.data.name,
            email: res.data.email,
            phone: res.data.phone || "",
            role: res.data.role,
          })
        );
        localStorage.setItem("userName", res.data.name);
      }

      toast.success("Login successful 🚀");

      if (res.data.role === "admin") {
        router.push("/admin");
      } else {
        router.push(returnTo || "/store");
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg === "User not found")
        toast.error("No account found with this email/phone ❌");
      else if (msg === "Incorrect password") toast.error("Wrong password ❌");
      else toast.error(msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = {
    width: "100%",
    padding: "13px 16px",
    border: "2px solid #e5e5e5",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#111",
    background: "white",
    outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
  };
  const labelBase = {
    display: "block",
    fontSize: "11px",
    fontWeight: "800",
    color: "#555",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "8px",
  };
  const fo = (e) => (e.target.style.borderColor = "#FEE12B");
  const bl = (e) => (e.target.style.borderColor = "#e5e5e5");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* LEFT BRAND PANEL */}
      {!isMobile && (
        <div
          style={{
            flex: 1,
            background: "#111",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ maxWidth: "380px", position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "48px",
                height: "48px",
                background: "#FEE12B",
                borderRadius: "8px",
                fontWeight: "900",
                fontSize: "18px",
                color: "#111",
                marginBottom: "22px",
              }}
            >
              RK
            </div>
            <h1
              style={{
                fontSize: "clamp(32px,4vw,48px)",
                fontWeight: "900",
                color: "white",
                margin: "0 0 14px",
                letterSpacing: "-1.5px",
                lineHeight: 1,
              }}
            >
              Router<span style={{ color: "#FEE12B" }}>Kart</span>
            </h1>
            <p
              style={{
                color: "#666",
                fontSize: "14px",
                lineHeight: "1.65",
                margin: "0 0 32px",
              }}
            >
              India&apos;s #1 store for networking equipment — routers, fiber tools,
              security systems and more.
            </p>
            {[
              "🚚 Free delivery on orders ₹499+",
              "🔒 Secure & encrypted payments",
              "💯 Genuine brand-verified products",
            ].map((f, i) => (
              <div
                key={i}
                style={{
                  color: "#bbb",
                  fontSize: "13px",
                  fontWeight: "500",
                  padding: "10px 14px",
                  background: "rgba(255,255,255,0.04)",
                  borderRadius: "6px",
                  borderLeft: "3px solid #FEE12B",
                  marginBottom: "8px",
                }}
              >
                {f}
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "40%",
              background:
                "repeating-linear-gradient(-45deg,transparent,transparent 10px,rgba(254,225,43,0.03) 10px,rgba(254,225,43,0.03) 20px)",
            }}
          />
        </div>
      )}

      {/* RIGHT FORM PANEL */}
      <div
        style={{
          width: isMobile ? "100%" : "480px",
          flexShrink: 0,
          background: isMobile ? "#fff" : "#F7F7F5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "32px 20px" : "40px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: isMobile ? "0" : "16px",
            padding: isMobile ? "4px 0" : "36px",
            width: "100%",
            boxShadow: isMobile ? "none" : "0 4px 32px rgba(0,0,0,0.08)",
          }}
        >
          {isMobile && (
            <div style={{ textAlign: "center", marginBottom: "28px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "44px",
                  height: "44px",
                  background: "#FEE12B",
                  borderRadius: "8px",
                  fontWeight: "900",
                  fontSize: "17px",
                  color: "#111",
                  marginBottom: "10px",
                }}
              >
                RK
              </div>
              <h1
                style={{
                  fontSize: "24px",
                  fontWeight: "900",
                  color: "#111",
                  margin: 0,
                }}
              >
                Router<span style={{ color: "#FEE12B" }}>Kart</span>
              </h1>
            </div>
          )}

          <h2
            style={{
              fontSize: "24px",
              fontWeight: "900",
              color: "#111",
              margin: "0 0 6px",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome back
          </h2>
          <p style={{ color: "#999", fontSize: "14px", margin: "0 0 26px" }}>
            Sign in to your RouterKart account
          </p>

          {/* Email or Phone */}
          <div style={{ marginBottom: "18px" }}>
            <label style={labelBase}>Email or Phone Number</label>
            <input
              type="text"
              placeholder="you@example.com or 98xxxxxxxx"
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                if (inputErr) setInputErr("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLogin();
                }
              }}
              style={{
                ...inputBase,
                borderColor: inputErr ? "#e53e3e" : "#e5e5e5",
              }}
              onFocus={fo}
              onBlur={bl}
              autoComplete="username"
            />
            {inputErr && (
              <p
                style={{
                  fontSize: "11px",
                  color: "#e53e3e",
                  fontWeight: "700",
                  margin: "5px 0 0",
                }}
              >
                ⚠️ {inputErr}
              </p>
            )}
            <p
              style={{
                fontSize: "11px",
                color: "#aaa",
                margin: "5px 0 0",
                fontWeight: "500",
              }}
            >
              You can sign in with your email address or registered phone number
            </p>
          </div>

          {/* Password */}
          <div style={{ marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <label style={{ ...labelBase, marginBottom: 0 }}>
                Password
              </label>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: "#FEE12B",
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleLogin();
                  }
                }}
                style={{ ...inputBase, paddingRight: "50px" }}
                onFocus={fo}
                onBlur={bl}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Sign In button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "#FEE12B",
              color: "#111",
              border: "none",
              borderRadius: "8px",
              fontWeight: "800",
              fontSize: "15px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background 0.15s",
              marginTop: "18px",
              marginBottom: "22px",
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = "#f5d400";
            }}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "#FEE12B")
            }
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                flex: 1,
                height: "1px",
                background: "#eee",
                display: "block",
              }}
            />
            <span
              style={{ fontSize: "12px", color: "#aaa", fontWeight: "600" }}
            >
              New to RouterKart?
            </span>
            <span
              style={{
                flex: 1,
                height: "1px",
                background: "#eee",
                display: "block",
              }}
            />
          </div>

          <Link
            href={returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : "/signup"}
            style={{
              display: "block",
              width: "100%",
              padding: "13px",
              border: "2px solid #111",
              borderRadius: "8px",
              textAlign: "center",
              textDecoration: "none",
              color: "#111",
              fontWeight: "800",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
