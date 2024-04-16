import { bound, isOpenWithEmptyChildren } from "../utils.js";
import { NodeController } from "../controllers/node-controller.js";
import { HoverData, measureHover } from "./measure-hover.js";
import { XY } from "./types.js";

function getNodesAroundCursor(
  node: NodeController<any> | null,
  prev: NodeController<any> | null,
  next: NodeController<any> | null,
  hover: HoverData,
): [NodeController<any> | null, NodeController<any> | null] {
  if (!node) {
    // We're hovering over the empty part of the list, not over an item,
    // Put the cursor below the last item which is "prev"
    return [prev, null];
  }
  if (node.isInternal) {
    if (hover.atTop) {
      return [prev, node];
    } else if (hover.inMiddle) {
      return [node, node];
    } else {
      return [node, next];
    }
  } else {
    if (hover.inTopHalf) {
      return [prev, node];
    } else {
      return [node, next];
    }
  }
}

export type DropResult = {
  parentId: string | null;
  index: number | null;
};

type Args = {
  element: HTMLElement;
  offset: XY;
  indent: number;
  node: NodeController<any> | null;
  prevNode: NodeController<any> | null;
  nextNode: NodeController<any> | null;
  direction: "ltr" | "rtl";
};

export type ComputedDrop = {
  drop: DropResult | null;
  cursor: Cursor | null;
};

function dropAt(parentId: string | null, index: number | null): DropResult {
  return { parentId, index };
}

function lineCursor(index: number, level: number) {
  return {
    type: "line" as "line",
    index,
    level,
  };
}

function highlightCursor(id: string) {
  return {
    type: "highlight" as "highlight",
    id,
  };
}

function walkUpFrom(node: NodeController<any>, level: number) {
  let drop = node;
  while (drop.parent && drop.level > level) {
    drop = drop.parent;
  }
  const parentId = drop.parentId;
  const index = drop.childIndex + 1;
  return { parentId, index };
}

export type LineCursor = ReturnType<typeof lineCursor>;
export type HighlightCursor = ReturnType<typeof highlightCursor>;
export type Cursor = LineCursor | HighlightCursor | null;

/**
 * This is the most complex, tricky function in the whole repo.
 */
export function computeDrop(args: Args): ComputedDrop {
  const hover = measureHover(args.element, args.offset, args.direction);
  const indent = args.indent;
  const hoverLevel = Math.round(Math.max(0, hover.x - indent) / indent);
  const { node, nextNode, prevNode } = args;
  const [above, below] = getNodesAroundCursor(node, prevNode, nextNode, hover);

  /* Hovering over the middle of a folder */
  if (node && node.isInternal && hover.inMiddle) {
    return {
      drop: dropAt(node.id, null),
      cursor: highlightCursor(node.id),
    };
  }

  /*
   * Now we only need to care about the node above the cursor
   * -----------                            -------
   */

  /* There is no node above the cursor line */
  if (!above) {
    return {
      drop: dropAt(below?.parentId || null, 0),
      cursor: lineCursor(0, 0),
    };
  }

  /* The node above the cursor line is an item */
  if (above.isLeaf) {
    const level = bound(hoverLevel, below?.level || 0, above.level);
    return {
      drop: walkUpFrom(above, level),
      cursor: lineCursor(above.rowIndex! + 1, level),
    };
  }

  /* The node above the cursor line is a closed folder */
  if (above.isClosed) {
    const level = bound(hoverLevel, below?.level || 0, above.level);
    return {
      drop: walkUpFrom(above, level),
      cursor: lineCursor(above.rowIndex! + 1, level),
    };
  }

  /* The node above the cursor line is an open folder with no children */
  if (isOpenWithEmptyChildren(above)) {
    const level = bound(hoverLevel, 0, above.level + 1);
    if (level > above.level) {
      /* Will be the first child of the empty folder */
      return {
        drop: dropAt(above.id, 0),
        cursor: lineCursor(above.rowIndex! + 1, level),
      };
    } else {
      /* Will be a sibling or grandsibling of the empty folder */
      return {
        drop: walkUpFrom(above, level),
        cursor: lineCursor(above.rowIndex! + 1, level),
      };
    }
  }

  /* The node above the cursor is a an open folder with children */
  return {
    drop: dropAt(above?.id, 0),
    cursor: lineCursor(above.rowIndex! + 1, above.level + 1),
  };
}
