import { createTheme } from "@mui/material/styles";

// Rmemo の紹介サイトと同じ配色。OS の設定に合わせてライト・ダークが切り替わる。
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: "media" },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#2563eb" },
        // 背景は真っ白にして、カードや枠の中はほんの少しだけ色を付けて区別する
        background: { default: "#ffffff", paper: "#fafafb" },
        text: { primary: "#16181d", secondary: "#5f6672" },
        divider: "#e3e5ea",
      },
    },
    dark: {
      palette: {
        primary: { main: "#60a5fa" },
        background: { default: "#17181c", paper: "#1e2026" },
        text: { primary: "#e8e9ec", secondary: "#9ca2ad" },
        divider: "#2c2f37",
      },
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Hiragino Sans", "Yu Gothic UI", "Meiryo", system-ui, sans-serif',
    body1: { lineHeight: 1.85 },
    body2: { lineHeight: 1.75 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiCard: {
      defaultProps: { variant: "outlined" },
    },
  },
});
