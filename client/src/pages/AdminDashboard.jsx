import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Robust token retriever with fallback keys
  const getAdminToken = () =>
    localStorage.getItem("adminToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  // Tab control: 'inventory' | 'analytics' | 'create-admin'
  const [activeTab, setActiveTab] = useState("inventory");

  // Data States
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Analytics Mock Data
  const [analytics] = useState({
    totalSales: 18450,
    ordersCount: 64,
    topCategory: "Kurtis",
    recentTransactions: [
      { id: "ORD-9901", item: "Zardozi Embroidered Silk Kurti", amount: 240, date: "2026-08-02", status: "Completed" },
      { id: "ORD-9902", item: "Royal Crimson Velvet Lehenga", amount: 850, date: "2026-08-02", status: "Processing" },
      { id: "ORD-9903", item: "Kashmiri Pashmina Shawl", amount: 320, date: "2026-08-01", status: "Completed" },
    ],
  });

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // 4. Create Secondary Admin
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
      {/* Top Admin Bar */}
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
        {/* Tab Navigation */}
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
            onClick={() => setActiveTab("analytics")}
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

        {/* TAB 2: SALES & PERFORMANCE ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-[#C89B3C]/30 rounded-sm shadow-sm">
                <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] block mb-1">
                  Total Gross Revenue
                </span>
                <p className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812] font-bold">
                  ${analytics.totalSales.toLocaleString()}
                </p>
                <span className="text-[10px] text-green-600 mt-2 block">↑ 18.4% from last month</span>
              </div>

              <div className="bg-white p-6 border border-[#C89B3C]/30 rounded-sm shadow-sm">
                <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] block mb-1">
                  Successful Orders
                </span>
                <p className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812] font-bold">
                  {analytics.ordersCount}
                </p>
                <span className="text-[10px] text-gray-500 mt-2 block">Across all luxury categories</span>
              </div>

              <div className="bg-white p-6 border border-[#C89B3C]/30 rounded-sm shadow-sm">
                <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] block mb-1">
                  Top Performing Category
                </span>
                <p className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#5C1225] font-bold">
                  {analytics.topCategory}
                </p>
                <span className="text-[10px] text-gray-500 mt-2 block">Accounts for 42% of revenue</span>
              </div>
            </div>

            <div className="bg-white border border-[#C89B3C]/30 p-6 rounded-sm shadow-sm">
              <h3 className="font-['Cinzel',serif] text-sm uppercase text-[#8A4A2A] tracking-wider mb-4 border-b pb-2">
                Recent Customer Orders & Transactions
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2C0812] text-[#E8CB86] uppercase font-['Cinzel',serif]">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Item Purchased</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {analytics.recentTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#FBF3E7]/20">
                        <td className="p-3 font-mono font-semibold">{tx.id}</td>
                        <td className="p-3 font-semibold text-[#2C0812]">{tx.item}</td>
                        <td className="p-3 text-gray-600">{tx.date}</td>
                        <td className="p-3 font-semibold text-[#C89B3C]">${tx.amount}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 text-[10px] rounded-xs font-semibold ${
                              tx.status === "Completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CREATE SECONDARY ADMIN */}
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