import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  // Wishlist Heart & Link Sharing states
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch detailed product info from backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback rich details
        setProduct({
          _id: id,
          id,
          name: "Zardozi Embroidered Silk Kurti",
          price: 240,
          category: "Kurtis",
          description:
            "Crafted with pure Mulberry silk, this piece features intricate hand-woven Zardozi embroidery along the neckline and cuffs. Cut in a tailored straight silhouette suited for royal occasions.",
          fabric: "100% Pure Mulberry Silk with Gold Threadwork",
          sizes: ["S", "M", "L", "XL"],
          estimatedDelivery: "3 - 5 Business Days via Express Shipping",
          returnPolicy: "Complimentary 7-day hassle-free returns & exchange policy.",
          image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
          images: [
            "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=800",
          ],
        });
        setLoading(false);
      });

    checkWishlistStatus();
  }, [id]);

  const getHeaders = () => {
    const token = localStorage.getItem("authToken");
    const sessionId = localStorage.getItem("cartSessionId") || "guest_session_1";
    return token ? { Authorization: `Bearer ${token}` } : { "x-session-id": sessionId };
  };

  const checkWishlistStatus = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/likes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const likedList = await res.json();
        if (Array.isArray(likedList)) {
          const found = likedList.some((item) => (item.id || item._id) === id);
          setIsLiked(found);
        }
      }
    } catch {
      // Ignore background failure
    }
  };

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Please log in to save items to your wishlist.");
      navigate("/auth");
      return;
    }

    const productId = product?._id || product?.id || id;
    setLiking(true);

    try {
      const res = await fetch(`http://localhost:5000/api/likes/${productId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setIsLiked(data.liked);
      }
    } catch {
      setIsLiked(!isLiked);
    } finally {
      setLiking(false);
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleAddToCart = async () => {
    const productId = product?._id || product?.id || id;
    setAdding(true);

    try {
      await fetch("http://localhost:5000/api/cart/item", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getHeaders() },
        body: JSON.stringify({ productId, quantity, size: selectedSize }),
      });
    } catch {
      // Handled locally
    } finally {
      setAdding(false);
      navigate("/cart");
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (loading || !product) {
    return <GarmentLoader message="Preparing Product View..." />;
  }

  // Normalize image gallery: extract images array or fall back to single image property
  const displayImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : ["https://via.placeholder.com/800x1000?text=No+Image+Available"];

  const activeImageUrl = displayImages[selectedImage] || displayImages[0];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Toast Alert for Copying Link */}
      {copied && (
        <div className="fixed bottom-6 right-6 bg-[#2C0812] text-[#FBF3E7] border border-[#C89B3C] px-5 py-3 rounded-sm shadow-2xl z-50 text-xs font-['Cinzel',serif] tracking-wider uppercase flex items-center gap-2">
          <span>✨ Product link copied to clipboard!</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="text-xs font-['Cinzel',serif] text-[#8A4A2A] mb-8 uppercase tracking-widest">
        <Link to="/" className="hover:underline">Home</Link> /{" "}
        <Link to="/collections" className="hover:underline">Collections</Link> /{" "}
        <span className="text-[#2C0812]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Product Images Gallery */}
        <div className="space-y-4">
          <div className="relative h-[500px] border border-[#C89B3C]/20 rounded-sm overflow-hidden bg-[#2C0812]/5">
            <img
              src={activeImageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />

            {/* Floating Quick Actions Overlay */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleToggleWishlist}
                disabled={liking}
                title={isLiked ? "Remove from Wishlist" : "Save to Wishlist"}
                className="w-10 h-10 bg-white/90 backdrop-blur-md border border-[#C89B3C]/40 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className={`w-5 h-5 transition-colors ${
                    isLiked ? "fill-[#5C1225] stroke-[#5C1225]" : "fill-none stroke-[#2C0812]"
                  }`}
                  strokeWidth="1.8"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>

              <button
                onClick={handleShareLink}
                title="Share Product"
                className="w-10 h-10 bg-white/90 backdrop-blur-md border border-[#C89B3C]/40 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2C0812"
                  strokeWidth="1.8"
                  className="w-5 h-5"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails (Only render if more than 1 image exists) */}
          {displayImages.length > 1 && (
            <div className="flex gap-4">
              {displayImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-24 border rounded-sm overflow-hidden transition-all ${
                    selectedImage === idx
                      ? "border-[#C89B3C] ring-1 ring-[#C89B3C]"
                      : "border-[#C89B3C]/20 opacity-70"
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Specification & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <span className="font-['Cinzel',serif] text-xs tracking-[0.28em] text-[#8A4A2A] uppercase block mb-1">
                {product.category}
              </span>

              <div className="flex gap-4 items-center">
                <button
                  onClick={handleToggleWishlist}
                  className="text-xs font-['Cinzel',serif] text-[#5C1225] hover:underline flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>{isLiked ? "❤️ Saved" : "🤍 Save to Wishlist"}</span>
                </button>
                <button
                  onClick={handleShareLink}
                  className="text-xs font-['Cinzel',serif] text-[#8A4A2A] hover:text-[#5C1225] flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>🔗 Share</span>
                </button>
              </div>
            </div>

            <h1 className="font-['Cormorant_Garamond',serif] italic text-4xl text-[#2C0812] font-semibold mt-1">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold text-[#C89B3C] mt-2">${product.price}</p>
          </div>

          <p className="text-sm leading-relaxed text-[#241713]/80 font-['Jost',sans-serif]">
            {product.description}
          </p>

          {/* Size Selector */}
          <div>
            <span className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-2">
              Select Size
            </span>
            <div className="flex gap-3">
              {(product.sizes || ["S", "M", "L", "XL"]).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 border text-xs font-semibold rounded-sm transition-colors ${
                    selectedSize === size
                      ? "bg-[#5C1225] text-[#FBF3E7] border-[#5C1225]"
                      : "border-[#C89B3C]/30 text-[#241713] hover:border-[#C89B3C]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <span className="block text-xs font-['Cinzel',serif] uppercase text-[#8A4A2A] mb-2">
              Quantity
            </span>
            <div className="flex items-center w-32 border border-[#C89B3C]/40 rounded-sm">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-sm hover:bg-[#FBF3E7]"
              >
                -
              </button>
              <span className="flex-1 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-sm hover:bg-[#FBF3E7]"
              >
                +
              </button>
            </div>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-[#C89B3C]/20">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 bg-[#C89B3C] text-[#2C0812] py-3.5 font-['Cinzel',serif] text-xs uppercase tracking-widest font-semibold hover:bg-[#E8CB86] transition-colors"
            >
              Add To Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-[#5C1225] text-[#FBF3E7] py-3.5 font-['Cinzel',serif] text-xs uppercase tracking-widest font-semibold hover:bg-[#2C0812] transition-colors"
            >
              Buy Now
            </button>
          </div>

          {/* Logistics & Fabric Specs */}
          <div className="border-t border-[#C89B3C]/20 pt-6 space-y-4 text-xs font-['Jost',sans-serif]">
            <div>
              <strong className="font-['Cinzel',serif] text-[#8A4A2A] uppercase block">
                Fabric & Care:
              </strong>
              <p className="text-[#241713]/80">
                {product.fabric || "100% Pure Handcrafted Silk with Embroidery"}
              </p>
            </div>
            <div>
              <strong className="font-['Cinzel',serif] text-[#8A4A2A] uppercase block">
                Estimated Delivery:
              </strong>
              <p className="text-[#241713]/80">
                {product.estimatedDelivery || "3 - 5 Business Days via Express Shipping"}
              </p>
            </div>
            <div>
              <strong className="font-['Cinzel',serif] text-[#8A4A2A] uppercase block">
                Returns & Exchange:
              </strong>
              <p className="text-[#241713]/80">
                {product.returnPolicy || "Complimentary 7-day hassle-free returns & exchange policy."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}