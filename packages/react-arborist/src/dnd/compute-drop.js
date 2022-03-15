import { bound, indexOf, isClosed, isFolder, isItem } from "../utils";
function measureHover(el, offset) {
    const rect = el.getBoundingClientRect();
    const x = offset.x - Math.round(rect.x);
    const y = offset.y - Math.round(rect.y);
    const height = rect.height;
    const inTopHalf = y < height / 2;
    const inBottomHalf = !inTopHalf;
    const pad = height / 4;
    const inMiddle = y > pad && y < height - pad;
    const atTop = !inMiddle && inTopHalf;
    const atBottom = !inMiddle && inBottomHalf;
    return { x, inTopHalf, inBottomHalf, inMiddle, atTop, atBottom };
}
function getNodesAroundCursor(node, prev, next, hover) {
    if (!node) {
        // We're hoving over the empty part of the list, not over an item,
        // Put the cursor below the last item which is "prev"
        return [prev, null];
    }
    if (isFolder(node)) {
        if (hover.atTop) {
            return [prev, node];
        }
        else if (hover.inMiddle) {
            return [node, node];
        }
        else {
            return [node, next];
        }
    }
    else {
        if (hover.inTopHalf) {
            return [prev, node];
        }
        else {
            return [node, next];
        }
    }
}
function getDropLevel(hovering, aboveCursor, belowCursor, indent) {
    const hoverLevel = Math.round(Math.max(0, hovering.x - indent) / indent);
    let min, max;
    if (!aboveCursor) {
        max = 0;
        min = 0;
    }
    else if (!belowCursor) {
        max = aboveCursor.level;
        min = 0;
    }
    else {
        max = aboveCursor.level;
        min = belowCursor.level;
    }
    return bound(hoverLevel, min, max);
}
function canDrop(above, below) {
    if (!above) {
        return true;
    }
    let n = above;
    if (isClosed(above) && above !== below)
        n = above.parent;
    while (n) {
        if (!n.isDroppable)
            return false;
        n = n.parent;
    }
    return true;
}
function dropAt(parentId, index) {
    return { parentId: parentId || null, index };
}
function lineCursor(index, level) {
    return {
        type: "line",
        index,
        level,
    };
}
function noCursor() {
    return {
        type: "none",
    };
}
function highlightCursor(id) {
    return {
        type: "highlight",
        id,
    };
}
function walkUpFrom(node, level) {
    var _a;
    let drop = node;
    while (drop.parent && drop.level > level) {
        drop = drop.parent;
    }
    const parentId = ((_a = drop.parent) === null || _a === void 0 ? void 0 : _a.id) || null;
    const index = indexOf(drop) + 1;
    return { parentId, index };
}
/**
 * This is the most complex, tricky function in the whole repo.
 * It could be simplified and made more understandable.
 */
export function computeDrop(args) {
    var _a;
    const hover = measureHover(args.element, args.offset);
    const { node, nextNode, prevNode } = args;
    const [above, below] = getNodesAroundCursor(node, prevNode, nextNode, hover);
    if (!canDrop(above, below)) {
        return { drop: null, cursor: noCursor() };
    }
    /* Hovering over the middle of a folder */
    if (node && isFolder(node) && hover.inMiddle) {
        return {
            drop: dropAt(node.id, 0),
            cursor: highlightCursor(node.id),
        };
    }
    /* At the top of the list */
    if (!above) {
        return {
            drop: dropAt((_a = below === null || below === void 0 ? void 0 : below.parent) === null || _a === void 0 ? void 0 : _a.id, 0),
            cursor: lineCursor(0, 0),
        };
    }
    /* The above node is an item or a closed folder */
    if (isItem(above) || isClosed(above)) {
        const level = getDropLevel(hover, above, below, args.indent);
        return {
            drop: walkUpFrom(above, level),
            cursor: lineCursor(above.rowIndex + 1, level),
        };
    }
    /* The above node is an open folder */
    return {
        drop: dropAt(above === null || above === void 0 ? void 0 : above.id, 0),
        cursor: lineCursor(above.rowIndex + 1, above.level + 1),
    };
}
