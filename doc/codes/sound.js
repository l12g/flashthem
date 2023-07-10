const { Sound, Stage, Sprite } = flashthem;
const sd = new Sound("./assets/music.mp3");
sd.on("load", () => {
  console.log("loaded");
  onClick(".sound-pause", () => {
    sd.pause();
  });
  onClick(".sound-stop", () => {
    sd.stop();
  });
  onClick(".sound-play", () => {
    sd.play();
  });
  onClick(".sound-mute", () => {
    sd.mute = !sd.mute;
  });
  document.querySelector(".sound-loading").innerHTML = "";
});

function onClick(el, fn) {
  const dom = document.querySelector(el);
  dom.removeAttribute("disabled");
  dom.onclick = fn;
}
document.querySelector(".sound-volum").oninput = (e) => {
  sd.volum = +e.target.value;
};

const stage = new Stage(canvas);

const box = new Sprite();
box.graphics.beginFill("#ccc");
box.graphics.drawRect(0, 0, 400, 5);
stage.addChild(box);
box.x = width / 2 - 200;
box.y = 100;

const bar = new Sprite();
bar.graphics.beginFill("#333");
bar.graphics.drawCircle(0, 0, 10);
bar.x = box.x;
bar.y = box.y + 2;
stage.addChild(bar);

stage.on("enter-frame", (e) => {
console.log(sd.currentTime);
  const p = sd.currentTime / sd.duration;
  bar.x = box.x + p * 400;
});
