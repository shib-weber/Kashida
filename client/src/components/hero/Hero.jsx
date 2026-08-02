import { useEffect, useRef, useState } from "react";
import SparkleSwirl from "./SparkleSwirl";
import { LOOKS } from "../../data/storeData";

export default function Hero() {
  const [titleOn, setTitleOn] = useState(false);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) {
      setTitleOn(true);
      return;
    }
    const t = setTimeout(() => setTitleOn(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero__arches" aria-hidden="true">
        <span className="arch arch--1" />
        <span className="arch arch--2" />
        <span className="arch arch--3" />
      </div>

      {/* Responsive Video Container */}
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
          <a href="/collections" className="btn btn--gold">
            Explore All
          </a>
          <a href="#story" className="btn btn--ghost">
            Our Craft
          </a>
        </div>
      </div>

      <div className={`lookstrip${titleOn ? " is-on" : ""}`}>
        {LOOKS.map((l, i) => (
          <a
            href="#products"
            className="look-card"
            key={i}
            style={{
              background: `linear-gradient(155deg, ${l.from}, ${l.to})`,
              transitionDelay: `${i * 0.08}s`,
            }}
          >
            <span className="look-card__badge">{l.off} off</span>
          </a>
        ))}
      </div>
    </section>
  );
}