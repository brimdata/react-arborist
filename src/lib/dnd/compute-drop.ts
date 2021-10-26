import { XYCoord } from "react-dnd";
import { Node } from "../types";
import { bound, indexOf, isFolder } from "../utils";

function measureHover(el: HTMLElement, offset: XYCoord) {
  const rect = el.getBoundingClientRect();
  const x = offset.x - Math.round(rect.x);
  const y = offset.y - Math.round(rect.y);
  const height = rect.height;
  const inTopHalf = y < height / 2;
  const inBottomHalf = !inTopHalf;
  const pad = height / 4;
  const inMiddle = y > pad && y < height - pad;

  return { x, inTopHalf, inBottomHalf, inMiddle };
}

type HoverData = ReturnType<typeof measureHover>;

function getNodesAroundCursor(
  node: Node | null,
  prev: Node | null,
  next: Node | null,
  hover: HoverData
): [Node | null, Node | null] {
  if (!node) {
    // We're hoving over the empty part of the list, not over an item,
    // Put the cursor below the last item which is "prev"
    return [prev, null];
  }

  if (isFolder(node)) {
    if (!hover.inMiddle && hover.inTopHalf) {
      return [prev, node];
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

type DropLocation = [Node | null, number];

function getDropLocation(
  nodeAboveCursor: Node,
  level: number,
  hover: HoverData
): DropLocation {
  let dropIndex = 0;
  let drop = nodeAboveCursor;
  let dropParent: Node | null = drop;

  if (!drop) {
    return [null, 0];
  }

  if (isFolder(drop) && drop.isOpen) {
    // keep args the same
  } else if (isFolder(drop) && hover.inMiddle) {
    // keep args the same
  } else {
    while (drop.parent && drop.level > level) {
      drop = drop.parent;
    }
    dropIndex = indexOf(drop) + 1;
    dropParent = drop.parent;
  }
  return [dropParent, dropIndex];
}

type Args = {
  element: HTMLElement;
  offset: XYCoord;
  indent: number;
  node: Node | null;
  prevNode: Node | null;
  nextNode: Node | null;
};

function getDropLevel(
  hovering: HoverData,
  aboveCursor: Node | null,
  belowCursor: Node | null,
  indent: number
) {
  const hoverLevel = Math.round(Math.max(0, hovering.x) / indent);
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

export function computeDrop({
  element,
  offset,
  indent,
  node,
  prevNode,
  nextNode,
}: Args) {
  const hovering = measureHover(element, offset);
  const [above, below] = getNodesAroundCursor(
    node,
    prevNode,
    nextNode,
    hovering
  );
  if (!above) {
    return {
      parentId: below?.parent?.id || null,
      index: 0,
      cursor: {
        parentId: below?.parent?.id || null,
        index: 0,
        level: 0,
      },
    };
  }
  const level = getDropLevel(hovering, above, below, indent);
  const [parent, index] = getDropLocation(above, level, hovering);
  // @ts-ignore
  const ret = {
    parentId: parent ? parent.id : null,
    index: index,
    cursor:
      parent && index === 0
        ? { parentId: parent ? parent.id : null, index: null, level: null }
        : {
            parentId: parent ? parent.id : null,
            index: above.rowIndex! + 1,
            level: level,
          },
  };
  return ret;
}
