/**
 * URL の #test などの位置へ移動する。
 * React が描画する前にブラウザが移動しようとして失敗するので、要素ができるのを待ってから移動する。
 * さらに、写真が読み込まれると高さが変わって位置がずれるので、全部読み込んだらもう一度移動する
 * （その前に自分でスクロールし始めていたら、邪魔しないように移動しない）。
 */
export function jumpToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;

  let touched = false;
  for (const type of ["wheel", "touchstart", "keydown"]) addEventListener(type, () => (touched = true), { once: true, passive: true });

  const jump = () => document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  const wait = () => {
    if (!document.getElementById(id)) return void requestAnimationFrame(wait);
    jump();
    // loading="lazy" の写真は、遠くにあるといつまでも読み込まれないので、2.5秒で待つのをやめる
    const loads = [...document.images]
      .filter((img) => !img.complete)
      .map((img) => new Promise((done) => (img.addEventListener("load", done), img.addEventListener("error", done))));
    const timeout = new Promise((done) => setTimeout(done, 2500));
    Promise.race([Promise.all(loads), timeout]).then(() => touched || jump());
  };
  wait();
}
