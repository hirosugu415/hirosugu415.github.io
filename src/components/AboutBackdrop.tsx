import { Box } from "@mui/material";

// About の上の方に敷く模様。左は化学の構造式、右は情報の世界のグラフ（点と線）で、
// 真ん中で分子の環がネットワークの点に変わっていく。「化学科から情報科学研究科へ」を絵にしたもの。
//
// 座標は「中身の列の左端を 0 とした px」。画面の幅が変わっても中身の列に合わせて置くので、
// 写真や文章とは重ならない場所（タイトルの右の帯、文章の右側、列の外の余白）に描いている。

type P = [number, number];
type Seg = [number, number, number, number];

const R = 34; // 環の半径（＝結合の長さ）
const W = Math.sqrt(3) * R; // 横に並んだ環の中心の間隔

/** 頂点が上を向いた六角形の頂点。0 が真上で、時計回り */
function hex([cx, cy]: P): P[] {
  return [-90, -30, 30, 90, 150, 210].map((d) => {
    const a = (d * Math.PI) / 180;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
}

const sides = (v: P[]): Seg[] => v.map((a, i) => [...a, ...v[(i + 1) % 6]]);

/** ベンゼン環の、1つおきの二重結合（内側の短い線） */
function doubles(c: P): Seg[] {
  const v = hex(c);
  return [0, 2, 4].map((i) => {
    const [a, b] = [v[i], v[(i + 1) % 6]].map(([x, y]): P => [c[0] + (x - c[0]) * 0.78, c[1] + (y - c[1]) * 0.78]);
    const s = 0.15;
    return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, b[0] + (a[0] - b[0]) * s, b[1] + (a[1] - b[1]) * s];
  });
}

/** ジグザグの炭素鎖。向き deg から、左右に30°ずつ振れながら n 本伸ばす。通った点を返す */
function chain(start: P, deg: number, n: number): P[] {
  const pts: P[] = [start];
  for (let i = 0; i < n; i++) {
    const a = ((deg + (i % 2 ? 30 : -30)) * Math.PI) / 180;
    const [x, y] = pts[i];
    pts.push([x + R * Math.cos(a), y + R * Math.sin(a)]);
  }
  return pts;
}

const path = (pts: P[]): Seg[] => pts.slice(1).map((b, i) => [...pts[i], ...b]);

// ---- 左：分子 ----
const PYRIDINE: P = [-20, 40]; // 列の外の余白。広い画面でだけ見える
const NAPH: P[] = [
  [190, 55],
  [190 + W, 55],
];
const CHAIN = chain(hex(NAPH[1])[1], 30, 3);

// ---- 真ん中：分子の環が、ネットワークの点になる ----
const END = CHAIN[CHAIN.length - 1];
const MID = hex([END[0] + R * Math.cos(Math.PI / 3) + R * Math.cos(-Math.PI / 6), END[1] + R * Math.sin(Math.PI / 3) + R * Math.sin(-Math.PI / 6)]);

// ---- 右：グラフ ----
const NODES: P[] = [
  // タイトルの右の帯
  [520, 40], [600, 95], [680, 30], [760, 80], [850, 25], [920, 100],
  // 文章の右側
  [1010, 60], [1080, 150], [1040, 250], [1150, 40], [1180, 220], [1110, 330],
  [1240, 120], [1290, 280], [1220, 400], [1340, 190], [1380, 60], [1050, 410],
];
/** 各点を、近い2点とつなぐ */
const EDGES: Seg[] = (() => {
  const seen = new Set<string>();
  const out: Seg[] = [];
  NODES.forEach((a, i) => {
    NODES.map((b, j) => [j, Math.hypot(a[0] - b[0], a[1] - b[1])] as const)
      .filter(([j]) => j !== i)
      .sort((x, y) => x[1] - y[1])
      .slice(0, 2)
      .forEach(([j]) => {
        const key = [i, j].sort().join("-");
        if (seen.has(key)) return;
        seen.add(key);
        out.push([...a, ...NODES[j]]);
      });
  });
  return out;
})();

const BONDS: Seg[] = [
  ...sides(hex(PYRIDINE)),
  ...NAPH.flatMap((c) => sides(hex(c))),
  ...path(CHAIN),
  [...END, ...MID[4]],
  ...sides(MID),
  // 真ん中の環から、グラフへ
  [...MID[1], ...NODES[0]],
  [...MID[2], ...NODES[1]],
  ...EDGES,
];
const DOUBLES: Seg[] = [PYRIDINE, ...NAPH].flatMap(doubles);

/** 原子の記号（ピリジンの窒素と、鎖の途中の酸素） */
const ATOMS: [P, string][] = [
  [hex(PYRIDINE)[3], "N"],
  [CHAIN[2], "O"],
];

/** 描く範囲。列の左端より左（広い画面の余白）にもはみ出す */
const VIEW = { x: -200, w: 1600, h: 440 };

export function AboutBackdrop() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: "0 0 auto 0",
        height: VIEW.h,
        pointerEvents: "none",
        color: "primary.main",
        // 右上だけ、ほんのり色を付ける
        background: "radial-gradient(ellipse 60% 80% at 85% 0%, color-mix(in srgb, var(--mui-palette-primary-main) 9%, transparent), transparent 70%)",
        // 下に向かって背景へ溶け込ませる
        maskImage: "linear-gradient(to bottom, #000 40%, transparent)",
      }}
    >
      <Box
        component="svg"
        viewBox={`${VIEW.x} 0 ${VIEW.w} ${VIEW.h}`}
        sx={{
          position: "absolute",
          top: 0,
          // 中身の列（Container lg：最大1200px、左右の余白はスマホ16px・それ以外24px）の左端に、座標の 0 を合わせる
          left: { xs: `${16 + VIEW.x}px`, sm: `calc(max(24px, 50% - 576px) + ${VIEW.x}px)` },
          width: VIEW.w,
          height: VIEW.h,
          // スマホでは小さくする
          transform: { xs: "scale(0.7)", sm: "none" },
          transformOrigin: `${-VIEW.x}px 0`,
          opacity: { xs: 0.14, md: 0.18 },
        }}
      >
        <g stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" fill="none">
          {[...BONDS, ...DOUBLES].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        <g fill="currentColor">
          {MID.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={4.5} />
          ))}
          {NODES.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 ? 5 : 7} />
          ))}
        </g>
        {ATOMS.map(([[x, y], label]) => (
          <text key={label} x={x} y={y} dy="0.35em" textAnchor="middle" fill="currentColor" stroke="var(--mui-palette-background-default)" strokeWidth={8} paintOrder="stroke" style={{ font: "600 17px system-ui, sans-serif" }}>
            {label}
          </text>
        ))}
      </Box>
    </Box>
  );
}
