import type { ReactNode } from "react";
import { AppBar, Box, Container, CssBaseline, Link, Stack, ThemeProvider, Toolbar, Typography } from "@mui/material";
import { theme } from "../theme";

// "#about" のようなページ内リンクは、トップページ上のセクションを指す。work.html からは "./#about" のようにトップへ戻る。
// Works だけは別のページ（社内システムの詳細）へのリンク。
const NAV = [
  ["#about", "About"],
  ["#projects", "Projects"],
  ["work.html", "Works"],
  ["#learning", "Learning"],
  ["#writing", "Writing"],
  ["#skills", "Skills"],
] as const;

/** wide のときの最大幅。詳細ページは画像を大きく見せたいので、トップより広くする */
const WIDE = 1440;

export function Layout({ children, onTop, wide }: { children: ReactNode; onTop: boolean; wide?: boolean }) {
  const base = onTop ? "" : "./";
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
            <Stack direction="row" spacing={{ xs: 1.75, sm: 2.25 }} sx={{ ml: "auto", overflowX: "auto", scrollbarWidth: "none" }}>
              {NAV.map(([href, label]) => (
                <Link
                  key={href}
                  href={href.startsWith("#") ? `${base}${href}` : href}
                  underline="none"
                  color="textSecondary"
                  sx={{ fontSize: { xs: 13, sm: 14 }, whiteSpace: "nowrap", "&:hover": { color: "text.primary" } }}
                >
                  {label}
                </Link>
              ))}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main">{children}</Box>

      <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 3.5 }}>
        <Container maxWidth={wide ? false : "lg"} sx={{ maxWidth: wide ? WIDE : undefined }}>
          <Stack direction="row" sx={{ flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 1.5 }}>
            <Stack direction="row" spacing={2.25}>
              {[
                ["https://github.com/hirosugu415", "GitHub"],
                ["https://zenn.dev/hiro_tech415", "Zenn"],
                ["https://note.com/hirosugu", "note"],
              ].map(([href, label]) => (
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

/** ページの大きな区切り。上に罫線を引く。 */
export function Section({ id, title, children, narrow, wide }: { id?: string; title?: ReactNode; children: ReactNode; narrow?: boolean; wide?: boolean }) {
  return (
    <Box
      component="section"
      id={id}
      sx={{ py: { xs: 6.5, md: 9 }, "& + &": { borderTop: 1, borderColor: "divider" } }}
    >
      <Container maxWidth={wide ? false : narrow ? "md" : "lg"} sx={{ maxWidth: wide ? WIDE : undefined }}>
        {title && (
          <Typography variant="h2" sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, fontWeight: 700, lineHeight: 1.3, mb: 3.5 }}>
            {title}
          </Typography>
        )}
        {children}
      </Container>
    </Box>
  );
}
