"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sheetTransitions = exports.sheetVariants = exports.SheetDescription = exports.SheetTitle = exports.SheetFooter = exports.SheetHeader = exports.SheetContent = exports.SheetOverlay = exports.SheetPortal = exports.SheetTrigger = exports.SheetClose = exports.Sheet = exports.Description = exports.Title = exports.Footer = exports.Header = exports.Content = exports.Overlay = exports.Portal = exports.Trigger = exports.Close = exports.Root = void 0;
var bits_ui_1 = require("bits-ui");
var tailwind_variants_1 = require("tailwind-variants");
var sheet_portal_svelte_1 = __importDefault(require("./sheet-portal.svelte"));
exports.Portal = sheet_portal_svelte_1.default;
exports.SheetPortal = sheet_portal_svelte_1.default;
var sheet_overlay_svelte_1 = __importDefault(require("./sheet-overlay.svelte"));
exports.Overlay = sheet_overlay_svelte_1.default;
exports.SheetOverlay = sheet_overlay_svelte_1.default;
var sheet_content_svelte_1 = __importDefault(require("./sheet-content.svelte"));
exports.Content = sheet_content_svelte_1.default;
exports.SheetContent = sheet_content_svelte_1.default;
var sheet_header_svelte_1 = __importDefault(require("./sheet-header.svelte"));
exports.Header = sheet_header_svelte_1.default;
exports.SheetHeader = sheet_header_svelte_1.default;
var sheet_footer_svelte_1 = __importDefault(require("./sheet-footer.svelte"));
exports.Footer = sheet_footer_svelte_1.default;
exports.SheetFooter = sheet_footer_svelte_1.default;
var sheet_title_svelte_1 = __importDefault(require("./sheet-title.svelte"));
exports.Title = sheet_title_svelte_1.default;
exports.SheetTitle = sheet_title_svelte_1.default;
var sheet_description_svelte_1 = __importDefault(require("./sheet-description.svelte"));
exports.Description = sheet_description_svelte_1.default;
exports.SheetDescription = sheet_description_svelte_1.default;
var Root = bits_ui_1.Dialog.Root;
exports.Root = Root;
exports.Sheet = Root;
var Close = bits_ui_1.Dialog.Close;
exports.Close = Close;
exports.SheetClose = Close;
var Trigger = bits_ui_1.Dialog.Trigger;
exports.Trigger = Trigger;
exports.SheetTrigger = Trigger;
exports.sheetVariants = (0, tailwind_variants_1.tv)({
    base: 'bg-background fixed z-50 gap-4 p-6 shadow-lg',
    variants: {
        side: {
            top: 'inset-x-0 top-0 border-b',
            bottom: 'inset-x-0 bottom-0 border-t',
            left: 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            right: 'inset-y-0 right-0 h-full w-3/4  border-l sm:max-w-sm'
        }
    },
    defaultVariants: {
        side: 'right'
    }
});
exports.sheetTransitions = {
    top: {
        in: {
            y: '-100%',
            duration: 500,
            opacity: 1
        },
        out: {
            y: '-100%',
            duration: 300,
            opacity: 1
        }
    },
    bottom: {
        in: {
            y: '100%',
            duration: 500,
            opacity: 1
        },
        out: {
            y: '100%',
            duration: 300,
            opacity: 1
        }
    },
    left: {
        in: {
            x: '-100%',
            duration: 500,
            opacity: 1
        },
        out: {
            x: '-100%',
            duration: 300,
            opacity: 1
        }
    },
    right: {
        in: {
            x: '100%',
            duration: 500,
            opacity: 1
        },
        out: {
            x: '100%',
            duration: 300,
            opacity: 1
        }
    }
};
//# sourceMappingURL=index.js.map