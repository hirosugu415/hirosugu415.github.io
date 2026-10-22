import type { ReactNode } from "react";
import { Box, Button, Card, CardActionArea, CardContent, Link, Stack, Typography } from "@mui/material";
import { Section } from "../components/Layout";
import { DummyNote, Eyebrow, Kbd, LinkChips, Meta, Period, Prose, Shot } from "../components/parts";
import { PERIODS, WORK } from "../content/work";

/** About の写真の下に並べる、よく使う技術 */
const ABOUT_TAGS = ["TypeScript", "React", "MUI", "Laravel", "MySQL", "Docker", "GitHub Actions", "Rust"];

/** 経歴の中の、社内システムの詳細ページやトップの項目へのリンク */
function To({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} underline="always" color="inherit" sx={{ textDecorationColor: "var(--mui-palette-divider)", textUnderlineOffset: "0.25em", "&:hover": { color: "primary.main" } }}>
      {children}
    </Link>
  );
}

const TIMELINE: [string, ReactNode][] = [
  ["出身", "鳥取県"],
  ["学部1年", "大阪大学 基礎工学部 化学応用化学科に入学。プログラマーのアルバイトを始める"],
  [
    "学部2年",
    <>React、AWS、Docker、セキュリティなどを片っ端から触って勉強する。秋に<To href="#work">社内システム</To>の作り直しを提案し、<To href="work.html#login">ログイン</To>や<To href="work.html#ui">画面の設計</To>、<To href="work.html#server">本番サーバーの構築</To>を進める</>,
  ],
  [
    "学部3年",
    <><To href="work.html#changelog">CI/CD</To>、<To href="work.html#tasks">タスク管理の仕組み</To>、<To href="work.html#docs">ドキュメント</To>を整える。春休みに<To href="work.html#mobile">スマホで部品を集める画面</To>を作り、<To href="work.html#responsive">システム全体をスマホに対応</To>させる</>,
  ],
  ["学部4年", <>TOEIC 800点。大阪大学大学院 情報科学研究科に合格。<To href="#rmemo">Rmemo</To> を Microsoft Store で公開</>],
  ["2027年4月", "大阪大学大学院 情報科学研究科に進学予定"],
];

const PERIOD_LABEL: Record<(typeof PERIODS)[number], string> = {
  学部2年: "学部2年",
  学部3年: "学部3年",
  学部4年: "学部4年",
};

/** Rmemo の紹介ページ。タイトル・動画・ボタンのどれを押しても、ここへ飛ぶ */
const RMEMO_SITE = "https://hirosugu415.github.io/Rmemo/";

const ZENN: [string, string][] = [
  ["https://zenn.dev/hiro_tech415/articles/bcda76ce48accf", "メモ帳を毎日使っていた僕が、保存のいらないメモアプリをRustで作ってMicrosoft Storeに出すまで"],
  ["https://zenn.dev/hiro_tech415/articles/9c8b10bb0e71ec", "Rust公式リファレンスは怖くない！「型サーフィン」でVec<String> に辿り着くまでの記録"],
  ["https://zenn.dev/hiro_tech415/articles/dcbfb4e92a083d", "Rustでlsコマンドを自作してみた：Rust特有の型に悩まされた話"],
  ["https://zenn.dev/hiro_tech415/articles/1dc0e7ce1a7cd0", "大学生がHHKBを購入！有線接続の罠とおすすめキーマップ設定"],
];

const NOTE: [string, string][] = [
  ["https://note.com/hirosugu/n/nc6c636e0bc71", "①化学科から情報科学研究科へ｜阪大情報科学研究科 外部合格記"],
  ["https://note.com/hirosugu/n/n698f760358f8", "②不安だったから、動くしかなかった｜阪大情報科学研究科 外部合格記"],
  ["https://note.com/hirosugu/n/n4a7cb4d45715", "【リーディング編】2週間でTOEIC710→800｜イメージで英語を「見る」TOEIC勉強法"],
  ["https://note.com/hirosugu/n/n6df19532cd12", "【リスニング編】ヤマカンで解いていた僕が、TOEICリスニング8割で安定するまで"],
];

const SKILLS: [string, string[]][] = [
  ["実務（アルバイト）", ["TypeScript", "React", "MUI", "PHP", "Laravel", "MySQL", "Docker", "nginx", "php-fpm", "GitHub Actions", "PWA", "Google Apps Script", "Slack API"]],
  ["個人開発", ["Rust", "Tauri 2", "CodeMirror 6", "Express", "Prisma", "Firebase", "Vercel", "GitHub Pages"]],
  ["研究・学習", ["Python", "AWS", "競技プログラミング（Rust）"]],
  ["語学", ["TOEIC 800"]],
];

