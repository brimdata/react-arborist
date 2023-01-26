import { XYCoord } from "react-dnd";
import { NodeApi } from "../interfaces/node-api";
import { bound, indexOf, isClosed, isItem } from "../utils";
import { DropResult } from "./drop-hook";

function measureHover(el: HTMLElement, offset: XYCoord) {
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

type HoverData = ReturnType<typeof measureHover>;

function getNodesAroundCursor(
  node: NodeApi | null,
  prev: NodeApi | null,
  next: NodeApi | null,
  hover: HoverData
): [NodeApi | null, NodeApi | null] {
  if (!node) {
    // We're hoving over the empty part of the list, not over an item,
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

type Args = {
  element: HTMLElement;
  offset: XYCoord;
  indent: number;
  node: NodeApi | null;
  prevNode: NodeApi | null;
  nextNode: NodeApi | null;
};

function getDropLevel(
  hovering: HoverData,
  aboveCursor: NodeApi | null,
  belowCursor: NodeApi | null,
  indent: number
) {
  const hoverLevel = Math.round(Math.max(0, hovering.x - indent) / indent);
  let min, max;
  if (!aboveCursor) {
    max = 0;
    min = 0;
  } else if (!belowCursor) {
    max = aboveCursor.level;
    min = 0;
  } else {
    max = aboveCursor.level;
    min = belowCursor.level;
  }

  return bound(hoverLevel, min, max);
}

export type ComputedDrop = {
  drop: DropResult | null;
  cursor: Cursor | null;
};

function dropAt(parentId: string | undefined, index: number): DropResult {
  return { parentId: parentId || null, index };
}

function lineCursor(index: number, level: number) {
  return {
    type: "line" as "line",
    index,
    level,
  };
}

function noCursor() {
  return {
    type: "none" as "none",
  };
}

function highlightCursor(id: string) {
  return {
    type: "highlight" as "highlight",
    id,
  };
}

function walkUpFrom(node: NodeApi, level: number) {
  let drop = node;
  while (drop.parent && drop.level > level) {
    drop = drop.parent;
  }
  const parentId = drop.parent?.id || null;
  const index = indexOf(drop) + 1;
  return { parentId, index };
}

export type LineCursor = ReturnType<typeof lineCursor>;
export type NoCursor = ReturnType<typeof noCursor>;
export type HighlightCursor = ReturnType<typeof highlightCursor>;
export type Cursor = LineCursor | NoCursor | HighlightCursor;

/**
 * This is the most complex, tricky function in the whole repo.
 * It could be simplified and made more understandable.
 */
export function computeDrop(args: Args): ComputedDrop {
  const hover = measureHover(args.element, args.offset);
  const { node, nextNode, prevNode } = args;
  const [above, below] = getNodesAroundCursor(node, prevNode, nextNode, hover);

  /* Hovering over the middle of a folder */
  if (node && node.isInternal && hover.inMiddle) {
    return {
      drop: dropAt(node.id, 0),
      cursor: highlightCursor(node.id),
    };
  }

  /* At the top of the list */
  if (!above) {
    return {
      drop: dropAt(below?.parent?.id, 0),
      cursor: lineCursor(0, 0),
    };
  }

  /* The above node is an item or a closed folder */
  if (isItem(above) || isClosed(above)) {
    const level = getDropLevel(hover, above, below, args.indent);
    return {
      drop: walkUpFrom(above, level),
      cursor: lineCursor(above.rowIndex! + 1, level),
    };
  }

  /* The above node is an open folder */
  return {
    drop: dropAt(above?.id, 0),
    cursor: lineCursor(above.rowIndex! + 1, above.level + 1),
  };
}
