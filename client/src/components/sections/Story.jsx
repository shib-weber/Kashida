import { STORY_STATS } from "../../data/storeData";
import { useReveal } from "../../hooks/useReveal";

export default function Story() {
  const [ref, visible] = useReveal(0.25);

  return (
    <section className="section section--split" id="story" ref={ref}>
      <div className={`story__visual${visible ? " is-visible" : ""}`}>
        <svg viewBox="0 0 300 340" className="animate-pattern-weave" aria-hidden="true">
          <rect width="300" height="340" fill="#1F4436" />
          {Array.from({ length: 6 }).map((_, r) =>
            Array.from({ length: 5 }).map((_, c) => (
              <path
                key={`${r}-${c}`}
                transform={`translate(${c * 60 + (r % 2 === 0 ? 0 : 30)},${r * 58 - 20})`}
                d="M20 4 C10 4 4 12 4 22 C4 30 10 36 18 35 C23 34 27 30 25 25 C24 22 20 20 18 22"
                stroke="#C89B3C"
                strokeWidth="1.6"
                fill="none"
                opacity="0.55"
              />
            ))
          )}
        </svg>
      </div>
      <div className={`story__text${visible ? " is-visible" : ""}`}>
        <p className="eyebrow">Our Craft</p>
        <h2 className="h2 h2--stitched">Six Yards, A Thousand Hands</h2>
        <p className="body-text">
          Every Kashida piece begins at the loom, not the design table. We work
          directly with weaving families across Varanasi, Kanchipuram and Bhuj,
          paying fair rates for work that often takes weeks to finish a single
          saree. What reaches your wardrobe carries their names, even if the
          label only carries ours.
        </p>
        <div className="story__stats">
          {STORY_STATS.map((s) => (
            <div key={s.l} className="story__stat">
              <span className="story__stat-num">{s.n}</span>
              <span className="story__stat-label">{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}