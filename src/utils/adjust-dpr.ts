export function adjustDpr(canvas, dpr) {
  const oldWidth = canvas.width;
  const oldHeight = canvas.height;
  canvas.width = oldWidth * dpr;
  canvas.height = oldHeight * dpr;
  canvas.style.width = oldWidth + "px";
  canvas.style.height = oldHeight + "px";
}
