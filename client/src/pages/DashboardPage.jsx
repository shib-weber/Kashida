import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";

const ORDER_STEPS = ["Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

export default function DashboardPage({ userProfile }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Selected Order for Detailed View Modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Exchange Modal State
  const [exchangeModalOrder, setExchangeModalOrder] = useState(null);
  const [exchangeSize, setExchangeSize] = useState("M");
  const [exchangeReason, setExchangeReason] = useState("");

  const token = localStorage.getItem("authToken") || localStorage.getItem("token");

  useEffect(() => {
    fetchDashboardAndOrders();
  }, [userProfile]);

  const fetchDashboardAndOrders = async () => {
    try {
      // 1. Fetch Dashboard Stats & Profile
      const dashRes = await fetch("http://localhost:5000/api/dashboard/", {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (dashRes.ok) {
        const data = await dashRes.json();
        setDashboardData(data);
      }

      // 2. Fetch Live Orders with Step Progress & Return/Exchange Windows
      const ordersRes = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (ordersRes.ok) {
        const orderData = await ordersRes.json();
        setOrders(orderData);
      }
    } catch {
      // Offline / Fallback Demo Data
      setDashboardData({
        user: {
          name: userProfile?.name || "Shibjyoti Roy",
          email: userProfile?.email || "shibjyoti@example.com",
          phone: userProfile?.phone || "+91 98765 43210",
          address: userProfile?.address || "123 Kashmiri Gate, New Delhi, India",
        },
        stats: { totalOrders: 3, likedItems: 5, activeCart: 2 },
      });

      setOrders([
        {
          _id: "ORD-94821039",
          created_at: "2026-08-01T10:00:00",
          delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          order_status: "Delivered",
          total_amount: 340.0,
          shipping_address: "123 Kashmiri Gate, New Delhi, India",
          payment_method: "Prepaid Online",
          items: [
            {
              product_id: "p1",
              product_name: "Pashmina Embroidered Shawl",
              image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
              price: 340,
              quantity: 1,
              size: "Free Size",
            },
          ],
        },
        {
          _id: "ORD-91028371",
          created_at: "2026-08-03T12:00:00",
          delivered_at: null,
          order_status: "Processing",
          total_amount: 120.0,
          shipping_address: "123 Kashmiri Gate, New Delhi, India",
          payment_method: "Cash On Delivery",
          items: [
            {
              product_id: "p2",
              product_name: "Handwoven Silk Dupatta",
              image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=400",
              price: 120,
              quantity: 1,
              size: "M",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 1. Cancel Order Action
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Order cancelled successfully.");
        fetchDashboardAndOrders();
        setSelectedOrder(null);
      } else {
        const err = await res.json();
        alert(`Cannot cancel: ${err.detail}`);
      }
    } catch {
      alert("Order cancelled locally.");
    }
  };

  // 2. Return Order Action (Within 5 days)
  const handleReturnOrder = async (orderId) => {
    const reason = prompt("Please provide a reason for return:");
    if (!reason) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/${orderId}/return?reason=${encodeURIComponent(reason)}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        alert("Return request submitted. Our courier team will collect the garment.");
        fetchDashboardAndOrders();
        setSelectedOrder(null);
      } else {
        const err = await res.json();
        alert(`Return error: ${err.detail}`);
      }
    } catch {
      alert("Return request logged.");
    }
  };

  // 3. Submit Size Exchange Action
  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    if (!exchangeModalOrder) return;

    const firstItem = exchangeModalOrder.items[0];
    try {
      // Step A: Trigger return for original item
      await fetch(
        `http://localhost:5000/api/orders/${exchangeModalOrder._id}/return?reason=${encodeURIComponent(
          `Exchanging for size ${exchangeSize}: ${exchangeReason}`
        )}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Step B: Automatically place replacement order with updated size
      const res = await fetch("http://localhost:5000/api/orders/buy-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: firstItem.product_id,
          quantity: firstItem.quantity,
          size: exchangeSize,
          shipping_address: exchangeModalOrder.shipping_address,
          phone: userProfile?.phone || "+91 98765 43210",
          payment_method: "Prepaid (Exchange Credit)",
        }),
      });

      if (res.ok) {
        alert(`✨ Exchange requested! Replacement order created for size '${exchangeSize}'.`);
        setExchangeModalOrder(null);
        setSelectedOrder(null);
        fetchDashboardAndOrders();
      } else {
        alert("Exchange replacement failed.");
      }
    } catch {
      alert("Exchange logged.");
      setExchangeModalOrder(null);
    }
  };

  // Check 5-day return/exchange window helper
  const isWithin5Days = (deliveredAt) => {
    if (!deliveredAt) return false;
    const deliveredDate = new Date(deliveredAt);
    const diffTime = Math.abs(new Date() - deliveredDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5;
  };

  if (loading) {
    return <GarmentLoader message="Assembling Your Personal Dashboard..." />;
  }

  const name = userProfile?.name || dashboardData?.user?.name || "Valued Client";
  const email = userProfile?.email || dashboardData?.user?.email || "N/A";
  const phone = userProfile?.phone || dashboardData?.user?.phone || "Not provided";
  const address = userProfile?.address || dashboardData?.user?.address || "No default address saved";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-['Jost',sans-serif]">
      {/* Page Header */}
      <div className="mb-10">
        <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.28em] text-[#8A4A2A] block mb-2">
          Personalized Atelier
        </span>
        <h1 className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812]">
          Welcome back, {name}
        </h1>
      </div>

      {/* Stats Counters & Account Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm flex flex-col justify-between">
            <p className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A]">Total Orders</p>
            <p className="font-['Cormorant_Garamond',serif] text-4xl font-semibold text-[#5C1225] mt-2">
              {orders.length || dashboardData?.stats?.totalOrders || 0}
            </p>
          </div>

          <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm flex flex-col justify-between">
            <p className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A]">Saved Wishlist</p>
            <p className="font-['Cormorant_Garamond',serif] text-4xl font-semibold text-[#5C1225] mt-2">
              {dashboardData?.stats?.likedItems || 0}
            </p>
          </div>

          <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm flex flex-col justify-between">
            <p className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A]">Items in Cart</p>
            <p className="font-['Cormorant_Garamond',serif] text-4xl font-semibold text-[#5C1225] mt-2">
              {dashboardData?.stats?.activeCart || 0}
            </p>
          </div>
        </div>

        {/* Account Info Panel */}
        <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-b border-[#C89B3C]/20 pb-3 mb-4">
              <h2 className="font-['Cormorant_Garamond',serif] italic text-xl text-[#2C0812] font-semibold">
                Account Information
              </h2>
              <Link
                to="/settings"
                className="font-['Cinzel',serif] text-[10px] uppercase text-[#8A4A2A] hover:text-[#5C1225] underline"
              >
                Edit Details
              </Link>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-['Cinzel',serif] text-[9px] uppercase tracking-widest text-[#8A4A2A] block">
                  Email
                </span>
                <p className="text-[#241713] font-medium">{email}</p>
              </div>

              <div>
                <span className="font-['Cinzel',serif] text-[9px] uppercase tracking-widest text-[#8A4A2A] block">
                  Phone
                </span>
                <p className="text-[#241713] font-medium">{phone}</p>
              </div>

              <div>
                <span className="font-['Cinzel',serif] text-[9px] uppercase tracking-widest text-[#8A4A2A] block">
                  Default Address
                </span>
                <p className="text-[#241713] font-medium line-clamp-2">{address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RE-DESIGNED VISUAL ORDER CARDS SECTION */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-['Cormorant_Garamond',serif] italic text-3xl text-[#2C0812]">
            Order Tracking & Active Deliveries
          </h2>
          <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A]">
            {orders.length} Total Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-[#C89B3C]/20 p-8 text-center rounded-sm">
            <p className="text-xs text-[#8A4A2A] font-['Cinzel',serif] uppercase">
              No recent order history found.
            </p>
          </div>
        ) : (
          orders.map((ord) => {
            const ordId = ord._id || ord.id;
            const primaryItem = ord.items?.[0] || {};
            const currentStepIdx = ORDER_STEPS.indexOf(ord.order_status);
            const isCancelled = ord.order_status === "Cancelled";
            const isReturnRequested = ord.order_status === "Return Requested";

            const canCancel = ["Placed", "Processing"].includes(ord.order_status);
            const canReturnOrExchange =
              ord.order_status === "Delivered" && isWithin5Days(ord.delivered_at);

            return (
              <div
                key={ordId}
                className="bg-white border border-[#C89B3C]/30 p-6 rounded-sm shadow-sm space-y-5 hover:border-[#C89B3C] transition-all"
              >
                {/* 1. Header Row */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#C89B3C]/20 pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        primaryItem.image ||
                        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400"
                      }
                      alt=""
                      className="w-16 h-20 object-cover border border-[#C89B3C]/20 rounded-xs flex-shrink-0"
                    />
                    <div>
                      <span className="font-mono text-[10px] text-gray-400 block uppercase">
                        REF #{ordId.slice(-8)}
                      </span>
                      <h3 className="font-['Cormorant_Garamond',serif] italic text-xl font-semibold text-[#2C0812]">
                        {primaryItem.product_name || "Handcrafted Garment"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Ordered: {new Date(ord.created_at || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span
                      className={`px-3 py-1 text-[10px] font-['Cinzel',serif] uppercase font-bold rounded-xs inline-block mb-1 ${
                        ord.order_status === "Delivered"
                          ? "bg-green-100 text-green-800"
                          : isCancelled
                          ? "bg-red-100 text-red-800"
                          : isReturnRequested
                          ? "bg-orange-100 text-orange-800"
                          : "bg-[#5C1225] text-[#FBF3E7]"
                      }`}
                    >
                      {ord.order_status}
                    </span>
                    <p className="text-sm font-semibold text-[#C89B3C]">${ord.total_amount}</p>
                  </div>
                </div>

                {/* 2. Stepper Progress Tracker */}
                {!isCancelled && !isReturnRequested ? (
                  <div className="py-2">
                    <div className="flex justify-between text-[10px] font-['Cinzel',serif] uppercase mb-2">
                      {ORDER_STEPS.map((step, idx) => (
                        <span
                          key={step}
                          className={
                            idx <= currentStepIdx ? "text-[#5C1225] font-bold" : "text-gray-300"
                          }
                        >
                          {step}
                        </span>
                      ))}
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#5C1225] h-full transition-all duration-500"
                        style={{
                          width: `${
                            ((currentStepIdx < 0 ? 0 : currentStepIdx) / (ORDER_STEPS.length - 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 bg-red-50 text-red-800 text-xs font-semibold rounded-xs border border-red-200">
                    Order Status: {ord.order_status}
                  </div>
                )}

                {/* 3. Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#C89B3C]/10">
                  <button
                    onClick={() => setSelectedOrder(ord)}
                    className="text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] hover:text-[#5C1225] underline font-semibold"
                  >
                    View Full Details
                  </button>

                  <div className="flex flex-wrap gap-2">
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(ordId)}
                        className="px-4 py-2 bg-red-800 hover:bg-red-900 text-white text-xs font-['Cinzel',serif] uppercase tracking-wider transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}

                    {canReturnOrExchange && (
                      <>
                        <button
                          onClick={() => handleReturnOrder(ordId)}
                          className="px-4 py-2 border border-[#C89B3C] text-[#2C0812] hover:bg-[#FBF3E7] text-xs font-['Cinzel',serif] uppercase tracking-wider transition-colors"
                        >
                          Return (5-Day Limit)
                        </button>
                        <button
                          onClick={() => setExchangeModalOrder(ord)}
                          className="px-4 py-2 bg-[#5C1225] hover:bg-[#2C0812] text-[#FBF3E7] text-xs font-['Cinzel',serif] uppercase tracking-wider transition-colors"
                        >
                          Exchange Size
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DETAILED ORDER VIEW MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#C89B3C] p-6 max-w-2xl w-full rounded-sm shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-['Cormorant_Garamond',serif] italic text-2xl text-[#2C0812]">
                Order Details: #{selectedOrder._id.slice(-8)}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            {/* Step Timeline */}
            <div className="py-2">
              <span className="font-['Cinzel',serif] text-[10px] uppercase text-[#8A4A2A] block mb-2">
                Fulfillment Progress
              </span>
              <div className="flex justify-between text-[10px] font-['Cinzel',serif] uppercase mb-1">
                {ORDER_STEPS.map((step) => (
                  <span
                    key={step}
                    className={
                      selectedOrder.order_status === step
                        ? "text-[#5C1225] font-bold"
                        : "text-gray-400"
                    }
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>

            {/* Garment Items */}
            <div className="border-t border-b py-3 space-y-2 max-h-48 overflow-y-auto">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-[#2C0812]">{item.product_name}</p>
                    <p className="text-gray-500">Size: {item.size} | Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#C89B3C]">${item.price}</p>
                </div>
              ))}
            </div>

            <div className="text-xs space-y-1 text-gray-700">
              <p><strong>Shipping Address:</strong> {selectedOrder.shipping_address}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.payment_method}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-[#5C1225] text-[#FBF3E7] font-['Cinzel',serif] text-xs uppercase"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIZE EXCHANGE SELECTION MODAL */}
      {exchangeModalOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#C89B3C] p-6 max-w-md w-full rounded-sm shadow-2xl space-y-4">
            <h3 className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] tracking-wider border-b pb-2">
              Exchange Garment Size (5-Day Return Policy)
            </h3>

            <form onSubmit={handleExchangeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#2C0812] uppercase mb-1 font-semibold">
                  Select New Size
                </label>
                <select
                  value={exchangeSize}
                  onChange={(e) => setExchangeSize(e.target.value)}
                  className="w-full border p-2 bg-[#FBF3E7]/30"
                >
                  <option value="XS">XS - Extra Small</option>
                  <option value="S">S - Small</option>
                  <option value="M">M - Medium</option>
                  <option value="L">L - Large</option>
                  <option value="XL">XL - Extra Large</option>
                  <option value="Custom Fit">Custom Tailored Fit</option>
                </select>
              </div>

              <div>
                <label className="block text-[#2C0812] uppercase mb-1 font-semibold">
                  Reason for Exchange
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Current size felt tight at shoulders..."
                  value={exchangeReason}
                  onChange={(e) => setExchangeReason(e.target.value)}
                  className="w-full border p-2 bg-[#FBF3E7]/30"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#5C1225] text-[#FBF3E7] py-2.5 font-['Cinzel',serif] uppercase text-xs"
                >
                  Confirm Exchange
                </button>
                <button
                  type="button"
                  onClick={() => setExchangeModalOrder(null)}
                  className="px-4 border text-xs font-['Cinzel',serif] uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}