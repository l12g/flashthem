(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.flashthem = {}));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    var Renderer = /** @class */ (function () {
        function Renderer(canvas, target) {
            this._extraContext = [];
            this._canvas = canvas;
            this._target = target;
        }
        Object.defineProperty(Renderer.prototype, "context", {
            get: function () {
                return this._canvas.getContext("2d");
            },
            enumerable: false,
            configurable: true
        });
        Renderer.prototype.addContext = function (ctx) {
            this._extraContext.push(ctx);
        };
        Renderer.prototype.draw = function (target) {
            var e_1, _a;
            this.clear();
            this._target.render(this, this._mouseEvent);
            this._mouseEvent = null;
            try {
                for (var _b = __values(this._extraContext), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var ctx = _c.value;
                    ctx.drawImage(this._canvas, 0, 0);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        Renderer.prototype.clear = function () {
            var e_2, _a;
            this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
            try {
                for (var _b = __values(this._extraContext), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var ctx = _c.value;
                    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        return Renderer;
    }());

    var EventDispatcher = /** @class */ (function () {
        function EventDispatcher() {
            this._map = new Map();
        }
        EventDispatcher.prototype.on = function (type, handler) {
            var map = this._map;
            if (!map.has(type)) {
                map.set(type, new Set());
            }
            map.get(type).add(handler);
        };
        EventDispatcher.prototype.off = function (type, handler) {
            var _a;
            var map = this._map;
            (_a = map.get(type)) === null || _a === void 0 ? void 0 : _a.delete(handler);
        };
        EventDispatcher.prototype.offAll = function (type) {
            var _a;
            var map = this._map;
            type ? (_a = map.get(type)) === null || _a === void 0 ? void 0 : _a.clear() : map.clear();
        };
        EventDispatcher.prototype.emit = function (type, data) {
            var e_1, _a;
            var map = this._map;
            if (!map.has(type)) {
                return;
            }
            try {
                for (var _b = __values(map.get(type).values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var handler = _c.value;
                    handler({
                        target: this,
                        data: data,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        EventDispatcher.prototype.dispose = function () {
            this.offAll();
            this._map.clear();
        };
        return EventDispatcher;
    }());

    var Engine = /** @class */ (function (_super) {
        __extends(Engine, _super);
        function Engine(target) {
            var _this = _super.call(this) || this;
            _this._time = 0;
            _this._startAt = Date.now();
            _this._raf = 0;
            _this._target = target;
            _this._step = function () {
                _this._raf = requestAnimationFrame(_this._step);
                var current = Date.now();
                var frameDt = 1000 / _this._target.fps;
                var elapsed = Math.min(frameDt, current - _this._startAt);
                _this._startAt = Date.now();
                _this._time += elapsed;
                while (_this._time >= frameDt) {
                    _this._target.onEngine(elapsed);
                    _this._time -= frameDt;
                }
            };
            _this.start();
            return _this;
        }
        Engine.prototype.start = function () {
            this.stop();
            this._step();
        };
        Engine.prototype.stop = function () {
            cancelAnimationFrame(this._raf);
        };
        return Engine;
    }(EventDispatcher));

    var Graphics = /** @class */ (function () {
        function Graphics(target) {
            this._needStroke = false;
            this._needFill = false;
            this._rules = [];
            this._lines = [];
            this._target = target;
            target.on("enter-frame", function (e) {
                e.data.context.save();
            });
            target.on("exit-frame", function (e) {
                e.data.context.restore();
            });
        }
        Graphics.prototype.afterDraw = function (ctx) {
            this._needFill && ctx.fill();
            this._needStroke && ctx.stroke();
        };
        Graphics.prototype.draw = function (render, evt) {
            var e_1, _a;
            var ctx = render.context;
            var target = this._target;
            ctx.translate(target.x, target.y);
            ctx.rotate((target.rotation / 180) * Math.PI);
            ctx.scale(target.scaleX, target.scaleY);
            ctx.globalCompositeOperation =
                target.blendMode || ctx.globalCompositeOperation;
            ctx.globalAlpha = target.parent
                ? target.parent.alpha * target.alpha
                : target.alpha;
            if (this._lines.length) {
                this._lines.forEach(function (v) {
                    ctx.moveTo(v[0], v[1]);
                    ctx.lineTo(v[2], v[3]);
                });
                ctx.stroke();
            }
            try {
                for (var _b = __values(this._rules), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var rule = _c.value;
                    var result = rule.call(this, ctx);
                    result && this.afterDraw(ctx);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            this._needStroke = false;
            this._needFill = false;
        };
        Graphics.prototype.clear = function () {
            this._rules = [];
            this._lines = [];
            this._needStroke = false;
            this._needFill = false;
        };
        Graphics.prototype.lineStyle = function (width, color, join, cap) {
            var _this = this;
            this._rules.push(function (ctx) {
                _this._needStroke = true;
                ctx.lineWidth = width;
                ctx.lineJoin = join;
                ctx.lineCap = cap;
                ctx.strokeStyle = color;
            });
        };
        Graphics.prototype.beginFill = function (color) {
            var _this = this;
            this._rules.push(function (ctx) {
                _this._needFill = true;
                ctx.fillStyle = color;
            });
        };
        Graphics.prototype.drawRect = function (x, y, w, h) {
            this._rules.push(function (ctx) {
                ctx.beginPath();
                ctx.rect(x, y, w, h);
                ctx.closePath();
                return true;
            });
        };
        Graphics.prototype.drawImg = function (img, dx, dy, dw, dh, sx, sy, sw, sh) {
            var ags = arguments;
            this._rules = [
                function drawImg(ctx) {
                    ctx.drawImage.apply(ctx, ags);
                },
            ];
        };
        Graphics.prototype.drawCircle = function (cx, cy, radius) {
            this._rules.push(function drawCircle(ctx) {
                ctx.beginPath();
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.closePath();
                return true;
            });
        };
        Graphics.prototype.drawText = function (x, y, text, font) {
            this._rules = [
                function (ctx) {
                    ctx.font = font;
                    ctx.fillText(text, x, y);
                    return true;
                },
            ];
        };
        Graphics.prototype.drawLine = function (x0, y0, x1, y1) {
            this._lines.push([x0, y0, x1, y1]);
        };
        Graphics.prototype.lineTo = function (x, y) {
            this._rules.push(function (ctx) {
                ctx.lineTo(x, y);
            });
        };
        Graphics.prototype.stroke = function () {
            this._rules.push(function (ctx) {
                ctx.stroke();
            });
        };
        return Graphics;
    }());

    var DisplayObject = /** @class */ (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject() {
            var _this = _super.call(this) || this;
            _this.mouseEnable = false;
            _this.visible = true;
            _this.x = 0;
            _this.y = 0;
            _this.width = 0;
            _this.height = 0;
            _this.pivotX = 0.5;
            _this.pivotY = 0.5;
            _this.scaleX = 1;
            _this.scaleY = 1;
            _this.rotation = 0;
            _this.alpha = 1;
            return _this;
        }
        Object.defineProperty(DisplayObject.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (v) {
                this._parent = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "graphics", {
            get: function () {
                return this._graphics || (this._graphics = new Graphics(this));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "globalX", {
            get: function () {
                var x = this.x;
                var p = this.parent;
                while (p) {
                    x += p.x;
                    p = p.parent;
                }
                return x;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "globalY", {
            get: function () {
                var y = this.y;
                var p = this.parent;
                while (p) {
                    y += p.y;
                    p = p.parent;
                }
                return y;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "globalRotation", {
            get: function () {
                var r = this.rotation;
                var p = this.parent;
                while (p) {
                    r += p.rotation;
                    p = p.parent;
                }
                return r;
            },
            enumerable: false,
            configurable: true
        });
        DisplayObject.prototype.render = function (render, evt) {
            if (!this.visible) {
                return;
            }
            this.emit("enter-frame", render);
            this.graphics.draw(render, evt);
            this.onRender(render, evt);
            this.emit("exit-frame", render);
        };
        DisplayObject.prototype.remove = function () {
            if (this.parent) {
                this.parent.removeChild(this);
            }
        };
        DisplayObject.prototype.onRender = function (render, evt) { };
        DisplayObject.prototype.hitTest = function (target) {
            var aabb1 = this.aabb();
            var aabb2 = target.aabb();
            var x = Math.abs(aabb1[0] - aabb2[0]) < aabb1[2];
            var y = Math.abs(aabb1[1] - aabb2[1]) < aabb1[3];
            // console.log(aabb1[0] - aabb2[0], aabb1[2]);
            return x && y;
        };
        DisplayObject.prototype.aabb = function () {
            var _a = __read(this.vertex(), 4), p1 = _a[0], p2 = _a[1], p3 = _a[2], p4 = _a[3];
            var minx = Math.min(p1[0], p2[0], p3[0], p4[0]);
            var miny = Math.min(p1[1], p2[1], p3[1], p4[1]);
            var maxx = Math.max(p1[0], p2[0], p3[0], p4[0]);
            var maxy = Math.max(p1[1], p2[1], p3[1], p4[1]);
            return [minx, miny, Math.abs(maxx - minx), Math.abs(maxy - miny)];
        };
        DisplayObject.prototype.vertex = function () {
            var gr = (Math.PI / 180) * this.globalRotation;
            var hw = this.width / 2;
            var hh = this.height / 2;
            var a = Math.cos(gr);
            var b = Math.sin(gr);
            var c = -Math.sin(gr);
            var d = Math.cos(gr);
            var p1 = [
                a * hw + c * hh + this.globalX,
                b * hw + d * hh + this.globalY,
            ];
            var p2 = [
                -a * hw + c * hh + this.globalX,
                -b * hw + d * hh + this.globalY,
            ];
            var p3 = [
                -a * hw - c * hh + this.globalX,
                -b * hw - d * hh + this.globalY,
            ];
            var p4 = [
                a * hw - c * hh + this.globalX,
                b * hw - d * hh + this.globalY,
            ];
            return [p1, p2, p3, p4];
        };
        return DisplayObject;
    }(EventDispatcher));

    var DisplayObjectContainer = /** @class */ (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.children = [];
            return _this;
        }
        DisplayObjectContainer.prototype.onRender = function (render, evt) {
            for (var i = 0, len = this.children.length; i < len; i++) {
                this.children[i].render(render, evt);
            }
        };
        DisplayObjectContainer.prototype.addChild = function (child) {
            this.addChildAt(child, this.children.length);
        };
        DisplayObjectContainer.prototype.addChildAt = function (child, idx) {
            if (idx === void 0) { idx = 0; }
            child.remove();
            this.children.splice(idx, 0, child);
            child.parent = this;
            child.emit("added");
            this.calcSize();
        };
        DisplayObjectContainer.prototype.removeChild = function (child) {
            this.removeChildAt(this.children.indexOf(child));
        };
        DisplayObjectContainer.prototype.removeChildAt = function (idx) {
            if (idx < 0 || idx > this.children.length - 1) {
                return;
            }
            var child = this.children[idx];
            child.parent = null;
            this.children.splice(idx, 1);
            child.emit("removed");
            this.calcSize();
        };
        DisplayObjectContainer.prototype.swapChild = function (child1, child2) {
            var idx1 = this.children.indexOf(child1);
            var idx2 = this.children.indexOf(child2);
            if (idx1 >= 0 && idx2 >= 0) {
                this.children[idx2] = child1;
                this.children[idx1] = child2;
            }
            this.calcSize();
        };
        DisplayObjectContainer.prototype.calcSize = function () {
            var w = 0;
            for (var i = 0; i < this.children.length; i++) {
                w = Math.max(w, this.children[i].width);
            }
            this.width = w;
        };
        return DisplayObjectContainer;
    }(DisplayObject));

    var Stage = /** @class */ (function (_super) {
        __extends(Stage, _super);
        function Stage(canvas, w, h) {
            var _this = _super.call(this) || this;
            _this.fps = 60;
            _this.canvas = canvas;
            _this._renderer = new Renderer(canvas, _this);
            _this._engine = new Engine(_this);
            _this.width = _this.canvas.width;
            _this.height = _this.canvas.height;
            return _this;
        }
        Stage.prototype.addCanvas = function (canvas) {
            this._renderer.addContext(canvas.getContext("2d"));
        };
        Stage.prototype.onEngine = function (elapsed) {
            this._renderer.draw();
        };
        Stage.prototype.calcSize = function () {
            // stage.width=canvas.width
        };
        Stage.prototype.flush = function () {
            this._renderer.draw(this);
        };
        return Stage;
    }(DisplayObjectContainer));

    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Sprite;
    }(DisplayObjectContainer));

    var Bitmap = /** @class */ (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(src) {
            var _this = _super.call(this) || this;
            _this.autoSize = true;
            _this._imgEl = new Image();
            _this.src = src;
            return _this;
        }
        Object.defineProperty(Bitmap.prototype, "src", {
            get: function () {
                return this._src;
            },
            set: function (value) {
                this._src = value;
                this._loaded = false;
                this.load();
            },
            enumerable: false,
            configurable: true
        });
        Bitmap.prototype.load = function () {
            var _this = this;
            this._imgEl.src = this.src;
            this._imgEl.onload = function () {
                _this._rawWidth = _this._imgEl.naturalWidth;
                _this._rawHeight = _this._imgEl.naturalHeight;
                if (_this.autoSize) {
                    _this.width = _this._rawWidth;
                    _this.height = _this._rawHeight;
                }
                _this._loaded = true;
                _this.update();
                _this.emit("load");
            };
        };
        Bitmap.prototype.render = function (render, evt) {
            if (!this._loaded) {
                return;
            }
            return _super.prototype.render.call(this, render, evt);
        };
        Bitmap.prototype.update = function () {
            this.graphics.drawImg(this._imgEl, 0, 0, this._rawWidth, this._rawHeight, -this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
        };
        return Bitmap;
    }(DisplayObject));

    var TextField = /** @class */ (function (_super) {
        __extends(TextField, _super);
        function TextField(text, font) {
            var _this = _super.call(this) || this;
            _this.text = text;
            _this.font = font;
            return _this;
        }
        Object.defineProperty(TextField.prototype, "font", {
            get: function () {
                return this._font;
            },
            set: function (value) {
                this._font = value;
                this.graphics.drawText(0, 0, this.text, this.font);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                this.graphics.drawText(0, 0, this.text, this.font);
            },
            enumerable: false,
            configurable: true
        });
        return TextField;
    }(DisplayObject));

    function removeFromArr(arr, val) {
        var find = arr.findIndex(function (o) { return o === val; });
        find >= 0 && arr.splice(find, 1);
    }

    var MovieClip = /** @class */ (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(src, clips) {
            var _this = _super.call(this, src) || this;
            _this.fps = 12;
            _this.loop = true;
            _this._currentFrame = 0;
            _this._clips = [];
            _this.src = src;
            _this._engine = new Engine(_this);
            _this._clips = clips;
            return _this;
        }
        MovieClip.prototype.play = function () {
            this._engine.start();
        };
        MovieClip.prototype.pause = function () {
            this._engine.stop();
        };
        MovieClip.prototype.stop = function () {
            this._currentFrame = 0;
            this.pause();
        };
        MovieClip.prototype.onEngine = function (elapsed) {
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
        };
        MovieClip.prototype.draw = function () {
            var clip = this._clips[this._currentFrame];
            if (!clip)
                return;
            if (this.autoSize) {
                this.width = clip.w;
                this.height = clip.h;
            }
            this.graphics.drawImg(this._imgEl, clip.x, clip.y, clip.w, clip.h, -this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
        };
        MovieClip.prototype.addClip = function (clip) {
            this._clips.push(clip);
        };
        MovieClip.prototype.addClipAt = function (clip, idx) {
            this._clips.splice(idx, 0, clip);
        };
        MovieClip.prototype.removeClip = function (idx) {
            removeFromArr(this._clips, this._clips[idx]);
        };
        MovieClip.prototype.setClips = function (clips) {
            this._clips = clips;
            this.draw();
        };
        return MovieClip;
    }(Bitmap));

    var Rect = /** @class */ (function (_super) {
        __extends(Rect, _super);
        function Rect(w, h, fill) {
            var _this = _super.call(this) || this;
            _this.width = w;
            _this.height = h;
            _this.graphics.beginFill(fill);
            _this.graphics.drawRect(-_this.width * _this.pivotX, -_this.height * _this.pivotY, w, h);
            return _this;
        }
        return Rect;
    }(Sprite));

    var ADD_TO_STAGE = "add-to-stage";
    var REMOVE_FROM_STAGE = "remove-from-stage";
    var ENTER_FRAME = "enter-frame";
    var LOAD = "load";

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
