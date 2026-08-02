import ProductCard from "./ProductCard";
import { PRODUCTS } from "../../data/storeData";
import { useReveal } from "../../hooks/useReveal";

export default function Products() {
  const [ref, visible] = useReveal(0.05);

  return (
    <section className="section" id="products" ref={ref}>
      <div className="section__head">
        <p className="eyebrow">Fresh Off the Loom</p>
        <h2 className="h2">This Week's Edit</h2>
      </div>
      <div className="products">
        {PRODUCTS.map((p, i) => (
          <ProductCard p={p} i={i} key={p.name} visible={visible} />
        ))}
      </div>
    </section>
  );
}