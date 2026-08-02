
const CATEGORY_ICONS = {
  drape: <path d="M20 15 C30 25 30 55 20 75 M40 12 C52 26 52 60 40 78 M60 15 C70 25 70 55 60 75" />,
  flare: <path d="M40 10 L20 70 L40 60 L60 70 Z" />,
  kurta: <path d="M25 15 L55 15 L60 30 L50 30 L50 75 L30 75 L30 30 L20 30 Z" />,
  jewel: <circle cx="40" cy="40" r="22" />,
};

export default function CategoryGlyph({ icon }) {
  return (
    <svg width="46" height="46" viewBox="0 0 80 80" fill="none" stroke="#E8CB86" strokeWidth="2.5" aria-hidden="true">
      {CATEGORY_ICONS[icon]}
    </svg>
  );
}