export function onInput(inputEl, handler) {
  const el =
    typeof inputEl === "string" ? document.querySelector(inputEl) : inputEl;
  el &&
    el.addEventListener("input", (e) => {
      handler(e.target.value);
    });
}
