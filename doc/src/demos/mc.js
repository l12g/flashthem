const { MovieClip, Stage, Sprite } = flashthem;

function getClips(n, w, h, y = 0) {
  return Array.from({ length: n }, function (_, idx) {
    return {
      x: idx * w,
      y,
      w,
      h,
    };
  });
}

const stage = new Stage(canvas);
const mc = new MovieClip("./assets/run.png", getClips(8, 46, 46));
stage.addChild(mc);
mc.x = mc.y = 100;
mc.scaleX = mc.scaleY = 2;

for (let i = 0; i < 10; i++) {
  const mc3 = new MovieClip("./assets/exp.png", getClips(12, 96, 96));
  stage.addChild(mc3);
  mc3.x = Math.random() * width;
  mc3.y = Math.random() * height;
  mc3.scaleX = mc3.scaleY = Math.random() * 0.5 + 0.3;
  mc3.fps = Math.floor(Math.random() * 12 + 12);
}
