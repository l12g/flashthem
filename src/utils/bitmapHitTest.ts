import DisplayObject from "../display/DisplayObject";

let canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.style.cssText = "border:solid 1px red";
const ctx = canvas.getContext("2d");

setTimeout(() => {
  document.querySelector("#bmptest").appendChild(canvas);
}, 300);
export function bitmapHitTest(a: DisplayObject, b: DisplayObject) {
  if (!a.stage || !b.stage) {
    return;
  }
  const { x, y, w, h } = a.aabb;
  if (w === 0 || h === 0) {
    return;
  }
  canvas.width = w;
  canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  const t: any = {};
  const mtx = a.matrix;
  ctx.save();
  ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, 0, 0);
  for (const cmd of a.graphics.commands) {
    const result = cmd.call(t, ctx);
    if (result) {
      if (t._needFill) {
        ctx.fill();
      }
      if (t._needStroke) {
        ctx.stroke();
      }
    }
  }
  ctx.restore();
  ctx.save();
  const mtx2 = b.matrix;
  ctx.transform(mtx2.a, mtx2.b, mtx2.c, mtx2.d, mtx2.tx, mtx2.ty);
  // ctx.globalCompositeOperation = "source-in";
  for (const cmd of b.graphics.commands) {
    const result = cmd.call(t, ctx);
    if (result) {
      if (t._needFill) {
        ctx.fill();
      }
      if (t._needStroke) {
        ctx.stroke();
      }
    }
  }
  ctx.restore();
}
