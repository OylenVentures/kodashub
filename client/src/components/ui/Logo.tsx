export const Logo_Light = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 520 120"
    width="100%"
    height="100%"
  >
    <defs>
      <linearGradient id="kh-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0052D4" />
        <stop offset="100%" stopColor="#00B4D8" />
      </linearGradient>

      <linearGradient id="kh-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#0052D4" stopOpacity="0.0" />
      </linearGradient>
    </defs>

    <g id="logo-mark" transform="translate(10, 10)">
      <polygon
        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
        fill="none"
        stroke="url(#kh-gradient)"
        strokeWidth="4"
        strokeLinejoin="round"
        opacity="0.15"
      />

      <path
        d="M 28 22 L 28 78"
        stroke="url(#kh-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M 28 50 L 62 24"
        stroke="url(#kh-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M 28 50 L 62 76"
        stroke="url(#kh-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M 42 39 L 74 39"
        stroke="url(#kh-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 42 61 L 74 61"
        stroke="url(#kh-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />

      <circle cx="28" cy="22" r="6" fill="#0052D4" />
      <circle cx="28" cy="78" r="6" fill="#0052D4" />
      <circle cx="62" cy="24" r="6" fill="#00B4D8" />
      <circle cx="62" cy="76" r="6" fill="#0052D4" />
      <circle cx="74" cy="39" r="5" fill="#00B4D8" />
      <circle cx="74" cy="61" r="5" fill="#00B4D8" />
      <circle
        cx="28"
        cy="50"
        r="7"
        fill="#0052D4"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
    </g>

    <g id="logo-text" transform="translate(125, 70)">
      <text
        fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="#0B132B"
        letterSpacing="-1"
      >
        Kodas
      </text>
      <text
        x="142"
        fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="#00B4D8"
        letterSpacing="-1"
      >
        Hub
      </text>
      <circle cx="238" cy="-32" r="5" fill="#10B981" />
    </g>
  </svg>
);

export const Logo_Dark = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 520 120"
    width="100%"
    height="100%"
  >
    <defs>
      <linearGradient id="kh-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#0052D4" />
        <stop offset="100%" stopColor="#00B4D8" />
      </linearGradient>

      <linearGradient id="kh-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#0052D4" stopOpacity="0.0" />
      </linearGradient>
    </defs>

    <g id="logo-mark" transform="translate(10, 10)">
      <polygon
        points="50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5"
        fill="none"
        stroke="url(#kh-gradient)"
        strokeWidth="4"
        strokeLinejoin="round"
        opacity="0.15"
      />

      <path
        d="M 28 22 L 28 78"
        stroke="url(#kh-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M 28 50 L 62 24"
        stroke="url(#kh-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M 28 50 L 62 76"
        stroke="url(#kh-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
      />

      <path
        d="M 42 39 L 74 39"
        stroke="url(#kh-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M 42 61 L 74 61"
        stroke="url(#kh-gradient)"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.8"
      />

      <circle cx="28" cy="22" r="6" fill="#0052D4" />
      <circle cx="28" cy="78" r="6" fill="#0052D4" />
      <circle cx="62" cy="24" r="6" fill="#00B4D8" />
      <circle cx="62" cy="76" r="6" fill="#0052D4" />
      <circle cx="74" cy="39" r="5" fill="#00B4D8" />
      <circle cx="74" cy="61" r="5" fill="#00B4D8" />
      <circle
        cx="28"
        cy="50"
        r="7"
        fill="#0052D4"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
    </g>

    <g id="logo-text" transform="translate(125, 70)">
      <text
        fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="#e2e8f0"
        letterSpacing="-1"
      >
        Kodas
      </text>
      <text
        x="142"
        fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif"
        fontWeight="800"
        fontSize="46"
        fill="#00B4D8"
        letterSpacing="-1"
      >
        Hub
      </text>
      <circle cx="238" cy="-32" r="5" fill="#10B981" />
    </g>
  </svg>
);

// export const Logo2 = () => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 520 120"
//     width="100%"
//     height="100%"
//   >
//     <defs>
//       <linearGradient id="shield-grad" x1="0%" y1="0%" x2="100%" y2="100%">
//         <stop offset="0%" stop-color="#00B4D8" />
//         <stop offset="100%" stop-color="#0052D4" />
//       </linearGradient>
//     </defs>

//     <g id="shield-mark" transform="translate(15, 10)">
//       <path
//         d="M 50 8 L 85 24 V 56 C 85 76 50 94 50 94 C 50 94 15 76 15 56 V 24 Z"
//         fill="none"
//         stroke="url(#shield-grad)"
//         stroke-width="7"
//         stroke-linejoin="round"
//       />

//       <path
//         d="M 36 38 L 48 50 L 36 62"
//         fill="none"
//         stroke="url(#shield-grad)"
//         stroke-width="6"
//         stroke-linecap="round"
//         stroke-linejoin="round"
//       />
//       <line
//         x1="56"
//         y1="62"
//         x2="68"
//         y2="62"
//         stroke="#00B4D8"
//         stroke-width="6"
//         stroke-linecap="round"
//       />
//     </g>

//     <g id="brand-name" transform="translate(125, 70)">
//       <text
//         font-family="'Plus Jakarta Sans', 'Inter', sans-serif"
//         font-weight="800"
//         font-size="46"
//         fill="#0B132B"
//         letter-spacing="-1"
//       >
//         Kodas
//       </text>
//       <text
//         x="142"
//         font-family="'Plus Jakarta Sans', 'Inter', sans-serif"
//         font-weight="800"
//         font-size="46"
//         fill="#0052D4"
//         letter-spacing="-1"
//       >
//         Hub
//       </text>
//     </g>
//   </svg>
// );
