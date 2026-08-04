import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Robust token retriever with fallback keys
  const getAdminToken = () =>
    localStorage.getItem("adminToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  // Tab control: 'inventory' | 'orders' | 'analytics' | 'create-admin'
  const [activeTab, setActiveTab] = useState("inventory");

  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState(null);

  // New Product Form State
  const [newProd, setNewProd] = useState({
    name: "",
    category: "Kurtis",
    price: "",
    description: "",
    fabric: "100% Handcrafted Mulberry Silk",
    tag: "",
    stock_quantity: 10,
  });
  const [imageFile, setImageFile] = useState(null);

  // Secondary Admin Creation Form State
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });

  // Analytics Real/Live State
  const [analytics, setAnalytics] = useState({
    total_revenue: 0,
    total_orders: 0,
    delivered_orders: 0,
    pending_orders: 0,
    returns_requested: 0,
  });

  useEffect(() => {
    fetchProducts();
    fetchAdminOrders();
    fetchAdminAnalytics();
  }, []);

  // Fetch Catalog
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch {
      setStatusMsg("❌ Error fetching active products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Admin Orders
  const fetchAdminOrders = async (statusFilter = "") => {
    setOrdersLoading(true);
    const token = getAdminToken();
    try {
      const url = statusFilter
        ? `http://localhost:5000/api/orders/admin/all?status=${statusFilter}`
        : "http://localhost:5000/api/orders/admin/all";

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch {
      console.error("Failed to fetch admin orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch Analytics
  const fetchAdminAnalytics = async () => {
    const token = getAdminToken();
    try {
      const res = await fetch("http://localhost:5000/api/orders/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data && typeof data.total_revenue !== "undefined") {
        setAnalytics(data);
      }
    } catch {
      console.error("Failed to fetch order analytics.");
    }
  };

  // 1. Publish Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = getAdminToken();
    if (!token) {
      alert("Authentication token missing. Please log in again.");
      return navigate("/admin/login");
    }

    if (!imageFile) return alert("Please select a cover image for the garment!");

    const formData = new FormData();
    Object.keys(newProd).forEach((k) => formData.append(k, newProd[k]));
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/products/admin/add", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setStatusMsg("✨ Product published successfully!");
        setNewProd({
          name: "",
          category: "Kurtis",
          price: "",
          description: "",
          fabric: "100% Handcrafted Mulberry Silk",
          tag: "",
          stock_quantity: 10,
        });
        setImageFile(null);
        fetchProducts();
      } else {
        const err = await res.json();
        alert(`Failed: ${err.detail || "Upload error"}`);
      }
    } catch {
      alert("Network error publishing product.");
    }
  };

  // 2. Edit/Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = getAdminToken();
    const pId = editingProduct._id || editingProduct.id;

    try {
      const res = await fetch(`http://localhost:5000/api/products/admin/${pId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingProduct),
      });

      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
      } else {
        alert("Failed to update product specs.");
      }
    } catch {
      alert("Error updating product.");
    }
  };

  // 3. Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const token = getAdminToken();

    try {
      const res = await fetch(`http://localhost:5000/api/products/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) fetchProducts();
    } catch {
      alert("Failed to delete product.");
    }
  };

  // 4. Update Order Status Step
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    const token = getAdminToken();
    try {
      const res = await fetch(`http://localhost:5000/api/orders/admin/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: newStatus,
          note: `Order status manually set to '${newStatus}' by merchant.`,
        }),
      });

      if (res.ok) {
        setStatusMsg(`✨ Order status updated to '${newStatus}'`);
        fetchAdminOrders();
        fetchAdminAnalytics();
      } else {
        const err = await res.json();
        alert(`Failed: ${err.detail}`);
      }
    } catch {
      alert("Network error updating order status.");
    }
  };

  // 5. Create Secondary Admin
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    const token = getAdminToken();

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAdmin),
      });

      if (res.ok) {
        alert("✨ Secondary admin created successfully!");
        setNewAdmin({ name: "", email: "", password: "" });
      } else {
        const err = await res.json();
        alert(`Error: ${err.detail || "Failed to create admin"}`);
      }
    } catch {
      alert("Failed to create admin.");
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#FBF3E7] font-['Jost',sans-serif]">
      {/* Top Admin Header */}
      <header className="bg-[#2C0812] text-[#FBF3E7] border-b border-[#C89B3C] sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-['Cinzel',serif] text-[10px] tracking-widest text-[#E8CB86] uppercase block">
              Atelier Control Center
            </span>
            <h1 className="font-['Cormorant_Garamond',serif] italic text-2xl font-bold">
              Kashida Merchant Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="bg-[#5C1225] hover:bg-red-800 text-[#FBF3E7] px-4 py-2 border border-[#C89B3C]/40 text-xs font-['Cinzel',serif] uppercase tracking-wider transition-colors"
            >
              Logout 👋
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#C89B3C]/30 pb-3">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-5 py-2.5 text-xs font-['Cinzel',serif] uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "inventory"
                ? "bg-[#5C1225] text-[#FBF3E7]"
                : "bg-white text-[#2C0812] border border-[#C89B3C]/30 hover:border-[#C89B3C]"
            }`}
          >
            📦 Product Inventory
          </button>

          <button
            onClick={() => {
              setActiveTab("orders");
              fetchAdminOrders();
            }}
            className={`px-5 py-2.5 text-xs font-['Cinzel',serif] uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "orders"
                ? "bg-[#5C1225] text-[#FBF3E7]"
                : "bg-white text-[#2C0812] border border-[#C89B3C]/30 hover:border-[#C89B3C]"
            }`}
          >
            📋 Order Fulfillment ({orders.length})
          </button>

          <button
            onClick={() => {
              setActiveTab("analytics");
              fetchAdminAnalytics();
            }}
            className={`px-5 py-2.5 text-xs font-['Cinzel',serif] uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "analytics"
                ? "bg-[#5C1225] text-[#FBF3E7]"
                : "bg-white text-[#2C0812] border border-[#C89B3C]/30 hover:border-[#C89B3C]"
            }`}
          >
            📈 Sales & Analytics
          </button>

          <button
            onClick={() => setActiveTab("create-admin")}
            className={`px-5 py-2.5 text-xs font-['Cinzel',serif] uppercase tracking-wider rounded-sm transition-all ${
              activeTab === "create-admin"
                ? "bg-[#5C1225] text-[#FBF3E7]"
                : "bg-white text-[#2C0812] border border-[#C89B3C]/30 hover:border-[#C89B3C]"
            }`}
          >
            👑 Add New Admin
          </button>
        </div>

        {statusMsg && (
          <div className="mb-6 p-3 bg-[#2C0812] text-[#E8CB86] text-xs font-['Cinzel',serif] uppercase tracking-wider rounded-sm flex justify-between">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg("")}>✕</button>
          </div>
        )}

        {/* TAB 1: PRODUCT INVENTORY MANAGEMENT */}
        {activeTab === "inventory" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Add New Product Form */}
            <div className="bg-white p-6 border border-[#C89B3C]/30 rounded-sm shadow-sm space-y-4 h-fit">
              <h2 className="font-['Cinzel',serif] text-sm uppercase text-[#8A4A2A] tracking-wider border-b pb-2">
                Publish New Garment
              </h2>

              <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="Zardozi Silk Kurti"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full border p-2.5 bg-[#FBF3E7]/20 rounded-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Category</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                      className="w-full border p-2.5 bg-white rounded-sm"
                    >
                      <option value="Kurtis">Kurtis</option>
                      <option value="Lehengas">Lehengas</option>
                      <option value="Sarees">Sarees</option>
                      <option value="Shawls">Shawls</option>
                      <option value="Dupattas">Dupattas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="240"
                      value={newProd.price}
                      onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                      className="w-full border p-2.5 bg-[#FBF3E7]/20 rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Predefined Tag</label>
                  <select
                    value={newProd.tag}
                    onChange={(e) => setNewProd({ ...newProd, tag: e.target.value })}
                    className="w-full border p-2.5 bg-white rounded-sm"
                  >
                    <option value="">No Special Tag</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Handcrafted">Handcrafted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Description</label>
                  <textarea
                    required
                    rows="3"
                    placeholder="Detailed craft specifications..."
                    value={newProd.description}
                    onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                    className="w-full border p-2.5 bg-[#FBF3E7]/20 rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Product Image (File)</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full border p-2 text-xs bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#C89B3C] text-[#2C0812] py-3 font-['Cinzel',serif] text-xs uppercase tracking-widest font-semibold hover:bg-[#E8CB86] transition-colors"
                >
                  Upload & Publish
                </button>
              </form>
            </div>

            {/* Right: Active Products Table */}
            <div className="lg:col-span-2 bg-white border border-[#C89B3C]/30 p-6 rounded-sm shadow-sm space-y-4">
              <h2 className="font-['Cinzel',serif] text-sm uppercase text-[#8A4A2A] tracking-wider border-b pb-2">
                Active Catalog List ({products.length})
              </h2>

              {loading ? (
                <p className="text-xs text-gray-500">Loading catalog...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#2C0812] text-[#E8CB86] uppercase font-['Cinzel',serif]">
                      <tr>
                        <th className="p-3">Cover</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Tag</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {products.map((p) => {
                        const pId = p._id || p.id;
                        return (
                          <tr key={pId} className="hover:bg-[#FBF3E7]/30 transition-colors">
                            <td className="p-3">
                              <img src={p.image} alt="" className="w-10 h-12 object-cover border" />
                            </td>
                            <td className="p-3 font-semibold text-[#2C0812]">{p.name}</td>
                            <td className="p-3">{p.category}</td>
                            <td className="p-3 font-semibold text-[#C89B3C]">${p.price}</td>
                            <td className="p-3">
                              <span className="bg-[#5C1225] text-white text-[9px] px-2 py-0.5 rounded-xs font-['Cinzel',serif] uppercase">
                                {p.tag || "Standard"}
                              </span>
                            </td>
                            <td className="p-3 space-x-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="text-blue-700 hover:underline font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(pId)}
                                className="text-red-600 hover:underline font-semibold"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ORDER FULFILLMENT & TRACKING STEP UPDATES */}
        {activeTab === "orders" && (
          <div className="bg-white border border-[#C89B3C]/30 p-6 rounded-sm shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
              <div>
                <h2 className="font-['Cinzel',serif] text-sm uppercase text-[#8A4A2A] tracking-wider">
                  Live Customer Orders & Fulfillment
                </h2>
                <p className="text-[11px] text-gray-500">
                  Update customer order status steps in real-time.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-1 text-[10px] font-['Cinzel',serif] uppercase">
                <button
                  onClick={() => fetchAdminOrders("")}
                  className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 border rounded-xs"
                >
                  All
                </button>
                <button
                  onClick={() => fetchAdminOrders("Placed")}
                  className="px-2.5 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded-xs"
                >
                  Placed
                </button>
                <button
                  onClick={() => fetchAdminOrders("Processing")}
                  className="px-2.5 py-1 bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200 rounded-xs"
                >
                  Processing
                </button>
                <button
                  onClick={() => fetchAdminOrders("Shipped")}
                  className="px-2.5 py-1 bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 rounded-xs"
                >
                  Shipped
                </button>
                <button
                  onClick={() => fetchAdminOrders("Delivered")}
                  className="px-2.5 py-1 bg-green-50 text-green-800 hover:bg-green-100 border border-green-200 rounded-xs"
                >
                  Delivered
                </button>
                <button
                  onClick={() => fetchAdminOrders("Return Requested")}
                  className="px-2.5 py-1 bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-200 rounded-xs"
                >
                  Returns
                </button>
              </div>
            </div>

            {ordersLoading ? (
              <p className="text-xs text-gray-500">Loading order records...</p>
            ) : orders.length === 0 ? (
              <p className="text-xs text-gray-500">No orders found matching criteria.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C0812] text-[#E8CB86] uppercase font-['Cinzel',serif]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Garments</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Current Status</th>
                      <th className="p-3">Step Controls</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((ord) => {
                      const ordId = ord._id || ord.id;
                      return (
                        <tr key={ordId} className="hover:bg-[#FBF3E7]/20 transition-colors">
                          <td className="p-3 font-mono font-semibold text-[#8A4A2A]">
                            #{ordId.slice(-8)}
                          </td>
                          <td className="p-3">
                            <p className="font-semibold text-[#2C0812]">{ord.customer_name}</p>
                            <p className="text-[10px] text-gray-500">{ord.customer_email}</p>
                            <p className="text-[10px] text-gray-400">{ord.phone}</p>
                          </td>
                          <td className="p-3">
                            {ord.items?.map((item, idx) => (
                              <div key={idx} className="text-[11px]">
                                • {item.product_name} ({item.size}) x {item.quantity}
                              </div>
                            ))}
                          </td>
                          <td className="p-3 font-semibold text-[#C89B3C]">${ord.total_amount}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 text-[9px] font-['Cinzel',serif] uppercase font-bold rounded-xs ${
                                ord.order_status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : ord.order_status === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : ord.order_status === "Return Requested"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {ord.order_status}
                            </span>
                            {ord.return_reason && (
                              <p className="text-[9px] text-red-600 italic mt-1">
                                Reason: {ord.return_reason}
                              </p>
                            )}
                          </td>
                          <td className="p-3">
                            {/* Step Change Dropdown */}
                            <select
                              value={ord.order_status}
                              onChange={(e) => handleOrderStatusUpdate(ordId, e.target.value)}
                              className="border border-[#C89B3C]/50 bg-white p-1 rounded-sm text-xs font-semibold focus:outline-none"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Returned">Returned</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SALES & PERFORMANCE ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-[#C89B3C]/30 rounded-sm shadow-sm">
                <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] block mb-1">
                  Total Gross Revenue
                </span>
                <p className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812] font-bold">
                  ${analytics.total_revenue?.toLocaleString() || "0"}
                </p>
                <span className="text-[10px] text-green-600 mt-2 block">Live sales metric</span>
              </div>

              <div className="bg-white p-6 border border-[#C89B3C]/30 rounded-sm shadow-sm">
                <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] block mb-1">
                  Total Orders
                </span>
                <p className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812] font-bold">
                  {analytics.total_orders || 0}
                </p>
                <span className="text-[10px] text-gray-500 mt-2 block">All active transactions</span>
              </div>

              <div className="bg-white p-6 border border-[#C89B3C]/30 rounded-sm shadow-sm">
                <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] block mb-1">
                  Delivered Garments
                </span>
                <p className="font-['Cormorant_Garamond',serif] italic text-4xl text-green-700 font-bold">
                  {analytics.delivered_orders || 0}
                </p>
                <span className="text-[10px] text-gray-500 mt-2 block">Fulfilled successfully</span>
              </div>

              <div className="bg-white p-6 border border-[#C89B3C]/30 rounded-sm shadow-sm">
                <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] block mb-1">
                  Returns Requested
                </span>
                <p className="font-['Cormorant_Garamond',serif] italic text-4xl text-orange-700 font-bold">
                  {analytics.returns_requested || 0}
                </p>
                <span className="text-[10px] text-gray-500 mt-2 block">Within 7-day window</span>
              </div>
            </div>

            <div className="bg-white border border-[#C89B3C]/30 p-6 rounded-sm shadow-sm">
              <h3 className="font-['Cinzel',serif] text-sm uppercase text-[#8A4A2A] tracking-wider mb-4 border-b pb-2">
                Order Fulfillment Health Summary
              </h3>
              <p className="text-xs text-gray-600">
                You currently have{" "}
                <span className="font-bold text-[#5C1225]">{analytics.pending_orders || 0}</span> orders pending processing or shipment. Maintain quick turnaround times to minimize return rates.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: CREATE SECONDARY ADMIN */}
        {activeTab === "create-admin" && (
          <div className="max-w-md mx-auto bg-white border border-[#C89B3C]/30 p-8 rounded-sm shadow-sm space-y-4">
            <h2 className="font-['Cinzel',serif] text-sm uppercase text-[#8A4A2A] tracking-wider border-b pb-2">
              Delegate Secondary Admin Access
            </h2>
            <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Senior Merchant"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                  className="w-full border p-2.5 bg-[#FBF3E7]/20 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="co-admin@kashida.com"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  className="w-full border p-2.5 bg-[#FBF3E7]/20 rounded-sm"
                />
              </div>

              <div>
                <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Assign Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  className="w-full border p-2.5 bg-[#FBF3E7]/20 rounded-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#5C1225] text-[#FBF3E7] py-3 font-['Cinzel',serif] text-xs uppercase tracking-widest font-semibold hover:bg-[#2C0812] transition-colors"
              >
                Grant Full Admin Authorization
              </button>
            </form>
          </div>
        )}
      </main>

      {/* EDIT PRODUCT MODAL OVERLAY */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-[#C89B3C] p-6 max-w-lg w-full rounded-sm space-y-4 shadow-2xl">
            <h3 className="font-['Cinzel',serif] text-sm uppercase text-[#8A4A2A] tracking-wider border-b pb-2">
              Edit Product Specifications
            </h3>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full border p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Price ($)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full border p-2"
                  />
                </div>

                <div>
                  <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Status Tag</label>
                  <select
                    value={editingProduct.tag || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, tag: e.target.value })}
                    className="w-full border p-2"
                  >
                    <option value="">None</option>
                    <option value="Sold Out">Sold Out</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Handcrafted">Handcrafted</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#8A4A2A] uppercase mb-1 font-semibold">Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full border p-2"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#5C1225] text-[#FBF3E7] py-2 font-['Cinzel',serif] uppercase text-xs"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 border border-gray-300 text-xs font-['Cinzel',serif] uppercase"
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