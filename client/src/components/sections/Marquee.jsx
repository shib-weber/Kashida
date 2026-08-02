import PaisleyMark from "../common/PaisleyMark";

export default function Marquee() {
  const items = ["Sarees", "Lehenga Sets", "Kurta Sets", "Jewelry", "Bridal Edit", "Festive Wear"];
  const row = [...items, ...items];

  return (
    <div className="marquee">
      <div className="marquee__track">
        {row.map((t, i) => (
          <span key={i} className="marquee__item">
            {t}
            <PaisleyMark size={12} color="#8A4A2A" />
          </span>
        ))}
      </div>
    </div>
  );
}