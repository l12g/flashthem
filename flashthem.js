var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
System.register("event/dispatcher", [], function (exports_1, context_1) {
    "use strict";
    var EventDispatcher;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            EventDispatcher = /** @class */ (function () {
                function EventDispatcher() {
                }
                EventDispatcher.prototype.addEventListener = function (type, handler) {
                    var map = this._map || (this._map = new Map());
                    if (!map.has(type)) {
                        return;
                    }
                    map.get(type).add(handler);
                };
                EventDispatcher.prototype.removeEventListener = function (type, handler) {
                    var map = this._map;
                    if (!map || !map.has(type)) {
                        return;
                    }
                    map.get(type).delete(handler);
                };
                EventDispatcher.prototype.removeAllEventListerner = function (type) {
                    var map = this._map;
                    if (!map || !map.has(type)) {
                        return;
                    }
                    type ? map.get(type).clear() : map.clear();
                };
                EventDispatcher.prototype.emit = function (type, data) {
                    var e_1, _a;
                    var map = this._map;
                    if (!map || !map.has(type)) {
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
                return EventDispatcher;
            }());
            exports_1("default", EventDispatcher);
        }
    };
});
System.register("event/event", [], function (exports_2, context_2) {
    "use strict";
    var ADD_TO_STAGE, REMOVE_FROM_STAGE;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [],
        execute: function () {
            exports_2("ADD_TO_STAGE", ADD_TO_STAGE = "add-to-stage");
            exports_2("REMOVE_FROM_STAGE", REMOVE_FROM_STAGE = "remove-from-stage");
        }
    };
});
System.register("utils/index", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function isUndef(val) {
        return typeof val === "undefined";
    }
    exports_3("isUndef", isUndef);
    function isNum(val) {
        return typeof val === "number";
    }
    exports_3("isNum", isNum);
    function removeFromArr(arr, val) {
        var find = arr.findIndex(function (o) { return o === val; });
        find >= 0 && arr.splice(find, 1);
    }
    exports_3("removeFromArr", removeFromArr);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("display/DisplayObject", ["event/dispatcher", "event/event", "utils/index"], function (exports_4, context_4) {
    "use strict";
    var dispatcher_1, event_1, index_1, DisplayObject;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (dispatcher_1_1) {
                dispatcher_1 = dispatcher_1_1;
            },
            function (event_1_1) {
                event_1 = event_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
            DisplayObject = /** @class */ (function (_super) {
                __extends(DisplayObject, _super);
                function DisplayObject() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this._x = 0;
                    _this._y = 0;
                    _this._w = 0;
                    _this._h = 0;
                    _this._children = [];
                    return _this;
                }
                DisplayObject.prototype.draw = function () {
                    for (var i = 0, len = this.children.length; i < len; i++) {
                        var child = this.children[i];
                        child.draw();
                    }
                };
                DisplayObject.prototype.setPos = function (x, y) {
                    this._x = index_1.isNum(x) ? x : this._x;
                    this._y = index_1.isNum(y) ? y : this._y;
                };
                DisplayObject.prototype.setSize = function (w, h) {
                    this._w = index_1.isNum(w) ? w : this._w;
                    this._h = index_1.isNum(h) ? h : this._h;
                };
                Object.defineProperty(DisplayObject.prototype, "children", {
                    get: function () {
                        return this._children;
                    },
                    enumerable: false,
                    configurable: true
                });
                Object.defineProperty(DisplayObject.prototype, "stage", {
                    get: function () {
                        return this._stage;
                    },
                    set: function (stage) {
                        if (!stage) {
                            this.emit(event_1.REMOVE_FROM_STAGE);
                        }
                        else {
                            this.emit(event_1.ADD_TO_STAGE);
                        }
                        this._stage = stage;
                    },
                    enumerable: false,
                    configurable: true
                });
                DisplayObject.prototype.addChild = function (child) {
                    this.children.push(child);
                };
                DisplayObject.prototype.removeChild = function (child) {
                    index_1.removeFromArr(this.children, child);
                };
                return DisplayObject;
            }(dispatcher_1.default));
            exports_4("DisplayObject", DisplayObject);
        }
    };
});
System.register("display/Stage", ["display/DisplayObject"], function (exports_5, context_5) {
    "use strict";
    var DisplayObject_1, Stage;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (DisplayObject_1_1) {
                DisplayObject_1 = DisplayObject_1_1;
            }
        ],
        execute: function () {
            Stage = /** @class */ (function (_super) {
                __extends(Stage, _super);
                function Stage(w, h) {
                    var _this = _super.call(this) || this;
                    _this.stage = _this;
                    _this.setSize(w, h);
                    return _this;
                }
                Stage.prototype.draw = function () {
                    for (var i = 0, len = this.children.length; i < len; i++) {
                        var child = this.children[i];
                        child.draw();
                    }
                };
                return Stage;
            }(DisplayObject_1.DisplayObject));
            exports_5("default", Stage);
        }
    };
});
System.register("display/Sprite", ["display/DisplayObject"], function (exports_6, context_6) {
    "use strict";
    var DisplayObject_2, Sprite;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (DisplayObject_2_1) {
                DisplayObject_2 = DisplayObject_2_1;
            }
        ],
        execute: function () {
            Sprite = /** @class */ (function (_super) {
                __extends(Sprite, _super);
                function Sprite() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                return Sprite;
            }(DisplayObject_2.DisplayObject));
            exports_6("default", Sprite);
        }
    };
});
System.register("index", ["display/Stage", "display/Sprite"], function (exports_7, context_7) {
    "use strict";
    var Stage_1, Sprite_1;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (Stage_1_1) {
                Stage_1 = Stage_1_1;
            },
            function (Sprite_1_1) {
                Sprite_1 = Sprite_1_1;
            }
        ],
        execute: function () {
            exports_7("Stage", Stage_1.default);
            exports_7("Sprite", Sprite_1.default);
        }
    };
});
