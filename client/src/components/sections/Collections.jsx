import React from "react";
import CategoryGlyph from "../common/CategoryGlyph";
import { CATEGORIES } from "../../data/storeData";
import { useReveal } from "../../hooks/useReveal";

export default function Collections() {
  const [ref, visible] = useReveal(0.1);


  return (
    <section className="section section--ivory" id="collections" ref={ref}>
      {/* Header with Subtle Subtitle */}
      <div className="section__head">
        <p className="eyebrow">Shop by Craft</p>
        <h2 className="h2">Four Ways to Wear Heritage</h2>
        <p className="body-text" style={{ marginTop: '8px', opacity: 0.85 }}>
          Explore curated silhouettes woven by handloom communities across India.
        </p>
      </div>

      {/* Grid Display */}
      <div className="collections">
        {CATEGORIES.map((c, i) => (
          <a
            href="#products"
            key={c.name}
            onClick={(e) => handleCategoryClick(e, c.name)}
            className={`coll-card ${c.big ? "coll-card--big" : ""} ${visible ? "is-visible" : ""}`}
            style={{
              background: `linear-gradient(160deg, ${c.from}, ${c.to})`,
              transitionDelay: `${i * 0.1}s`,
            }}
            aria-label={`Browse ${c.name} collection featuring ${c.count}`}
          >
            {/* Top Row: SVG Glyph & Count Pill */}
            <div className="coll-card__top">
              <CategoryGlyph icon={c.icon} />
              <span className="coll-card__badge">{c.count}</span>
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