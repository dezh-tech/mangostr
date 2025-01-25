"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var adapter_static_1 = __importDefault(require("@sveltejs/adapter-static"));
var vite_plugin_svelte_1 = require("@sveltejs/vite-plugin-svelte");
/** @type {import('@sveltejs/kit').Config} */
var config = {
    kit: {
        adapter: (0, adapter_static_1.default)({ fallback: '404.html' }), paths: {
            base: process.argv.includes('dev') ? '' : process.env.BASE_PATH
        }
    },
    preprocess: (0, vite_plugin_svelte_1.vitePreprocess)()
};
exports.default = config;
//# sourceMappingURL=svelte.config.js.map