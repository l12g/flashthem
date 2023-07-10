(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.flashthem = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
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

    var PercentFilter = /** @class */ (function () {
        function PercentFilter(name, value, min, max) {
            if (value === void 0) { value = 0; }
            if (min === void 0) { min = 0; }
            if (max === void 0) { max = 100; }
            this._name = name;
            this._max = max;
            this._min = min;
            this.percentage = value;
        }
        Object.defineProperty(PercentFilter.prototype, "percentage", {
            get: function () {
                return this._percentage;
            },
            set: function (value) {
                this._percentage = Math.max(this._min, Math.min(this._max, value));
            },
            enumerable: false,
            configurable: true
        });
        PercentFilter.prototype.toString = function () {
            return "".concat(this._name, "(").concat(this.percentage, "%)");
        };
        return PercentFilter;
    }());
    var BrightnessFilter = /** @class */ (function (_super) {
        __extends(BrightnessFilter, _super);
        function BrightnessFilter(value) {
            return _super.call(this, "brightness", value) || this;
        }
        return BrightnessFilter;
    }(PercentFilter));
    var ContrastFilter = /** @class */ (function (_super) {
        __extends(ContrastFilter, _super);
        function ContrastFilter(value) {
            return _super.call(this, "contrast", value) || this;
        }
        return ContrastFilter;
    }(PercentFilter));
    var GrayFilter = /** @class */ (function (_super) {
        __extends(GrayFilter, _super);
        function GrayFilter(value) {
            return _super.call(this, "grayscale", value) || this;
        }
        return GrayFilter;
    }(PercentFilter));
    var InvertFilter = /** @class */ (function (_super) {
        __extends(InvertFilter, _super);
        function InvertFilter(value) {
            return _super.call(this, "invert", value) || this;
        }
        return InvertFilter;
    }(PercentFilter));
    var SaturateFilter = /** @class */ (function (_super) {
        __extends(SaturateFilter, _super);
        function SaturateFilter(value) {
            return _super.call(this, "saturate", value) || this;
        }
        return SaturateFilter;
    }(PercentFilter));
    var SepiaFilter = /** @class */ (function (_super) {
        __extends(SepiaFilter, _super);
        function SepiaFilter(value) {
            return _super.call(this, "sepia", value) || this;
        }
        return SepiaFilter;
    }(PercentFilter));
    var BlurFilter = /** @class */ (function () {
        function BlurFilter(length) {
            this.blur = length;
        }
        BlurFilter.prototype.toString = function () {
            return "blur(".concat(this.blur, "px)");
        };
        return BlurFilter;
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

    function loadSound(src, ctx) {
        return fetch(src)
            .then(function (d) { return d.arrayBuffer(); })
            .then(function (data) {
            return ctx.decodeAudioData(data);
        });
    }
    var Sound = /** @class */ (function (_super) {
        __extends(Sound, _super);
        function Sound(src) {
            var _this = _super.call(this) || this;
            _this._mute = false;
            _this._volum = 0.3;
            _this._ctx = new AudioContext();
            _this._gain = _this._ctx.createGain();
            _this._gain.gain.value = _this.volum;
            _this.src = src;
            _this._ctx.addEventListener("statechange", function (e) {
                console.log(e);
            });
            return _this;
        }
        Object.defineProperty(Sound.prototype, "src", {
            get: function () {
                return this._src;
            },
            set: function (value) {
                var _this = this;
                this._src = value;
                loadSound(this._src, this._ctx).then(function (buffer) {
                    _this._buffer = buffer;
                    console.log(buffer);
                    _this.emit("load");
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "volum", {
            get: function () {
                return this._volum;
            },
            set: function (value) {
                this._volum = value;
                this._gain.gain.value = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "mute", {
            get: function () {
                return this._mute;
            },
            set: function (value) {
                this._mute = value;
                this._gain.gain.value = value ? 0 : this.volum;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "currentTime", {
            get: function () {
                return this._ctx.currentTime || 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Sound.prototype, "duration", {
            get: function () {
                if (!this._buffer) {
                    return 0;
                }
                return this._buffer.duration;
            },
            enumerable: false,
            configurable: true
        });
        Sound.prototype.play = function () {
            if (this._paused) {
                this._paused = false;
                this._ctx.resume();
            }
            else {
                if (this._ctx.state === "suspended") {
                    this._ctx.resume();
                }
                if (!this._source) {
                    this._source = this._ctx.createBufferSource();
                    this._source.buffer = this._buffer;
                    this._source.connect(this._gain);
                    this._gain.connect(this._ctx.destination);
                    this._source.start(0, 0);
                }
            }
        };
        Sound.prototype.pause = function () {
            this._ctx.suspend();
            this._paused = true;
        };
        Sound.prototype.stop = function () {
            if (this._source) {
                this._source.stop();
                this._source = null;
            }
        };
        Sound.prototype.seek = function (time) {
            if (this._source) {
                this._source.start(0, time);
            }
        };
        return Sound;
    }(EventDispatcher));

    var Graphics = /** @class */ (function () {
        function Graphics(target) {
            this._needStroke = false;
            this._needFill = false;
            this._commands = [];
            this._target = target;
        }
        Object.defineProperty(Graphics.prototype, "commands", {
            get: function () {
                return this._commands;
            },
            enumerable: false,
            configurable: true
        });
        Graphics.prototype.afterDraw = function (ctx) {
            this._needFill && ctx.fill();
            this._needStroke && ctx.stroke();
        };
        Graphics.prototype.draw = function (ctx, evt, onDraw) {
            var e_1, _a;
            this.context = ctx;
            var target = this._target;
            if (target.shadow) {
                ctx.shadowBlur = target.shadow.blur;
                ctx.shadowColor = target.shadow.color;
                ctx.shadowOffsetX = target.shadow.offsetX;
                ctx.shadowOffsetY = target.shadow.offsetY;
            }
            // ctx.transform(
            //   mtx.a,
            //   mtx.b,
            //   mtx.c,
            //   mtx.d,
            //   Math.floor(mtx.tx),
            //   Math.floor(mtx.ty)
            // );
            ctx.translate(target.x, target.y);
            ctx.scale(target.scaleX, target.scaleY);
            ctx.rotate((target.rotation * Math.PI) / 180);
            if (target.useBitmapCache) {
                target.bitmapCache.draw(ctx);
            }
            else {
                ctx.globalCompositeOperation =
                    target.blendMode || ctx.globalCompositeOperation;
                ctx.globalAlpha = target.parent
                    ? target.parent.alpha * target.alpha
                    : target.alpha;
                ctx.filter = target.filters.map(function (o) { return o.toString(); }).join(" ");
                onDraw && onDraw();
                try {
                    for (var _b = __values(this._commands), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var cmd = _c.value;
                        var result = cmd.call(this, ctx);
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
            }
            this.checkEvent(ctx, evt);
            this._needStroke = false;
            this._needFill = false;
        };
        Graphics.prototype.checkEvent = function (ctx, evt) {
            var target = this._target;
            if (evt && target.mouseEnable) {
                var dpr = target.stage.dpr;
                var offsetX = evt.offsetX, offsetY = evt.offsetY;
                var ox = offsetX * dpr;
                var oy = offsetY * dpr;
                var data = {
                    x: ox,
                    y: oy,
                };
                var type = evt.type;
                if (ctx.isPointInPath(ox, oy) || ctx.isPointInStroke(ox, oy)) {
                    if (type === "mousemove") {
                        if (!this._hovered) {
                            this._hovered = true;
                            target.emit("mouseover", data);
                        }
                    }
                    else {
                        target.emit(evt.type, data);
                    }
                }
                else {
                    if (this._hovered) {
                        this._hovered = false;
                        target.emit("mouseout", data);
                    }
                }
            }
        };
        Graphics.prototype.clear = function () {
            this._commands = [];
            this._needStroke = false;
            this._needFill = false;
        };
        // private addCommand(){
        //   this._commands.push(fn);
        // }
        Graphics.prototype.lineStyle = function (width, color, join, cap) {
            this._commands.push(function (ctx) {
                this._needStroke = true;
                ctx.lineWidth = width;
                ctx.lineJoin = join;
                ctx.lineCap = cap;
                ctx.strokeStyle = color;
            });
        };
        Graphics.prototype.fontStyle = function (font, align, baseLine) {
            this._commands.push(function (ctx) {
                ctx.textAlign = align;
                ctx.textBaseline = baseLine;
                ctx.font = font;
            });
        };
        Graphics.prototype.beginFill = function (color) {
            this._commands.push(function (ctx) {
                this._needFill = true;
                ctx.fillStyle = color;
            });
        };
        Graphics.prototype.drawRect = function (x, y, w, h) {
            this._commands.push(function (ctx) {
                var _a = this._target, pivotX = _a.pivotX, pivotY = _a.pivotY, width = _a.width, height = _a.height;
                ctx.beginPath();
                ctx.rect(x - pivotX * width, y - pivotY * height, w, h);
                ctx.closePath();
                return true;
            });
        };
        Graphics.prototype.drawCircle = function (cx, cy, radius) {
            this._target.width = this._target.height = radius * 2;
            this._commands.push(function drawCircle(ctx) {
                var _a = this._target, pivotX = _a.pivotX, pivotY = _a.pivotY, width = _a.width, height = _a.height;
                ctx.beginPath();
                ctx.arc(cx - pivotX * width, cy - pivotY * height, radius, 0, Math.PI * 2);
                ctx.closePath();
                return true;
            });
        };
        Graphics.prototype.drawText = function (text, x, y, font) {
            var _this = this;
            this._commands.push(function (ctx) {
                ctx.font = font;
                var _a = _this._target, pivotX = _a.pivotX, pivotY = _a.pivotY, width = _a.width, height = _a.height;
                ctx.fillText(text, x - pivotX * width, y - pivotY * height, width);
            });
        };
        Graphics.prototype.lineTo = function (x, y) {
            this._commands.push(function (ctx) {
                ctx.lineTo(x, y);
                return true;
            });
        };
        Graphics.prototype.moveTo = function (x, y) {
            this._commands.push(function (ctx) {
                ctx.beginPath();
                ctx.moveTo(x, y);
            });
        };
        Graphics.prototype.quadraticCurveTo = function (cpx, cpy, x, y) {
            this._commands.push(function (ctx) {
                ctx.quadraticCurveTo(cpx, cpy, x, y);
            });
        };
        Graphics.prototype.stroke = function () {
            this._commands.push(function (ctx) {
                ctx.stroke();
            });
        };
        Graphics.prototype.drawImage = function (source, sx, sy, sw, sh, dx, dy, dw, dh) {
            this._commands.push(function (ctx) {
                var _a = this._target, pivotX = _a.pivotX, pivotY = _a.pivotY, width = _a.width, height = _a.height;
                ctx.drawImage(source, sx, sy, sw, sh, dx - pivotX * width, dy - pivotY * height, dw, dh);
            });
        };
        Graphics.DEG_TO_RAD = Math.PI / 180;
        return Graphics;
    }());

    var DEG_TO_RAD = Math.PI / 180;
    var Matrix2D = /** @class */ (function () {
        function Matrix2D() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
        }
        Matrix2D.prototype.rotate = function (angel) {
            var deg = angel * DEG_TO_RAD;
            this.a = Math.cos(deg);
            this.b = -Math.sin(deg);
            this.c = Math.sin(deg);
            this.d = Math.cos(deg);
            return this;
        };
        Matrix2D.prototype.scale = function (x, y) {
            this.a *= x;
            this.b *= y;
            this.c *= x;
            this.d *= y;
            return this;
        };
        Matrix2D.prototype.mult = function (x, y) {
            var _a = this, a = _a.a, b = _a.b, c = _a.c, d = _a.d;
            return [a * x + b * y + this.tx, c * x + d * y + this.ty];
        };
        Matrix2D.prototype.translate = function (x, y) {
            this.tx = x;
            this.ty = y;
            return this;
        };
        Matrix2D.prototype.toString = function () {
            console.log("\n        ".concat(this.a, "--").concat(this.c, "\n        ").concat(this.b, "--").concat(this.d, "\n        "));
        };
        return Matrix2D;
    }());

    var Vec2 = /** @class */ (function () {
        function Vec2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = 0;
            this.y = 0;
            this.x = x;
            this.y = y;
        }
        Object.defineProperty(Vec2.prototype, "length", {
            get: function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            },
            set: function (v) {
                this.x = Math.cos(this.angle) * v;
                this.y = Math.sin(this.angle) * v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vec2.prototype, "angle", {
            get: function () {
                return Math.atan2(this.y, this.x);
            },
            enumerable: false,
            configurable: true
        });
        Vec2.prototype.clone = function () {
            return new Vec2(this.x, this.y);
        };
        Vec2.prototype.zero = function () {
            this.x = 0;
            this.y = 0;
            return this;
        };
        Vec2.prototype.isZero = function () {
            return this.x === 0 && this.y === 0;
        };
        Vec2.prototype.reverse = function () {
            this.x *= -1;
            this.y *= -1;
            return this;
        };
        Vec2.prototype.add = function (v) {
            return new Vec2(this.x + v.x, this.y + v.y);
        };
        Vec2.prototype.addxy = function (x, y) {
            return new Vec2(this.x + x, this.y + y);
        };
        Vec2.prototype.subtract = function (v) {
            return new Vec2(this.x - v.x, this.y - v.y);
        };
        Vec2.prototype.multiply = function (v) {
            return new Vec2(this.x * v, this.y * v);
        };
        Vec2.prototype.divide = function (v) {
            return new Vec2(this.x / v, this.y / v);
        };
        Vec2.prototype.equals = function (v) {
            return this.x === v.x && this.y === v.y;
        };
        Vec2.prototype.toString = function () {
            return "Vec2(".concat(this.x, ",").concat(this.y, ")");
        };
        Vec2.prototype.transform = function (mtx) {
            this.x = mtx.a * this.x + mtx.c * this.y;
            this.y = mtx.b * this.x + mtx.d * this.y;
            return this;
        };
        return Vec2;
    }());

    function removeFromArr(arr, val) {
        var find = arr.findIndex(function (o) { return o === val; });
        find >= 0 && arr.splice(find, 1);
    }
    function getType(obj) {
        return Object.prototype.toString.call(obj);
    }

    var BitmapCache = /** @class */ (function () {
        function BitmapCache(target) {
            this._target = target;
            this._canvas = document.createElement("canvas");
            this._canvas.width = 1;
            this._canvas.height = 1;
        }
        Object.defineProperty(BitmapCache.prototype, "context", {
            get: function () {
                return this._canvas.getContext("2d");
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(BitmapCache.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: false,
            configurable: true
        });
        BitmapCache.prototype.draw = function (ctx) {
            var _a = this._target, width = _a.width, height = _a.height;
            if (!this._cached) {
                this.update();
            }
            ctx.drawImage(this._canvas, 0, 0, width, height, 0, 0, width, height);
        };
        BitmapCache.prototype.afterDraw = function (ctx) {
            this._needFill && ctx.fill();
            this._needStroke && ctx.stroke();
        };
        BitmapCache.prototype.reset = function () {
            this._cached = false;
        };
        BitmapCache.prototype.update = function () {
            var _this = this;
            var ctx = this.context;
            ctx.save();
            var target = this._target;
            this._cached = true;
            var commands = target.graphics.commands;
            var _a = this._target, width = _a.width, height = _a.height;
            this._canvas.width = width;
            this._canvas.height = height;
            this.context.clearRect(0, 0, width, height);
            ctx.globalAlpha = target.parent
                ? target.parent.alpha * target.alpha
                : target.alpha;
            commands.forEach(function (c) {
                c.call(_this, ctx) && _this.afterDraw(ctx);
            });
            ctx.restore();
        };
        return BitmapCache;
    }());

    var DisplayObject = /** @class */ (function (_super) {
        __extends(DisplayObject, _super);
        function DisplayObject() {
            var _this = _super.call(this) || this;
            _this._filters = [];
            _this._x = 0;
            _this._y = 0;
            _this._scaleX = 1;
            _this._scaleY = 1;
            _this._width = 0;
            _this._height = 0;
            _this._rotation = 0;
            _this._pivotX = 0;
            _this._pivotY = 0;
            _this._skewX = 0;
            _this._skewY = 0;
            _this.snapToPixel = true;
            _this.mouseEnable = false;
            _this.visible = true;
            _this._alpha = 1;
            _this.graphics = new Graphics(_this);
            return _this;
        }
        Object.defineProperty(DisplayObject.prototype, "filters", {
            get: function () {
                return this._filters;
            },
            set: function (v) {
                this._filters = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "bitmapCache", {
            get: function () {
                return this._bitmapCache;
            },
            set: function (value) {
                this._bitmapCache = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "useBitmapCache", {
            get: function () {
                return this._useBitmapCache;
            },
            set: function (value) {
                if (value) {
                    this._bitmapCache = this._bitmapCache || new BitmapCache(this);
                }
                this._useBitmapCache = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleX", {
            get: function () {
                return this._scaleX;
            },
            set: function (value) {
                this._scaleX = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "scaleY", {
            get: function () {
                return this._scaleY;
            },
            set: function (value) {
                this.updateBitmapCache();
                this._scaleY = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "width", {
            get: function () {
                return this._width;
            },
            set: function (value) {
                this._width = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "height", {
            get: function () {
                return this._height;
            },
            set: function (value) {
                this._height = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            set: function (value) {
                this._rotation = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "pivotX", {
            get: function () {
                return this._pivotX;
            },
            set: function (value) {
                this._pivotX = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "pivotY", {
            get: function () {
                return this._pivotY;
            },
            set: function (value) {
                this._pivotY = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "skewX", {
            get: function () {
                return this._skewX;
            },
            set: function (value) {
                this._skewX = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "skewY", {
            get: function () {
                return this._skewY;
            },
            set: function (value) {
                this._skewY = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            set: function (v) {
                if (v && v.constructor === DisplayObjectContainer$1) {
                    throw new Error("parent must be instance of DisplayObjectContainer,got ".concat(getType(v)));
                }
                this._parent = v;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "alpha", {
            get: function () {
                return this._alpha;
            },
            set: function (value) {
                var eq = value === this._alpha;
                this._alpha = value;
                if (!eq) {
                    this.updateBitmapCache();
                }
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
        Object.defineProperty(DisplayObject.prototype, "stage", {
            get: function () {
                var p = this.parent;
                while (p) {
                    if (p.constructor === Stage$1) {
                        return p;
                    }
                    p = p.parent;
                }
                return null;
            },
            enumerable: false,
            configurable: true
        });
        DisplayObject.prototype.drawCache = function () { };
        DisplayObject.prototype.render = function (render, evt, elapsed) {
            var _this = this;
            if (!this.visible) {
                return;
            }
            this.emit("enter-frame", render);
            render.context.save();
            if (this.useBitmapCache) {
                this.drawCache();
            }
            this.graphics.draw(render.context, evt, function () {
                _this.onRender(render, evt, elapsed);
            });
            render.context.restore();
            this.emit("exit-frame", render);
        };
        DisplayObject.prototype.remove = function () {
            this.parent && this.parent.removeChild(this);
            return this;
        };
        DisplayObject.prototype.onRender = function (render, evt, elapsed) { };
        /**
         * 矩形碰撞检测
         * @param target
         * @returns
         */
        DisplayObject.prototype.hitTestObject = function (target) {
            var bound1 = this.aabb;
            var bound2 = target.aabb;
            var axs1 = bound1.x;
            var axs2 = bound1.x + bound1.w;
            var bxs1 = bound2.x;
            var bxs2 = bound2.x + bound2.w;
            var ays1 = bound1.y;
            var ays2 = bound1.y + bound1.h;
            var bys1 = bound2.y;
            var bys2 = bound2.y + bound2.h;
            var x = Math.max(axs1, axs2, bxs1, bxs2) - Math.min(axs1, axs2, bxs1, bxs2) <
                bound1.w + bound2.w;
            var y = Math.max(ays1, ays2, bys1, bys2) - Math.min(ays1, ays2, bys1, bys2) <
                bound1.h + bound2.h;
            return x && y;
        };
        /**
         *
         * @param number x x坐标
         * @param number y y坐标
         * @returns
         */
        DisplayObject.prototype.hitTestPoint = function (x, y) {
            var aabb = this.aabb;
            return (x > aabb.x && x < aabb.x + aabb.w && y > aabb.y && y < aabb.y + aabb.h);
        };
        Object.defineProperty(DisplayObject.prototype, "aabb", {
            /**
             *
             * @returns
             */
            get: function () {
                var _a = __read(this.vertex, 4), p1 = _a[0], p2 = _a[1], p3 = _a[2], p4 = _a[3];
                var minx = Math.min(p1.x, p2.x, p3.x, p4.x);
                var miny = Math.min(p1.y, p2.y, p3.y, p4.y);
                var maxx = Math.max(p1.x, p2.x, p3.x, p4.x);
                var maxy = Math.max(p1.y, p2.y, p3.y, p4.y);
                return {
                    x: minx,
                    y: miny,
                    w: Math.abs(maxx - minx),
                    h: Math.abs(maxy - miny),
                };
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DisplayObject.prototype, "vertex", {
            get: function () {
                var _a = this, width = _a.width, height = _a.height, pivotX = _a.pivotX, pivotY = _a.pivotY;
                var ox = width * pivotX * -1;
                var oy = height * pivotY * -1;
                var p1 = new Vec2(ox, oy);
                var p2 = new Vec2(ox + width, oy);
                var p3 = new Vec2(ox + width, oy + height);
                var p4 = new Vec2(ox, oy + height);
                var mtx = new Matrix2D();
                mtx
                    .translate(this.globalX, this.globalY)
                    .rotate(this.rotation)
                    .scale(this.scaleX, this.scaleY);
                return [p1, p2, p3, p4].map(function (o) {
                    var _a = __read(mtx.mult(o.x, o.y), 2), x = _a[0], y = _a[1];
                    return new Vec2(x, y);
                });
            },
            enumerable: false,
            configurable: true
        });
        DisplayObject.prototype.updateBitmapCache = function () {
            this._useBitmapCache && this._bitmapCache.reset();
        };
        DisplayObject.prototype.dispose = function () { };
        return DisplayObject;
    }(EventDispatcher));

    var DisplayObjectContainer = /** @class */ (function (_super) {
        __extends(DisplayObjectContainer, _super);
        function DisplayObjectContainer() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.children = [];
            return _this;
        }
        DisplayObjectContainer.prototype.onRender = function (render, evt, elapsed) {
            for (var i = 0, len = this.children.length; i < len; i++) {
                this.children[i].render(render, evt, elapsed);
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
            child.emit("add-to-stage");
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
        };
        DisplayObjectContainer.prototype.swapChild = function (child1, child2) {
            var idx1 = this.children.indexOf(child1);
            var idx2 = this.children.indexOf(child2);
            if (idx1 >= 0 && idx2 >= 0) {
                this.children[idx2] = child1;
                this.children[idx1] = child2;
            }
        };
        DisplayObjectContainer.prototype.dispose = function () {
            this.children.forEach(function (ch) { return ch.dispose(); });
        };
        return DisplayObjectContainer;
    }(DisplayObject));
    var DisplayObjectContainer$1 = DisplayObjectContainer;

    var Fps = /** @class */ (function (_super) {
        __extends(Fps, _super);
        function Fps() {
            var _this = _super.call(this) || this;
            _this._frame = 0;
            _this._t = 0;
            _this.width = 50;
            _this.height = 20;
            _this.draw();
            return _this;
        }
        Fps.prototype.draw = function () {
            this.graphics.clear();
            this.graphics.beginFill("#000");
            this.graphics.drawRect(0, 0, 50, 20);
            this.graphics.beginFill("#fff");
            this.graphics.fontStyle("18px", "center", "middle");
            this.graphics.drawText("fps:" + this._frame, 25, 10, "18px");
        };
        Fps.prototype.onRender = function (render, evt, elapsed) {
            this._t += elapsed;
            this._frame++;
            if (this._t >= 1000) {
                this.draw();
                this._t = 0;
                this._frame = 0;
            }
        };
        return Fps;
    }(DisplayObject));

    var Grid = /** @class */ (function (_super) {
        __extends(Grid, _super);
        function Grid() {
            var _this = _super.call(this) || this;
            _this.cellWidth = 50;
            _this.cellHeight = 50;
            _this.on("enter-frame", function () {
                _this.graphics.clear();
                _this.graphics.lineStyle(1, "#ddd");
                for (var i = 0; i < _this.width; i += _this.cellWidth) {
                    _this.graphics.moveTo(i, 0);
                    _this.graphics.lineTo(i, _this.height);
                }
                for (var j = 0; j < _this.height; j += _this.cellHeight) {
                    _this.graphics.moveTo(0, j);
                    _this.graphics.lineTo(_this.width, j);
                }
            });
            return _this;
        }
        return Grid;
    }(DisplayObject));

    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return Sprite;
    }(DisplayObjectContainer$1));

    var Engine = /** @class */ (function () {
        function Engine(target) {
            var _this = this;
            this._time = 0;
            this._startAt = Date.now();
            this._raf = 0;
            this._target = target;
            this._step = function () {
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
            this.start();
        }
        Engine.prototype.start = function () {
            this.stop();
            this._step();
        };
        Engine.prototype.stop = function () {
            cancelAnimationFrame(this._raf);
        };
        return Engine;
    }());

    var Renderer = /** @class */ (function () {
        function Renderer(canvas, dpr) {
            if (dpr === void 0) { dpr = 1; }
            this._extraContext = [];
            this._dpr = 1;
            this._canvas = canvas;
            this._dpr = dpr;
            this.context = this._canvas.getContext("2d");
        }
        Renderer.prototype.addContext = function (ctx) {
            this._extraContext.push(ctx);
        };
        Renderer.prototype.render = function (target, evt, elapsed) {
            var e_1, _a;
            this.clear();
            this.context.save();
            this.context.scale(this._dpr, this._dpr);
            target.render(this, evt, elapsed);
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
            this.context.restore();
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

    var Stage = /** @class */ (function (_super) {
        __extends(Stage, _super);
        function Stage(el, dpr) {
            var _this = _super.call(this) || this;
            _this.fps = 60;
            _this._dpr = 1;
            _this.mouseHandler = function (e) {
                _this._mouseEvent = e;
                _this.mouseX = e.offsetX;
                _this.mouseY = e.offsetY;
            };
            var canvas = (_this.canvas =
                typeof el === "string" ? document.querySelector(el) : el);
            _this.width = canvas.width;
            _this.height = canvas.height;
            _this.dpr = dpr || window.devicePixelRatio;
            _this._renderer = new Renderer(canvas, _this._dpr);
            _this._engine = new Engine(_this);
            canvas.addEventListener("mousemove", _this.mouseHandler);
            canvas.addEventListener("click", _this.mouseHandler);
            canvas.addEventListener("mouseup", _this.mouseHandler);
            canvas.addEventListener("mousedown", _this.mouseHandler);
            Stage.context = _this._renderer.context;
            return _this;
        }
        Object.defineProperty(Stage.prototype, "dpr", {
            get: function () {
                return this._dpr;
            },
            set: function (value) {
                value = Math.max(1, value);
                this._dpr = value;
                this.adjustDpr();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "context", {
            get: function () {
                return this._renderer.context;
            },
            enumerable: false,
            configurable: true
        });
        Stage.prototype.debug = function (v) {
            var _this = this;
            if (v) {
                var box_1 = new Sprite();
                this.addChild(new Fps());
                var g_1 = new Grid();
                g_1.width = this.width;
                g_1.height = this.height;
                this.addChildAt(g_1, 0);
                this.addChild(box_1);
                var draw_1 = function (c) {
                    if (c === box_1 || c === g_1) {
                        return;
                    }
                    var _a = c.aabb, x = _a.x, y = _a.y, w = _a.w, h = _a.h; _a.globalX; _a.globalY;
                    box_1.graphics.drawRect(x, y, w, h);
                    box_1.graphics.drawCircle(c.x, c.y, 3);
                    if (c.children) {
                        c.children.forEach(draw_1);
                    }
                };
                if (v.grid) {
                    this.on("enter-frame", function () {
                        box_1.graphics.clear();
                        box_1.graphics.lineStyle(1, "red");
                        _this.children.forEach(draw_1);
                    });
                }
            }
        };
        Stage.prototype.adjustDpr = function () {
            var canvas = this.canvas;
            var oldWidth = this.width;
            var oldHeight = this.height;
            canvas.width = oldWidth * this.dpr;
            canvas.height = oldHeight * this.dpr;
            canvas.style.width = oldWidth + "px";
            canvas.style.height = oldHeight + "px";
        };
        Stage.prototype.addCanvas = function (canvas) {
            this._renderer.addContext(canvas.getContext("2d"));
        };
        Stage.prototype.onEngine = function (elapsed) {
            this._renderer.render(this, this._mouseEvent, elapsed);
            this._mouseEvent = null;
        };
        Stage.prototype.flush = function () {
            this._renderer.render(this, null, 0);
        };
        Stage.prototype.remove = function () {
            return this;
        };
        Stage.prototype.dispose = function () {
            _super.prototype.dispose.call(this);
            this._engine.stop();
            var canvas = this.canvas;
            canvas.addEventListener("mousemove", this.mouseHandler);
            canvas.addEventListener("click", this.mouseHandler);
            canvas.addEventListener("mouseup", this.mouseHandler);
            canvas.addEventListener("mousedown", this.mouseHandler);
        };
        return Stage;
    }(DisplayObjectContainer$1));
    var Stage$1 = Stage;

    var Bitmap = /** @class */ (function (_super) {
        __extends(Bitmap, _super);
        function Bitmap(src) {
            var _this = _super.call(this) || this;
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
                _this.width = _this._rawWidth;
                _this.height = _this._rawHeight;
                _this._loaded = true;
                setTimeout(function () {
                    _this.emit("load");
                }, 0);
                _this.graphics.drawImage(_this._imgEl, 0, 0, _this._rawWidth, _this._rawHeight, 0, 0, _this.width, _this.height);
            };
        };
        return Bitmap;
    }(DisplayObject));

    var MovieClip = /** @class */ (function (_super) {
        __extends(MovieClip, _super);
        function MovieClip(src, clips) {
            var _this = _super.call(this, src) || this;
            _this.fps = 12;
            _this.loop = true;
            _this._currentFrame = 0;
            _this._clips = [];
            _this.autoSize = true;
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
        MovieClip.prototype.gotoAndStop = function (frame) {
            this._currentFrame = frame;
            this.pause();
        };
        MovieClip.prototype.gotoAndPlay = function (frame) {
            this._currentFrame = frame;
            this.play();
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
        };
        MovieClip.prototype.onRender = function (renderer, evt) {
            var clip = this._clips[this._currentFrame];
            if (!clip)
                return;
            if (this.autoSize) {
                this.width = clip.w;
                this.height = clip.h;
            }
            this.graphics.clear();
            this.graphics.drawImage(this._imgEl, clip.x, clip.y, clip.w, clip.h, -this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
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
            _this.graphics.drawRect(0, 0, w, h);
            return _this;
        }
        return Rect;
    }(Sprite));

    var DEFAULT_FONT = "24px STheiti, SimHei";
    var TextField = /** @class */ (function (_super) {
        __extends(TextField, _super);
        function TextField(text) {
            var _this = _super.call(this) || this;
            _this._size = "24px";
            _this._fontFamily = "STheiti";
            _this.align = "left";
            _this.baseLine = "middle";
            _this.wrap = true;
            _this.text = text;
            _this.on("add-to-stage", function () {
                _this.adjust();
            });
            return _this;
        }
        Object.defineProperty(TextField.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this._text = value;
                this.updateDraw();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "color", {
            get: function () {
                return this._color;
            },
            set: function (value) {
                this._color = value;
                this.updateDraw();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "size", {
            get: function () {
                return this._size;
            },
            set: function (value) {
                this._size = value;
                this.updateDraw();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "fontFamily", {
            get: function () {
                return this._fontFamily;
            },
            set: function (value) {
                this._fontFamily = value;
                this.updateDraw();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TextField.prototype, "font", {
            get: function () {
                return this._font;
            },
            set: function (value) {
                this._font = value;
                this.updateDraw();
            },
            enumerable: false,
            configurable: true
        });
        TextField.prototype.getFont = function () {
            if (this.font) {
                return this.font;
            }
            return ([this.size, this.fontFamily].filter(Boolean).join(" ") || DEFAULT_FONT);
        };
        TextField.prototype.onRender = function () {
            this.graphics.context.textBaseline = this.baseLine;
            this.graphics.context.textAlign = this.align;
        };
        TextField.prototype.updateDraw = function () {
            this.graphics.clear();
            this.graphics.beginFill(this.color);
            this.graphics.drawText(this.text, 0, 0, this.getFont());
        };
        TextField.prototype.adjust = function () {
            var stage = this.stage;
            if (!stage) {
                return;
            }
            stage.context.save();
            stage.context.font = this.getFont();
            var rect = stage.context.measureText(this.text);
            this._textWidth = rect.width;
            this._textHeight =
                rect.actualBoundingBoxAscent + rect.actualBoundingBoxDescent;
            this.width = this._textWidth;
            this.height = this._textHeight;
            stage.context.restore();
        };
        return TextField;
    }(DisplayObject));

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

    var canvas = document.createElement("canvas");
    canvas.style.cssText = "border:solid 1px red";
    var ctx = canvas.getContext("2d");
    function bitmapHitTest(a, b) {
        var e_1, _a, e_2, _b;
        if (!a.stage || !b.stage) {
            return;
        }
        var _c = a.aabb; _c.x; _c.y; var w = _c.w, h = _c.h;
        if (w === 0 || h === 0) {
            return;
        }
        canvas.width = w;
        canvas.height = h;
        ctx.clearRect(0, 0, w, h);
        var t = {};
        var mtx = a.matrix;
        ctx.save();
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, 0, 0);
        try {
            for (var _d = __values(a.graphics.commands), _e = _d.next(); !_e.done; _e = _d.next()) {
                var cmd = _e.value;
                var result = cmd.call(t, ctx);
                if (result) {
                    if (t._needFill) {
                        ctx.fill();
                    }
                    if (t._needStroke) {
                        ctx.stroke();
                    }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
            }
            finally { if (e_1) throw e_1.error; }
        }
        ctx.restore();
        ctx.save();
        var mtx2 = b.matrix;
        ctx.transform(mtx2.a, mtx2.b, mtx2.c, mtx2.d, mtx2.tx, mtx2.ty);
        try {
            // ctx.globalCompositeOperation = "source-in";
            for (var _f = __values(b.graphics.commands), _g = _f.next(); !_g.done; _g = _f.next()) {
                var cmd = _g.value;
                var result = cmd.call(t, ctx);
                if (result) {
                    if (t._needFill) {
                        ctx.fill();
                    }
                    if (t._needStroke) {
                        ctx.stroke();
                    }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_2) throw e_2.error; }
        }
        ctx.restore();
    }

    exports.Bitmap = Bitmap;
    exports.BlurFilter = BlurFilter;
    exports.BrightnessFilter = BrightnessFilter;
    exports.ContrastFilter = ContrastFilter;
    exports.Event = Event;
    exports.Fps = Fps;
    exports.GrayFilter = GrayFilter;
    exports.InvertFilter = InvertFilter;
    exports.MovieClip = MovieClip;
    exports.Rect = Rect;
    exports.SaturateFilter = SaturateFilter;
    exports.SepiaFilter = SepiaFilter;
    exports.Sound = Sound;
    exports.Sprite = Sprite;
    exports.Stage = Stage$1;
    exports.TextField = TextField;
    exports.bitmapHitTest = bitmapHitTest;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