/**
 * 横いっぱいのカード（wide）が、何列ぶんを使うかを決める。
 * 行の途中に来たら、その行の残りを全部使う。そうしないと、手前の行に隙間ができてしまうため。
 */
function spans(items: { wide?: boolean }[], cols: number) {
  let pos = 0;
  return items.map((w) => {
    const rest = cols - (pos % cols);
    const span = w.wide ? rest : 1;
    pos += span;
    return span;
  });
}

/** 枠で囲んだ大きなまとまり（社内システム、Rmemo） */
function ProjectBox({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <Box id={id} sx={{ bgcolor: "background.paper", border: 1, borderColor: "divider", borderRadius: 4, p: { xs: 2.75, md: 5.5 }, mb: 5, "&:last-child": { mb: 0 } }}>
      {children}
    </Box>
  );
}

function ProjectTitle({ children }: { children: ReactNode }) {
  return (
    <Typography variant="h3" sx={{ display: "flex", alignItems: "center", gap: 1.5, fontSize: { xs: "1.35rem", md: "1.7rem" }, fontWeight: 700, lineHeight: 1.4, mb: 2.25 }}>
      {children}
    </Typography>
  );
}

function SimpleCard({ title, children, links }: { title: string; children: ReactNode; links?: [string, string][] }) {
  return (
    <Card sx={{ p: { xs: 2.5, md: 3.25 } }}>
      <Typography variant="h4" sx={{ fontSize: "1.15rem", fontWeight: 700, lineHeight: 1.5, mb: 1.5 }}>
        {title}
      </Typography>
      <Prose>{children}</Prose>
      {links && (
        <Box sx={{ mt: 2 }}>
          <LinkChips links={links} />
        </Box>
      )}
    </Card>
  );
}

function ArticleList({ items }: { items: [string, string][] }) {
  return (
    <Box component="ul" sx={{ listStyle: "none", m: 0, p: 0 }}>
      {items.map(([href, title]) => (
        <Box component="li" key={href} sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Link
            href={href}
            underline="none"
            color="textPrimary"
            sx={{ display: "block", py: 1.5, px: 0.5, "&:hover": { color: "primary.main", bgcolor: "action.hover" } }}
          >
            {title}
          </Link>
        </Box>
      ))}
    </Box>
  );
}

