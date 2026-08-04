import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const getSessionHeader = () => {
    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    const sessionId = localStorage.getItem("cartSessionId") || "guest_session_1";
    return token ? { Authorization: `Bearer ${token}` } : { "x-session-id": sessionId };
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/cart", {
        headers: { ...getSessionHeader() },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch {
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
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, delta) => {
    if (!cart) return;
    setUpdatingId(productId);

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
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    setUpdatingId(productId);
    const updatedItems = cart.items.filter((item) => item.productId !== productId);
    setCart({ ...cart, items: updatedItems });

    try {
      await fetch(`http://localhost:5000/api/cart/item/${productId}`, {
        method: "DELETE",
        headers: { ...getSessionHeader() },
      });
    } catch {
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    setCart({ items: [] });
    try {
      await fetch("http://localhost:5000/api/cart", {
        method: "DELETE",
        headers: { ...getSessionHeader() },
      });
    } catch {}
  };

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 15 : 0;
  const grandTotal = subtotal + shipping;

  if (loading) {
    return <GarmentLoader message="Retrieving Shopping Bag..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-['Jost',sans-serif]">
      <div className="mb-10 text-center">
        <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.28em] text-[#8A4A2A] block mb-2">
          Shopping Atelier
        </span>
        <h1 className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812]">
          Your Shopping Cart
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="max-w-xl mx-auto text-center py-20 bg-white border border-[#C89B3C]/20 rounded-sm p-8 shadow-sm">
          <h2 className="font-['Cormorant_Garamond',serif] italic text-3xl text-[#2C0812] mb-3">
            Your Bag is Empty
          </h2>
          <Link
            to="/"
            className="inline-block bg-[#C89B3C] text-[#2C0812] px-8 py-3.5 font-['Cinzel',serif] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#E8CB86] transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                    <h3 className="font-['Cormorant_Garamond',serif] italic text-xl text-[#2C0812] font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-sm font-semibold text-[#C89B3C] mt-1">${item.price}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  <div className="flex items-center border border-[#C89B3C]/40 rounded-sm">
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, -1)}
                      className="px-3 py-1 text-sm text-[#2C0812]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, 1)}
                      className="px-3 py-1 text-sm text-[#2C0812]"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="text-[11px] text-[#8A4A2A] hover:text-[#5C1225] underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-[#C89B3C]/20 p-6 rounded-sm shadow-sm h-fit">
            <h2 className="font-['Cormorant_Garamond',serif] italic text-2xl text-[#2C0812] border-b pb-4 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-sm text-[#5C1225] border-t pt-4">
                <span>Total Amount</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* DIRECT NAVIGATION TO PAYMENT / CHECKOUT PAGE */}
            <button
              onClick={() => navigate("/checkout")}
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