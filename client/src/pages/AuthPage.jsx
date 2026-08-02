import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";
import DashboardPage from "./DashboardPage";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState(null);
  
  // State tracking logged-in user profile
  const [userProfile, setUserProfile] = useState(null);

  // 1. Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUserProfile(token);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  // Verify token & fetch customer details
  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Session expired. Please log in again.");
      }

      const data = await response.json();
      setUserProfile(data);
    } catch (err) {
      localStorage.removeItem("authToken");
      setUserProfile(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Handle Authentication Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (data.token) {
        localStorage.setItem("authToken", data.token);
        await fetchUserProfile(data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setUserProfile(null);
    setFormData({ name: "", email: "", password: "" });
  };

  if (checkingAuth) {
    return <GarmentLoader message="Verifying Account Details..." />;
  }

  // LOGGED IN STATE: Pass userProfile to DashboardPage
  if (userProfile) {
    return (
      <div className="relative">
        <div className="bg-[#2C0812] text-[#FBF3E7] px-6 py-2.5 flex justify-between items-center border-b border-[#C89B3C]/30 text-xs font-['Cinzel',serif]">
          <span className="tracking-widest text-[#E8CB86] uppercase">
            Logged in as {userProfile.name || userProfile.email}
          </span>
          <button
            onClick={handleLogout}
            className="text-[#E8CB86] hover:text-white underline underline-offset-4 tracking-wider uppercase"
          >
            Sign Out
          </button>
        </div>

        {/* Pass userProfile down as props */}
        <DashboardPage userProfile={userProfile} />
      </div>
    );
  }

  // LOGGED OUT STATE: Render Auth Form
  return (
    <div className="min-h-screen bg-[#2C0812] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#FBF3E7] border border-[#C89B3C]/30 rounded-sm p-8 shadow-2xl">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="font-['Cinzel',serif] text-2xl tracking-[0.25em] text-[#5C1225] font-semibold block mb-2"
          >
            KASHIDA
          </Link>
          <span className="font-['Cinzel',serif] text-[11px] tracking-[0.28em] text-[#8A4A2A] uppercase block">
            {isLogin ? "Welcome Back" : "Join The Collection"}
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-[#5C1225]/10 border border-[#5C1225] text-[#5C1225] text-xs rounded-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-xs font-['Cinzel',serif] tracking-wider text-[#241713] uppercase mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-white border border-[#C89B3C]/40 px-4 py-2.5 text-sm text-[#241713] focus:outline-none focus:border-[#C89B3C]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-['Cinzel',serif] tracking-wider text-[#241713] uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white border border-[#C89B3C]/40 px-4 py-2.5 text-sm text-[#241713] focus:outline-none focus:border-[#C89B3C]"
            />
          </div>

          <div>
            <label className="block text-xs font-['Cinzel',serif] tracking-wider text-[#241713] uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white border border-[#C89B3C]/40 px-4 py-2.5 text-sm text-[#241713] focus:outline-none focus:border-[#C89B3C]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C89B3C] text-[#2C0812] py-3 font-['Cinzel',serif] text-xs uppercase tracking-[0.18em] font-semibold hover:bg-[#E8CB86] transition-colors"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="text-xs text-[#8A4A2A] hover:text-[#5C1225] underline underline-offset-4"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already registered? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}