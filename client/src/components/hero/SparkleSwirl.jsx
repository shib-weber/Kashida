
export default function SparkleSwirl({ started }) {
  return (
    <svg className="sparkle-swirl" viewBox="0 0 640 260" aria-hidden="true">
      <path
        className={`sparkle-swirl__path${started ? " draw" : ""}`}
        d="M20,190 C140,230 220,90 320,120 C420,150 460,60 600,80"
        stroke="#E8CB86"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {[
        [70, 175],
        [230, 105],
        [400, 118],
        [560, 78],
      ].map(([x, y], idx) => (
        <g key={idx} className={`sparkle-dot${started ? " twinkle" : ""}`} style={{ animationDelay: `${1.9 + idx * 0.22}s` }}>
          <path
            transform={`translate(${x},${y})`}
            d="M0,-8 L2,-2 L8,0 L2,2 L0,8 L-2,2 L-8,0 L-2,-2 Z"
            fill="#F1DDA0"
          />
        </g>
      ))}
    </svg>
  );
}