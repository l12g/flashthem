(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.flashthem = {}));
}(this, (function (exports) { 'use strict';

  class Renderer {
      constructor(stage) {
          this._extraContext = [];
          this._stage = stage;
          this.canvas.addEventListener("click", (e) => {
              this._mouseEvent = e;
          });
          this.canvas.addEventListener("mousemove", (e) => {
              this._mouseEvent = e;
          });
      }
      get context() {
          return this.canvas.getContext("2d");
      }
      get canvas() {
          return this._stage.canvas;
      }
      addContext(ctx) {
          this._extraContext.push(ctx);
      }
      draw() {
          this.clear();
          this.context.save();
          this._stage.render(this, this._mouseEvent);
          this._mouseEvent = null;
          for (const ctx of this._extraContext) {
              ctx.drawImage(this.canvas, 0, 0);
          }
          this.context.restore();
      }
      clear() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          for (const ctx of this._extraContext) {
              ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          }
      }
  }

  class EventDispatcher {
      constructor() {
          this._map = new Map();
      }
      on(type, handler) {
          const map = this._map;
          if (!map.has(type)) {
              map.set(type, new Set());
          }
          map.get(type).add(handler);
      }
      off(type, handler) {
          var _a;
          const map = this._map;
          (_a = map.get(type)) === null || _a === void 0 ? void 0 : _a.delete(handler);
      }
      offAll(type) {
          var _a;
          const map = this._map;
          type ? (_a = map.get(type)) === null || _a === void 0 ? void 0 : _a.clear() : map.clear();
      }
      emit(type, data) {
          const map = this._map;
          if (!map.has(type)) {
              return;
          }
          for (const handler of map.get(type).values()) {
              handler({
                  target: this,
                  data,
              });
          }
      }
      dispose() {
          this.offAll();
          this._map.clear();
      }
  }

  class Engine extends EventDispatcher {
      constructor(target) {
          super();
          this._time = 0;
          this._startAt = Date.now();
          this._raf = 0;
          this._target = target;
          this._step = () => {
              this._raf = requestAnimationFrame(this._step);
              const current = Date.now();
              const frameDt = 1000 / this._target.fps;
              const elapsed = Math.min(frameDt, current - this._startAt);
              this._startAt = Date.now();
              this._time += elapsed;
              while (this._time >= frameDt) {
                  this._target.onEngine(elapsed);
                  this._time -= frameDt;
              }
          };
          this.start();
      }
      start() {
          this.stop();
          this._step();
      }
      stop() {
          cancelAnimationFrame(this._raf);
      }
  }

  class Graphics {
      constructor(target) {
          this._needStroke = false;
          this._needFill = false;
          this._rules = [];
          this._lines = [];
          this._target = target;
          target.on("enter-frame", (e) => {
              e.data.context.save();
          });
          target.on("exit-frame", (e) => {
              e.data.context.restore();
          });
      }
      draw(render, evt) {
          const ctx = render.context;
          const target = this._target;
          ctx.translate(target.x, target.y);
          ctx.rotate(target.rotation);
          ctx.scale(target.scaleX, target.scaleY);
          if (target.blendMode)
              ctx.globalCompositeOperation = target.blendMode;
          ctx.globalAlpha = target.parent
              ? target.parent.alpha * target.alpha
              : target.alpha;
          if (this._lines.length) {
              this._lines.forEach((v) => {
                  ctx.moveTo(v[0], v[1]);
                  ctx.lineTo(v[2], v[3]);
              });
              ctx.stroke();
          }
          for (const rule of this._rules) {
              const result = rule.call(this, ctx);
              result && this.afterDraw(ctx);
          }
          this._needStroke = false;
          this._needFill = false;
      }
      afterDraw(ctx) {
          this._needFill && ctx.fill();
          this._needStroke && ctx.stroke();
      }
      clear() {
          this._rules = [];
          this._lines = [];
          this._needStroke = false;
          this._needFill = false;
      }
      lineStyle(width, color, join, cap) {
          this._rules.push((ctx) => {
              this._needStroke = true;
              ctx.lineWidth = width;
              ctx.lineJoin = join;
              ctx.lineCap = cap;
              ctx.strokeStyle = color;
          });
      }
      beginFill(color) {
          this._rules.push((ctx) => {
              this._needFill = true;
              ctx.fillStyle = color;
          });
      }
      drawRect(x, y, w, h) {
          this._rules.push((ctx) => {
              ctx.beginPath();
              ctx.rect(x, y, w, h);
              ctx.closePath();
              return true;
          });
      }
      drawImg(img, dx, dy, dw, dh, sx, sy, sw, sh) {
          const ags = arguments;
          this._rules = [
              function drawImg(ctx) {
                  ctx.drawImage.apply(ctx, ags);
              },
          ];
      }
      drawCircle(cx, cy, radius) {
          this._rules.push(function drawCircle(ctx) {
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, Math.PI * 2);
              ctx.closePath();
              return true;
          });
      }
      drawText(x, y, text, font) {
          this._rules = [
              (ctx) => {
                  ctx.font = font;
                  ctx.fillText(text, x, y);
                  return true;
              },
          ];
      }
      drawLine(x0, y0, x1, y1) {
          this._lines.push([x0, y0, x1, y1]);
      }
      lineTo(x, y) {
          this._rules.push((ctx) => {
              ctx.lineTo(x, y);
          });
      }
      stroke() {
          this._rules.push((ctx) => {
              ctx.stroke();
          });
      }
  }

  class DisplayObject extends EventDispatcher {
      constructor() {
          super(...arguments);
          this.mouseEnable = false;
          this.x = 0;
          this.y = 0;
          this.width = 0;
          this.height = 0;
          this.pivotX = 0.5;
          this.pivotY = 0.5;
          this.scaleX = 1;
          this.scaleY = 1;
          this.rotation = 0;
          this.alpha = 1;
      }
      get parent() {
          return this._parent;
      }
      set parent(v) {
          this._parent = v;
      }
      get graphics() {
          return this._graphics || (this._graphics = new Graphics(this));
      }
      get globalX() {
          let x = this.x;
          let p = this.parent;
          while (p) {
              x += p.x;
              p = p.parent;
          }
          return x;
      }
      get globalY() {
          let y = this.y;
          let p = this.parent;
          while (p) {
              y += p.y;
              p = p.parent;
          }
          return y;
      }
      render(render, evt) {
          this.emit("enter-frame", render);
          this.graphics.draw(render, evt);
          this.onRender(render, evt);
          this.emit("exit-frame", render);
      }
      onRender(render, evt) { }
      remove() {
          if (this.parent) {
              this.parent.removeChild(this);
          }
      }
  }

  class DisplayObjectContainer extends DisplayObject {
      constructor() {
          super(...arguments);
          this.children = [];
      }
      onRender(render, evt) {
          for (let i = 0, len = this.children.length; i < len; i++) {
              const child = this.children[i];
              child.render(render, evt);
          }
      }
      addChild(child) {
          this.addChildAt(child, this.children.length);
      }
      addChildAt(child, idx = 0) {
          child.remove();
          this.children.splice(idx, 0, child);
          child.parent = this;
          child.emit("added");
          this.calcSize();
      }
      removeChild(child) {
          this.removeChildAt(this.children.indexOf(child));
      }
      removeChildAt(idx) {
          if (idx < 0 || idx > this.children.length - 1) {
              return;
          }
          const child = this.children[idx];
          child.parent = null;
          this.children.splice(idx, 1);
          child.emit("removed");
          this.calcSize();
      }
      swapChild(child1, child2) {
          const idx1 = this.children.indexOf(child1);
          const idx2 = this.children.indexOf(child2);
          if (idx1 >= 0 && idx2 >= 0) {
              this.children[idx2] = child1;
              this.children[idx1] = child2;
          }
          this.calcSize();
      }
      calcSize() {
          let w = 0;
          for (let i = 0; i < this.children.length; i++) {
              w = Math.max(w, this.children[i].width);
          }
          this.width = w;
      }
  }

  class Stage extends DisplayObjectContainer {
      constructor(canvas, w, h) {
          super();
          this.fps = 60;
          this.canvas = canvas;
          this._renderer = new Renderer(this);
          this._engine = new Engine(this);
          this.width = this.canvas.width;
          this.height = this.canvas.height;
      }
      addCanvas(canvas) {
          this._renderer.addContext(canvas.getContext("2d"));
      }
      onEngine(elapsed) {
          this._renderer.draw();
      }
      calcSize() {
          // stage.width=canvas.width
      }
  }

  class Sprite extends DisplayObjectContainer {
  }

  class Bitmap extends DisplayObject {
      constructor(src) {
          super();
          this.autoSize = true;
          this._imgEl = new Image();
          this.src = src;
      }
      get src() {
          return this._src;
      }
      set src(value) {
          this._src = value;
          this._loaded = false;
          this.load();
      }
      load() {
          this._imgEl.src = this.src;
          this._imgEl.onload = () => {
              this._rawWidth = this._imgEl.naturalWidth;
              this._rawHeight = this._imgEl.naturalHeight;
              if (this.autoSize) {
                  this.width = this._rawWidth;
                  this.height = this._rawHeight;
              }
              this._loaded = true;
              this.draw();
              this.emit("load");
              console.log("load");
          };
      }
      draw() {
          this.graphics.drawImg(this._imgEl, 0, 0, this._rawWidth, this._rawHeight, -this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
      }
  }

  class TextField extends DisplayObject {
      constructor(text, font) {
          super();
          this.text = text;
          this.font = font;
      }
      get font() {
          return this._font;
      }
      set font(value) {
          this._font = value;
          this.graphics.drawText(0, 0, this.text, this.font);
      }
      get text() {
          return this._text;
      }
      set text(value) {
          this._text = value;
          this.graphics.drawText(0, 0, this.text, this.font);
      }
  }

  function removeFromArr(arr, val) {
      const find = arr.findIndex((o) => o === val);
      find >= 0 && arr.splice(find, 1);
  }

  /**
   * 动画
   *
   * new MovieClip(src,clips)
   *
   *
   * new MovieClip(“hero.png”，[
   *  {x:0,y:0,w:50,h:50},
   *  {x:50,y:0,w:50,h:50},
   *  {x:100,y:0,w:50,h:50},
   * ])
   */
  class MovieClip extends Bitmap {
      constructor(src, clips) {
          super(src);
          this.fps = 12;
          this.loop = true;
          this._currentFrame = 0;
          this._clips = [];
          this.src = src;
          this._engine = new Engine(this);
          this._clips = clips;
      }
      play() {
          this._engine.start();
      }
      pause() {
          this._engine.stop();
      }
      stop() {
          this._currentFrame = 0;
          this.pause();
      }
      onEngine(elapsed) {
          if (!this._loaded) {
              return;
          }
          this._currentFrame++;
          if (this._currentFrame > this._clips.length - 1) {
              if (this.loop) {
                  this._currentFrame = 0;
              }
              else {
                  this._currentFrame = this._clips.length - 1;
                  this.pause();
                  this.emit("complete");
              }
          }
          this.draw();
      }
      draw() {
          const clip = this._clips[this._currentFrame];
          if (!clip)
              return;
          if (this.autoSize) {
              this.width = clip.w;
              this.height = clip.h;
          }
          this.graphics.drawImg(this._imgEl, clip.x, clip.y, clip.w, clip.h, -this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
      }
      addClip(clip) {
          this._clips.push(clip);
      }
      addClipAt(clip, idx) {
          this._clips.splice(idx, 0, clip);
      }
      removeClip(idx) {
          removeFromArr(this._clips, this._clips[idx]);
      }
      setClips(clips) {
          this._clips = clips;
          this.draw();
      }
  }

  class Rect extends Sprite {
      constructor(w, h, fill) {
          super();
          this.width = w;
          this.height = h;
          this.graphics.beginFill(fill);
          this.graphics.drawRect(-this.width * this.pivotX, -this.height * this.pivotY, w, h);
      }
  }

  const ADD_TO_STAGE = "add-to-stage";
  const REMOVE_FROM_STAGE = "remove-from-stage";
  const ENTER_FRAME = "enter-frame";
  const LOAD = "load";

  var Event = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ADD_TO_STAGE: ADD_TO_STAGE,
    REMOVE_FROM_STAGE: REMOVE_FROM_STAGE,
    ENTER_FRAME: ENTER_FRAME,
    LOAD: LOAD
  });

  exports.Bitmap = Bitmap;
  exports.Event = Event;
  exports.MovieClip = MovieClip;
  exports.Rect = Rect;
  exports.Sprite = Sprite;
  exports.Stage = Stage;
  exports.TextField = TextField;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
