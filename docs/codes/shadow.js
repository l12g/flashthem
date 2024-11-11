//hides
function onInput(inputEl, handler) {
  const el =
    typeof inputEl === "string" ? document.querySelector(inputEl) : inputEl;
  el &&
    el.addEventListener("input", (e) => {
      handler(e.target.value);
    });
  handler(el.value);
}
//hidee

const { Bitmap, Stage } = flashthem;

const stage = new Stage(canvas);

const bmp = new Bitmap("./assets/dragon.png");
stage.addChild(bmp);
bmp.x = width / 2;
bmp.y = height / 2;
bmp.pivotX = bmp.pivotY = 0.5;
bmp.shadow = {};

onInput("#shadow-color", (value) => {
  console.log(value);
  bmp.shadow.color = value;
});
onInput("#shadow-blur", (value) => {
  bmp.shadow.blur = value;
});
onInput("#shadow-x", (value) => {
  bmp.shadow.offsetX = value;
});
onInput("#shadow-y", (value) => {
  bmp.shadow.offsetY = value;
});

// bmp.filters=[new BlurFilter(10)];