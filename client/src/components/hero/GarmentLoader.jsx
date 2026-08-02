import React from "react";

export default function GarmentLoader({ message = "Crafting Your Collection..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] py-16 px-4">
      {/* Animated Dancing Kurti & Lehenga SVGs */}
      <div className="relative w-40 h-32 mb-6 flex items-center justify-center gap-4">
        <svg
          viewBox="0 0 200 140"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Decorative Sparkles */}
          <circle cx="20" cy="20" r="1.5" className="animate-ping fill-[#C89B3C]" />
          <circle cx="180" cy="30" r="2" className="animate-ping fill-[#E8CB86] [animation-delay:0.5s]" />
          <circle cx="100" cy="15" r="1.5" className="animate-ping fill-[#C89B3C] [animation-delay:1s]" />

          {/* --- LADY'S KURTI (Dancing Left) --- */}
          <g className="animate-[danceKurti_2.4s_ease-in-out_infinite] origin-[60px_30px]">
            {/* Kurti Base Shape */}
            <path
              d="M 45 25 L 52 20 C 56 24, 64 24, 68 20 L 75 25 L 82 42 L 72 44 L 70 34 L 74 90 L 46 90 L 50 34 L 48 44 L 38 42 Z"
              className="animate-[colorShift_6s_infinite_linear] stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
            />
            {/* Kurti Neckline & Front Slit Details */}
            <path
              d="M 56 22 L 60 38 L 64 22 M 60 38 L 60 55"
              stroke="#E8CB86"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Side Slits */}
            <path
              d="M 48 68 L 46 90 M 72 68 L 74 90"
              stroke="#C89B3C"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          </g>

          {/* --- LEHENGA & CHOLI (Dancing Right) --- */}
          <g className="animate-[danceLehenga_2.4s_ease-in-out_infinite] origin-[140px_30px]">
            {/* Choli (Blouse Top) */}
            <path
              d="M 125 24 L 132 20 C 136 23, 144 23, 148 20 L 155 24 L 153 42 L 127 42 Z"
              className="animate-[colorShiftAlt_6s_infinite_linear] stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
            />
            {/* Dupatta Drapes */}
            <path
              d="M 127 24 C 135 32, 145 38, 158 48 C 152 65, 148 85, 142 100"
              stroke="#E8CB86"
              strokeWidth="1.2"
              strokeDasharray="3 2"
              className="opacity-80"
            />
            {/* Flared Lehenga Skirt */}
            <path
              d="M 130 46 L 150 46 C 158 72, 172 92, 178 102 C 150 108, 130 108, 102 102 C 108 92, 122 72, 130 46 Z"
              className="animate-[colorShift_6s_infinite_linear] stroke-[1.8] stroke-linecap-round stroke-linejoin-round"
            />
            {/* Lehenga Border / Zari Pattern */}
            <path
              d="M 106 96 C 130 102, 150 102, 174 96"
              stroke="#C89B3C"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </g>
        </svg>
      </div>

      {/* Styled Text */}
      <h3 className="font-['Cormorant_Garamond',serif] italic text-2xl text-[#2C0812] tracking-wide mb-1 animate-pulse">
        {message}
      </h3>
      <span className="font-['Cinzel',serif] text-[10px] tracking-[0.25em] text-[#8A4A2A] uppercase">
        Kashida Couture
      </span>

      {/* Dynamic Keyframe Animations */}
      <style>{`
        /* Dancing Kurti Movement */
        @keyframes danceKurti {
          0%, 100% {
            transform: translateY(0px) rotate(-4deg) scale(1);
          }
          50% {
            transform: translateY(-10px) rotate(5deg) scale(1.03);
          }
        }

        /* Dancing Lehenga Movement */
        @keyframes danceLehenga {
          0%, 100% {
            transform: translateY(-8px) rotate(4deg) scale(1.02);
          }
          50% {
            transform: translateY(2px) rotate(-5deg) scale(0.98);
          }
        }

        /* Primary Color Cycle (Maroon -> Gold -> Terracotta -> Emerald -> Maroon) */
        @keyframes colorShift {
          0%, 100% {
            fill: #5C1225;
            stroke: #C89B3C;
          }
          25% {
            fill: #8A4A2A;
            stroke: #E8CB86;
          }
          50% {
            fill: #C89B3C;
            stroke: #2C0812;
          }
          75% {
            fill: #1F4436;
            stroke: #E8CB86;
          }
        }

        /* Alternate Color Cycle for contrast */
        @keyframes colorShiftAlt {
          0%, 100% {
            fill: #C89B3C;
            stroke: #2C0812;
          }
          25% {
            fill: #1F4436;
            stroke: #E8CB86;
          }
          50% {
            fill: #5C1225;
            stroke: #C89B3C;
          }
          75% {
            fill: #8A4A2A;
            stroke: #FBF3E7;
          }
        }
      `}</style>
    </div>
  );
}