(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.flashthem = {}));
}(this, (function (exports) { 'use strict';

  class Renderer {
      constructor(stage) {
          this._stage = stage;
          this._offCanvas = new OffscreenCanvas(this.canvas.width, this.canvas.height);
          this.context.lineWidth = 0;
          this.context.strokeStyle = null;
          this.canvas.addEventListener("click", (e) => {
              this._mouseEvent = e;
          });
      }
      get offContext() {
          return this._offCanvas.getContext("2d");
      }
      get context() {
          return this._offCanvas.getContext("2d");
      }
      get displayContext() {
          return this.canvas.getContext("2d");
      }
      get canvas() {
          return this._stage.canvas;
      }
      draw() {
          this.clear();
          for (let i = 0, len = this._stage.children.length; i < len; i++) {
              const child = this._stage.children[i];
              child.draw(this, this._mouseEvent);
          }
          this._mouseEvent = null;
          this.displayContext.drawImage(this._offCanvas, 0, 0);
      }
      clear() {
          this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.displayContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
  }

  class Graphics {
      constructor(target) {
          this._needStroke = false;
          this._rules = [];
          this._target = target;
      }
      draw(ctx, evt) {
          ctx.save();
          ctx.translate(this._target.x, this._target.y);
          ctx.rotate(this._target.rotation);
          ctx.scale(this._target.scaleX, this._target.scaleY);
          for (const rule of this._rules) {
              rule(ctx);
          }
          if (evt && ctx.isPointInPath(evt.clientX, evt.clientY)) {
              this._target.emit("click", evt);
          }
          ctx.restore();
      }
      clear() {
          this._rules = [];
          this._needStroke = false;
      }
      lineStyle(width, color, join, cap) {
          this._needStroke = true;
          this._rules.push((ctx) => {
              ctx.lineWidth = width;
              ctx.lineJoin = join;
              ctx.lineCap = cap;
              ctx.strokeStyle = color;
          });
      }
      beginFill(color) {
          this._rules.push((ctx) => {
              ctx.fillStyle = color;
          });
      }
      drawRect(x, y, w, h) {
          this._rules.push((ctx) => {
              ctx.beginPath();
              ctx.rect(x, y, w, h);
              ctx.fill();
              this._needStroke && ctx.stroke();
              ctx.closePath();
          });
      }
      drawCircle(cx, cy, radius) {
          this._rules.push((ctx) => {
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, Math.PI * 2);
              ctx.fill();
              this._needStroke && ctx.stroke();
              ctx.closePath();
          });
      }
  }

  function isNum(val) {
      return typeof val === "number";
  }
  function removeFromArr(arr, val) {
      const find = arr.findIndex((o) => o === val);
      find >= 0 && arr.splice(find, 1);
  }

  class Vec2 {
      constructor(x = 0, y = 0) {
          this.x = 0;
          this.y = 0;
          this.set(x, y);
      }
      set(x, y) {
          this.x = isNum(x) ? x : this.x;
          this.y = isNum(y) ? y : this.y;
      }
  }

  class EventDispatcher {
      addEventListener(type, handler) {
          const map = this._map || (this._map = new Map());
          if (!map.has(type)) {
              map.set(type, new Set());
          }
          map.get(type).add(handler);
      }
      removeEventListener(type, handler) {
          const map = this._map;
          if (!map || !map.has(type)) {
              return;
          }
          map.get(type).delete(handler);
      }
      removeAllEventListerner(type) {
          const map = this._map;
          if (!map || !map.has(type)) {
              return;
          }
          type ? map.get(type).clear() : map.clear();
      }
      emit(type, data) {
          const map = this._map;
          if (!map || !map.has(type)) {
              return;
          }
          for (const handler of map.get(type).values()) {
              handler({
                  target: this,
                  data,
              });
          }
      }
  }

  const ADD_TO_STAGE = "add-to-stage";
  const REMOVE_FROM_STAGE = "remove-from-stage";
  const ENTER_FRAME = "enter-frame";

  var Event = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ADD_TO_STAGE: ADD_TO_STAGE,
    REMOVE_FROM_STAGE: REMOVE_FROM_STAGE,
    ENTER_FRAME: ENTER_FRAME
  });

  class DisplayObject extends EventDispatcher {
      constructor() {
          super(...arguments);
          this._pos = new Vec2();
          this._size = new Vec2();
          this._scale = new Vec2(1, 1);
          this._rotation = 0;
          this._children = [];
      }
      get scale() {
          return this._scale;
      }
      get scaleX() {
          return this._scale.x;
      }
      set scaleX(value) {
          this._scale.x = value;
      }
      get scaleY() {
          return this._scale.y;
      }
      set scaleY(value) {
          this._scale.y = value;
      }
      get rotation() {
          return this._rotation;
      }
      set rotation(value) {
          this._rotation = value;
      }
      get x() {
          return this._pos.x;
      }
      get y() {
          return this._pos.y;
      }
      set x(val) {
          this._pos.x = val;
      }
      set y(val) {
          this._pos.y = val;
      }
      get width() {
          return this._size.x;
      }
      get height() {
          return this._size.y;
      }
      set width(val) {
          this._size.x = val;
      }
      set height(val) {
          this._size.y = val;
      }
      get graphics() {
          return this._graphics || (this._graphics = new Graphics(this));
      }
      get children() {
          return this._children;
      }
      get stage() {
          return this._stage;
      }
      set stage(stage) {
          if (!stage) {
              this.emit(REMOVE_FROM_STAGE);
          }
          else {
              this.emit(ADD_TO_STAGE);
          }
          this._stage = stage;
      }
      draw(render, evt) {
          this._graphics.draw(render.context, evt);
          for (let i = 0, len = this.children.length; i < len; i++) {
              const child = this.children[i];
              child.draw(render, evt);
          }
      }
      addChild(child) {
          this.children.push(child);
      }
      removeChild(child) {
          removeFromArr(this.children, child);
      }
  }

  class Stage extends DisplayObject {
      constructor(canvas, w, h) {
          super();
          this.stage = this;
          this.width = w;
          this.height = h;
          this.canvas = canvas;
          this._renderer = new Renderer(this);
          this.update();
      }
      update() {
          const fn = () => {
              this.draw();
              this.emit(ENTER_FRAME);
              requestAnimationFrame(fn);
          };
          fn();
      }
      draw() {
          this._renderer.draw();
      }
  }

  class Sprite extends DisplayObject {
  }

  exports.Event = Event;
  exports.Sprite = Sprite;
  exports.Stage = Stage;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
