import { useState, type ReactNode } from "react";
import { AppBar, Box, Container, CssBaseline, IconButton, Link, Menu, MenuItem, Stack, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { theme } from "../theme";

// "#about" のようなページ内リンクは、トップページ上のセクションを指す。work.html からは "./#about" のようにトップへ戻る。
// 社内システム詳細だけは別のページ（work.html）へのリンク。Projects と区別がつくように、名前で中身を言う。
const NAV = [
  ["#about", "About"],
  ["#projects", "Projects"],
  ["work.html", "社内システム詳細"],
  ["#learning", "Learning"],
  ["#writing", "Writing"],
  ["#skills", "Skills"],
] as const;

/** 外部のアカウント。フッターと、トップの Contact に並べる。[リンク, サービス名, アカウント名] */
export const SOCIAL = [
  ["https://github.com/hirosugu415", "GitHub", "hirosugu415"],
  ["https://zenn.dev/hiro_tech415", "Zenn", "hiro_tech415"],
  ["https://note.com/hirosugu", "note", "hirosugu"],
  ["https://x.com/hirosugu_0415", "X", "@hirosugu_0415"],
] as const;

/** wide のときの最大幅。詳細ページは画像を大きく見せたいので、トップより広くする */
const WIDE = 1440;

/**
 * この幅以下では、ナビが入りきらないのでハンバーガーメニューにまとめる。
 * 横スクロールで逃がすと、続きがあることに気づかれにくいので、入りきる幅まで余裕をもって切り替える
 */
const NARROW = "@media (max-width: 720px)";

export function Layout({ children, onTop, wide }: { children: ReactNode; onTop: boolean; wide?: boolean }) {
  const base = onTop ? "" : "./";
  const navHref = (href: string) => (href.startsWith("#") ? `${base}${href}` : href);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* PC では文字も画像も余白も、全部を均等にひとまわり大きくする */}
      <Box component="style">{"html { scroll-behavior: smooth; scroll-padding-top: 72px; } @media (min-width: 900px) { body { zoom: 1.1; } }"}</Box>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: "color-mix(in srgb, var(--mui-palette-background-default) 88%, transparent)",
          backdropFilter: "blur(10px)",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth={wide ? false : "lg"} sx={{ maxWidth: wide ? WIDE : undefined }}>
          <Toolbar disableGutters variant="dense" sx={{ minHeight: 56, gap: 2 }}>
            <Link href={onTop ? "#" : "./"} underline="none" color="textPrimary" sx={{ fontWeight: 700, fontSize: 18 }}>
              Hirosugu
            </Link>
            <Stack direction="row" spacing={{ xs: 1.75, sm: 2.25 }} sx={{ ml: "auto", overflowX: "auto", scrollbarWidth: "none", [NARROW]: { display: "none" } }}>
              {NAV.map(([href, label]) => (
                <Link
                  key={href}
                  href={navHref(href)}
                  underline="none"
                  color="textSecondary"
                  sx={{ fontSize: { xs: 13, sm: 14 }, whiteSpace: "nowrap", "&:hover": { color: "text.primary" } }}
                >
                  {label}
                </Link>
              ))}
            </Stack>
            {/* 狭い画面では、右端のボタンからメニューを開く */}
            <IconButton
              aria-label="メニューを開く"
              aria-controls={menuAnchor ? "nav-menu" : undefined}
              aria-expanded={menuAnchor ? "true" : undefined}
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              edge="end"
              sx={{ display: "none", ml: "auto", color: "text.secondary", [NARROW]: { display: "inline-flex" } }}
            >
              <Box component="svg" viewBox="0 0 24 24" sx={{ width: 22, height: 22 }}>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" fill="none" />
              </Box>
            </IconButton>
            <Menu
              id="nav-menu"
              anchorEl={menuAnchor}
              open={!!menuAnchor}
              onClose={() => setMenuAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              // 開いている間にスクロールを止めると、ページ内リンク（#projects など）へ移動できなくなるため止めない
              disableScrollLock
              slotProps={{ paper: { variant: "outlined", sx: { minWidth: 180, mt: 0.5 } } }}
            >
              {NAV.map(([href, label]) => (
                <MenuItem key={href} component="a" href={navHref(href)} onClick={() => setMenuAnchor(null)} sx={{ fontSize: 15 }}>
                  {label}
                </MenuItem>
              ))}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main">{children}</Box>

      <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3.5 }}>
        <Container maxWidth={wide ? false : "lg"} sx={{ maxWidth: wide ? WIDE : undefined }}>
          <Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
            <Stack direction="row" spacing={2.25}>
              {SOCIAL.map(([href, label]) => (
                <Link key={href} href={href} underline="none" color="textSecondary" sx={{ fontSize: 14, "&:hover": { color: "text.primary" } }}>
                  {label}
                </Link>
              ))}
            </Stack>
            <Typography variant="body2" color="textSecondary">
              &copy; 2026 Hirosugu
            </Typography>
          </Stack>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

/**
 * ページの大きな区切り。上に罫線を引く。backdrop を渡すと、中身の後ろに敷く。
 * side にすると、PC では見出しを左の列に置き、中身を右の列に置く。左の列は About の写真の列と同じ幅なので、
 * 中身の左端が About の紹介文とそろう。文章や一覧のように、横いっぱいに広げると読みにくいセクションに使う。
 */
export function Section({ id, title, children, wide, backdrop, side, first }: { id?: string; title?: ReactNode; children: ReactNode; wide?: boolean; backdrop?: ReactNode; side?: boolean; first?: boolean }) {
  const heading = title && (
    <Typography
      variant="h2"
      sx={{
        fontSize: { xs: "1.6rem", md: "2.1rem" },
        fontWeight: 700,
        lineHeight: 1.3,
        mb: side ? { xs: 3.5, md: 0 } : 3.5,
        // 左の列の見出しは、中身を読んでいる間も見えるように残す
        ...(side && { position: { md: "sticky" }, top: 80 }),
      }}
    >
      {title}
    </Typography>
  );
  return (
    <Box
      component="section"
      id={id}
      // backdrop のはみ出しは clip で切る。hidden にすると、中の position: sticky（work.html の学年の目次）が効かなくなる
      // first はページの一番上のセクション。すぐ上はヘッダーなので、セクション同士を離すための上の余白を詰める
      sx={{ position: "relative", overflow: backdrop ? "clip" : undefined, py: { xs: 6.5, md: 4 }, ...(first && { pt: { xs: 3, md: 4 } }), "section + &": { borderTop: 1, borderColor: "divider" } }}
    >
      {backdrop}
      <Container maxWidth={wide ? false : "lg"} sx={{ position: "relative", maxWidth: wide ? WIDE : undefined }}>
        {side ? (
          <Box sx={{ display: { md: "grid" }, gridTemplateColumns: "200px minmax(0, 1fr)", columnGap: 5, alignItems: "start" }}>
            {heading}
            <Box>{children}</Box>
          </Box>
        ) : (
          <>
            {heading}
            {children}
          </>
        )}
      </Container>
    </Box>
  );
}
