

export default function PaisleyMark({ size = 22, color = "#C89B3C" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path
        d="M62 8 C34 8 14 30 14 58 C14 80 32 92 54 89 C68 87 78 76 75 64 C73 56 65 51 57 54 C51 56 48 62 51 68 C53 71 57 73 61 71"
        stroke={color}
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}