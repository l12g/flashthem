'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/*! *****************************************************************************
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

var Renderer = /** @class */ (function () {
    function Renderer(canvas) {
        this._extraContext = [];
        this._canvas = canvas;
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
    Renderer.prototype.render = function (target, evt, elapsed) {
        var e_1, _a;
        this.clear();
        this.context.save();
        this.context.scale(Stage$1.DPR, Stage$1.DPR);
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
    Graphics.prototype.draw = function (ctx, evt) {
        var e_1, _a;
        var target = this._target;
        var mtx = target.matrix;
        ctx.transform(mtx.a, mtx.b, mtx.c, mtx.d, Math.floor(mtx.tx), Math.floor(mtx.ty));
        if (target.useBitmapCache) {
            target.bitmapCache.draw(ctx);
        }
        else {
            ctx.globalCompositeOperation =
                target.blendMode || ctx.globalCompositeOperation;
            ctx.globalAlpha = target.parent
                ? target.parent.alpha * target.alpha
                : target.alpha;
            target.filters.forEach(function (f) {
                ctx.filter = f.toString();
            });
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
        if (evt && target.mouseEnable) {
            var offsetX = evt.offsetX, offsetY = evt.offsetY;
            if (ctx.isPointInPath(offsetX, offsetY) ||
                ctx.isPointInStroke(offsetX, offsetY)) {
                target.emit(evt.type);
            }
        }
        this._needStroke = false;
        this._needFill = false;
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
    Graphics.prototype.beginFill = function (color) {
        this._commands.push(function (ctx) {
            this._needFill = true;
            ctx.fillStyle = color;
        });
    };
    Graphics.prototype.drawRect = function (x, y, w, h) {
        this._commands.push(function (ctx) {
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.closePath();
            return true;
        });
    };
    Graphics.prototype.drawCircle = function (cx, cy, radius) {
        this._target.width = this._target.height = radius * 2;
        this._commands.push(function drawCircle(ctx) {
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.closePath();
            return true;
        });
    };
    Graphics.prototype.drawText = function (x, y, text, font) {
        this._commands = [
            function (ctx) {
                ctx.font = font;
                ctx.fillText(text, x, y);
                return true;
            },
        ];
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
            ctx.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
        });
    };
    Graphics.DEG_TO_RAD = Math.PI / 180;
    return Graphics;
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
        return "Vec2(" + this.x + "," + this.y + ")";
    };
    Vec2.prototype.transform = function (mtx) {
        this.x = mtx.a * this.x + mtx.c * this.y;
        this.y = mtx.b * this.x + mtx.d * this.y;
        return this;
    };
    return Vec2;
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

var Matrix2D = /** @class */ (function () {
    function Matrix2D(a, b, c, d, x, y) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 0; }
        if (d === void 0) { d = 1; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.setValues(a, b, c, d, x, y);
    }
    Matrix2D.prototype.setValues = function (a, b, c, d, tx, ty) {
        if (a === void 0) { a = 1; }
        if (b === void 0) { b = 0; }
        if (c === void 0) { c = 0; }
        if (d === void 0) { d = 1; }
        if (tx === void 0) { tx = 0; }
        if (ty === void 0) { ty = 0; }
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    };
    Object.defineProperty(Matrix2D.prototype, "isIdentity", {
        get: function () {
            return (this.a === 1 &&
                this.b === 0 &&
                this.c === 0 &&
                this.d === 1 &&
                this.tx === 0 &&
                this.ty === 0);
        },
        enumerable: false,
        configurable: true
    });
    Matrix2D.prototype.mult = function (a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            this.a = a1 * a + c1 * b;
            this.b = b1 * a + d1 * b;
            this.c = a1 * c + c1 * d;
            this.d = b1 * c + d1 * d;
        }
        this.tx = a1 * tx + c1 * ty + this.tx;
        this.ty = b1 * tx + d1 * ty + this.ty;
        return this;
    };
    Matrix2D.prototype.multBy = function (a, b, c, d, tx, ty) {
        var a1 = this.a;
        var c1 = this.c;
        var tx1 = this.tx;
        this.a = a * a1 + c * this.b;
        this.b = b * a1 + d * this.b;
        this.c = a * c1 + c * this.d;
        this.d = b * c1 + d * this.d;
        this.tx = a * tx1 + c * this.ty + tx;
        this.ty = b * tx1 + d * this.ty + ty;
        return this;
    };
    Matrix2D.prototype.rotate = function (angle) {
        angle = (angle / 180) * Math.PI;
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var a1 = this.a;
        var b1 = this.b;
        this.a = a1 * cos + this.c * sin;
        this.b = b1 * cos + this.d * sin;
        this.c = -a1 * sin + this.c * cos;
        this.d = -b1 * sin + this.d * cos;
        return this;
    };
    Matrix2D.prototype.translate = function (x, y) {
        this.tx = x;
        this.ty = y;
        return this;
    };
    Matrix2D.prototype.identity = function () {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
        return this;
    };
    Matrix2D.prototype.append = function (a, b, c, d, tx, ty) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;
        if (a != 1 || b != 0 || c != 0 || d != 1) {
            this.a = a1 * a + c1 * b;
            this.b = b1 * a + d1 * b;
            this.c = a1 * c + c1 * d;
            this.d = b1 * c + d1 * d;
        }
        this.tx = a1 * tx + c1 * ty + this.tx;
        this.ty = b1 * tx + d1 * ty + this.ty;
        return this;
    };
    Matrix2D.prototype.appendTransform = function (x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
        if (rotation % 360) {
            var r = rotation * Matrix2D.DEG_TO_RAD;
            var cos = Math.cos(r);
            var sin = Math.sin(r);
        }
        else {
            cos = 1;
            sin = 0;
        }
        if (skewX || skewY) {
            // TODO: can this be combined into a single append operation?
            skewX *= Matrix2D.DEG_TO_RAD;
            skewY *= Matrix2D.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        }
        else {
            this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
        }
        if (regX || regY) {
            // append the registration offset:
            this.tx -= regX * this.a + regY * this.c;
            this.ty -= regX * this.b + regY * this.d;
        }
        return this;
    };
    Matrix2D.DEG_TO_RAD = Math.PI / 180;
    return Matrix2D;
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
                throw new Error("parent must be instance of DisplayObjectContainer,got " + getType(v));
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
        if (!this.visible) {
            return;
        }
        this.emit("enter-frame", render);
        render.context.save();
        if (this.useBitmapCache) {
            this.drawCache();
        }
        this.graphics.draw(render.context, evt);
        this.onRender(render, evt, elapsed);
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
    Object.defineProperty(DisplayObject.prototype, "matrix", {
        get: function () {
            this._mtx = this._mtx || new Matrix2D();
            this._mtx
                .identity()
                .appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.skewX, this.skewY, this.pivotX, this.pivotY);
            return this._mtx;
        },
        enumerable: false,
        configurable: true
    });
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
            var _this = this;
            var rad = (this.rotation / 180) * Math.PI;
            var sin = Math.sin(rad);
            var cos = Math.cos(rad);
            var a = cos;
            var b = sin;
            var c = -sin;
            var d = cos;
            new Matrix2D(a, b, c, d, 0, 0);
            var hw = this.width;
            var hh = this.height;
            // top-left
            var p1 = new Vec2();
            // top-right
            var p2 = new Vec2(a * hw, b * hw);
            // bottom-right
            var p3 = new Vec2(a * hw + c * hh, b * hw + d * hh);
            // bottom-left
            var p4 = new Vec2(c * hh, d * hh);
            return [p1, p2, p3, p4].map(function (v) {
                return v.addxy(_this.globalX, _this.globalY);
            });
        },
        enumerable: false,
        configurable: true
    });
    DisplayObject.prototype.addFilter = function (filter) {
        this._filters.push(filter);
    };
    DisplayObject.prototype.updateBitmapCache = function () {
        this._useBitmapCache && this._bitmapCache.reset();
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
        child.emit("added");
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
    return DisplayObjectContainer;
}(DisplayObject));
var DisplayObjectContainer$1 = DisplayObjectContainer;

