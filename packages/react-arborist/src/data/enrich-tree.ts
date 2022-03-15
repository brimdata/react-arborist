import { TreeProps, IdObj, Node } from "../types";

function createNode<T extends IdObj>(
  model: T,
  level: number,
  parent: Node<T> | null,
  children: Node<T>[] | null,
  isOpen: boolean,
  isDraggable: boolean,
  isDroppable: boolean
): Node<T> {
  return {
    id: model.id,
    level,
    parent,
    children,
    isOpen,
    isDraggable,
    isDroppable,
    model,
    rowIndex: null,
  };
}

function access(obj: any, accessor: string | boolean | Function) {
  if (typeof accessor === "boolean") {
    return accessor;
  }

  if (typeof accessor === "string") {
    return obj[accessor];
  }

  return accessor(obj);
}

export function enrichTree<T extends IdObj>(
  model: T,
  hideRoot: boolean = false,
  getChildren: TreeProps<T>["getChildren"] = "children",
  isOpen: TreeProps<T>["isOpen"] = "isOpen",
  disableDrag: TreeProps<T>["disableDrag"] = false,
  disableDrop: TreeProps<T>["disableDrop"] = false,
  openByDefault: boolean = true
): Node<T> {
  function visitSelfAndChildren(
    model: T,
    level: number,
    parent: Node<T> | null
  ) {
    const open = access(model, isOpen) as boolean;
    const draggable = !access(model, disableDrag) as boolean;
    const droppable = !access(model, disableDrop) as boolean;
    const node = createNode<T>(
      model,
      level,
      parent,
      null,
      open === undefined ? openByDefault : open,
      draggable,
      droppable
    );
    const children = access(model, getChildren) as T[];

    if (children) {
      node.children = children.map((child: T) =>
        visitSelfAndChildren(child, level + 1, node)
      );
    }
    return node;
  }

  return visitSelfAndChildren(model, hideRoot ? -1 : 0, null);
}
