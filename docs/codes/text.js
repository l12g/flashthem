const { Sprite, Stage, TextField } = flashthem;
const stage = new Stage(canvas);
stage.debug(true);
const box = new Sprite();
box.x = 200;
box.y = 40;
stage.addChild(box);
let text = new TextField("text from flashthem");
// text.color = "#00";
box.addChild(text);

text = new TextField("text with color");
text.color = "red";
text.y = 30;
box.addChild(text);

text = new TextField("自定义font属性");
text.font = "bold italic 18px PingFang SC,Microsoft Yahei";
text.y = 100;
box.addChild(text);

text = new TextField("text with size");
text.color = "#ff00ff";
text.size = "30px";
text.y = 60;
box.addChild(text);
text.rotation = 30;
text.pivotX = text.pivotY = 0.5;

let size = 0;
stage.on("enter-frame", () => {
  size++;
  if (size > 360) size = 0;
  // text.size = 18 + Math.sin((size * Math.PI) / 180) * 12 + "px";
  text.rotation++;
});
