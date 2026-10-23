import { useEffect, useState } from "react";
import { Box, Chip, Collapse, Link, Stack, Typography } from "@mui/material";
import { Section } from "../components/Layout";
import { Carousel, DummyNote, Eyebrow, Meta, Prose, Shot } from "../components/parts";
import { PERIODS, WORK } from "../content/work";

/** タイムラインの学年。学部1年・2年は項目がないので、短い一文だけ置く。 */
const YEARS = [
  { id: "y1", label: "学部1年", note: "プログラマーのアルバイトを始めました。" },
  { id: "y2", label: "学部2年", note: "秋に、新しい社内システムを作ろうと提案して、開発が始まりました。", period: "学部2年" },
  { id: "y3", label: "学部3年", period: "学部3年" },
  { id: "y4", label: "学部4年", period: "学部4年" },
] as const satisfies readonly { id: string; label: string; note?: string; period?: (typeof PERIODS)[number] }[];

/** タイムラインの縦線の位置（左端からの距離）と、本文の字下げ */
const LINE_X = 7;
const INDENT = { xs: "32px", md: "44px" };

function Back() {
  return (
    <Link href="./#work" underline="none" sx={{ fontSize: 14 }}>
      ← トップに戻る
    </Link>
  );
}

/** 技術タグを、使っている項目が多い順に並べたもの */
const TAGS = Object.entries(
  WORK.flatMap((w) => w.tags).reduce<Record<string, number>>((acc, t) => ((acc[t] = (acc[t] ?? 0) + 1), acc), {}),
)
  .sort((a, b) => b[1] - a[1])
  .map(([t]) => t);

/**
 * 画面の真ん中あたりにある学年と項目を返す（スクロールスパイ）。
 * 絞り込みで学年や項目が出入りしたら、見張る相手を見直す。
 */