var Stage = /** @class */ (function (_super) {
    __extends(Stage, _super);
    function Stage(el, dpr) {
        var _this = _super.call(this) || this;
        _this.fps = 60;
        _this.debug = true;
        _this._dpr = 1;
        var canvas = (_this.canvas =
            typeof el === "string" ? document.querySelector(el) : el);
        _this.width = canvas.width;
        _this.height = canvas.height;
        _this.dpr = dpr || window.devicePixelRatio;
        _this._renderer = new Renderer(canvas);
        _this._engine = new Engine(_this);
        var mouseHandler = _this.onMouse.bind(_this);
        canvas.addEventListener("mousemove", mouseHandler);
        canvas.addEventListener("click", mouseHandler);
        canvas.addEventListener("mouseup", mouseHandler);
        canvas.addEventListener("mousedown", mouseHandler);
        canvas.addEventListener("touchmove", _this.onTouchMove.bind(_this));
        if (_this.debug) {
            _this.addChild(new Fps());
        }
        _this.on("enter-frame", function () {
            if (!_this.debug)
                return;
            _this.graphics.clear();
            _this.graphics.lineStyle(1, "red");
            _this.children.forEach(function (c) {
                var aabb = c.aabb;
                _this.graphics.drawRect(aabb.x, aabb.y, aabb.w, aabb.h);
            });
        });
        return _this;
    }
    Object.defineProperty(Stage.prototype, "dpr", {
        get: function () {
            return this._dpr;
        },
        set: function (value) {
            value = Math.max(1, value);
            Stage.DPR = value;
            this._dpr = value;
            this.adjustDpr();
        },
        enumerable: false,
        configurable: true
    });
    Stage.prototype.onMouse = function (e) {
        this._mouseEvent = e;
        this.mouseX = e.offsetX;
        this.mouseY = e.offsetY;
    };
    Stage.prototype.onTouchMove = function (e) { };
    Stage.prototype.adjustDpr = function () {
        var canvas = this.canvas;
        var oldWidth = this.width;
        var oldHeight = this.height;
        console.log(oldWidth, oldHeight, this.dpr);
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
    Stage.DPR = 1;
    return Stage;
}(DisplayObjectContainer$1));
var Stage$1 = Stage;

var Sprite = /** @class */ (function (_super) {
    __extends(Sprite, _super);
    function Sprite() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Sprite;
}(DisplayObjectContainer$1));

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
            if (_this.width === 0) {
                _this.width = _this._rawWidth;
            }
            if (_this.height === 0) {
                _this.height = _this._rawHeight;
            }
            _this._loaded = true;
            _this.emit("load");
        };
    };
    Bitmap.prototype.render = function (renderer, evt, elapsed) {
        if (!this._loaded)
            return;
        _super.prototype.render.call(this, renderer, evt, elapsed);
    };
    Bitmap.prototype.onRender = function (renderer, evt) {
        renderer.context.drawImage(this._imgEl, 0, 0, this._rawWidth, this._rawHeight, -this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
    };
    return Bitmap;
}(DisplayObject));

