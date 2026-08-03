import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Extract JWT string regardless of whether TokenResponse wraps it in .token or .access_token
        const jwtToken =
          data.token?.token ||
          data.access_token ||
          (typeof data.token === "string" ? data.token : null);

        if (!jwtToken) {
          setError("Server returned an invalid authentication token payload.");
          return;
        }

        // Save under all standard keys to guarantee full app compatibility
        localStorage.setItem("adminToken", jwtToken);
        localStorage.setItem("authToken", jwtToken);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("userRole", "admin");

        navigate("/admin/dashboard");
      } else {
        setError(data.detail || "Invalid admin credentials or account lacks privileges.");
      }
    } catch {
      setError("Network error. Unable to reach authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2C0812] px-4 font-['Jost',sans-serif]">
      <div className="max-w-md w-full bg-[#FBF3E7] p-8 sm:p-10 border border-[#C89B3C] rounded-sm shadow-2xl">
        <div className="text-center mb-8">
          <span className="font-['Cinzel',serif] text-[10px] uppercase tracking-[0.3em] text-[#8A4A2A] block mb-1">
            Restricted Merchant Portal
          </span>
          <h1 className="font-['Cormorant_Garamond',serif] italic text-3xl sm:text-4xl text-[#2C0812] font-bold">
            Kashida Atelier
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-800 text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-5 text-xs">
          <div>
            <label className="block font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1.5 font-semibold tracking-wider">
              Admin Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@kashida.com"
              className="w-full p-3 border border-[#C89B3C]/40 bg-white rounded-sm focus:outline-none focus:border-[#5C1225]"
            />
          </div>

          <div>
            <label className="block font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-1.5 font-semibold tracking-wider">
              Secret Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full p-3 border border-[#C89B3C]/40 bg-white rounded-sm focus:outline-none focus:border-[#5C1225]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5C1225] text-[#FBF3E7] py-3.5 font-['Cinzel',serif] text-xs uppercase tracking-widest font-semibold hover:bg-[#2C0812] transition-colors shadow-md mt-4"
          >
            {loading ? "Authenticating Admin..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}