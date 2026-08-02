import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";

export default function LikesPage() {
  const [likedItems, setLikedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setError("Please log in to view your saved wishlist.");
      setLikedItems([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/likes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to fetch wishlist items.");
      }

      const data = await response.json();
      
      // Safety Guard: Ensure response is an array before setting state
      if (Array.isArray(data)) {
        setLikedItems(data);
      } else {
        setLikedItems([]);
      }
    } catch (err) {
      setError(err.message);
      setLikedItems([]); // Keep state as an array to prevent .map crashes
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveLike = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/likes/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Optimistically remove from state UI
        setLikedItems((prev) => prev.filter((item) => item.id !== productId && item._id !== productId));
      }
    } catch (err) {
      console.error("Error removing item from wishlist:", err);
    }
  };

  if (loading) {
    return <GarmentLoader message="Retrieving Saved Wishlist..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-10">
        <span className="font-['Cinzel',serif] text-xs uppercase tracking-[0.28em] text-[#8A4A2A] block mb-2">
          Curated Selection
        </span>
        <h1 className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812]">
          Your Saved Wishlist
        </h1>
      </div>

      {error ? (
        <div className="bg-[#5C1225]/10 border border-[#5C1225] p-6 text-center text-[#5C1225] rounded-sm">
          <p className="text-sm font-medium mb-4">{error}</p>
          <Link
            to="/auth"
            className="inline-block bg-[#C89B3C] text-[#2C0812] px-6 py-2.5 font-['Cinzel',serif] text-xs uppercase tracking-wider font-semibold hover:bg-[#E8CB86] transition-colors"
          >
            Sign In / Register
          </Link>
        </div>
      ) : likedItems.length === 0 ? (
        <div className="bg-white border border-[#C89B3C]/20 p-12 text-center rounded-sm">
          <p className="font-['Cormorant_Garamond',serif] italic text-2xl text-[#2C0812] mb-3">
            Your Atelier Wishlist is Empty
          </p>
          <p className="text-xs text-[#8A4A2A] mb-6 font-['Jost',sans-serif]">
            Explore our handcrafted collections and save items for later.
          </p>
          <Link
            to="/collection"
            className="inline-block bg-[#5C1225] text-[#FBF3E7] px-6 py-3 font-['Cinzel',serif] text-xs uppercase tracking-[0.2em] hover:bg-[#2C0812] transition-colors"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {likedItems.map((product) => (
            <div
              key={product.id || product._id}
              className="bg-white border border-[#C89B3C]/20 rounded-sm overflow-hidden shadow-sm group relative flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] overflow-hidden bg-[#FBF3E7]">
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemoveLike(product.id || product._id)}
                    className="absolute top-3 right-3 bg-white/80 hover:bg-[#5C1225] hover:text-white text-[#5C1225] p-2 rounded-full text-xs transition-colors"
                    title="Remove from Wishlist"
                  >
                    ✕
                  </button>
                </div>
                <div className="p-4">
                  <span className="font-['Cinzel',serif] text-[9px] uppercase tracking-widest text-[#8A4A2A] block mb-1">
                    {product.category}
                  </span>
                  <h3 className="font-['Cormorant_Garamond',serif] text-lg font-semibold text-[#2C0812] line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm font-semibold text-[#5C1225] mt-1">
                    ${floatVal(product.price)}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Link
                  to={`/product/${product.id || product._id}`}
                  className="w-full text-center block bg-[#FBF3E7] text-[#5C1225] border border-[#C89B3C]/40 py-2 font-['Cinzel',serif] text-[10px] uppercase tracking-wider font-semibold hover:bg-[#5C1225] hover:text-white transition-colors"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function to safely format numbers
function floatVal(val) {
  const num = parseFloat(val);
  return isNaN(num) ? "0.00" : num.toFixed(2);
}