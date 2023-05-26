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

const { Sprite, Stage, MovieClip } = flashthem;

const stage = new Stage(canvas);
const mc = new MovieClip("./assets/run.png", getClips(8, 46, 46));
stage.addChild(mc);
mc.x = mc.y = 0;
mc.scaleX = mc.scaleY = 2;

stage.addCanvas(document.querySelector("#ca"));
stage.addCanvas(document.querySelector("#cb"));
