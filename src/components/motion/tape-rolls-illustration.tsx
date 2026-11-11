import { cn } from "@/lib/utils";

type Roll = {
  cx: number;
  cy: number;
  rx: number;
  depth: number;
  hole: number;
  body: string;
  face: string;
  ring: string;
  stripe?: string;
  delay: string;
  r: string;
};

const rolls: Roll[] = [
  { cx: 250, cy: 190, rx: 135, depth: 70, hole: 0.6, body: "#e6e1d6", face: "#f4f1ea", ring: "#d7d0c2", delay: "0s", r: "-6deg" },
  { cx: 120, cy: 360, rx: 92, depth: 42, hole: 0.66, body: "#b8331d", face: "#55575d", ring: "#3f4146", stripe: "#d63c22", delay: "-2s", r: "8deg" },
  { cx: 385, cy: 365, rx: 88, depth: 56, hole: 0.62, body: "#a9cde6", face: "#d8ecf8", ring: "#bcdcf0", delay: "-4s", r: "-10deg" },
];

/**
 * Pure-SVG tape rolls: what phones (and desktops, until WebGL is ready) see in the hero.
 * Costs nothing to render and floats with a CSS animation.
 */
export function TapeRollsIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 500" className={cn("h-full w-full", className)} aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e5462b" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#e5462b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="260" cy="270" r="230" fill="url(#glow)" />
      {rolls.map((roll, i) => {
        const ry = roll.rx * 0.42;
        const { cx, cy, rx, depth } = roll;
        const hrx = rx * roll.hole;
        const hry = ry * roll.hole;
        return (
          <g
            key={i}
            className="animate-float"
            style={{ animationDelay: roll.delay, ["--r" as string]: roll.r, transformOrigin: `${cx}px ${cy}px`, transformBox: "view-box" }}
          >
            <path
              d={`M${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy} L${cx + rx},${cy + depth} A${rx},${ry} 0 0 1 ${cx - rx},${cy + depth} Z`}
              fill={roll.body}
            />
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={roll.face} />
            {Array.from({ length: 7 }, (_, k) => {
              const f = roll.hole + ((1 - roll.hole) * (k + 1)) / 8;
              return (
                <ellipse
                  key={k}
                  cx={cx}
                  cy={cy}
                  rx={rx * f}
                  ry={ry * f}
                  fill="none"
                  stroke={roll.stripe && k % 2 ? roll.stripe : roll.ring}
                  strokeWidth="1.4"
                />
              );
            })}
            <ellipse cx={cx} cy={cy} rx={hrx + 9} ry={hry + 4} fill="#b98b5b" />
            <ellipse cx={cx} cy={cy} rx={hrx} ry={hry} fill="#16171b" />
          </g>
        );
      })}
      {/* peeled strip from the big roll */}
      <path
        d="M385 205 C 430 215, 470 250, 462 300 C 458 330, 430 345, 445 380"
        fill="none"
        stroke="#fbfaf6"
        strokeWidth="26"
        strokeLinecap="butt"
        opacity="0.92"
      />
    </svg>
  );
}
