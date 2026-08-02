import React from "react";

export default function Garment({ g, i, started }) {
  const gradId = `g-fabric-${i}`;
  const garmentType = g.type || "lehenga"; // Fallback to 'lehenga' if type isn't passed

  // Render SVG paths based on the specific ethnic garment type
  const renderGarmentPaths = () => {
    switch (garmentType.toLowerCase()) {
      case "saree":
        return (
          <>
            {/* Blouse */}
            <path d="M40,12 Q60,2 80,12 L84,42 Q60,50 36,42 Z" fill={g.blouse || g.from} />
            
            {/* Saree Pleats & Lower Skirt */}
            <path
              d="M32,46 L88,46 L104,250 Q60,262 16,250 Z"
              fill={`url(#${gradId})`}
            />
            {/* Pleat Lines */}
            <path d="M48,48 L44,254 M60,48 L60,256 M72,48 L76,254" stroke={g.sash} strokeWidth="1.2" opacity="0.4" />

            {/* Decorative Motifs on Skirt */}
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 3 }).map((_, c) => (
                <circle
                  key={`saree-dot-${r}-${c}`}
                  cx={35 + c * 25 + (r % 2 === 0 ? 0 : 8)}
                  cy={90 + r * 38}
                  r="2"
                  fill={g.sash}
                  opacity="0.6"
                />
              ))
            )}

            {/* Draped Pallu across torso and over shoulder */}
            <path
              d="M34,44 C48,20 86,10 96,2 C98,28 106,120 112,230 L96,236 C92,130 84,32 72,46 Z"
              fill={g.sash}
              opacity="0.9"
            />
            
            {/* Zari Border at Hem */}
            <path d="M16,250 L104,250 L101,260 Q60,268 19,260 Z" fill={g.sash} opacity="0.85" />
          </>
        );

      case "kurti":
        return (
          <>
            {/* Kurti Body */}
            <path
              d="M38,10 Q60,2 82,10 L92,50 L88,190 Q60,195 32,190 L28,50 Z"
              fill={`url(#${gradId})`}
            />
            {/* Side Slits Accent */}
            <path d="M30,130 L32,190 M90,130 L88,190" stroke={g.sash} strokeWidth="2" opacity="0.7" />

            {/* Embroidered Neckline / Yoke */}
            <path d="M48,10 Q60,28 72,10 L68,60 Q60,68 52,60 Z" fill={g.sash} opacity="0.85" />

            {/* Pattern Dots */}
            {Array.from({ length: 3 }).map((_, r) =>
              Array.from({ length: 3 }).map((_, c) => (
                <circle
                  key={`kurti-dot-${r}-${c}`}
                  cx={40 + c * 20}
                  cy={80 + r * 30}
                  r="1.8"
                  fill={g.sash}
                  opacity="0.65"
                />
              ))
            )}

            {/* Fitted Churidar / Bottom Pants */}
            <path d="M42,192 L52,255 L58,255 L52,192 Z" fill={g.blouse || g.to} />
            <path d="M78,192 L68,255 L62,255 L68,192 Z" fill={g.blouse || g.to} />

            {/* Border Hem */}
            <path d="M32,185 L88,185 L88,192 L32,192 Z" fill={g.sash} opacity="0.9" />
          </>
        );

      case "anarkali":
        return (
          <>
            {/* Fitted Bodice */}
            <path d="M40,8 Q60,-2 80,8 L84,52 Q60,58 36,52 Z" fill={g.blouse || g.from} />

            {/* Flared Kalis (Skirt Flare) */}
            <path
              d="M36,52 L84,52 L112,246 Q60,264 8,246 Z"
              fill={`url(#${gradId})`}
            />

            {/* Vertical Kali / Panel Seam Lines */}
            <path d="M48,52 L28,250 M60,52 L60,256 M72,52 L92,250" stroke={g.sash} strokeWidth="1" opacity="0.35" />

            {/* Scattered Booti Embroidery */}
            {Array.from({ length: 4 }).map((_, r) =>
              Array.from({ length: 4 }).map((_, c) => (
                <circle
                  key={`anarkali-dot-${r}-${c}`}
                  cx={26 + c * 22 + (r % 2 === 0 ? 0 : 5)}
                  cy={80 + r * 38}
                  r="2.2"
                  fill={g.sash}
                  opacity="0.6"
                />
              ))
            )}

            {/* Flowing Dupatta Stole */}
            <path
              d="M20,30 C5,90 2,160 12,230 L22,228 C14,160 16,90 28,34 Z"
              fill={g.sash}
              opacity="0.8"
            />

            {/* Broad Heavy Border */}
            <path d="M8,246 L112,246 L108,258 Q60,268 12,258 Z" fill={g.sash} opacity="0.9" />
          </>
        );

      case "lehenga":
      default:
        return (
          <>
            {/* Choli (Blouse) */}
            <path d="M38,8 Q60,-4 82,8 L86,44 Q60,53 34,44 Z" fill={g.blouse || g.from} />

            {/* Flared Lehenga Skirt */}
            <path
              d="M30,46 L90,46 L109,252 Q60,264 11,252 Z"
              fill={`url(#${gradId})`}
            />

            {/* Motif Grids */}
            {Array.from({ length: 5 }).map((_, r) =>
              Array.from({ length: 3 }).map((_, c) => (
                <circle
                  key={`lehenga-dot-${r}-${c}`}
                  cx={30 + c * 30 + (r % 2 === 0 ? 0 : 10)}
                  cy={70 + r * 34}
                  r="2.1"
                  fill={g.sash}
                  opacity="0.55"
                />
              ))
            )}

            {/* Diagonal Dupatta Drape */}
            <path
              d="M84,18 C112,64 120,150 98,238 L114,242 C136,148 126,54 100,8 Z"
              fill={g.sash}
              opacity="0.92"
            />

            {/* Bottom Zari Border */}
            <path d="M11,252 L109,252 L106,262 Q60,270 14,262 Z" fill={g.sash} opacity="0.85" />
          </>
        );
    }
  };

  return (
    <div
      className={`garment garment--${g.dir}${started ? " is-in" : ""}`}
      style={{
        animationDelay: `${0.15 + i * 0.16}s`,
        transform: `translateY(${g.h}px)`,
        zIndex: g.lead ? 3 : 1,
      }}
    >
      <svg
        viewBox="0 0 120 270"
        width={g.lead ? 118 : 96}
        className={`garment__svg${started ? " is-sway" : ""}`}
        style={{ animationDelay: `${1.6 + i * 0.3}s` }}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={g.from} />
            <stop offset="100%" stopColor={g.to} />
          </linearGradient>
        </defs>

        {renderGarmentPaths()}
      </svg>
    </div>
  );
}