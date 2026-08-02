import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Retrieve user token or guest session ID for Redis key reference
  const getSessionHeader = () => {
    const token = localStorage.getItem("authToken");
    const sessionId = localStorage.getItem("cartSessionId") || "guest_session_1";
    return token ? { Authorization: `Bearer ${token}` } : { "x-session-id": sessionId };
  };

  // 1. FETCH CART FROM REDIS BACKEND
  const fetchCart = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/cart", {
        headers: { ...getSessionHeader() },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch {
      // Fallback Demo Cart Data for local testing before Redis backend connects
      setCart({
        items: [
          {
            productId: "prod_1",
            name: "Zardozi Embroidered Silk Kurti",
            price: 240,
            quantity: 1,
            size: "M",
            color: "Maroon",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
          },
          {
            productId: "prod_2",
            name: "Handwoven Banarasi Dupatta",
            price: 120,
            quantity: 2,
            size: "Free Size",
            color: "Gold",
            image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=400",
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. UPDATE ITEM QUANTITY IN REDIS (HINCRBY / JSON.NUMINCRBY)
  const handleUpdateQuantity = async (productId, delta) => {
    if (!cart) return;
    setUpdatingId(productId);

    // Optimistic UI Update
    const updatedItems = cart.items
      .map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setCart({ ...cart, items: updatedItems });

    try {
      await fetch("http://localhost:5000/api/cart/item", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getSessionHeader(),
        },
        body: JSON.stringify({ productId, delta }),
      });
    } catch {
      // Retain optimistic state locally if API is offline
    } finally {
      setUpdatingId(null);
    }
  };

  // 3. REMOVE ITEM FROM REDIS (HDEL / JSON.DEL)
  const handleRemoveItem = async (productId) => {
    setUpdatingId(productId);

    // Optimistic UI Update
    const updatedItems = cart.items.filter((item) => item.productId !== productId);
    setCart({ ...cart, items: updatedItems });

    try {
      await fetch(`http://localhost:5000/api/cart/item/${productId}`, {
        method: "DELETE",
        headers: { ...getSessionHeader() },
      });
    } catch {
      // Retain local state
    } finally {
      setUpdatingId(null);
    }
  };

  // 4. CLEAR ENTIRE CART (DEL cart:user_id)
  const handleClearCart = async () => {
    setCart({ items: [] });
    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "DELETE",
        headers: { ...getSessionHeader() },
      });
    } catch {
      // Local reset
    }
  };

  // Calculations
  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shipping;

  if (loading) {
    return <GarmentLoader message="Retrieving Shopping Bag..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10 text-center">
        <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.28em] text-[#8A4A2A] block mb-2">
          Shopping Atelier
        </span>
        <h1 className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812]">
          Your Shopping Cart
        </h1>
      </div>

      {/* --- EMPTY CART STATE --- */}
      {items.length === 0 ? (
        <div className="max-w-xl mx-auto text-center py-20 bg-white border border-[#C89B3C]/20 rounded-sm p-8 shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 text-[#C89B3C] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-12 h-12">
              <path d="M6 8h12l-1 13H7L6 8z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </div>
          <h2 className="font-['Cormorant_Garamond',serif] italic text-3xl text-[#2C0812] mb-3">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-[#241713]/70 font-['Jost',sans-serif] max-w-sm mx-auto mb-8">
            You haven't added any handcrafted pieces to your collection yet.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#C89B3C] text-[#2C0812] px-8 py-3.5 font-['Cinzel',serif] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#E8CB86] transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        /* --- ACTIVE CART STATE --- */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center border-b border-[#C89B3C]/20 pb-4">
              <span className="font-['Cinzel',serif] text-xs uppercase text-[#8A4A2A]">
                Selected Items ({items.reduce((a, b) => a + b.quantity, 0)})
              </span>
              <button
                onClick={handleClearCart}
                className="text-xs font-['Cinzel',serif] text-[#5C1225] hover:underline uppercase tracking-wider"
              >
                Clear All
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.productId}
                className={`bg-white border border-[#C89B3C]/20 p-4 sm:p-5 rounded-sm flex flex-col sm:flex-row gap-5 items-center justify-between transition-opacity ${
                  updatingId === item.productId ? "opacity-50 pointer-events-none" : "opacity-100"
                }`}
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-sm border border-[#C89B3C]/20 flex-shrink-0"
                  />
                  <div>
                    <span className="font-['Cinzel',serif] text-[9px] uppercase tracking-widest text-[#8A4A2A] block">
                      {item.color} / Size: {item.size}
                    </span>
                    <h3 className="font-['Cormorant_Garamond',serif] italic text-xl text-[#2C0812] font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#C89B3C] mt-1">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 border-[#C89B3C]/10 pt-3 sm:pt-0">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-[#C89B3C]/40 rounded-sm">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, -1)}
                      className="px-3 py-1 text-sm text-[#2C0812] hover:bg-[#FBF3E7] transition-colors"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-[#2C0812]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, 1)}
                      className="px-3 py-1 text-sm text-[#2C0812] hover:bg-[#FBF3E7] transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Total Line Item Price & Remove */}
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#5C1225] font-['Jost',sans-serif]">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-[11px] text-[#8A4A2A] hover:text-[#5C1225] underline mt-1 block"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Box */}
          <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm h-fit">
            <h2 className="font-['Cormorant_Garamond',serif] italic text-2xl text-[#2C0812] border-b border-[#C89B3C]/20 pb-4 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-xs font-['Jost',sans-serif]">
              <div className="flex justify-between text-[#241713]/80">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#241713]/80">
                <span>Estimated Express Delivery</span>
                <span className="font-semibold">${shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-[#C89B3C]/20 pt-4 flex justify-between text-sm font-semibold text-[#5C1225]">
                <span>Total Amount</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => alert("Proceeding to Redis-backed order checkout session...")}
              className="w-full mt-8 bg-[#5C1225] text-[#FBF3E7] py-3.5 font-['Cinzel',serif] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2C0812] transition-colors"
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}