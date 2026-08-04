import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CategoryGlyph from "../common/CategoryGlyph";
import { CATEGORIES as FALLBACK_CATEGORIES } from "../../data/storeData";
import { useReveal } from "../../hooks/useReveal";

export default function Collections() {
  const [ref, visible] = useReveal(0.1);
  const navigate = useNavigate();

  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryCounts();
  }, []);

  const fetchCategoryCounts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const products = await res.json();

      if (Array.isArray(products)) {
        // Calculate dynamic count for each category from MongoDB
        const updatedCategories = FALLBACK_CATEGORIES.map((cat) => {
          const count = products.filter(
            (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return {
            ...cat,
            count: count > 0 ? `${count} Garments` : "Curated Edit",
          };
        });

        setCategories(updatedCategories);
      }
    } catch (err) {
      console.error("Error fetching live category counts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (e, categoryName) => {
    e.preventDefault();
    navigate(`/collections?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="section section--ivory" id="collections" ref={ref}>
      {/* Header with Subtle Subtitle */}
      <div className="section__head">
        <p className="eyebrow">Shop by Craft</p>
        <h2 className="h2">Ways to Wear Heritage</h2>
        <p className="body-text" style={{ marginTop: "8px", opacity: 0.85 }}>
          Explore curated silhouettes woven by handloom communities across India.
        </p>
      </div>

      {/* Grid Display */}
      <div className="collections">
        {categories.map((c, i) => (
          <a
            href={`/collections?category=${encodeURIComponent(c.name)}`}
            key={c.name}
            onClick={(e) => handleCategoryClick(e, c.name)}
            className={`coll-card ${c.big ? "coll-card--big" : ""} ${
              visible ? "is-visible" : ""
            }`}
            style={{
              background: `linear-gradient(160deg, ${c.from}, ${c.to})`,
              transitionDelay: `${i * 0.1}s`,
            }}
            aria-label={`Browse ${c.name} collection featuring ${c.count}`}
          >
            {/* Top Row: SVG Glyph & Count Pill */}
            <div className="coll-card__top">
              <CategoryGlyph icon={c.icon} />
              <span className="coll-card__badge">
                {loading ? "..." : c.count}
              </span>
            </div>

            {/* Bottom Text Content */}
            <div className="coll-card__text">
              <h3>{c.name}</h3>
              <div className="coll-card__cta">
                <span>Explore Edit</span>
                <span className="arrow">→</span>
              </div>
            </div>

            {/* Decorative Gold Border Corner Motif */}
            <span className="coll-card__corner" aria-hidden="true" />
          </a>
        ))}
      </div>
    </section>
  );
}