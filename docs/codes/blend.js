//hides
const select = document.createElement("select");
//hidee

const { Stage, Bitmap } = flashthem;
const stage = new Stage(canvas);
for (let i = 0; i < 10; i++) {
  const dragon = new Bitmap("./assets/dragon.png");
  stage.addChild(dragon);
  dragon.pivotX = dragon.pivotY = 0.5;
  dragon.x = Math.random() * width;
  dragon.y = Math.random() * height;
  dragon.rotation = Math.random() * 360;
  dragon.on("enter-frame", (e) => {
    e.target.rotation++;
  });
}

const b2 = new Bitmap("./assets/hero.png");
stage.addChild(b2);
b2.pivotX = b2.pivotY = 0.5;
b2.shadow = {
  color: "#00000066",
  blur: 10,
  offsetX: 10,
  offsetY: 10,
};

select.addEventListener("change", (e) => {
  b2.blendMode = e.target.value;
});

stage.on("enter-frame", (e) => {
  b2.x = stage.mouseX;
  b2.y = stage.mouseY;
});

//hides
const list = document.querySelector(".blend-mode-list");
const arr = [
  "source-over",
  "source-in",
  "source-out",
  "source-atop",
  "destination-over",
  "destination-in",
  "destination-out",
  "destination-atop",
  "lighter",
  "copy",
  "xor",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
];
select.innerHTML = arr
  .map((o) => {
    return "<option value='" + o + "'>" + o + "</option>";
  })
  .join("");
list.innerHTML = "";
list.appendChild(select);
select.addEventListener("change", (e) => {
  b2.blendMode = e.target.value;
});
//hidee
