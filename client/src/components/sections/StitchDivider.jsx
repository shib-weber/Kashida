import PaisleyDraw from "../common/PaisleyDraw";
import { useReveal } from "../../hooks/useReveal";

export default function StitchDivider() {
  const [ref, visible] = useReveal(0.4);

  return (
    <div className="divider" ref={ref}>
      <PaisleyDraw visible={visible} />
      <p className="divider__caption">Every curve, hand-embroidered</p>
    </div>
  );
}