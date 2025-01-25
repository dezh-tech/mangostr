"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.badgeVariants = exports.Badge = void 0;
var tailwind_variants_1 = require("tailwind-variants");
var badge_svelte_1 = require("./badge.svelte");
Object.defineProperty(exports, "Badge", { enumerable: true, get: function () { return __importDefault(badge_svelte_1).default; } });
exports.badgeVariants = (0, tailwind_variants_1.tv)({
    base: 'focus:ring-ring inline-flex select-none items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/80 border-transparent',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent',
            destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent',
            outline: 'text-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
//# sourceMappingURL=index.js.map