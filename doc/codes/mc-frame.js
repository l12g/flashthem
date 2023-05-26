const { Stage, Sprite } = flashthem;

const stage = new Stage(canvas);
stage.debug(true);
for (let i = 0; i < 100; i++) {
  const sp = new Sprite();
  sp.graphics.beginFill("#333");
  sp.graphics.drawCircle(0, 0, Math.floor(Math.random() * 5 + 5));
  stage.addChild(sp);
  sp.x = Math.random() * width;
  sp.y = Math.random() * height;
  sp.vx = Math.random() * 4 - 2;
  sp.vy = Math.random() * 4 - 2;
  sp.on("enter-frame", () => {
    sp.x += sp.vx;
    sp.y += sp.vy;
    if (sp.x > width || sp.x < 0) {
      sp.vx *= -1;
    }
    if (sp.y > height || sp.y < 0) {
      sp.vy *= -1;
    }
  });
}
