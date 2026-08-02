import PaisleyMark from "../common/PaisleyMark";
import { TESTIMONIALS } from "../../data/storeData";
import { useReveal } from "../../hooks/useReveal";

export default function Testimonials() {
  const [ref, visible] = useReveal(0.15);

  return (
    <section className="section section--maroon" ref={ref}>
      <div className="section__head">
        <p className="eyebrow eyebrow--light">Kind Words</p>
        <h2 className="h2 h2--light">Worn, Loved, Passed Down</h2>
      </div>
      <div className="testimonials">
        {TESTIMONIALS.map((t, i) => (
          <blockquote
            key={t.name}
            className={`testimonial${visible ? " is-visible" : ""}`}
            style={{ transitionDelay: `${i * 0.12}s` }}
          >
            <PaisleyMark size={26} color="#C89B3C" />
            <p>&ldquo;{t.quote}&rdquo;</p>
            <footer>
              <span className="testimonial__name">{t.name}</span>
              <span className="testimonial__city">{t.city}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}