import React, { useState, useEffect } from "react";

const ORDER_STEPS = ["Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch {
      console.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchOrders();
      else {
        const err = await res.json();
        alert(err.detail);
      }
    } catch {
      alert("Error cancelling order.");
    }
  };

  const handleReturn = async (orderId) => {
    const reason = prompt("Please specify your reason for requesting a return:");
    if (!reason) return;

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/return?reason=${encodeURIComponent(reason)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchOrders();
      else {
        const err = await res.json();
        alert(err.detail);
      }
    } catch {
      alert("Error submitting return request.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E7] font-['Jost',sans-serif] p-6 max-w-5xl mx-auto">
      <h1 className="font-['Cormorant_Garamond',serif] italic text-3xl font-bold text-[#2C0812] mb-6">
        My Orders & Track Status
      </h1>

      {loading ? (
        <p className="text-xs">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-xs text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStepIdx = ORDER_STEPS.indexOf(order.order_status);
            const isCancelled = order.order_status === "Cancelled";
            const isReturnRequested = order.order_status === "Return Requested";

            return (
              <div key={order._id} className="bg-white border border-[#C89B3C]/30 p-6 rounded-sm shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b pb-3 text-xs">
                  <div>
                    <span className="font-mono text-gray-500">ORDER #{order._id.slice(-8)}</span>
                    <span className="block text-[10px] text-gray-400">
                      {new Date(order.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right font-semibold text-[#5C1225]">${order.total_amount}</div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img src={item.image} alt="" className="w-12 h-14 object-cover border" />
                      <div className="text-xs">
                        <p className="font-semibold text-[#2C0812]">{item.product_name}</p>
                        <p className="text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Timeline Progress Bar */}
                {!isCancelled && !isReturnRequested ? (
                  <div className="py-4">
                    <div className="flex justify-between text-[10px] font-['Cinzel',serif] uppercase mb-2">
                      {ORDER_STEPS.map((step, idx) => (
                        <span
                          key={step}
                          className={idx <= currentStepIdx ? "text-[#5C1225] font-bold" : "text-gray-300"}
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                    <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#5C1225] h-full transition-all duration-500"
                        style={{
                          width: `${((currentStepIdx < 0 ? 0 : currentStepIdx) / (ORDER_STEPS.length - 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2 bg-red-50 text-red-800 text-xs font-semibold rounded-xs">
                    Status: {order.order_status}
                  </div>
                )}

                {/* Action Buttons: Cancel or Return */}
                <div className="flex justify-end gap-3 pt-2">
                  {["Placed", "Processing"].includes(order.order_status) && (
                    <button
                      onClick={() => handleCancel(order._id)}
                      className="px-4 py-2 bg-red-800 text-white text-xs uppercase tracking-wider font-['Cinzel',serif]"
                    >
                      Cancel Order
                    </button>
                  )}

                  {order.order_status === "Delivered" && (
                    <button
                      onClick={() => handleReturn(order._id)}
                      className="px-4 py-2 border border-[#C89B3C] text-[#2C0812] text-xs uppercase tracking-wider font-['Cinzel',serif] hover:bg-[#FBF3E7]"
                    >
                      Request Return (7 Days)
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}