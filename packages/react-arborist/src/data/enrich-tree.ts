import { TreeProps, IdObj, Node } from "../types";
import { withDefault } from "../utils";

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
    const isDraggable = !access(model, disableDrag) as boolean;
    const isDroppable = !access(model, disableDrop) as boolean;
    const children = access(model, getChildren) as T[];
    const open = access(model, isOpen);
    const isFolder = !!children;

    const node: Node<T> = {
      id: model.id,
      model,
      level,
      parent,
      children: null,
      isFolder: !!children,
      isRoot: parent === null,
      isOpen: isFolder && withDefault(open, openByDefault),
      isDraggable,
      isDroppable,
      rowIndex: null,
    };

    if (children) {
      node.children = children.map((child: T) =>
        visitSelfAndChildren(child, level + 1, node)
      );
    }

    return node;
  }

  return visitSelfAndChildren(model, hideRoot ? -1 : 0, null);
}
