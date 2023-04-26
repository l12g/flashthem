import "highlight.js/styles/atom-one-dark.css";
import hlt from "highlight.js";

function syncCode(el, path) {
  const dom = document.querySelector(el);
  const str = () => import(path);
  return str().then((code) => {
    dom.innerHTML = `<pre><code>${code.default}</code></pre>`;
  });
}
Promise.all([
  syncCode("#code-sprite", "./demos/sprite?raw"),
  syncCode("#code-stage", "./demos/stage?raw"),
]).then(() => {
  hlt.highlightAll();
});
