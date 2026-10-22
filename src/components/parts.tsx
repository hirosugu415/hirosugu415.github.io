import { Fragment, useRef, useState, type ReactNode } from "react";
import { Alert, Box, Chip, Collapse, Dialog, IconButton, Link, Stack, Typography } from "@mui/material";

export type ShotSpec = {
  src: string;
  caption?: string;
  /** スマホの画面などの縦長の画像。幅を絞って中央に置く。 */
  phone?: boolean;
  /** MP4 のとき、再生が始まるまで出す画像 */
  poster?: string;
  /** トップのカードのサムネイルには、動く画像の代わりにこの静止画を使う */
  thumbSrc?: string;
  /** 詳細ページのパネルには、見せたい部分だけを切り抜いたこの画像を出す。全体はクリックで拡大して見る */
  view?: string;
  /** トップのカードのサムネイルで、どこを切り取って見せるか（object-position） */
  thumbPos?: string;
  /** 大きさをそろえたいとき、この縦横比の枠に入れる（例："4 / 3"）。はみ出たぶんは下を切る */
  aspect?: string;
  /** aspect の枠への入れ方。contain なら切らずに全体を収める */
  fit?: "cover" | "contain";
};

/**
 * スクリーンショットか GIF か MP4（音なしでループ再生）。ファイルがまだ置かれていないときは、
 * placeholder なら点線の枠にファイル名を出し、そうでなければ何も描かない。
 */
export function Shot({ shot, placeholder = true, thumb = false }: { shot: ShotSpec; placeholder?: boolean; thumb?: boolean }) {
  const [missing, setMissing] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  if (missing && !placeholder) return null;
  const src = thumb ? (shot.thumbSrc ?? shot.src) : (shot.view ?? shot.src);
  const media = {
    ...(src.endsWith(".mp4")
      ? { component: "video", autoPlay: true, muted: true, loop: true, playsInline: true, preload: "metadata", poster: shot.poster }
      : // 詳細ページでは最初に全部読み込む。遅れて読み込むと高さが変わり、#test などへ飛んだ位置がずれるため
        { component: "img", alt: shot.caption ?? "", loading: thumb ? "lazy" : "eager" }),
    src,
    onError: () => setMissing(true),
  } as const;

  const frame = {
    display: "block",
    width: "100%",
    border: 1,
    borderColor: "divider",
    borderRadius: thumb ? 2 : 3,
    bgcolor: "background.paper",
  } as const;

  return (
    <Box component="figure" sx={{ m: 0 }}>
      {missing ? (
        <Box
          sx={{
            ...frame,
            borderStyle: "dashed",
            borderWidth: 2,
            display: "grid",
            placeItems: "center",
            aspectRatio: shot.phone ? "9 / 16" : "16 / 10",
            maxWidth: shot.phone ? 260 : "none",
            mx: "auto",
            p: 2,
            fontFamily: "Consolas, monospace",
            fontSize: 12,
            color: "text.secondary",
            textAlign: "center",
            wordBreak: "break-all",
          }}
        >
          {shot.src}
        </Box>
      ) : thumb ? (
        <Box {...media} sx={{ ...frame, height: 160, objectFit: "cover", objectPosition: shot.thumbPos ?? "top" }} />
      ) : (
        // 幅をそろえるため、どの画像も同じ幅のパネルに入れる。縦長の画像は高さを抑えて中央に置く。
        // クリックすると、画面いっぱいに拡大して見られる（横長の画像が小さくて読みにくいため）。
        <Box
          role="button"
          tabIndex={0}
          aria-label={`${shot.caption ?? "画像"}を拡大する`}
          onClick={() => setZoomed(true)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setZoomed(true))}
          sx={{
            position: "relative",
            p: { xs: 1.5, md: 2 },
            borderRadius: 3,
            // 画像の後ろの四角は、ぼんやりあるとわかるくらいの薄さにする
            bgcolor: "color-mix(in srgb, var(--mui-palette-text-primary) 2.5%, transparent)",
            display: "grid",
            placeItems: "center",
            cursor: "zoom-in",
            "&:hover .zoom-hint, &:focus-visible .zoom-hint": { opacity: 1 },
          }}
        >
          <Box
            {...media}
            sx={{
              ...frame,
              borderRadius: 2,
              width: shot.phone ? "auto" : "100%",
              maxWidth: "100%",
              height: "auto",
              maxHeight: shot.phone ? 480 : "none",
              ...(shot.aspect && { aspectRatio: shot.aspect, objectFit: shot.fit ?? "cover", objectPosition: "top" }),
            }}
          />
          <Box
            className="zoom-hint"
            sx={{
              position: "absolute",
              right: 12,
              bottom: 12,
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontSize: 12,
              color: "#fff",
              bgcolor: "rgba(0,0,0,.6)",
              opacity: { xs: 1, md: 0.75 },
              transition: "opacity .2s",
              pointerEvents: "none",
            }}
          >
            クリックで拡大
          </Box>
        </Box>
      )}
      {zoomed && (
        <Dialog
          open
          onClose={() => setZoomed(false)}
          onClick={() => setZoomed(false)}
          maxWidth={false}
          slotProps={{ paper: { sx: { m: 1, bgcolor: "transparent", boxShadow: "none", backgroundImage: "none", overflow: "visible", cursor: "zoom-out" } } }}
        >
          <Box
            {...(shot.src.endsWith(".mp4")
              ? { component: "video", autoPlay: true, muted: true, loop: true, playsInline: true, poster: shot.poster }
              : { component: "img", alt: shot.caption ?? "" })}
            src={shot.src}
            sx={{ display: "block", maxWidth: "88vw", maxHeight: "78vh", width: "auto", height: "auto", mx: "auto", borderRadius: 2, bgcolor: "background.paper" }}
          />
          {shot.caption && <Typography sx={{ mt: 1.25, textAlign: "center", color: "#fff", fontSize: 14 }}>{shot.caption}</Typography>}
          <Typography sx={{ mt: 0.5, textAlign: "center", color: "rgba(255,255,255,.7)", fontSize: 12 }}>
            {/* 拡大すると細かいところまで読めるので、社内システムの画像にはここでも断っておく */}
            {shot.src.startsWith("assets/work/") && "画像の中のデータはすべてダミーです　・　"}
            クリックかEscで閉じる
          </Typography>
        </Dialog>
      )}
      {shot.caption && !thumb && (
        <Typography component="figcaption" variant="body2" color="textSecondary" sx={{ mt: 1, fontSize: 13, textAlign: "center" }}>
          {shot.caption}
        </Typography>
      )}
    </Box>
  );
}

