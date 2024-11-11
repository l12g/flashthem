const { Sprite, Stage, TextField } = flashthem;
const stage = new Stage(canvas);

const box = new Sprite();
box.x = 20;
box.y = 20;
stage.addChild(box);
let text = new TextField("text from flashthem");
// text.color = "#00";
box.addChild(text);

text = new TextField("text with color");
text.color = "#ff0000";
text.y = 30;
box.addChild(text);

text = new TextField("text with size");
text.color = "#ff00ff";
text.size = "30px";
text.y = 60;
box.addChild(text);

text = new TextField("text with font，自定义font属性");
text.font = "bold italic 18px PingFang SC,Microsoft Yahei";
text.y = 100;
box.addChild(text);
