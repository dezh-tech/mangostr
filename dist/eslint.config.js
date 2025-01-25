"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eslint_config_prettier_1 = __importDefault(require("eslint-config-prettier"));
var js_1 = __importDefault(require("@eslint/js"));
var compat_1 = require("@eslint/compat");
var eslint_plugin_svelte_1 = __importDefault(require("eslint-plugin-svelte"));
var globals_1 = __importDefault(require("globals"));
var node_url_1 = require("node:url");
var typescript_eslint_1 = __importDefault(require("typescript-eslint"));
var gitignorePath = (0, node_url_1.fileURLToPath)(new URL('./.gitignore', import.meta.url));
exports.default = typescript_eslint_1.default.config.apply(typescript_eslint_1.default, __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([(0, compat_1.includeIgnoreFile)(gitignorePath),
    js_1.default.configs.recommended], typescript_eslint_1.default.configs.recommended, false), eslint_plugin_svelte_1.default.configs['flat/recommended'], false), [eslint_config_prettier_1.default], false), eslint_plugin_svelte_1.default.configs['flat/prettier'], false), [{
        languageOptions: {
            globals: __assign(__assign({}, globals_1.default.browser), globals_1.default.node)
        }
    },
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parserOptions: {
                parser: typescript_eslint_1.default.parser
            }
        }
    }], false));
//# sourceMappingURL=eslint.config.js.map