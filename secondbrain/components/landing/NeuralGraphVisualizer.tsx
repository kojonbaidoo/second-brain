type GraphNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  accent: "cyan" | "blue" | "amber";
};

const nodes: GraphNode[] = [
  {
    id: "core",
    label: "SecondBrain",
    x: 400,
    y: 280,
    size: 82,
    delay: 0,
    accent: "cyan",
  },
  {
    id: "ideas",
    label: "Ideas",
    x: 220,
    y: 132,
    size: 38,
    delay: 0.2,
    accent: "amber",
  },
  {
    id: "voice",
    label: "Voice",
    x: 332,
    y: 78,
    size: 30,
    delay: 0.8,
    accent: "blue",
  },
  {
    id: "images",
    label: "Images",
    x: 560,
    y: 116,
    size: 34,
    delay: 1.1,
    accent: "cyan",
  },
  {
    id: "links",
    label: "Links",
    x: 620,
    y: 236,
    size: 28,
    delay: 0.5,
    accent: "amber",
  },
  {
    id: "memory",
    label: "Memory",
    x: 594,
    y: 392,
    size: 40,
    delay: 1.4,
    accent: "blue",
  },
  {
    id: "projects",
    label: "Projects",
    x: 438,
    y: 470,
    size: 36,
    delay: 0.9,
    accent: "amber",
  },
  {
    id: "insights",
    label: "Insights",
    x: 246,
    y: 420,
    size: 34,
    delay: 1.7,
    accent: "cyan",
  },
  {
    id: "notes",
    label: "Notes",
    x: 170,
    y: 270,
    size: 30,
    delay: 1.2,
    accent: "blue",
  },
];

const edges = [
  ["core", "ideas"],
  ["core", "voice"],
  ["core", "images"],
  ["core", "links"],
  ["core", "memory"],
  ["core", "projects"],
  ["core", "insights"],
  ["core", "notes"],
  ["ideas", "voice"],
  ["ideas", "notes"],
  ["images", "links"],
  ["memory", "projects"],
  ["insights", "notes"],
] as const;

const particles = [
  { x: 134, y: 96, size: 6, delay: 0.1 },
  { x: 688, y: 132, size: 5, delay: 0.7 },
  { x: 640, y: 464, size: 7, delay: 1.2 },
  { x: 116, y: 392, size: 5, delay: 1.8 },
  { x: 420, y: 34, size: 4, delay: 1.4 },
  { x: 726, y: 286, size: 6, delay: 0.4 },
];

const accentStyles = {
  cyan: {
    fill: "rgba(96, 231, 255, 0.2)",
    stroke: "rgba(96, 231, 255, 0.85)",
    glow: "rgba(96, 231, 255, 0.35)",
    text: "rgba(220, 250, 255, 0.95)",
  },
  blue: {
    fill: "rgba(120, 146, 255, 0.2)",
    stroke: "rgba(160, 182, 255, 0.9)",
    glow: "rgba(120, 146, 255, 0.32)",
    text: "rgba(232, 237, 255, 0.96)",
  },
  amber: {
    fill: "rgba(255, 191, 94, 0.22)",
    stroke: "rgba(255, 214, 125, 0.92)",
    glow: "rgba(255, 191, 94, 0.3)",
    text: "rgba(255, 246, 221, 0.96)",
  },
};

function getNode(id: string) {
  return nodes.find((node) => node.id === id)!;
}

export default function NeuralGraphVisualizer() {
  return (
    <div className="graph-shell relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/12 bg-[#07111f] shadow-[0_30px_90px_rgba(4,12,24,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(106,227,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,191,94,0.14),transparent_30%),linear-gradient(135deg,rgba(10,25,41,0.98),rgba(7,13,24,0.98))]" />

      <div className="relative aspect-[4/3] w-full">
        <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.28em] text-slate-300/80 backdrop-blur-md">
          Neural map
        </div>

        <svg
          viewBox="0 0 800 560"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="edgeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(96, 231, 255, 0.2)" />
              <stop offset="50%" stopColor="rgba(151, 160, 255, 0.7)" />
              <stop offset="100%" stopColor="rgba(255, 191, 94, 0.2)" />
            </linearGradient>
            <filter id="nodeBlur" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>

          {edges.map(([from, to], index) => {
            const start = getNode(from);
            const end = getNode(to);

            return (
              <line
                key={`${from}-${to}`}
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                className="graph-edge"
                style={{ animationDelay: `${index * 0.18}s` }}
              />
            );
          })}

          {particles.map((particle) => (
            <circle
              key={`${particle.x}-${particle.y}`}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              className="graph-particle"
              style={{ animationDelay: `${particle.delay}s` }}
            />
          ))}

          {nodes.map((node) => {
            const accent = accentStyles[node.accent];

            return (
              <g
                key={node.id}
                className="graph-node"
                style={{ animationDelay: `${node.delay}s` }}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size + 16}
                  fill={accent.glow}
                  filter="url(#nodeBlur)"
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.size}
                  fill={accent.fill}
                  stroke={accent.stroke}
                  strokeWidth={node.id === "core" ? 2.5 : 1.5}
                />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.id === "core" ? 10 : 6}
                  fill={accent.stroke}
                />
                <text
                  x={node.x}
                  y={node.y + (node.id === "core" ? 30 : node.size + 22)}
                  textAnchor="middle"
                  fill={accent.text}
                  fontSize={node.id === "core" ? 24 : 16}
                  fontWeight={node.id === "core" ? 600 : 500}
                  letterSpacing={node.id === "core" ? "0.06em" : "0.03em"}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-6 right-6 max-w-[15rem] rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-200/85 backdrop-blur-xl">
          Capture scattered inputs and let them settle into a living network of related thoughts.
        </div>
      </div>

      <style jsx>{`
        .graph-shell {
          isolation: isolate;
        }

        .graph-edge {
          stroke: url(#edgeGlow);
          stroke-width: 1.4;
          stroke-linecap: round;
          stroke-dasharray: 10 14;
          opacity: 0.46;
          animation: edgePulse 6.5s linear infinite;
        }

        .graph-node {
          transform-origin: center;
          animation: nodeDrift 8s ease-in-out infinite;
        }

        .graph-particle {
          fill: rgba(255, 255, 255, 0.72);
          opacity: 0.45;
          animation: particleFloat 7s ease-in-out infinite;
        }

        @keyframes edgePulse {
          0% {
            stroke-dashoffset: 0;
            opacity: 0.22;
          }
          50% {
            opacity: 0.68;
          }
          100% {
            stroke-dashoffset: -96;
            opacity: 0.22;
          }
        }

        @keyframes nodeDrift {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          25% {
            transform: translate3d(0, -8px, 0) scale(1.015);
          }
          50% {
            transform: translate3d(6px, 4px, 0) scale(0.985);
          }
          75% {
            transform: translate3d(-5px, 6px, 0) scale(1.01);
          }
        }

        @keyframes particleFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.2;
          }
          40% {
            transform: translate3d(10px, -10px, 0);
            opacity: 0.8;
          }
          75% {
            transform: translate3d(-8px, 12px, 0);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}