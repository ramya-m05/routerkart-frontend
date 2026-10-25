"use client";

import { useState, useContext, useEffect } from "react";
import API from "../../services/api";
import { CartContext } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useIsMobile } from "../../hooks/useIsMobile";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const lbl = {
  display: "block",
  fontSize: "11px",
  fontWeight: "800",
  color: "#555",
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginBottom: "6px",
};

export default function Checkout() {
  // ── Auth guard ──
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    const user = (() => {
      try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
    })();
    if (!token || !user) {
      router.replace("/login?returnTo=%2Fcheckout");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- auth gate: must set state in effect for SSR hydration
    setAuthChecked(true);
  }, [router]);

  // Delivery fields
  const [doorNo, setDoorNo] = useState("");
  const [houseName, setHouseName] = useState("");
  const [cross, setCross] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [phone, setPhone] = useState("");

  const [paymentMode, setPaymentMode] = useState("online");
  const [loading, setLoading] = useState(false);
  const [codConfirmed, setCodConfirmed] = useState(false);

  const { cart, setCart, clearCart } = useContext(CartContext);
  const isMobile = useIsMobile();
  const [addresses, setAddresses] = useState([]);

  // Sync cart items with fresh product data on mount
  useEffect(() => {
    const syncCartProducts = async () => {
      try {
        const res = await API.get("/products");
        const products = res.data;
        if (Array.isArray(products) && products.length > 0) {
          setCart((prevCart) =>
            prevCart.map((cartItem) => {
              const fresh = products.find((p) => p._id === cartItem._id);
              if (fresh) {
                return {
                  ...cartItem,
                  price: fresh.price,
                  name: fresh.name,
                  image: fresh.images?.[0] || fresh.image || cartItem.image,
                  advancePayment: fresh.advancePayment,
                  advanceAmount: fresh.advanceAmount,
                };
              }
              return cartItem;
            })
          );
        }
      } catch (err) {
        console.error("Cart sync error:", err);
      }
    };
    if (cart && cart.length > 0) {
      syncCartProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only effect: re-syncing on every cart change would cause infinite loop
  }, []);

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const delivery = subtotal >= 499 ? 0 : 49;
  const grandTotal = subtotal + delivery;

  // Calculate COD advance based on items that have advancePayment enabled
  const rawCodAdvance = cart.reduce((sum, i) => {
    if (i.advancePayment && Number(i.advanceAmount) > 0) {
      return sum + Number(i.advanceAmount) * Number(i.qty || 1);
    }
    return sum;
  }, 0);
  const codAdvance = Math.min(rawCodAdvance, grandTotal);
  const codOnDelivery = Math.max(0, grandTotal - codAdvance);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await API.get("/users/addresses");
        setAddresses(res.data);
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
      }
    };
    fetchAddresses();
  }, []);

  useEffect(() => {
    if (!addresses || addresses.length === 0) return;
    const defaultAddress =
      addresses.find((a) => a.isDefault) || addresses[0];
    if (!defaultAddress) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- populating form fields from fetched address data (external API response)
    setDoorNo(defaultAddress.doorNo || "");
    setHouseName(defaultAddress.houseName || "");
    setCross(defaultAddress.cross || "");
    setLandmark(defaultAddress.landmark || "");
    setCity(defaultAddress.city || "");
    setDistrict(defaultAddress.district || "");
    setState(defaultAddress.state || "");
    setPincode(defaultAddress.pincode || "");
    setPhone(defaultAddress.phone || "");
  }, [addresses]);

  const buildAddress = () => {
    const parts = [
      doorNo && `${doorNo}`,
      houseName && `${houseName}`,
      cross && `${cross}`,
      landmark && `Near ${landmark}`,
      city && `${city}`,
      district && `${district}`,
      state && `${state}`,
      pincode && `- ${pincode}`,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const validate = () => {
    if (!doorNo.trim()) {
      toast.error("Please enter Door No / House Name");
      return false;
    }
    if (!city.trim()) {
      toast.error("Please enter your city");
      return false;
    }
    if (!district.trim()) {
      toast.error("Please enter your district");
      return false;
    }
    if (!state.trim()) {
      toast.error("Please select your state");
      return false;
    }
    if (!pincode.trim() || pincode.length !== 6 || isNaN(pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }
    if (paymentMode === "cod" && codAdvance > 0 && !codConfirmed) {
      toast.error("Please confirm COD advance payment terms");
      return false;
    }
    return true;
  };

  const placeOrder = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const user =
        typeof window !== "undefined"
          ? JSON.parse(localStorage.getItem("user") || "{}")
          : {};
      const fullAddress = buildAddress();

      // If COD and NO advance is required, place order directly without Razorpay
      if (paymentMode === "cod" && codAdvance === 0) {
        await API.post("/orders/check-stock", {
          items: cart.map((i) => ({
            productId: i._id,
            qty: i.qty,
          })),
        });

        await API.post("/orders", {
          items: cart.map((i) => ({
            productId: i._id,
            name: i.name,
            price: Number(i.price),
            qty: Number(i.qty),
          })),
          address: fullAddress,
          addressDetails: {
            doorNo,
            houseName,
            cross,
            landmark,
            city,
            district,
            state,
            pincode,
          },
          phone: phone.toString(),
          paymentMode: "cod",
          paymentStatus: "pending",
          advancePaid: 0,
          amountDueOnDelivery: Number(grandTotal),
        });

        clearCart();
        toast.success(
          `Order placed! ₹${grandTotal.toLocaleString()} due on delivery 🎉`
        );
        router.push("/orders");
        return;
      }

      const amount =
        paymentMode === "cod" ? Number(codAdvance) : Number(grandTotal);

      // STEP 1: CHECK STOCK BEFORE PAYMENT
      await API.post("/orders/check-stock", {
        items: cart.map((i) => ({
          productId: i._id,
          qty: i.qty,
        })),
      });

      // STEP 2: CREATE ORDER (RAZORPAY)
      const { data } = await API.post("/payment/create-order", {
        items: cart.map((i) => ({ productId: i._id, qty: i.qty })),
        paymentMode,
        amount,
      });

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const options = {
        key: razorpayKey,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,

        name: "RouterKart",
        description:
          paymentMode === "cod" ? "COD Advance Payment" : "Order Payment",

        prefill: {
          name: user?.name || "Customer",
          email: user?.email || "customer@routerkart.in",
          contact:
            phone?.toString().replace(/\D/g, "").slice(-10) || "9999999999",
        },

        notes: {
          address: "RouterKart Order",
        },

        image: "https://routerkart.in/favicon.png",

        theme: {
          color: "#FEE12B",
        },

        // STEP 3: PAYMENT SUCCESS HANDLER
        handler: async function (response) {
          try {
            const verifyRes = await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyRes.data?.verified) {
              throw new Error("Payment verification failed");
            }

            // CREATE FINAL ORDER
            await API.post("/orders", {
              items: cart.map((i) => ({
                productId: i._id,
                name: i.name,
                price: Number(i.price),
                qty: Number(i.qty),
              })),

              address: fullAddress,

              addressDetails: {
                doorNo,
                houseName,
                cross,
                landmark,
                city,
                district,
                state,
                pincode,
              },

              phone: phone.toString(),

              paymentMode,
              paymentStatus:
                paymentMode === "cod" ? "advance_paid" : "paid",

              ...(paymentMode === "cod" && {
                advancePaid: Number(codAdvance),
                amountDueOnDelivery: Number(codOnDelivery),
              }),

              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            });

            clearCart();

            toast.success(
              paymentMode === "cod"
                ? `Order placed! ₹${codOnDelivery.toLocaleString()} due on delivery 🎉`
                : "Payment successful 🎉"
            );

            router.push("/orders");
          } catch (err) {
            console.error("ORDER ERROR:", err.response?.data || err);
            const msg = err.response?.data?.message;
            if (msg?.includes("stock")) {
              toast.error("Product is out of stock ❌");
            } else {
              toast.error(msg || "Order failed after payment");
            }
          }
        },

        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          },
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("PAYMENT FAILED:", response.error);
          toast.error(response.error?.description || "Payment failed");
        });
        rzp.open();
      } else {
        toast.error("Payment gateway failed to load. Please refresh.");
      }
    } catch (err) {
      console.error("PAYMENT ERROR:", err.response?.data || err);
      const msg = err.response?.data?.message;
      if (msg?.includes("stock")) {
        toast.error("Some items are out of stock ❌");
      } else {
        toast.error(msg || "Payment initialization failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const inp = {
    width: "100%",
    padding: "12px 14px",
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
  const onFocus = (e) => (e.target.style.borderColor = "#FEE12B");
  const onBlur = (e) => (e.target.style.borderColor = "#e5e5e5");

  // Don't render checkout until auth is verified
  if (!authChecked) return null;

  return (
    <div
      style={{
        background: "#F7F7F5",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#111",
          padding: isMobile ? "28px 20px 22px" : "44px 40px 32px",
          borderBottom: "4px solid #FEE12B",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <p style={{ fontSize: "12px", marginBottom: "8px" }}>
            <Link
              href="/store"
              style={{
                color: "#FEE12B",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Store
            </Link>
            <span style={{ margin: "0 8px", color: "#555" }}>/</span>
            <Link
              href="/cart"
              style={{
                color: "#FEE12B",
                textDecoration: "none",
                fontWeight: "700",
              }}
            >
              Cart
            </Link>
            <span style={{ margin: "0 8px", color: "#555" }}>/</span>
            <span style={{ color: "#999" }}>Checkout</span>
          </p>
          <h1
            style={{
              color: "white",
              fontSize: isMobile ? "32px" : "clamp(32px,5vw,56px)",
              fontWeight: "900",
              letterSpacing: "-1.5px",
              margin: 0,
              lineHeight: 1,
            }}
          >
            Checkout
          </h1>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "20px 16px" : "40px",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "20px" : "32px",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT: FORM */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* DELIVERY SECTION */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: isMobile ? "20px 16px" : "28px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              border: "1px solid #ececec",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "22px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  background: "#FEE12B",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "11px",
                  color: "#111",
                  flexShrink: 0,
                }}
              >
                01
              </div>
              <h3
                style={{
                  fontWeight: "900",
                  fontSize: "16px",
                  color: "#111",
                  margin: 0,
                }}
              >
                Delivery Details
              </h3>
            </div>

            {/* ROW 1 — Door No + House Name */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "14px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label style={lbl}>
                  Door No. <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  placeholder="e.g. 12B, Flat 4A"
                  value={doorNo}
                  onChange={(e) => setDoorNo(e.target.value)}
                  style={inp}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <label style={lbl}>
                  House / Building Name
                  <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  placeholder="e.g. Green Apartments"
                  value={houseName}
                  onChange={(e) => setHouseName(e.target.value)}
                  style={inp}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* ROW 2 — Cross + Landmark */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "14px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label style={lbl}>
                  Cross / Street<span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  placeholder="e.g. 5th Cross, MG Road"
                  value={cross}
                  onChange={(e) => setCross(e.target.value)}
                  style={inp}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <label style={lbl}>
                  Landmark{" "}
                  <span
                    style={{
                      color: "#aaa",
                      fontWeight: "500",
                      textTransform: "none",
                      letterSpacing: 0,
                    }}
                  >
                    (Optional)
                  </span>
                </label>
                <input
                  placeholder="e.g. Near Bus Stand"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  style={inp}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* ROW 3 — City + District */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "14px",
                marginBottom: "14px",
              }}
            >
              <div>
                <label style={lbl}>
                  City <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  placeholder="e.g. 8th mile"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={inp}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
              <div>
                <label style={lbl}>
                  District <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  placeholder="e.g. Bangalore Urban"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={inp}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            </div>

            {/* STATE */}
            <div style={{ marginBottom: "14px" }}>
              <label style={lbl}>
                State <span style={{ color: "#e53e3e" }}>*</span>
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={inp}
                onFocus={onFocus}
                onBlur={onBlur}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* ROW 4 — Pincode + Phone */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                <label style={lbl}>
                  Pincode <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input
                  placeholder="6-digit pincode"
                  value={pincode}
                  onChange={(e) => {
                    if (e.target.value.length <= 6)
                      setPincode(e.target.value.replace(/\D/g, ""));
                  }}
                  maxLength={6}
                  style={{
                    ...inp,
                    borderColor:
                      pincode.length > 0 && pincode.length !== 6
                        ? "#e53e3e"
                        : "#e5e5e5",
                  }}
                  onFocus={onFocus}
                  onBlur={(e) => {
                    e.target.style.borderColor =
                      pincode.length > 0 && pincode.length !== 6
                        ? "#e53e3e"
                        : "#e5e5e5";
                  }}
                />
                {pincode.length > 0 && pincode.length !== 6 && (
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#e53e3e",
                      margin: "4px 0 0",
                      fontWeight: "600",
                    }}
                  >
                    Enter 6-digit pincode
                  </p>
                )}
              </div>
              <div>
                <label style={lbl}>
                  Phone Number <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#555",
                      pointerEvents: "none",
                    }}
                  >
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="98xxxxxxxx"
                    value={phone}
                    onChange={(e) => {
                      if (e.target.value.length <= 10)
                        setPhone(e.target.value.replace(/\D/g, ""));
                    }}
                    maxLength={10}
                    style={{ ...inp, paddingLeft: "48px" }}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>
            </div>

            {/* ADDRESS PREVIEW */}
            {(doorNo || city || pincode) && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  background: "#F7F7F5",
                  borderRadius: "8px",
                  border: "1px solid #ececec",
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    color: "#aaa",
                    margin: "0 0 4px",
                  }}
                >
                  Delivery Address Preview
                </p>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#555",
                    margin: 0,
                    lineHeight: 1.6,
                    fontWeight: "500",
                  }}
                >
                  📍 {buildAddress() || "—"}
                </p>
              </div>
            )}
          </div>

          {/* PAYMENT MODE */}
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: isMobile ? "20px 16px" : "28px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              border: "1px solid #ececec",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  background: "#FEE12B",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "11px",
                  color: "#111",
                  flexShrink: 0,
                }}
              >
                02
              </div>
              <h3
                style={{
                  fontWeight: "900",
                  fontSize: "16px",
                  color: "#111",
                  margin: 0,
                }}
              >
                Payment Method
              </h3>
            </div>

            {[
              {
                id: "online",
                title: "Pay Online",
                sub: "UPI · Cards · Net Banking · Wallets",
                icon: "💳",
              },
              {
                id: "cod",
                title: "Cash on Delivery",
                sub: "Pay remaining amount when order is delivered",
                icon: "🏠",
              },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setPaymentMode(opt.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  border: `2px solid ${
                    paymentMode === opt.id ? "#FEE12B" : "#e5e5e5"
                  }`,
                  borderRadius: "10px",
                  padding: "14px 16px",
                  cursor: "pointer",
                  marginBottom: "10px",
                  background:
                    paymentMode === opt.id ? "#FFFDF0" : "white",
                  transition: "all 0.15s",
                }}
              >
                <div
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    border: `5px solid ${
                      paymentMode === opt.id ? "#FEE12B" : "#ddd"
                    }`,
                    flexShrink: 0,
                    background:
                      paymentMode === opt.id ? "#FEE12B" : "white",
                    transition: "all 0.15s",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontWeight: "800",
                      fontSize: "14px",
                      color: "#111",
                      margin: "0 0 2px",
                    }}
                  >
                    {opt.title}
                  </p>
                  <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>
                    {opt.sub}
                  </p>
                </div>
                <span style={{ fontSize: "18px" }}>{opt.icon}</span>
              </div>
            ))}

            {/* COD ALERT / INFO */}
            {paymentMode === "cod" &&
              (codAdvance > 0 ? (
                <div
                  style={{
                    marginTop: "4px",
                    background: "#FFFCEB",
                    border: "2px solid #FEE12B",
                    borderRadius: "10px",
                    padding: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>⚠️</span>
                    <strong style={{ fontSize: "13px", color: "#111" }}>
                      COD Advance Payment Required
                    </strong>
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#666",
                      lineHeight: "1.6",
                      margin: "0 0 12px",
                    }}
                  >
                    Pay{" "}
                    <strong style={{ color: "#111" }}>
                      ₹{codAdvance.toLocaleString()}
                    </strong>{" "}
                    online now to confirm your order. Remaining{" "}
                    <strong style={{ color: "#111" }}>
                      ₹{codOnDelivery.toLocaleString()}
                    </strong>{" "}
                    is collected at delivery.
                  </p>
                  <div
                    style={{
                      background: "rgba(0,0,0,0.04)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      marginBottom: "12px",
                    }}
                  >
                    {[
                      [
                        "Order Total",
                        `₹${grandTotal.toLocaleString()}`,
                        "#111",
                      ],
                      [
                        "Pay Now (Advance)",
                        `₹${codAdvance.toLocaleString()}`,
                        "#cc8800",
                      ],
                      [
                        "Pay on Delivery",
                        `₹${codOnDelivery.toLocaleString()}`,
                        "#22863a",
                      ],
                    ].map(([k, v, c]) => (
                      <div
                        key={k}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ color: c, fontWeight: "600" }}>{k}</span>
                        <span style={{ fontWeight: "800", color: c }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={codConfirmed}
                      onChange={(e) => setCodConfirmed(e.target.checked)}
                      style={{
                        accentColor: "#FEE12B",
                        width: "16px",
                        height: "16px",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        fontWeight: "600",
                        lineHeight: 1.5,
                      }}
                    >
                      I agree to pay ₹{codAdvance.toLocaleString()} advance online
                      + ₹{codOnDelivery.toLocaleString()} on delivery
                    </span>
                  </label>
                </div>
              ) : (
                <div
                  style={{
                    marginTop: "4px",
                    background: "#F0FDF4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "10px",
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>✅</span>
                    <strong style={{ fontSize: "13px", color: "#166534" }}>
                      No Advance Payment Required
                    </strong>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#15803d",
                      margin: "4px 0 0",
                    }}
                  >
                    You can pay the full amount of{" "}
                    <strong>₹{grandTotal.toLocaleString()}</strong> in cash/UPI
                    upon delivery.
                  </p>
                </div>
              ))}
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div
          style={{
            width: isMobile ? "100%" : "340px",
            flexShrink: 0,
            position: isMobile ? "static" : "sticky",
            top: "24px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "12px",
              padding: isMobile ? "20px 16px" : "28px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
              border: "1px solid #ececec",
            }}
          >
            <h3
              style={{
                fontWeight: "900",
                fontSize: "16px",
                color: "#111",
                margin: "0 0 18px",
                paddingBottom: "14px",
                borderBottom: "2px solid #111",
              }}
            >
              Order Summary
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "4px",
              }}
            >
              {cart.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      minWidth: 0,
                    }}
                  >
                    <img
                      src={
                        (Array.isArray(item.images) && item.images[0]) ||
                        item.image ||
                        "/placeholder.png"
                      }
                      alt={item.name}
                      style={{
                        width: "40px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        border: "1px solid #f0f0f0",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.src = "/placeholder.png";
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: "700",
                          fontSize: "12px",
                          color: "#111",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "120px",
                        }}
                      >
                        {item.name}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#aaa",
                          margin: 0,
                        }}
                      >
                        Qty: {item.qty}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontWeight: "800",
                      fontSize: "13px",
                      flexShrink: 0,
                    }}
                  >
                    ₹{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                height: "1px",
                background: "#eee",
                margin: "14px 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "#666", fontSize: "13px" }}>Subtotal</span>
              <span style={{ fontWeight: "700" }}>
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span style={{ color: "#666", fontSize: "13px" }}>Delivery</span>
              <span
                style={{
                  fontWeight: "700",
                  color: delivery === 0 ? "#22c55e" : "#111",
                }}
              >
                {delivery === 0 ? "FREE" : `₹${delivery}`}
              </span>
            </div>

            {paymentMode === "cod" && codAdvance > 0 && (
              <>
                <div
                  style={{
                    height: "1px",
                    background: "#eee",
                    margin: "10px 0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      color: "#cc8800",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    COD Advance
                  </span>
                  <span style={{ fontWeight: "800", color: "#cc8800" }}>
                    ₹{codAdvance.toLocaleString()}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "#22863a",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    On Delivery
                  </span>
                  <span style={{ fontWeight: "800", color: "#22863a" }}>
                    ₹{codOnDelivery.toLocaleString()}
                  </span>
                </div>
              </>
            )}

            {paymentMode === "cod" && codAdvance === 0 && (
              <>
                <div
                  style={{
                    height: "1px",
                    background: "#eee",
                    margin: "10px 0",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span
                    style={{
                      color: "#22863a",
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    Due on Delivery
                  </span>
                  <span style={{ fontWeight: "800", color: "#22863a" }}>
                    ₹{grandTotal.toLocaleString()}
                  </span>
                </div>
              </>
            )}

            <div
              style={{
                height: "1px",
                background: "#eee",
                margin: "14px 0",
              }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontWeight: "900", fontSize: "17px" }}>
                Total
              </span>
              <span
                style={{
                  fontWeight: "900",
                  fontSize: "21px",
                  letterSpacing: "-0.5px",
                }}
              >
                ₹{grandTotal.toLocaleString()}
              </span>
            </div>

            {paymentMode !== "cod" && (
              <div
                style={{
                  background: "#fff8e1",
                  border: "1px solid #FEE12B",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  fontSize: "13px",
                  color: "#7a6000",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "16px" }}>⚠️</span>
                <span>
                  Some netbanking options may be unavailable. Please use{" "}
                  <strong>UPI or Card</strong> for the best experience.
                </span>
              </div>
            )}

            <button
              onClick={placeOrder}
              disabled={
                loading ||
                (paymentMode === "cod" && codAdvance > 0 && !codConfirmed)
              }
              style={{
                width: "100%",
                padding: "14px",
                background: "#FEE12B",
                color: "#111",
                border: "none",
                borderRadius: "8px",
                fontWeight: "900",
                fontSize: "15px",
                cursor:
                  loading ||
                  (paymentMode === "cod" &&
                    codAdvance > 0 &&
                    !codConfirmed)
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  loading ||
                  (paymentMode === "cod" &&
                    codAdvance > 0 &&
                    !codConfirmed)
                    ? 0.6
                    : 1,
                fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.background = "#f5d400";
              }}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#FEE12B")
              }
            >
              {loading
                ? "Processing..."
                : paymentMode === "cod"
                ? codAdvance > 0
                  ? `Pay ₹${codAdvance.toLocaleString()} Advance →`
                  : "Place COD Order →"
                : `Pay ₹${grandTotal.toLocaleString()} →`}
            </button>

            {paymentMode === "cod" && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  color: "#aaa",
                  margin: "8px 0 0",
                }}
              >
                ₹
                {(codAdvance > 0
                  ? codOnDelivery
                  : grandTotal
                ).toLocaleString()}{" "}
                collected at your doorstep
              </p>
            )}
            <p
              style={{
                textAlign: "center",
                fontSize: "12px",
                color: "#aaa",
                margin: "12px 0 0",
              }}
            >
              🔒 100% secure & encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
