import GlobalStyles from "../components/layout/GlobalStyles";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GarmentLoader from "../components/hero/GarmentLoader";
import Navbar from "../components/layout/Navbar";

export default function CollectionsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const navigate = useNavigate();

  const categories = ["All", "Kurtis", "Lehengas", "Sarees", "Shawls", "Dupattas"];

  // Fetch products from database
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback demo dataset matching Kashida theme
        const mockProducts = [
          {
            id: "prod_1",
            name: "Zardozi Embroidered Silk Kurti",
            category: "Kurtis",
            price: 240,
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600",
            tag: "Best Seller",
          },
          {
            id: "prod_2",
            name: "Royal Crimson Velvet Lehenga",
            category: "Lehengas",
            price: 850,
            image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600",
            tag: "Heritage",
          },
          {
            id: "prod_3",
            name: "Handwoven Banarasi Dupatta",
            category: "Dupattas",
            price: 120,
            image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=600",
            tag: "Handcrafted",
          },
          {
            id: "prod_4",
            name: "Kashmiri Artisanal Pashmina Shawl",
            category: "Shawls",
            price: 320,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
            tag: "Limited Edition",
          },
        ];
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setLoading(false);
      });
  }, []);

  // Filter products by category
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter((p) => p.category === category));
    }
  };

  // Quick Add to Cart via Redis API
  const handleAddToCart = async (e, product) => {
    e.stopPropagation();
    const productId = product._id || product.id;
    setAddingId(productId);

    const token = localStorage.getItem("authToken");
    const sessionId = localStorage.getItem("cartSessionId") || "guest_session_1";
    const headers = token ? { Authorization: `Bearer ${token}` } : { "x-session-id": sessionId };

    try {
      await fetch("http://localhost:5000/api/cart/item", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
    } catch {
      // Local fallback complete
    } finally {
      setTimeout(() => setAddingId(null), 500);
    }
  };

  if (loading) {
    return <GarmentLoader message="Curating Royal Collections..." />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF3E7]">
      <GlobalStyles />
      {/* Top Header Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-8 sm:py-12 mt-16 sm:mt-20">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <span className="font-['Cinzel',serif] text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#8A4A2A] block mb-1 sm:mb-2">
            The Haute Couture Gallery
          </span>
          <h1 className="font-['Cormorant_Garamond',serif] italic text-3xl sm:text-5xl text-[#2C0812]">
            Our Masterpiece Collections
          </h1>
        </div>

        {/* Category Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-['Cinzel',serif] uppercase tracking-widest rounded-sm transition-all ${
                selectedCategory === cat
                  ? "bg-[#5C1225] text-[#FBF3E7] border border-[#5C1225]"
                  : "bg-white text-[#241713] border border-[#C89B3C]/30 hover:border-[#C89B3C]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Collections Grid (Force 2 columns on mobile) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-8">
          {filteredProducts.map((product, index) => {
            const productId = product._id || product.id || `product-${index}`;
            return (
              <div
                key={productId}
                onClick={() => navigate(`/product/${productId}`)}
                className="group cursor-pointer bg-white border border-[#C89B3C]/20 rounded-sm overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div>
                  {/* Product Image */}
                  <div className="relative h-48 sm:h-80 overflow-hidden bg-[#2C0812]/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {product.tag && (
                      <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-[#2C0812] text-[#E8CB86] text-[8px] sm:text-[9px] font-['Cinzel',serif] tracking-widest uppercase px-1.5 sm:px-2.5 py-0.5 sm:py-1">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  {/* Product Meta */}
                  <div className="p-3 sm:p-5">
                    <span className="font-['Cinzel',serif] text-[8px] sm:text-[10px] tracking-widest text-[#8A4A2A] uppercase block mb-0.5 sm:mb-1">
                      {product.category}
                    </span>
                    <h3 className="font-['Cormorant_Garamond',serif] italic text-base sm:text-xl text-[#2C0812] font-semibold mb-1 sm:mb-2 group-hover:text-[#8A4A2A] transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold text-[#C89B3C]">${product.price}</p>
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="p-3 sm:p-5 pt-0">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={addingId === productId}
                    className="w-full bg-[#C89B3C] text-[#2C0812] py-2 sm:py-2.5 font-['Cinzel',serif] text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#E8CB86] transition-colors"
                  >
                    {addingId === productId ? "Added!" : "Add to Bag"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}