/**
 * WorkflowPreview — SVG mini-canvas that mimics ReactFlow nodes + edges.
 * Used in frame gallery cards to show a visual preview of the workflow.
 */

export type PNode = {
  id: string;
  x: number; y: number;
  w?: number; h?: number;
  label: string;
  sub: string;
  color: string;
};

export type PEdge = {
  from: string; to: string;
  fromSide?: 'right' | 'left' | 'top' | 'bottom';
  toSide?:   'right' | 'left' | 'top' | 'bottom';
};

const NW = 76, NH = 30;

function anchor(n: PNode, side: string) {
  const w = n.w ?? NW, h = n.h ?? NH;
  const cx = n.x + w / 2, cy = n.y + h / 2;
  if (side === 'right')  return { x: n.x + w, y: cy };
  if (side === 'left')   return { x: n.x,     y: cy };
  if (side === 'top')    return { x: cx,       y: n.y };
  if (side === 'bottom') return { x: cx,       y: n.y + h };
  return { x: n.x + w, y: cy };
}

function edgePath(e: PEdge, nodeMap: Map<string, PNode>): string {
  const fn = nodeMap.get(e.from)!;
  const tn = nodeMap.get(e.to)!;
  const fs = e.fromSide ?? 'right';
  const ts = e.toSide   ?? 'left';
  const f  = anchor(fn, fs);
  const t  = anchor(tn, ts);

  let c1x: number, c1y: number, c2x: number, c2y: number;
  if (fs === 'right' || fs === 'left') {
    const dx = t.x - f.x;
    c1x = f.x + dx * 0.5; c1y = f.y;
    c2x = t.x - dx * 0.5; c2y = t.y;
  } else {
    const dy = t.y - f.y;
    c1x = f.x; c1y = f.y + dy * 0.5;
    c2x = t.x; c2y = t.y - dy * 0.5;
  }
  return `M${f.x},${f.y} C${c1x},${c1y} ${c2x},${c2y} ${t.x},${t.y}`;
}

export default function WorkflowPreview({
  uid, nodes, edges,
}: {
  uid: string;
  nodes: PNode[];
  edges: PEdge[];
}) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const pid = `dot-${uid}`;
  const mid = `arr-${uid}`;

  return (
    <svg
      viewBox="0 0 380 160"
      preserveAspectRatio="xMidYMid meet"
      className="w-full h-full"
      style={{ display: 'block' }}
    >
      <defs>
        {/* Grid dots */}
        <pattern id={pid} width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="0.75" fill="rgba(255,255,255,0.07)" />
        </pattern>
        {/* Arrow marker */}
        <marker
          id={mid}
          markerWidth="7" markerHeight="7"
          refX="6" refY="3.5"
          orient="auto"
        >
          <path d="M0,1 L6,3.5 L0,6 Z" fill="rgba(255,255,255,0.45)" />
        </marker>
      </defs>

      {/* Background */}
      <rect width="380" height="160" fill="#080818" />
      <rect width="380" height="160" fill={`url(#${pid})`} />

      {/* Edges */}
      {edges.map((e, i) => (
        <path
          key={i}
          d={edgePath(e, nodeMap)}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1.5"
          markerEnd={`url(#${mid})`}
        />
      ))}

      {/* Nodes */}
      {nodes.map(n => {
        const w = n.w ?? NW, h = n.h ?? NH;
        const hasSub = n.sub.length > 0;
        return (
          <g key={n.id}>
            {/* Outer glow */}
            <rect
              x={n.x - 2} y={n.y - 2}
              width={w + 4} height={h + 4}
              rx="8" ry="8"
              fill={n.color}
              opacity="0.15"
            />
            {/* Node body */}
            <rect
              x={n.x} y={n.y}
              width={w} height={h}
              rx="6" ry="6"
              fill="#10102e"
              stroke={n.color}
              strokeWidth="1.5"
            />
            {/* Label */}
            <text
              x={n.x + w / 2}
              y={n.y + (hasSub ? 11 : 18)}
              textAnchor="middle"
              fill="white"
              fontSize="8.5"
              fontWeight="700"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {n.label}
            </text>
            {/* Sub-label (tool name) */}
            {hasSub && (
              <text
                x={n.x + w / 2}
                y={n.y + 22}
                textAnchor="middle"
                fill={n.color}
                fontSize="7"
                fontWeight="500"
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {n.sub}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