function useActive(deps: unknown) {
  const [year, setYear] = useState<string>(YEARS[0].id);
  const [item, setItem] = useState<string | null>(null);
  useEffect(() => {
    const years = new Set<string>(YEARS.map((y) => y.id));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          if (years.has(e.target.id)) setYear(e.target.id);
          else setItem(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of [...years, ...WORK.map((w) => w.id)]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [deps]);
  return { year, item };
}

/**
 * 学年の目次。PC では左に固定し、今いる学年だけ、下に項目のタイトルを開いて並べる（ほかの学年は閉じる）。
 * スマホでは学年だけを上に横並びで固定する。
 */
function YearNav({ year, item, tag }: { year: string; item: string | null; tag: string | null }) {
  return (
    <Box
      component="nav"
      aria-label="学年"
      sx={{
        position: "sticky",
        top: { xs: 56, md: 80 },
        zIndex: 2,
        alignSelf: "start",
        maxHeight: { md: "calc(100vh - 110px)" },
        overflowY: { md: "auto" },
        scrollbarWidth: "thin",
        mx: { xs: -2, sm: -3, md: 0 },
        px: { xs: 2, sm: 3, md: 0 },
        py: { xs: 1, md: 0 },
        bgcolor: { xs: "color-mix(in srgb, var(--mui-palette-background-default) 92%, transparent)", md: "transparent" },
        backdropFilter: { xs: "blur(10px)", md: "none" },
        borderBottom: { xs: 1, md: 0 },
        borderColor: "divider",
      }}
    >
      <Stack direction={{ xs: "row", md: "column" }} sx={{ gap: { xs: 0.5, md: 0.25 }, overflowX: { xs: "auto", md: "visible" }, scrollbarWidth: "none" }}>
        {YEARS.map((y) => {
          const on = y.id === year;
          const items = "period" in y ? WORK.filter((w) => w.period === y.period && (!tag || w.tags.includes(tag))) : [];
          if (tag && items.length === 0) return null;
          return (
            <Box key={y.id}>
              <Link
                href={`#${y.id}`}
                underline="none"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.25,
                  py: { xs: 0.5, md: 0.75 },
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                  fontSize: 14,
                  fontWeight: on ? 700 : 500,
                  color: on ? "primary.main" : "text.secondary",
                  bgcolor: on ? "action.selected" : "transparent",
                  transition: "color .2s, background-color .2s",
                  "&:hover": { color: on ? "primary.main" : "text.primary" },
                }}
              >
                <Box component="span" sx={{ display: { xs: "none", md: "inline" }, width: 8, fontSize: 10 }}>
                  {on ? "▶" : ""}
                </Box>
                {y.label}
              </Link>

              {/* 項目のタイトル。PC だけで、今いる学年のぶんだけ開く */}
              {items.length > 0 && (
                <Collapse in={on} sx={{ display: { xs: "none", md: "block" } }}>
                <Box component="ul" sx={{ listStyle: "none", m: 0, mt: 0.25, mb: 1, ml: "21px", p: 0, borderLeft: 1, borderColor: "divider" }}>
                  {items.map((w) => {
                    const here = w.id === item;
                    return (
                      <li key={w.id}>
                        <Link
                          href={`#${w.id}`}
                          underline="none"
                          sx={{
                            display: "block",
                            ml: "-1px",
                            pl: 1.25,
                            py: 0.4,
                            borderLeft: 2,
                            borderColor: here ? "primary.main" : "transparent",
                            fontSize: 12.5,
                            lineHeight: 1.5,
                            fontWeight: here ? 700 : 400,
                            color: here ? "primary.main" : "text.secondary",
                            transition: "color .2s, border-color .2s",
                            "&:hover": { color: here ? "primary.main" : "text.primary" },
                          }}
                        >
                          {w.title}
                        </Link>
                      </li>
                    );
                  })}
                </Box>
                </Collapse>
              )}
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}

/** 縦線の上に打つ点。filled なら塗りつぶし、そうでなければ白抜き。 */
function dot(filled: boolean, top: string) {
  return {
    content: '""',
    position: "absolute",
    left: `calc(${LINE_X + 1}px - var(--indent) - 7px)`,
    top,
    width: 14,
    height: 14,
    borderRadius: "50%",
    border: filled ? 0 : 2,
    borderColor: "primary.main",
    bgcolor: filled ? "primary.main" : "background.default",
    // 縦線の上に乗っていることがわかるよう、背景色のふちで線を切る
    outline: "3px solid var(--mui-palette-background-default)",
  } as const;
}

export function Work() {
  const [tag, setTag] = useState<string | null>(null);
  const { year, item } = useActive(tag);
  const pick = (t: string | null) => {
    setTag(t);
    document.getElementById("tags")?.scrollIntoView({ behavior: "smooth" });
  };
  let n = 0;
  return (
    <>
      <Section wide first>
        <Box sx={{ mb: 2.5 }}>
          <Back />
        </Box>
        <Eyebrow>アルバイト ／ 学部2年の秋〜現在</Eyebrow>
        <Typography variant="h1" sx={{ fontSize: { xs: "1.6rem", md: "2.2rem" }, fontWeight: 700, lineHeight: 1.35, mb: 2.25 }}>
          部品を扱う会社の社内システム
        </Typography>
        <Meta
          rows={[
            ["チーム", "開発者3人"],
            ["役割", "提案、設計、フロントエンド、バックエンド、インフラ、運用"],
            ["技術", "React / TypeScript / MUI / Laravel / MySQL / Docker / nginx / php-fpm / GitHub Actions"],
          ]}
        />
        <Box sx={{ maxWidth: 760 }}>
          <Prose>
            <p>住所録、部品や実装基板の検索、部品の発注管理、部品収集などができる社内システムです。本番サーバーで運用していて、運用歴はそろそろ2年になります。</p>
            <p>学部2年の秋に新しいサーバーを作ろうと提案して、社長も乗ってくれたので開発が始まりました。フロントにReact、バックにLaravelを採用して、途中からTypeScriptを取り入れています。主に住所録と部品収集の画面を担当しています。</p>
            <p>社内では「LARASERVER」と呼んでいます。もともと社内にWindows 7のサーバーがあって、先輩が7とサーバーで「nanaserver」と名付けていたので、それにならって、Laravelとサーバーで名付けました。</p>
            <p>開発者3人のチームなので、コードを書く以外のことにも携わってきました。ここでは、僕が携わったことをやってきた順に書いています。</p>
          </Prose>
          <DummyNote />
        </Box>

        {/* 目次 */}
        <Box component="nav" aria-label="目次" sx={{ mt: 3.5, p: { xs: 2.25, md: 3 }, maxWidth: 760, border: 1, borderColor: "divider", borderRadius: 3, bgcolor: "background.paper" }}>
          {PERIODS.map((period) => {
            const items = WORK.filter((w) => w.period === period);
            const start = n + 1;
            n += items.length;
            return (
              <Box key={period} sx={{ "& + &": { mt: 1.75 } }}>
                <Typography color="textSecondary" sx={{ fontSize: 13, fontWeight: 700, mb: 0.5 }}>
                  {period}
                </Typography>
                <Box component="ol" start={start} sx={{ m: 0, pl: 3.25 }}>
                  {items.map((w) => (
                    <li key={w.id}>
                      <Link href={`#${w.id}`} underline="hover">
                        {w.title}
                      </Link>
                    </li>
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Section>

      <Section title="やってきたこと" wide>
        {/* 技術で絞り込む */}
        <Box id="tags" sx={{ mb: 4, scrollMarginTop: 16 }}>
          <Typography color="textSecondary" sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
            技術で絞り込む
          </Typography>
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75 }}>
            <Chip label="すべて" size="small" clickable color={tag ? "default" : "primary"} variant={tag ? "outlined" : "filled"} onClick={() => pick(null)} />
            {TAGS.map((t) => (
              <Chip key={t} label={t} size="small" clickable color={t === tag ? "primary" : "default"} variant={t === tag ? "filled" : "outlined"} onClick={() => pick(t === tag ? null : t)} />
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "180px minmax(0, 1fr)" }, columnGap: 5, rowGap: 3 }}>
          <YearNav year={year} item={item} tag={tag} />

          <Box
            sx={{
              position: "relative",
              "--indent": INDENT,
              "&::before": { content: '""', position: "absolute", left: LINE_X, top: 12, bottom: 0, width: 2, bgcolor: "divider" },
            }}
          >
            {YEARS.map((y) => {
              const items = "period" in y ? WORK.filter((w) => w.period === y.period && (!tag || w.tags.includes(tag))) : [];
              if (tag && items.length === 0) return null;
              return (
                <Box key={y.id} id={y.id} sx={{ scrollMarginTop: { xs: 48, md: 16 }, pb: { xs: 5, md: 7 } }}>
                  <Box sx={{ position: "relative", pl: "var(--indent)", "&::before": { ...dot(true, "calc(50% - 7px)"), width: 16, height: 16, left: `${LINE_X + 1 - 8}px`, top: "calc(50% - 8px)" } }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1.5,
                      py: 0.4,
                      borderRadius: 99,
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {y.label}
                  </Box>
                  </Box>

                  {"note" in y && !tag && (
                    <Box sx={{ position: "relative", pl: "var(--indent)", mt: 2.5 }}>
                      <Typography color="textSecondary" sx={{ position: "relative", "&::before": dot(false, "calc(0.8em - 7px)") }}>
                        {y.note}
                      </Typography>
                    </Box>
                  )}

                  {items.map((w) => (
                    <Box
                      component="section"
                      id={w.id}
                      key={w.id}
                      sx={{
                        mt: { xs: 4, md: 5 },
                        pl: "var(--indent)",
                        scrollMarginTop: { xs: 48, md: 8 },
                        display: "grid",
                        gridTemplateColumns: { xs: "minmax(0, 1fr)", md: w.shots ? "minmax(0, clamp(26rem, 40%, 34rem)) minmax(0, 1fr)" : "minmax(0, 1fr)" },
                        gap: { xs: 3, md: 5 },
                        alignItems: "start",
                        "&:target h3": { color: "primary.main" },
                      }}
                    >
                      {/* 1行が長くなりすぎないよう、写真がない項目は幅を絞る */}
                      <Box sx={{ maxWidth: w.shots ? "none" : "38em" }}>
                        {w.when && (
                          <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "primary.main", mb: 0.5 }}>
                            {w.when}
                          </Typography>
                        )}
                        <Typography
                          variant="h3"
                          sx={{ position: "relative", fontSize: "1.2rem", fontWeight: 700, lineHeight: 1.5, mb: 1.5, "&::before": dot(true, "calc(0.75em - 7px)") }}
                        >
                          {w.title}
                        </Typography>
                        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.5, mb: 1.75 }}>
                          {w.tags.map((t) => (
                            <Chip key={t} label={t} size="small" variant="outlined" clickable onClick={() => pick(t)} sx={{ fontSize: 12, height: 22 }} />
                          ))}
                        </Stack>
                        <Typography sx={{ fontWeight: 700, fontSize: "1.05rem", lineHeight: 1.75, mb: 2 }}>{w.lead}</Typography>
                        <Prose>{w.body}</Prose>
                      </Box>
                      {w.shots && (
                        <Box sx={{ display: "grid", gap: 2.5 }}>
                          {w.carousel ? <Carousel shots={w.shots} /> : w.shots.map((s) => <Shot key={s.src} shot={s} />)}
                        </Box>
                      )}

                      {/* 図などは、写真の列までまたいで全幅で出す。文章は1行が長くなりすぎないよう幅を絞る */}
                      {w.after && (
                        <Box sx={{ gridColumn: "1 / -1", "& > p, & > ul": { maxWidth: "38em" } }}>
                          <Prose>{w.after}</Prose>
                        </Box>
                      )}

                      {/* 「結果」は写真の列までまたいで全幅で出し、項目の締めにする（背景は付けない） */}
                      {w.result && (
                        <Box sx={{ gridColumn: "1 / -1" }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5, fontSize: 13, fontWeight: 700, color: "success.main" }}>
                            <Box component="span" sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
                            結果
                          </Box>
                          <Prose>{w.result}</Prose>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Back />
        </Box>
      </Section>
    </>
  );
}
