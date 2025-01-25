"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flyAndScale = void 0;
exports.cn = cn;
var clsx_1 = require("clsx");
var tailwind_merge_1 = require("tailwind-merge");
var easing_1 = require("svelte/easing");
function cn() {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
var flyAndScale = function (node, params) {
    var _a;
    if (params === void 0) { params = { y: -8, x: 0, start: 0.95, duration: 150 }; }
    var style = getComputedStyle(node);
    var transform = style.transform === 'none' ? '' : style.transform;
    var scaleConversion = function (valueA, scaleA, scaleB) {
        var minA = scaleA[0], maxA = scaleA[1];
        var minB = scaleB[0], maxB = scaleB[1];
        var percentage = (valueA - minA) / (maxA - minA);
        var valueB = percentage * (maxB - minB) + minB;
        return valueB;
    };
    var styleToString = function (style) {
        return Object.keys(style).reduce(function (str, key) {
            if (style[key] === undefined)
                return str;
            return str + "".concat(key, ":").concat(style[key], ";");
        }, '');
    };
    return {
        duration: (_a = params.duration) !== null && _a !== void 0 ? _a : 200,
        delay: 0,
        css: function (t) {
            var _a, _b, _c;
            var y = scaleConversion(t, [0, 1], [(_a = params.y) !== null && _a !== void 0 ? _a : 5, 0]);
            var x = scaleConversion(t, [0, 1], [(_b = params.x) !== null && _b !== void 0 ? _b : 0, 0]);
            var scale = scaleConversion(t, [0, 1], [(_c = params.start) !== null && _c !== void 0 ? _c : 0.95, 1]);
            return styleToString({
                transform: "".concat(transform, " translate3d(").concat(x, "px, ").concat(y, "px, 0) scale(").concat(scale, ")"),
                opacity: t
            });
        },
        easing: easing_1.cubicOut
    };
};
exports.flyAndScale = flyAndScale;
//# sourceMappingURL=utils.js.map