"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Row = void 0;
const react_1 = __importStar(require("react"));
const context_1 = require("../context");
const drag_hook_1 = require("../dnd/drag-hook");
const drop_hook_1 = require("../dnd/drop-hook");
exports.Row = react_1.default.memo(function Row({ index, style }) {
    const tree = (0, context_1.useStaticContext)();
    const selected = (0, context_1.useIsSelected)();
    const node = tree.api.visibleNodes[index];
    const next = tree.api.visibleNodes[index + 1] || null;
    const prev = tree.api.visibleNodes[index - 1] || null;
    const cursorParentId = (0, context_1.useCursorParentId)();
    const cursorOverFolder = (0, context_1.useIsCursorOverFolder)();
    const el = (0, react_1.useRef)(null);
    const [{ isDragging }, dragRef] = (0, drag_hook_1.useDragHook)(node);
    const [, dropRef] = (0, drop_hook_1.useDropHook)(el, node, prev, next);
    const isEditing = node.id === (0, context_1.useEditingId)();
    const isSelected = selected(index);
    const nextSelected = next && selected(index + 1);
    const prevSelected = prev && selected(index - 1);
    const isHoveringOverChild = node.id === cursorParentId;
    const isOverFolder = node.id === cursorParentId && cursorOverFolder;
    const isOpen = node.isOpen;
    const indent = tree.indent * node.level;
    const state = (0, react_1.useMemo)(() => {
        return {
            isEditing,
            isDragging,
            isFirstOfSelected: isSelected && !prevSelected,
            isLastOfSelected: isSelected && !nextSelected,
            isSelected,
            isHoveringOverChild,
            isOpen,
            isOverFolder,
        };
    }, [
        isEditing,
        isSelected,
        prevSelected,
        nextSelected,
        isHoveringOverChild,
        isOpen,
        isDragging,
        isOverFolder,
    ]);
    if (isSelected) {
        console.log({ id: node.id, state });
    }
    const ref = (0, react_1.useCallback)((n) => {
        el.current = n;
        dragRef(dropRef(n));
    }, [dragRef, dropRef]);
    const styles = (0, react_1.useMemo)(() => ({
        row: { ...style },
        indent: { paddingLeft: indent },
    }), [indent, style]);
    const handlers = (0, react_1.useMemo)(() => {
        return {
            select: (e, selectOnClick = true) => {
                if (node.rowIndex === null)
                    return;
                if (selectOnClick || e.metaKey || e.shiftKey) {
                    tree.api.select(node.rowIndex, e.metaKey, e.shiftKey);
                }
                else {
                    tree.api.select(null, false, false);
                }
            },
            toggle: (e) => {
                e.stopPropagation();
                tree.onToggle(node.id, !node.isOpen);
            },
            edit: () => {
                tree.api.edit(node.id);
            },
            submit: (name) => {
                if (name.trim())
                    tree.onEdit(node.id, name);
                tree.api.edit(null);
            },
            reset: () => {
                tree.api.edit(null);
            },
        };
    }, [tree, node]);
    const Renderer = (0, react_1.useMemo)(() => {
        return react_1.default.memo(tree.renderer);
    }, [tree.renderer]);
    return (<Renderer innerRef={ref} data={node.model} styles={styles} state={state} handlers={handlers} preview={false} tree={tree.api}/>);
});
