import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import { PRODUCTS as FALLBACK_PRODUCTS } from "../../data/storeData";
import { useReveal } from "../../hooks/useReveal";

// Vibrant gradient palette designed for dark contrast and luxury aesthetics
const BG_PALETTE = [
  "linear-gradient(135deg, #2C0812 0%, #5C1225 100%)",
  "linear-gradient(135deg, #1A2E26 0%, #0F5233 100%)",
  "linear-gradient(135deg, #3B1C0A 0%, #8A4A2A 100%)",
  "linear-gradient(135deg, #1E1233 0%, #4A125C 100%)",
  "linear-gradient(135deg, #2C1A08 0%, #C89B3C 100%)",
  "linear-gradient(135deg, #08202C 0%, #124B5C 100%)",
];

export default function Products() {
  const [ref, visible] = useReveal(0.05);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeksEditProducts();
  }, []);

  const fetchWeeksEditProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        // Filter products for "This Week's Edit" or key heritage tags
        const weeksEdit = data.filter(
          (p) =>
            p.tag === "This Week's Edit" ||
            p.tag === "Best Seller" ||
            p.tag === "Heritage" ||
            p.tag === "Limited Edition" ||
            p.tag === "Handcrafted"
        );

        const listToDisplay = weeksEdit.length > 0 ? weeksEdit : data.slice(0, 8);

        // Normalize product objects to ensure valid IDs and images
        const styledProducts = listToDisplay.map((p, idx) => ({
          ...p,
          _id: p._id || p.id,
          // Robust image key fallbacks
          image:
            p.image ||
            p.image_url ||
            p.cover_image ||
            FALLBACK_PRODUCTS[idx % FALLBACK_PRODUCTS.length]?.image,
          bg: p.bg || BG_PALETTE[idx % BG_PALETTE.length],
        }));

        setProducts(styledProducts);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err) {
      console.error("Error fetching week's edit products:", err);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="products" ref={ref}>
      <div className="section__head">
        <p className="eyebrow">Fresh Off the Loom</p>
        <h2 className="h2">This Week's Edit</h2>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs font-['Cinzel',serif] uppercase tracking-widest text-[#8A4A2A]">
          Loading Handcrafted Edit...
        </div>
      ) : (
        <div className="products">
          {products.map((p, i) => {
            const productId = p._id || p.id;
            return (
              <Link
                key={productId}
                to={`/product/${productId}`}
                className="product-card-wrapper block rounded-sm overflow-hidden p-4 shadow-lg transition-transform duration-300 hover:scale-[1.02] text-[#FBF3E7] cursor-pointer"
                style={{
                  background: p.bg || BG_PALETTE[i % BG_PALETTE.length],
                }}
              >
                {/* CSS Override to keep text crisp white/gold over dark background palettes */}
                <style>{`
                  .product-card-wrapper * {
                    color: #FBF3E7 !important;
                  }
                  .product-card-wrapper .price,
                  .product-card-wrapper .tag,
                  .product-card-wrapper .product-card__price {
                    color: #E8CB86 !important;
                  }
                  .product-card-wrapper h3,
                  .product-card-wrapper h4,
                  .product-card-wrapper .product-card__title {
                    color: #FFFFFF !important;
                    text-shadow: 0 1px 3px rgba(0,0,0,0.6);
                  }
                  .product-card-wrapper p,
                  .product-card-wrapper .product-card__category {
                    color: #E2D3C7 !important;
                  }
                  .product-card-wrapper img {
                    width: 100%;
                    height: 280px;
                    object-fit: cover;
                    border-radius: 2px;
                    display: block;
                  }
                `}</style>

                <ProductCard p={p} i={i} visible={visible} />
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}