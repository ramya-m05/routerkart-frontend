"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import API from "../../services/api";

export default function OrderHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: "30px", fontFamily: "'DM Sans', sans-serif" }}>
      <h2>📦 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} style={card}>
            <h4>Order ID: {order._id}</h4>
            <p>Status: {order.status}</p>

            {order.items.map((item, i) => (
              <div key={i} style={row}>
                <div>
                  <span>
                    {item.name} x {item.qty}
                  </span>

                  {/* Review button per product */}
                  {order.status === "Delivered" && (
                    <button
                      onClick={() =>
                        router.push(
                          `/product/${
                            item.productId || item.product || item._id
                          }?review=true`
                        )
                      }
                      style={btn}
                    >
                      ⭐ Write Review
                    </button>
                  )}
                </div>

                <span>₹{item.price * item.qty}</span>
              </div>
            ))}

            <h3>Total: ₹{order.totalAmount}</h3>
          </div>
        ))
      )}
    </div>
  );
}

const btn = {
  marginTop: "6px",
  padding: "6px 10px",
  background: "#FEE12B",
  border: "none",
  borderRadius: "6px",
  fontWeight: "700",
  cursor: "pointer",
  display: "block",
};
const card = {
  background: "white",
  padding: "20px",
  marginBottom: "15px",
  borderRadius: "10px",
};

const row = {
  display: "flex",
  justifyContent: "space-between",
};