var TextField = /** @class */ (function (_super) {
    __extends(TextField, _super);
    function TextField(text) {
        var _this = _super.call(this) || this;
        _this._font = "24px STheiti, SimHei";
        _this._textBaseline = "top";
        _this.wrap = true;
        _this.text = text;
        return _this;
    }
    Object.defineProperty(TextField.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this._text = value;
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
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textAlign", {
        get: function () {
            return this._textAlign;
        },
        set: function (value) {
            this._textAlign = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TextField.prototype, "textBaseline", {
        get: function () {
            return this._textBaseline;
        },
        set: function (value) {
            this._textBaseline = value;
        },
        enumerable: false,
        configurable: true
    });
    TextField.prototype.onRender = function (renderer, evt, elapsed) {
        renderer.context.textBaseline = this.textBaseline;
        renderer.context.textAlign = this.textAlign;
        renderer.context.font = this.font;
        this.adjust(renderer);
        renderer.context.fillText(this.text, 0, 0, this.width);
    };
    TextField.prototype.adjust = function (renderer) {
        var rect = renderer.context.measureText(this.text);
        this._textWidth = rect.width;
        this._textHeight =
            rect.actualBoundingBoxAscent + rect.actualBoundingBoxDescent;
        if (this.width === 0) {
            this.width = this._textWidth;
        }
        if (this.height === 0) {
            this.height = this._textHeight;
        }
    };
    return TextField;
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
        renderer.context.drawImage(this._imgEl, clip.x, clip.y, clip.w, clip.h, -this.width * this.pivotX, -this.height * this.pivotY, this.width, this.height);
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

var Fps = /** @class */ (function (_super) {
    __extends(Fps, _super);
    function Fps() {
        var _this = _super.call(this, "fps:0") || this;
        _this._frame = 0;
        _this._t = 0;
        _this.font = "12px _sans";
        _this.graphics.beginFill('red');
        return _this;
    }
    Fps.prototype.onRender = function (render, evt, elapsed) {
        _super.prototype.onRender.call(this, render, evt, elapsed);
        this._t += elapsed;
        this._frame++;
        if (this._t > 1000) {
            this.text = "fps:" + this._frame;
            this._t = 0;
            this._frame = 0;
        }
    };
    return Fps;
}(TextField));

var Filter = /** @class */ (function () {
    function Filter() {
    }
    Filter.prototype.draw = function () { };
    Filter.prototype.toString = function () {
        return "";
    };
    return Filter;
}());

var BlurFilter = /** @class */ (function (_super) {
    __extends(BlurFilter, _super);
    function BlurFilter(length) {
        var _this = _super.call(this) || this;
        _this.blur = length;
        return _this;
    }
    BlurFilter.prototype.toString = function () {
        return "blur(" + this.blur + "px)";
    };
    return BlurFilter;
}(Filter));

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
exports.BlurFilter = BlurFilter;
exports.Event = Event;
exports.Fps = Fps;
exports.MovieClip = MovieClip;
exports.Rect = Rect;
exports.Sprite = Sprite;
exports.Stage = Stage$1;
exports.TextField = TextField;
