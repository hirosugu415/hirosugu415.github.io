import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { jumpToHash } from "./jumpToHash";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout onTop>
      <Home />
    </Layout>
  </StrictMode>,
);

// 描画が終わってから、URL の #id の位置へ移動する。
jumpToHash();
