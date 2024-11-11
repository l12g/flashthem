const { Sprite, Stage, TextField } = flashthem;

function fill(n) {
  return n.toString().length === 1 ? "0" + n : n;
}
function color() {
  return Math.floor(Math.random() * 255).toString(16);
}
function randomcolor() {
  return ["#", color(), color(), color()].join("");
}

const stage = new Stage(canvas);
const rect = new Sprite();
rect.graphics.beginFill("blue");
rect.graphics.drawRect(0, 0, 100, 100);
stage.addChild(rect);
rect.x = 10;
rect.y = 10;
rect.mouseEnable = true;
rect.on("click", (e) => {
  alert("box clicked!");
});
const text = new TextField("click me");
text.color = "#ffffff";
text.size = "18px";
rect.addChild(text);

for (let i = 0; i < 20; i++) {
  const sp = new Sprite();
  sp.graphics.beginFill(randomcolor());
  const w = Math.random() * 20 + 20;
  const h = Math.random() * 20 + 20;
  sp.graphics.drawRect(-w / 2, -h / 2, w, h);
  stage.addChild(sp);
  sp.x = Math.random() * width;
  sp.y = Math.random() * height;
  sp.mouseEnable = true;
  sp.on("mouseover", (e) => {
    e.target.alpha = 0.5;
    e.target.scaleX = e.target.scaleY = 1.5;
  });
  sp.on("mouseout", (e) => {
    e.target.alpha = 1;
    e.target.scaleX = e.target.scaleY = 1;
  });
}
