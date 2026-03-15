/**
 * Product page loader.
 *
 * A triangle with one side always "open" (invisible). The open side travels
 * clockwise — bottom → right → left → bottom — drawing in as it arrives,
 * erasing as it leaves. The dot sits at the midpoint of whichever side is open.
 *
 * Timing per full cycle (3.6 s):
 *   0 %  – 22 % : hold  — open bottom, dot at (32, 58)
 *  22 %  – 33 % : move  — bottom draws in / right erases / dot travels to (46, 31)
 *  33 %  – 55 % : hold  — open right,   dot at (46, 31)
 *  55 %  – 66 % : move  — right draws in / left erases / dot travels to (18, 31)
 *  66 %  – 88 % : hold  — open left,    dot at (18, 31)
 *  88 %  – 100% : move  — left draws in / bottom erases / dot travels to (32, 58)
 */
export default function ProductLoading() {
  const dur = '3.6s';

  return (
    <div
      className="flex items-center justify-center"
      style={{ minHeight: '65vh' }}
      role="status"
      aria-label="Loading"
    >
      {/*
        viewBox gives 4 px padding on each side so thick strokes / dot radius
        never clip. Content spans x: 4–60, y: 4–63 (dot radius 5 at y=58).
      */}
      <svg width="72" height="70" viewBox="-4 -2 72 70">

        {/* ── Left side (32,4)→(4,58)  length≈61 ────────────────────────
            Visible in states 0 and 2. Erases during move 0→1 (22–33 %).
            Redraws during move 1→2 (55–66 %).                           */}
        <line
          x1="32" y1="4" x2="4" y2="58"
          stroke="var(--brand)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray="61" strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0; 0; 61; 61; 0; 0"
            keyTimes="0; 0.22; 0.33; 0.55; 0.66; 1"
            dur={dur} repeatCount="indefinite"
          />
        </line>

        {/* ── Right side (32,4)→(60,58)  length≈61 ───────────────────────
            Visible in states 0 and 1. Erases during move 1→2 (55–66 %).
            Redraws during move 2→0 (88–100 %).                           */}
        <line
          x1="32" y1="4" x2="60" y2="58"
          stroke="var(--brand)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray="61" strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="0; 0; 0; 61; 61; 0"
            keyTimes="0; 0.22; 0.55; 0.66; 0.88; 1"
            dur={dur} repeatCount="indefinite"
          />
        </line>

        {/* ── Bottom side (4,58)→(60,58)  length=56 ──────────────────────
            Hidden in state 0. Draws in during move 0→1 (22–33 %).
            Erases during move 2→0 (88–100 %).                            */}
        <line
          x1="4" y1="58" x2="60" y2="58"
          stroke="var(--brand)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray="56" strokeDashoffset="56"
        >
          <animate
            attributeName="stroke-dashoffset"
            values="56; 56; 0; 0; 56"
            keyTimes="0; 0.22; 0.33; 0.88; 1"
            dur={dur} repeatCount="indefinite"
          />
        </line>

        {/* ── Dot — always at midpoint of the open side ──────────────────
            bottom (32,58) → right (46,31) → left (18,31) → bottom …     */}
        <circle cx="32" cy="58" r="5" fill="var(--brand)">
          <animate
            attributeName="cx"
            values="32; 32; 18; 18; 46; 46; 32"
            keyTimes="0; 0.22; 0.33; 0.55; 0.66; 0.88; 1"
            dur={dur} repeatCount="indefinite"
          />
          <animate
            attributeName="cy"
            values="58; 58; 31; 31; 31; 31; 58"
            keyTimes="0; 0.22; 0.33; 0.55; 0.66; 0.88; 1"
            dur={dur} repeatCount="indefinite"
          />
        </circle>

      </svg>
    </div>
  );
}
