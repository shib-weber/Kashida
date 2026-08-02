import PaisleyMark from "../common/PaisleyMark";

export default function ProductCard({ p, i, visible }) {
  return (
    <div
      className={`product${visible ? " is-visible" : ""}`}
      style={{ transitionDelay: `${(i % 3) * 0.1}s` }}
    >
      <div className="product__swatch" style={{ background: `linear-gradient(155deg, ${p.from}, ${p.to})` }}>
        <span className="product__corner">
          <PaisleyMark size={20} color="#E8CB86" />
        </span>
        <div className="product__addbar">
          <button className="product__addbtn">Add to Bag</button>
        </div>
      </div>
      <div className="product__info">
        <span className="product__tag">{p.tag}</span>
        <h3>{p.name}</h3>
        <span className="product__price">{p.price}</span>
      </div>
    </div>
  );
}