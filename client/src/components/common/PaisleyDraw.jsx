
export default function PaisleyDraw({ visible }) {
  return (
    <svg width="180" height="200" viewBox="0 0 180 200" fill="none" aria-hidden="true">
      <path
        className={`paisley-path${visible ? " draw" : ""}`}
        d="M118 16 C64 16 24 58 24 116 C24 158 56 182 98 176 C124 172 142 152 136 130 C132 114 116 105 100 111 C88 115 82 127 88 138 C92 146 100 150 108 146"
        stroke="#C89B3C"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}