import hlt from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
const regxp = /\/\/hides[\w\W]+?\/\/hidee/g;
function syncCode(el, path) {
  const dom = document.querySelector(el);
  const str = () => import(path);
  return str().then((code) => {
    const { default: str } = code;

    dom.innerHTML = `<pre><code>${str.replace(regxp, "")}</code></pre>`;
  });
}
Promise.all([
  syncCode("#code-sprite", "./demos/sprite?raw"),
  syncCode("#code-bitmap", "./demos/bitmap?raw"),
  syncCode("#code-mc", "./demos/mc?raw"),
  syncCode("#code-basic", "./demos/basic?raw"),
]).then(() => {
  hlt.highlightAll();
});
