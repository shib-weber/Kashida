import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // "COD" | "Prepaid"
  const [saveToProfile, setSaveToProfile] = useState(true);

  const getSessionHeader = () => {
    const sessionId = localStorage.getItem("cartSessionId") || "guest_session_1";
    return token ? { Authorization: `Bearer ${token}` } : { "x-session-id": sessionId };
  };

  useEffect(() => {
    fetchProfileAndCart();
  }, []);

  const fetchProfileAndCart = async () => {
    setLoading(true);
    try {
      // 1. Fetch Saved Profile Details (Address & Phone)
      if (token) {
        const profRes = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profRes.ok) {
          const profData = await profRes.json();
          if (profData.address) setShippingAddress(profData.address);
          if (profData.phone) setPhone(profData.phone);
        } else {
          // Fallback to cached profile if available
          const cached = localStorage.getItem("userProfile");
          if (cached) {
            const parsed = JSON.parse(cached);
            setShippingAddress(parsed.address || "");
            setPhone(parsed.phone || "");
          }
        }
      }

      // 2. Fetch Active Cart
      const cartRes = await fetch("http://localhost:5000/api/cart", {
        headers: { ...getSessionHeader() },
      });
      if (!cartRes.ok) throw new Error("Failed to fetch cart");
      const data = await cartRes.json();
      setCart(data);
    } catch {
      // Fallback local cart if server fails
      setCart({
        items: [
          {
            productId: "prod_1",
            name: "Zardozi Embroidered Silk Kurti",
            price: 240,
            quantity: 1,
            size: "M",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please log in to complete your order.");
      return navigate("/auth");
    }

    if (!shippingAddress || !phone) {
      return alert("Please enter your complete shipping address and phone number.");
    }

    setSubmitting(true);

    try {
      const items = cart?.items || [];
      if (items.length === 0) return alert("Your cart is empty!");

      // Optional: Save updated Address & Phone to User Profile
      if (saveToProfile) {
        await fetch("http://localhost:5000/api/user/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            address: shippingAddress,
            phone: phone,
          }),
        }).catch(() => {});
      }

      // Submit first item or primary order item using buy-now / order API
      const primaryItem = items[0];
      const res = await fetch("http://localhost:5000/api/orders/buy-now", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: primaryItem.productId || primaryItem.product_id,
          quantity: primaryItem.quantity || 1,
          size: primaryItem.size || "M",
          shipping_address: shippingAddress,
          phone: phone,
          payment_method: paymentMethod,
        }),
      });

      if (res.ok) {
        // Clear cart after placement
        await fetch("http://localhost:5000/api/cart", {
          method: "DELETE",
          headers: { ...getSessionHeader() },
        }).catch(() => {});

        alert("✨ Order placed successfully! Tracking steps initialized.");
        navigate("/dashboard");
      } else {
        const err = await res.json();
        alert(`Failed to place order: ${err.detail || "Server error"}`);
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Unable to process order.");
    } finally {
      setSubmitting(false);
    }
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shipping;

  if (loading) {
    return <GarmentLoader message="Preparing Luxury Checkout..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-['Jost',sans-serif]">
      <div className="mb-10 text-center">
        <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.28em] text-[#8A4A2A] block mb-2">
          Secure Payment Portal
        </span>
        <h1 className="font-[#Cormorant_Garamond',serif] italic text-4xl text-[#2C0812]">
          Complete Your Atelier Order
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Shipping & Payment Form */}
        <div className="lg:col-span-2 bg-white border border-[#C89B3C]/20 p-8 rounded-sm shadow-sm">
          <form onSubmit={handlePlaceOrder} className="space-y-6 text-xs">
            {/* Delivery Address Section */}
            <div>
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] tracking-wider">
                  1. Delivery Destination
                </h2>
                <span className="text-[10px] text-gray-500 italic">Pre-filled from account settings</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[#2C0812] uppercase mb-1 font-semibold">
                    Shipping Address
                  </label>
                  <textarea
                    required
                    rows="3"
                    placeholder="House No., Street Name, City, Pincode"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full border p-3 border-[#C89B3C]/40 bg-[#FBF3E7]/20 rounded-sm focus:outline-none focus:border-[#5C1225]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C0812] uppercase mb-1 font-semibold">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border p-3 border-[#C89B3C]/40 bg-[#FBF3E7]/20 rounded-sm focus:outline-none focus:border-[#5C1225]"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-[#2C0812] pt-1">
                  <input
                    type="checkbox"
                    checked={saveToProfile}
                    onChange={(e) => setSaveToProfile(e.target.checked)}
                    className="accent-[#5C1225]"
                  />
                  <span>Save this shipping address and contact number to my account profile</span>
                </label>
              </div>
            </div>

            {/* Payment Method Options */}
            <div>
              <h2 className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A] tracking-wider mb-4 border-b pb-2">
                2. Select Payment Option
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label
                  className={`border p-4 rounded-sm cursor-pointer flex items-center gap-3 transition-colors ${
                    paymentMethod === "COD"
                      ? "border-[#5C1225] bg-[#FBF3E7]/40"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <span className="font-semibold text-[#2C0812] block">
                      Cash on Delivery (COD)
                    </span>
                    <span className="text-[10px] text-gray-500">Pay at your doorstep</span>
                  </div>
                </label>

                <label
                  className={`border p-4 rounded-sm cursor-pointer flex items-center gap-3 transition-colors ${
                    paymentMethod === "Prepaid"
                      ? "border-[#5C1225] bg-[#FBF3E7]/40"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Prepaid"
                    checked={paymentMethod === "Prepaid"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div>
                    <span className="font-semibold text-[#2C0812] block">
                      Instant Online Payment
                    </span>
                    <span className="text-[10px] text-gray-500">Credit/Debit Card / UPI</span>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#5C1225] text-[#FBF3E7] py-4 font-['Cinzel',serif] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2C0812] transition-colors shadow-md"
            >
              {submitting ? "Processing Order..." : `Pay & Place Order ($${grandTotal.toFixed(2)})`}
            </button>
          </form>
        </div>

        {/* Order Items Preview */}
        <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm h-fit space-y-4">
          <h2 className="font-['Cormorant_Garamond',serif] italic text-2xl text-[#2C0812] border-b pb-3">
            Garments Summary ({items.length})
          </h2>

          <div className="divide-y max-h-80 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="py-3 flex gap-4 items-center">
                <img
                  src={item.image}
                  alt=""
                  className="w-14 h-16 object-cover border rounded-sm"
                />
                <div className="text-xs">
                  <p className="font-semibold text-[#2C0812]">{item.name}</p>
                  <p className="text-gray-500">
                    Qty: {item.quantity} | Size: {item.size || "M"}
                  </p>
                  <p className="text-[#C89B3C] font-semibold">${item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Express Delivery</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm text-[#5C1225] pt-2 border-t">
              <span>Total Amount</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}