export function Home() {
  return (
    <>
      {/* ============ About ============ */}
      <Section id="about" title="About">
        {/* PC では左に写真、右に紹介文と経歴。スマホでは写真を上に置く */}
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "200px minmax(0, 1fr)" }, columnGap: { sm: 5 }, rowGap: 3, alignItems: "start" }}>
        <Box>
        <Box
          component="img"
          src="assets/me/profile.jpg"
          alt="Hirosugu の写真"
          sx={{ display: "block", width: { xs: 180, sm: "100%" }, aspectRatio: "4 / 5", objectFit: "cover", borderRadius: 4, border: 1, borderColor: "divider" }}
        />
        {/* 写真の下に、よく使う技術を並べる */}
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 0.75, mt: { xs: 1.5, sm: 2 } }}>
          {ABOUT_TAGS.map((t) => (
            <Box key={t} sx={{ px: 1.1, py: 0.25, border: 1, borderColor: "divider", borderRadius: 1.5, fontSize: 12.5, color: "text.secondary" }}>
              {t}
            </Box>
          ))}
        </Stack>
        </Box>
        {/* 幅は Projects に合わせて広げたが、文章は1行が長くなりすぎないように絞る */}
        <Box sx={{ maxWidth: "44em" }}>
        <Prose>
          <p>大阪大学 基礎工学部 化学応用化学科の4年生です。2027年4月から、大阪大学大学院 情報科学研究科に進学します。</p>
          <p>大学では化学を専攻していますが、大学1年生のときからプログラマーのアルバイトをしていて、部品を扱う会社の社内システムを3人のチームで開発・運用しています。企画から設計、実装、インフラ、運用まで携わってきました。</p>
          <p>情報系の授業は一度も受けたことがないのですが、大学院は独学で情報科学研究科を受験して合格しました。</p>
          <p>アルバイト以外でも、普段使っていて不便だなと思ったものは自分で作って解決するようにしています。最近だと、自作のメモアプリをMicrosoft Storeに公開しました。</p>
        </Prose>

        {/* 経歴は紹介文のすぐ下に続ける（左の列は写真とタグ） */}
        <Box component="ol" sx={{ listStyle: "none", m: 0, mt: 4.5, p: 0, borderLeft: 2, borderColor: "divider" }}>
          {TIMELINE.map(([when, what]) => (
            <Box
              component="li"
              key={when}
              sx={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "7.5em minmax(0, 1fr)" },
                columnGap: 2,
                pl: 2.75,
                pb: 2.25,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: -7,
                  top: "0.62em",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  bgcolor: "background.default",
                  border: 2,
                  borderColor: "primary.main",
                },
              }}
            >
              <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: 600, pt: "0.15em" }}>
                {when}
              </Typography>
              <Typography>{what}</Typography>
            </Box>
          ))}
        </Box>
        </Box>
        </Box>
      </Section>

      {/* ============ Projects ============ */}
      <Section id="projects" title="Projects">
        {/* ---------- 社内システム ---------- */}
        <ProjectBox id="work">
          <Eyebrow>アルバイト ／ 学部2年の秋〜現在</Eyebrow>
          <ProjectTitle>部品を扱う会社の社内システム</ProjectTitle>
          <Meta
            rows={[
              ["チーム", "開発者3人"],
              ["役割", "提案、設計、フロントエンド、バックエンド、インフラ、運用"],
              ["技術", "React / TypeScript / MUI / Laravel / MySQL / Docker / nginx / php-fpm / GitHub Actions"],
            ]}
          />
          <Box sx={{ maxWidth: 760 }}>
            <Typography>
              住所録、部品の検索、発注管理、部品収集などができる社内システムで、社内では「LARASERVER」と呼んでいます。学部2年の秋に新しいサーバーを作ろうと提案して、開発が始まりました。ここでは、3人のチームの中で僕が携わったことを、やってきた順に並べています。
            </Typography>
            <DummyNote />
          </Box>

          {PERIODS.map((period) => (
            <Box key={period}>
              <Period>{PERIOD_LABEL[period]}</Period>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
                {WORK.filter((w) => w.period === period).map((w, i, items) => (
                  <Card
                    key={w.id}
                    sx={{ bgcolor: "background.default", gridColumn: { sm: `span ${spans(items, 2)[i]}`, md: `span ${spans(items, 3)[i]}` } }}
                  >
                    <CardActionArea href={`work.html#${w.id}`} sx={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                      {w.shots?.[0] && (
                        <Box sx={{ p: 1.25, pb: 0 }}>
                          <Shot shot={w.shots[0]} placeholder={false} thumb />
                        </Box>
                      )}
                      <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                        <Typography variant="h4" sx={{ fontSize: "1rem", fontWeight: 700, lineHeight: 1.5, mb: 0.75 }}>
                          {w.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1.25 }}>
                          {w.summary}
                        </Typography>
                        <Typography color="primary" sx={{ mt: "auto", fontSize: 14, fontWeight: 600 }}>
                          詳しくはこちら →
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}

          <Box sx={{ textAlign: "center", mt: 3.5 }}>
            <Button href="work.html" variant="contained" disableElevation size="large">
              社内システムでやってきたことを全部見る →
            </Button>
          </Box>
        </ProjectBox>

        {/* ---------- Rmemo ---------- */}
        <ProjectBox id="rmemo">
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.15fr) minmax(0, 1fr)" }, gap: { xs: 3, md: 5 }, alignItems: "start" }}>
            <Box>
              <Eyebrow>個人開発 ／ 2026年10月 公開</Eyebrow>
              <ProjectTitle>
                <Link href={RMEMO_SITE} underline="hover" color="inherit" sx={{ display: "inline-flex", alignItems: "center", gap: 1.5 }}>
                  <Box component="img" src="assets/rmemo/icon.png" alt="" sx={{ width: 36, height: 36 }} />
                  Rmemo
                </Link>
              </ProjectTitle>
              <Meta
                rows={[
                  ["形態", "Windowsアプリ（Microsoft Store で公開）"],
                  ["技術", "Rust / Tauri 2 / React / TypeScript / CodeMirror 6"],
                ]}
              />
              <Prose>
                <p>
                  Windowsのメモ帳への不満を全部解決するために作った、保存のいらないメモアプリです。どの画面にいても<Kbd>Ctrl</Kbd> + <Kbd>N</Kbd>で入力窓が一瞬で出てきて、書いたら勝手に保存されます。常駐アプリが重いと本末転倒なので、Rustで作りました。
                </p>
                <p>作って終わりではなく、Microsoft Storeに出すところまでやりました。署名の費用をかけないためにMSIXを選び、TauriがMSIXを出力しないのでパッケージを作るスクリプトを自作して、MSIXだと効かなくなる自動起動も作り直しています。</p>
              </Prose>
              <Button href={RMEMO_SITE} variant="contained" disableElevation sx={{ mt: 2.5 }}>
                紹介ページを見る →
              </Button>
              <Box sx={{ mt: 2 }}>
                <LinkChips
                  links={[
                    ["https://apps.microsoft.com/detail/9n2mdp1460w3?hl=ja-JP&gl=JP", "Microsoft Store"],
                    ["https://github.com/hirosugu415/Rmemo", "GitHub"],
                    ["https://zenn.dev/hiro_tech415/articles/bcda76ce48accf", "詳しくは Zenn の記事で →"],
                  ]}
                />
              </Box>
            </Box>
            <Box component="figure" sx={{ m: 0 }}>
              {/* 動画を押しても紹介ページへ飛ぶ */}
              <Box
                component="a"
                href={RMEMO_SITE}
                aria-label="Rmemo の紹介ページを見る"
                sx={{ position: "relative", display: "block", "&:hover .open-hint, &:focus-visible .open-hint": { opacity: 1 } }}
              >
                <Box
                  component="video"
                  src="assets/rmemo/demo.mp4"
                  poster="assets/rmemo/demo-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  sx={{ display: "block", width: "100%", border: 1, borderColor: "divider", borderRadius: 3 }}
                />
                <Box
                  className="open-hint"
                  sx={{
                    position: "absolute",
                    right: 12,
                    bottom: 12,
                    px: 1.25,
                    py: 0.4,
                    borderRadius: 1,
                    fontSize: 13,
                    color: "#fff",
                    bgcolor: "rgba(0,0,0,.65)",
                    opacity: { xs: 1, md: 0.8 },
                    transition: "opacity .2s",
                    pointerEvents: "none",
                  }}
                >
                  紹介ページを見る →
                </Box>
              </Box>
              <Typography component="figcaption" variant="body2" color="textSecondary" sx={{ mt: 1, fontSize: 13, textAlign: "center" }}>
                Wikipedia を読みながら <Kbd>Ctrl</Kbd> + <Kbd>N</Kbd> でメモ
              </Typography>
            </Box>
          </Box>
        </ProjectBox>

      </Section>

      {/* ============ Learning ============ */}
      <Section id="learning" title="学び・実績">
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))", gap: 3 }}>
          <SimpleCard
            title="化学科から、情報科学研究科へ"
            links={[
              ["https://note.com/hirosugu/n/nc6c636e0bc71", "合格記 ①"],
              ["https://note.com/hirosugu/n/n698f760358f8", "合格記 ②"],
            ]}
          >
            <p>化学の必修しか取っていないので、オートマトンや計算機アーキテクチャは全て初めて見る内容でした。外部からの受験で、倍率は3倍弱です。研究室を3つ訪問して情報を集めるところから始め、過去問15年分で58%から9割まで上げて、本番は308人中35位（全受験者の上位約11%）で合格しました。</p>
          </SimpleCard>
          <SimpleCard
            title="TOEIC 800点"
            links={[
              ["https://note.com/hirosugu/n/n4a7cb4d45715", "リーディング編"],
              ["https://note.com/hirosugu/n/n6df19532cd12", "リスニング編"],
            ]}
          >
            <p>院試で必要だったので勉強して、800点を取りました。院試に集中するため、800点で打ち切っています。勉強法はnoteにまとめています。</p>
          </SimpleCard>
          <SimpleCard title="化学とアルバイトの両立">
            <p>レポートの多い実験や、学年の4割が単位を落とすような試験を、週2回のアルバイトでプログラミングを続けながら乗り越えてきました。研究では、Pythonで機械学習力場を使ったシミュレーションをしています。</p>
          </SimpleCard>
          <SimpleCard title="今やっていること">
            <ul>
              <li>Rustで競技プログラミング</li>
              <li>ソフトウェア工学の論文を読む</li>
              <li>Zennやnoteで、学んだことを記事にまとめる</li>
            </ul>
          </SimpleCard>
        </Box>
      </Section>

      {/* ============ Writing ============ */}
      <Section id="writing" title="Writing" narrow>
        <Typography color="textSecondary" sx={{ fontWeight: 700, mb: 1 }}>
          Zenn
        </Typography>
        <ArticleList items={ZENN} />
        <Typography color="textSecondary" sx={{ fontWeight: 700, mt: 3.5, mb: 1 }}>
          note
        </Typography>
        <ArticleList items={NOTE} />
      </Section>

      {/* ============ Skills ============ */}
      <Section id="skills" title="Skills" narrow>
        <Stack spacing={2.75}>
          {SKILLS.map(([group, items]) => (
            <Box key={group}>
              <Typography color="textSecondary" sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
                {group}
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
                {items.map((s) => (
                  <Box key={s} sx={{ px: 1.5, py: 0.5, border: 1, borderColor: "divider", borderRadius: 2, bgcolor: "background.paper", fontSize: 14 }}>
                    {s}
                  </Box>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Section>
    </>
  );
}
