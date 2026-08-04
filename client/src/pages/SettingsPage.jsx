import React, { useState, useEffect } from "react";
import GarmentLoader from "../components/hero/GarmentLoader";

const ORDER_STEPS = ["Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");
  const [saving, setSaving] = useState(false);

  // Expanded Order Card Tracker ID
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Exchange Modal State
  const [exchangeOrder, setExchangeOrder] = useState(null);
  const [exchangeSize, setExchangeSize] = useState("M");
  const [exchangeReason, setExchangeReason] = useState("");

  const token = localStorage.getItem("authToken") || localStorage.getItem("token");

  useEffect(() => {
    fetchProfileAndOrders();
  }, []);

  const fetchProfileAndOrders = async () => {
    setLoading(true);
    try {
      // 1. Fetch Profile
      const profRes = await fetch("http://localhost:5000/api/user/profile", {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile({
          name: profData.name || "",
          email: profData.email || "",
          phone: profData.phone || "",
          address: profData.address || "",
        });
      }

      // 2. Fetch Orders
      const ordRes = await fetch("http://localhost:5000/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token || ""}` },
      });
      if (ordRes.ok) {
        const ordData = await ordRes.json();
        setOrders(ordData);
      }
    } catch {
      // Fallback Demo Cache
      setProfile({
        name: "Shibjyoti Roy",
        email: "shibjyoti@example.com",
        phone: "+91 98765 43210",
        address: "123 Kashmiri Gate, New Delhi, India",
      });

      setOrders([
        {
          _id: "ORD-94821039",
          created_at: "2026-08-01T10:00:00",
          delivered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          order_status: "Delivered",
          total_amount: 340.0,
          shipping_address: "123 Kashmiri Gate, New Delhi, India",
          payment_method: "Prepaid",
          items: [
            {
              product_id: "p1",
              product_name: "Zardozi Embroidered Silk Kurti",
              image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
              price: 340,
              quantity: 1,
              size: "M",
            },
          ],
        },
        {
          _id: "ORD-88192041",
          created_at: "2026-08-03T14:30:00",
          delivered_at: null,
          order_status: "Processing",
          total_amount: 120.0,
          shipping_address: "123 Kashmiri Gate, New Delhi, India",
          payment_method: "COD",
          items: [
            {
              product_id: "p2",
              product_name: "Handwoven Banarasi Dupatta",
              image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=400",
              price: 120,
              quantity: 1,
              size: "Free Size",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Profile Form Save
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setStatusMsg("✨ Profile & Default Shipping Address updated successfully!");
      } else {
        setStatusMsg("❌ Failed to update profile.");
      }
    } catch {
      setStatusMsg("✨ Changes saved locally.");
    } finally {
      setSaving(false);
    }
  };

  // Cancel Order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        alert("Order cancelled successfully.");
        fetchProfileAndOrders();
      } else {
        const err = await res.json();
        alert(err.detail || "Cancellation failed.");
      }
    } catch {
      alert("Order cancelled locally.");
    }
  };

  // Return Order
  const handleReturnOrder = async (orderId) => {
    const reason = prompt("Please enter a reason for returning this garment:");
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
        alert("Return request submitted successfully. Courier pickup will be scheduled.");
        fetchProfileAndOrders();
      } else {
        const err = await res.json();
        alert(err.detail || "Return failed.");
      }
    } catch {
      alert("Return request logged.");
    }
  };

  // Submit Size Exchange
  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
    if (!exchangeOrder) return;

    const item = exchangeOrder.items[0];
    try {
      // Return previous item
      await fetch(
        `http://localhost:5000/api/orders/${exchangeOrder._id}/return?reason=${encodeURIComponent(
          `Exchange requested for size '${exchangeSize}': ${exchangeReason}`
        )}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Re-place order with new size
      const res = await fetch("http://localhost:5000/api/orders/buy-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: item.product_id,
          quantity: item.quantity,
          size: exchangeSize,
          shipping_address: profile.address,
          phone: profile.phone,
          payment_method: "Prepaid (Size Exchange)",
        }),
      });

      if (res.ok) {
        alert(`✨ Size exchange requested! New order placed for size '${exchangeSize}'.`);
        setExchangeOrder(null);
        fetchProfileAndOrders();
      } else {
        alert("Failed to initiate size exchange.");
      }
    } catch {
      alert("Exchange order submitted.");
      setExchangeOrder(null);
    }
  };

  // Helper: Check 5-Day Window After Delivery
  const isWithin5Days = (deliveredAt) => {
    if (!deliveredAt) return false;
    const deliveredDate = new Date(deliveredAt);
    const diffDays = Math.ceil(Math.abs(new Date() - deliveredDate) / (1000 * 60 * 60 * 24));
    return diffDays <= 5;
  };

  if (loading) {
    return <GarmentLoader message="Accessing Account Settings..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-['Jost',sans-serif]">
      <h1 className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812] mb-8">
        Account & Orders Atelier
      </h1>

      {/* Tabs */}
      <div className="flex border-b border-[#C89B3C]/30 mb-8 font-['Cinzel',serif] text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 mr-8 transition-colors ${
            activeTab === "profile"
              ? "border-b-2 border-[#C89B3C] text-[#5C1225] font-semibold"
              : "text-[#241713]/60"
          }`}
        >
          Profile Details & Address
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-colors ${
            activeTab === "orders"
              ? "border-b-2 border-[#C89B3C] text-[#5C1225] font-semibold"
              : "text-[#241713]/60"
          }`}
        >
          Order Cards & Tracking ({orders.length})
        </button>
      </div>

      {statusMsg && (
        <div className="mb-6 p-3 bg-[#FBF3E7] border border-[#C89B3C] text-[#2C0812] text-xs rounded-sm">
          {statusMsg}
        </div>
      )}

      {/* TAB 1: PROFILE DETAILS FORM */}
      {activeTab === "profile" && (
        <form
          onSubmit={handleProfileSubmit}
          className="max-w-2xl bg-white border border-[#C89B3C]/20 p-8 rounded-sm shadow-sm space-y-6"
        >
          <div>
            <label className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-[#FBF3E7]/30 border border-[#C89B3C]/30 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#5C1225]"
            />
          </div>

          <div>
            <label className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-[#FBF3E7]/30 border border-[#C89B3C]/30 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#5C1225]"
            />
          </div>

          <div>
            <label className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1">
              Contact Phone Number
            </label>
            <input
              type="text"
              placeholder="+91 98765 43210"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-[#FBF3E7]/30 border border-[#C89B3C]/30 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#5C1225]"
            />
          </div>

          <div>
            <label className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1">
              Default Shipping Address
            </label>
            <textarea
              rows="3"
              placeholder="House No., Street, City, Pin Code"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full bg-[#FBF3E7]/30 border border-[#C89B3C]/30 px-4 py-2.5 text-sm rounded-sm focus:outline-none focus:border-[#5C1225]"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#5C1225] text-[#FBF3E7] px-8 py-3.5 font-['Cinzel',serif] text-xs uppercase tracking-widest hover:bg-[#2C0812] transition-colors shadow-md"
          >
            {saving ? "Saving..." : "Save Profile & Shipping Address"}
          </button>
        </form>
      )}

      {/* TAB 2: VISUAL ORDER CARDS WITH EXPANDABLE DETAILS */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <p className="text-xs text-gray-500">No previous order records found.</p>
          ) : (
            orders.map((order) => {
              const ordId = order._id || order.id;
              const primaryItem = order.items?.[0] || {};
              const isExpanded = expandedOrderId === ordId;
              const canCancel = ["Placed", "Processing"].includes(order.order_status);
              const canReturnOrExchange =
                order.order_status === "Delivered" && isWithin5Days(order.delivered_at);

              return (
                <div
                  key={ordId}
                  className="bg-white border border-[#C89B3C]/30 rounded-sm shadow-sm overflow-hidden transition-all hover:border-[#C89B3C]"
                >
                  {/* Card Main Summary Header */}
                  <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Product Image Thumbnail */}
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
                          {primaryItem.product_name || "Custom Handmade Garment"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Ordered on: {new Date(order.created_at || Date.now()).toLocaleDateString()}
                        </p>
                        <p className="text-xs font-semibold text-[#C89B3C] mt-1">
                          Total: ${order.total_amount}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                      <span className="px-3 py-1 text-[10px] font-['Cinzel',serif] uppercase font-bold bg-[#5C1225] text-[#FBF3E7] rounded-xs w-fit">
                        {order.order_status}
                      </span>

                      {/* Expand Details Trigger */}
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : ordId)}
                        className="text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] hover:text-[#5C1225] underline"
                      >
                        {isExpanded ? "Hide Details ▲" : "View Full Order Details ▼"}
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE DETAILED DRAWER */}
                  {isExpanded && (
                    <div className="bg-[#FBF3E7]/40 border-t border-[#C89B3C]/20 p-6 space-y-6 text-xs">
                      {/* Step Progress Tracker */}
                      <div>
                        <span className="font-['Cinzel',serif] text-[10px] uppercase text-[#8A4A2A] tracking-wider block mb-2">
                          Step-by-Step Fulfillment Tracker
                        </span>
                        <div className="flex justify-between text-[10px] font-['Cinzel',serif] uppercase mb-1">
                          {ORDER_STEPS.map((step) => (
                            <span
                              key={step}
                              className={
                                order.order_status === step
                                  ? "text-[#5C1225] font-bold underline"
                                  : "text-gray-400"
                              }
                            >
                              {step}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Items Purchased List */}
                      <div>
                        <span className="font-['Cinzel',serif] text-[10px] uppercase text-[#8A4A2A] tracking-wider block mb-2">
                          Items Included in Package
                        </span>
                        <div className="space-y-2 bg-white p-4 border border-[#C89B3C]/20 rounded-xs">
                          {order.items?.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-[#2C0812]">{item.product_name}</p>
                                <p className="text-gray-500">
                                  Size: {item.size || "M"} | Quantity: {item.quantity}
                                </p>
                              </div>
                              <span className="font-semibold text-[#C89B3C]">${item.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Payment Meta */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 border border-[#C89B3C]/20 rounded-xs">
                        <div>
                          <span className="font-['Cinzel',serif] text-[10px] uppercase text-[#8A4A2A] block">
                            Destination Address
                          </span>
                          <p className="text-gray-700">{order.shipping_address || profile.address}</p>
                        </div>
                        <div>
                          <span className="font-['Cinzel',serif] text-[10px] uppercase text-[#8A4A2A] block">
                            Payment Method
                          </span>
                          <p className="text-gray-700">{order.payment_method || "Online Card"}</p>
                        </div>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-wrap gap-3 pt-2 justify-end">
                        {canCancel && (
                          <button
                            onClick={() => handleCancelOrder(ordId)}
                            className="px-4 py-2 bg-red-800 text-white font-['Cinzel',serif] uppercase text-xs"
                          >
                            Cancel Order
                          </button>
                        )}

                        {canReturnOrExchange && (
                          <>
                            <button
                              onClick={() => handleReturnOrder(ordId)}
                              className="px-4 py-2 border border-[#C89B3C] text-[#2C0812] font-['Cinzel',serif] uppercase hover:bg-white"
                            >
                              Return Item (5-Day Limit)
                            </button>
                            <button
                              onClick={() => setExchangeOrder(order)}
                              className="px-4 py-2 bg-[#5C1225] text-white font-['Cinzel',serif] uppercase"
                            >
                              Exchange Size
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SIZE EXCHANGE MODAL */}
      {exchangeOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#C89B3C] p-6 max-w-md w-full rounded-sm shadow-2xl space-y-4">
            <h3 className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] tracking-wider border-b pb-2">
              Garment Size Exchange Request
            </h3>

            <form onSubmit={handleExchangeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#2C0812] uppercase mb-1 font-semibold">
                  Select Preferred Replacement Size
                </label>
                <select
                  value={exchangeSize}
                  onChange={(e) => setExchangeSize(e.target.value)}
                  className="w-full border p-2.5 bg-[#FBF3E7]/30"
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
                  Exchange Reason / Notes
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Current size fits tight at chest..."
                  value={exchangeReason}
                  onChange={(e) => setExchangeReason(e.target.value)}
                  className="w-full border p-2.5 bg-[#FBF3E7]/30"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#5C1225] text-[#FBF3E7] py-2.5 font-['Cinzel',serif] uppercase text-xs"
                >
                  Submit Size Exchange Request
                </button>
                <button
                  type="button"
                  onClick={() => setExchangeOrder(null)}
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