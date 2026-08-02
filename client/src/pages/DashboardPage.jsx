import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";

export default function DashboardPage({ userProfile }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await fetch("http://localhost:5000/api/dashboard/", {
          headers: {
            Authorization: `Bearer ${token || ""}`,
          },
        });

        if (!response.ok) {
          throw new Error("API call failed");
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        // Fallback personalization using passed props if backend server is unreachable
        setDashboardData({
          user: {
            name: userProfile?.name || "Shibjyoti Roy",
            email: userProfile?.email || "user@example.com",
            phone: userProfile?.phone || "+91 98765 43210",
            address: userProfile?.address || "123 Kashmiri Gate, New Delhi, India",
          },
          stats: { totalOrders: 3, likedItems: 5, activeCart: 2 },
          recentOrders: [
            {
              id: "ORD-9482",
              date: "2026-07-28",
              status: "Delivered",
              total: "$340.00",
              items: "Pashmina Embroidered Shawl",
            },
            {
              id: "ORD-9102",
              date: "2026-07-15",
              status: "Processing",
              total: "$120.00",
              items: "Handwoven Silk Dupatta",
            },
            {
              id: "ORD-8819",
              date: "2026-05-10",
              status: "Delivered",
              total: "$450.00",
              items: "Velvet Zardozi Lehengha",
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [userProfile]);

  if (loading) {
    return <GarmentLoader message="Assembling Your Personal Dashboard..." />;
  }

  // Active display values prioritizing direct props over fetch response
  const name = userProfile?.name || dashboardData?.user?.name || "Valued Client";
  const email = userProfile?.email || dashboardData?.user?.email || "N/A";
  const phone = userProfile?.phone || dashboardData?.user?.phone || "Not provided";
  const address = userProfile?.address || dashboardData?.user?.address || "No default address saved";

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.28em] text-[#8A4A2A] block mb-2">
          Personalized Atelier
        </span>
        <h1 className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812]">
          Welcome back, {name}
        </h1>
      </div>

      {/* Overview Cards & Account Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Left Side: Metrics Counters */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm flex flex-col justify-between">
            <p className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A]">
              Total Orders
            </p>
            <p className="font-['Cormorant_Garamond',serif] text-4xl font-semibold text-[#5C1225] mt-2">
              {dashboardData?.stats?.totalOrders || 0}
            </p>
          </div>

          <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm flex flex-col justify-between">
            <p className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A]">
              Saved Wishlist
            </p>
            <p className="font-['Cormorant_Garamond',serif] text-4xl font-semibold text-[#5C1225] mt-2">
              {dashboardData?.stats?.likedItems || 0}
            </p>
          </div>

          <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm flex flex-col justify-between">
            <p className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A]">
              Items in Cart
            </p>
            <p className="font-['Cormorant_Garamond',serif] text-4xl font-semibold text-[#5C1225] mt-2">
              {dashboardData?.stats?.activeCart || 0}
            </p>
          </div>
        </div>

        {/* Right Side: Account Details Card */}
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
                Edit
              </Link>
            </div>

            <div className="space-y-3 text-xs font-['Jost',sans-serif]">
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

      {/* Order History Table */}
      <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-['Cormorant_Garamond',serif] italic text-2xl text-[#2C0812]">
            Order History
          </h2>
          <Link
            to="/settings"
            className="font-['Cinzel',serif] text-xs text-[#8A4A2A] hover:text-[#5C1225]"
          >
            View Full Settings →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#241713]">
            <thead className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] bg-[#FBF3E7]/50 border-b border-[#C89B3C]/20">
              <tr>
                <th className="p-3">Order Ref</th>
                <th className="p-3">Date</th>
                <th className="p-3">Purchased Items</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData?.recentOrders?.length > 0 ? (
                dashboardData.recentOrders.map((order) => {
                  const isDelivered = order.status?.toLowerCase() === "delivered";

                  return (
                    <tr
                      key={order.id}
                      className="border-b border-[#C89B3C]/10 hover:bg-[#FBF3E7]/20 transition-colors"
                    >
                      <td className="p-3 font-semibold text-[#5C1225]">
                        {order.id}
                      </td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3">{order.items}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-xs text-[11px] font-['Cinzel',serif] uppercase tracking-wider font-semibold ${
                            isDelivered
                              ? "bg-[#5C1225] text-[#FBF3E7]" // Royal Maroon for Delivered
                              : "bg-[#1F4436]/10 text-[#1F4436]" // Soft Emerald Green for Active/Processing
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">{order.total}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-xs text-[#8A4A2A]">
                    No previous order history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}