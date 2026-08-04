import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [titleOn, setTitleOn] = useState(false);
  const [heroProducts, setHeroProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) {
      setTitleOn(true);
    } else {
      const t = setTimeout(() => setTitleOn(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  // Fetch Live Featured Products from Backend API
  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          // Take top 6 items for the lookstrip
          setHeroProducts(data.slice(0, 6));
        }
      } catch (err) {
        console.error("Failed to load hero products, using fallback data:", err);
        // Fallback items if server is offline
        setHeroProducts([
          {
            _id: "prod_1",
            name: "Zardozi Silk Kurti",
            price: 240,
            tag: "Best Seller",
            image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400",
          },
          {
            _id: "prod_2",
            name: "Banarasi Dupatta",
            price: 120,
            tag: "Heritage",
            image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=400",
          },
          {
            _id: "prod_3",
            name: "Velvet Lehenga",
            price: 850,
            tag: "Limited Edition",
            image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=400",
          },
        ]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchHeroProducts();
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero__arches" aria-hidden="true">
        <span className="arch arch--1" />
        <span className="arch arch--2" />
        <span className="arch arch--3" />
      </div>

      {/* Full-Width Video Container */}
      <div className="garment-ro">
        <video
          className="w-full aspect-video object-contain shadow-md"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/hero-animation.mp4" type="video/mp4" />
        </video>
      </div>

      <div className={`hero__inner${titleOn ? " is-on" : ""}`}>
        <p className="eyebrow eyebrow--light hero__eyebrow">Beautiful Ethnic, Since 2026</p>
        <h1 className="hero__title">
          <span className="reveal-word">Kashida</span>
        </h1>
        <span className="hero__rule" />
        <p className="hero__tagline">Indian Ethnic Wear</p>
        <div className="hero__ctas">
          <Link to="/collections" className="btn btn--gold">
            Explore All
          </Link>
          <a href="#story" className="btn btn--ghost">
            Our Craft
          </a>
        </div>
      </div>

      {/* DYNAMIC LIVE PRODUCT STRIP */}
      <div className={`lookstrip${titleOn ? " is-on" : ""}`}>
        {loadingProducts ? (
          <div className="text-xs text-[#E8CB86] font-['Cinzel',serif] uppercase p-4">
            Loading Artisanal Garments...
          </div>
        ) : (
          heroProducts.map((prod, i) => {
            const pId = prod._id || prod.id;
            return (
              <Link
                to={`/product/${pId}`}
                className="look-card group relative overflow-hidden rounded-sm border border-[#C89B3C]/30 bg-black/40 backdrop-blur-xs transition-all hover:scale-105 hover:border-[#C89B3C]"
                key={pId}
                style={{
                  transitionDelay: `${i * 0.08}s`,
                }}
              >
                {/* Product Cover Background Image */}
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />

                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Badge Tag */}
                {prod.tag && (
                  <span className="look-card__badge absolute top-2 right-2 z-10 bg-[#5C1225] text-[#FBF3E7] text-[9px] font-['Cinzel',serif] uppercase px-2 py-0.5 rounded-xs tracking-wider shadow-md">
                    {prod.tag}
                  </span>
                )}

                {/* Garment Details Footnote */}
                <div className="absolute bottom-2 left-2 right-2 z-10 text-left">
                  <p className="font-['Cormorant_Garamond',serif] italic text-sm text-[#FBF3E7] font-semibold truncate leading-tight">
                    {prod.name}
                  </p>
                  <p className="text-xs text-[#C89B3C] font-semibold font-['Jost',sans-serif]">
                    ${prod.price}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </section>
  );
}