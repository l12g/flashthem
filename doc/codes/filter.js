const {
  Sprite,
  Stage,
  BlurFilter,
  GrayFilter,
  ContrastFilter,
  BrightnessFilter,
  Bitmap,
  TextField,
} = flashthem;
const stage = new Stage(canvas);

const fs = [
  ["模糊", new BlurFilter(10)],
  ["灰度", new GrayFilter(10)],
  ["对比度", new ContrastFilter(10)],
  ["亮度", new BrightnessFilter(10)],
];

fs.forEach((f, idx) => {
  const t = new TextField(f[0]);
  stage.addChild(t);
  const bmp = new Bitmap("./assets/hero.png");
  stage.addChild(bmp);
  bmp.x = 100 * idx + 100;
  t.x = bmp.x - 15;
  bmp.y = height / 2;
  t.y = height / 2 - 50;
  bmp.pivotX = bmp.pivotY = 0.5;
  bmp.filters = [f[1]];
});

function onInput(inputEl, handler) {
  const el =
    typeof inputEl === "string" ? document.querySelector(inputEl) : inputEl;
  el &&
    el.addEventListener("input", (e) => {
      handler(e.target.value);
    });
  handler(el.value);
}

onInput("#filter-range", (value) => {
  console.log(value);
  fs.forEach((f) => {
    f[1].percentage = value;
    f[1].blur = value;
  });
});