/**
 * 何枚もの写真を1枚ずつ見せる。横にスワイプするか、左右のボタンか下の点で切り替える。
 * スクロールスナップで作っているので、スマホでは指でそのまま送れる。
 */
export function Carousel({ shots }: { shots: ShotSpec[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const next = (i + shots.length) % shots.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  };

  const arrow = (dir: -1 | 1) => (
    <IconButton
      aria-label={dir < 0 ? "前の写真" : "次の写真"}
      onClick={() => go(index + dir)}
      size="small"
      sx={{
        position: "absolute",
        top: "calc(50% - 30px)",
        [dir < 0 ? "left" : "right"]: 8,
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        boxShadow: 1,
        "&:hover": { bgcolor: "background.paper" },
      }}
    >
      <Box component="span" sx={{ fontSize: 22, lineHeight: 1, width: 22, height: 22, display: "grid", placeItems: "center" }}>
        {dir < 0 ? "‹" : "›"}
      </Box>
    </IconButton>
  );

  return (
    <Box>
      <Box sx={{ position: "relative" }}>
        <Box
          ref={track}
          onScroll={(e) => {
            const el = e.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
          sx={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {shots.map((s) => (
            <Box key={s.src} sx={{ flex: "0 0 100%", minWidth: 0, scrollSnapAlign: "start" }}>
              <Shot shot={s} />
            </Box>
          ))}
        </Box>
        {arrow(-1)}
        {arrow(1)}
      </Box>
      <Stack direction="row" sx={{ justifyContent: "center", gap: 1, mt: 1.25 }}>
        {shots.map((s, i) => (
          <Box
            key={s.src}
            component="button"
            aria-label={`${i + 1}枚目`}
            onClick={() => go(i)}
            sx={{
              width: 8,
              height: 8,
              p: 0,
              border: 0,
              borderRadius: "50%",
              cursor: "pointer",
              bgcolor: i === index ? "primary.main" : "action.disabled",
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}

/** 社内システムの画像について、データがすべてダミーであることを目立たせて断る */
export function DummyNote() {
  return (
    <Alert
      severity="info"
      variant="outlined"
      sx={{ mt: 2.25, borderRadius: 2.5, "& .MuiAlert-message": { fontSize: 14, lineHeight: 1.8 } }}
    >
      <Box component="strong" sx={{ display: "block", mb: 0.25 }}>
        画像の中のデータは、すべてダミーデータです
      </Box>
      画像に出てくる会社名、人の名前、住所、電話番号、メールアドレスなどは、すべてダミーで、実在のものではありません。社内のシステムなので、画面も一部分だけをお見せしています。見せられない部分は黒く塗っています。
    </Alert>
  );
}

const STEP_COLOR = { 課題: "warning.main", やったこと: "primary.main", 結果: "success.main" } as const;

/** 本文を「課題 → やったこと → 結果」に分ける、小さなラベルつきのまとまり */
export function Step({ label, children }: { label: keyof typeof STEP_COLOR; children: ReactNode }) {
  return (
    <Box sx={{ mb: 2.25, "&:last-child": { mb: 0 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75, fontSize: 13, fontWeight: 700, color: STEP_COLOR[label] }}>
        <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STEP_COLOR[label] }} />
        {label}
      </Box>
      {/* 縦線は引かない。タイムラインの縦線と二重に見えるため */}
      <Box>{children}</Box>
    </Box>
  );
}

/** 箇条書きの1項目。太字の見出しだけを見せて、説明は「詳しく」で開く（長いところだけに使う） */
export function Fold({ title, children }: { title: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <b>{title}</b>
      <Box
        component="button"
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        sx={{ ml: 1, p: 0, border: 0, bgcolor: "transparent", color: "primary.main", font: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
      >
        {open ? "閉じる ▴" : "詳しく ▾"}
      </Box>
      <Collapse in={open}>
        <Box sx={{ pt: 0.75 }}>{children}</Box>
      </Collapse>
    </li>
  );
}

/** 左から右へ流れる図。狭い画面では上から下に並べる */
export function Flow({ steps }: { steps: ReactNode[] }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        alignItems: { xs: "stretch", sm: "center" },
        gap: 0.75,
        my: 2,
        p: 1.75,
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      {steps.map((s, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <Box aria-hidden sx={{ color: "primary.main", fontWeight: 700, textAlign: "center", lineHeight: 1 }}>
              <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>→</Box>
              <Box component="span" sx={{ display: { xs: "inline", sm: "none" } }}>↓</Box>
            </Box>
          )}
          <Box sx={{ px: 1.25, py: 0.75, borderRadius: 2, bgcolor: "action.hover", fontSize: 14, textAlign: "center" }}>{s}</Box>
        </Fragment>
      ))}
    </Box>
  );
}

/** 真ん中の1つから、まわりの6つ（3×3 のマスの上段と下段）へ線が伸びる図 */
export function Hub({ center, nodes }: { center: ReactNode; nodes: ReactNode[] }) {
  // 3×3 のマスのうち、真ん中以外に置く位置（行, 列）。上段3つ・下段3つ
  const cells = [
    [1, 1], [1, 2], [1, 3],
    [3, 1], [3, 2], [3, 3],
  ];
  const pct = (n: number) => `${((n - 0.5) / 3) * 100}%`;
  return (
    <Box
      sx={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gridTemplateRows: "repeat(3, minmax(0, 1fr))",
        gap: { xs: 1, sm: 1.5 },
        my: 2.5,
        p: { xs: 1.25, sm: 2 },
        border: 1,
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "background.paper",
      }}
    >
      <Box component="svg" aria-hidden sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", color: "text.secondary", opacity: 0.5 }}>
        {nodes.map((_, i) => (
          <line key={i} x1="50%" y1="50%" x2={pct(cells[i][1])} y2={pct(cells[i][0])} stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
        ))}
      </Box>
      <Box
        sx={{
          gridRow: 2,
          gridColumn: 2,
          position: "relative",
          display: "grid",
          placeItems: "center",
          p: 1,
          borderRadius: 2,
          // 色は付けず、文字色と背景色を入れ替えた白黒にする（ライトでは黒地に白、ダークでは白地に黒）
          bgcolor: "text.primary",
          color: "background.default",
          fontWeight: 700,
          textAlign: "center",
          fontSize: { xs: 13, sm: 15 },
        }}
      >
        {center}
      </Box>
      {nodes.map((n, i) => (
        <Box
          key={i}
          sx={{
            gridRow: cells[i][0],
            gridColumn: cells[i][1],
            position: "relative",
            display: "grid",
            placeItems: "center",
            p: { xs: 0.75, sm: 1 },
            borderRadius: 2,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.default",
            textAlign: "center",
            fontSize: { xs: 11.5, sm: 13 },
            lineHeight: 1.5,
            "& code": { fontSize: "0.8em", overflowWrap: "normal" },
          }}
        >
          {/* grid の中に直接置くと、文字とコードが別々のマスとして並んでしまうので包む */}
          <span>{n}</span>
        </Box>
      ))}
    </Box>
  );
}

/** インラインコード */
export function C({ children }: { children: ReactNode }) {
  return (
    <Box
      component="code"
      sx={{
        fontFamily: '"Cascadia Code", Consolas, monospace',
        fontSize: "0.88em",
        px: 0.5,
        py: 0.1,
        borderRadius: 1,
        bgcolor: "action.hover",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </Box>
  );
}

/** キーボードのキー */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <Box
      component="kbd"
      sx={{
        fontFamily: '"Cascadia Code", Consolas, monospace',
        fontSize: "0.85em",
        px: 0.6,
        py: 0.1,
        border: 1,
        borderBottomWidth: 2,
        borderColor: "divider",
        borderRadius: 1,
        bgcolor: "background.paper",
      }}
    >
      {children}
    </Box>
  );
}

/** 本文のまとまり。中の p / ul / li を MUI のタイポグラフィに合わせる。 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        typography: "body1",
        "& p": { m: 0, mb: 2 },
        "& ul": { m: 0, mb: 2, pl: 2.6 },
        "& li": { mb: 0.9 },
        "& > :last-child": { mb: 0 },
      }}
    >
      {children}
    </Box>
  );
}

/** 「技術」「役割」などの見出しつきの行 */
export function Meta({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <Box component="dl" sx={{ m: 0, mb: 2.25, display: "grid", gap: 0.75, fontSize: 14 }}>
      {rows.map(([k, v]) => (
        <Box key={k} sx={{ display: "grid", gridTemplateColumns: "4.5em minmax(0, 1fr)", gap: 1.5 }}>
          <Box component="dt" sx={{ color: "text.secondary" }}>{k}</Box>
          <Box component="dd" sx={{ m: 0 }}>{v}</Box>
        </Box>
      ))}
    </Box>
  );
}

/** 小さな見出しの上の、青い一行 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "primary.main", mb: 0.5 }}>{children}</Typography>
  );
}

/** 外部リンクを丸いチップで並べる */
export function LinkChips({ links }: { links: [string, string][] }) {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
      {links.map(([href, label]) => (
        <Chip key={href} component="a" href={href} label={label} clickable variant="outlined" size="small" />
      ))}
    </Stack>
  );
}

/** 時期の見出し（右に罫線が伸びる） */
export function Period({ children }: { children: ReactNode }) {
  return (
    <Typography
      sx={{
        mt: 4.5,
        mb: 1.75,
        fontSize: 14,
        fontWeight: 700,
        color: "primary.main",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        "&::after": { content: '""', flex: 1, height: "1px", bgcolor: "divider" },
      }}
    >
      {children}
    </Typography>
  );
}

export { Link };
