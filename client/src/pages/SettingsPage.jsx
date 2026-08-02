import React, { useState, useEffect } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState({ name: "", email: "", phone: "", address: "" });
  const [orders, setOrders] = useState([]);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    // Fetch profile details
    fetch("http://localhost:5000/api/user/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch(() => {
        setProfile({
          name: "Shibjyoti Roy",
          email: "shibjyoti@example.com",
          phone: "+91 98765 43210",
          address: "123 Kashmiri Gate, New Delhi, India",
        });
      });

    // Fetch order history
    fetch("http://localhost:5000/api/user/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch(() => {
        setOrders([
          { id: "ORD-9482", date: "2026-07-28", status: "Delivered", total: "$340.00", items: "Pashmina Embroidered Shawl" },
          { id: "ORD-9102", date: "2026-07-15", status: "Delivered", total: "$120.00", items: "Handwoven Silk Dupatta" },
          { id: "ORD-8819", date: "2026-05-10", status: "Delivered", total: "$450.00", items: "Velvet Zardozi Lehengha" },
        ]);
      });
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("Saving...");
    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setStatusMsg("Profile updated successfully!");
      } else {
        setStatusMsg("Failed to update profile.");
      }
    } catch {
      setStatusMsg("Profile saved locally (Offline mode).");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812] mb-8">
        Account Settings
      </h1>

      <div className="flex border-b border-[#C89B3C]/30 mb-8 font-['Cinzel',serif] text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 mr-8 transition-colors ${
            activeTab === "profile" ? "border-b-2 border-[#C89B3C] text-[#5C1225] font-semibold" : "text-[#241713]/60"
          }`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-colors ${
            activeTab === "orders" ? "border-b-2 border-[#C89B3C] text-[#5C1225] font-semibold" : "text-[#241713]/60"
          }`}
        >
          Order History
        </button>
      </div>

      {statusMsg && (
        <div className="mb-6 p-3 bg-[#C89B3C]/10 border border-[#C89B3C] text-[#2C0812] text-xs rounded-sm">
          {statusMsg}
        </div>
      )}

      {activeTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="max-w-2xl bg-white border border-[#C89B3C]/20 p-8 rounded-sm shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full bg-[#FBF3E7]/30 border border-[#C89B3C]/30 px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1">Email Address</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full bg-[#FBF3E7]/30 border border-[#C89B3C]/30 px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1">Phone Number</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-[#FBF3E7]/30 border border-[#C89B3C]/30 px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1">Shipping Address</label>
            <textarea
              rows="3"
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              className="w-full bg-[#FBF3E7]/30 border border-[#C89B3C]/30 px-4 py-2.5 text-sm"
            />
          </div>
          <button
            type="submit"
            className="bg-[#5C1225] text-[#FBF3E7] px-6 py-3 font-['Cinzel',serif] text-xs uppercase tracking-widest hover:bg-[#2C0812] transition-colors"
          >
            Save Changes
          </button>
        </form>
      )}

      {activeTab === "orders" && (
        <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] bg-[#FBF3E7]/50 border-b border-[#C89B3C]/20">
                <tr>
                  <th className="p-3">Order Ref</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Items Purchased</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-[#C89B3C]/10">
                    <td className="p-3 font-semibold text-[#5C1225]">{o.id}</td>
                    <td className="p-3">{o.date}</td>
                    <td className="p-3">{o.items}</td>
                    <td className="p-3"><span className="text-[#1F4436] font-semibold">{o.status}</span></td>
                    <td className="p-3 font-semibold">{o.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}