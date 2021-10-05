import { Accessor, IdObj, Node } from "../types";

function createNode<T extends IdObj>(
  model: T,
  level: number,
  parent: Node<T> | null,
  children: Node<T>[] | null,
  isOpen: boolean
): Node<T> {
  return {
    id: model.id,
    level,
    parent,
    children,
    isOpen,
    model,
    rowIndex: null,
  };
}

function access<T, R>(obj: T, accessor: Accessor<T, R>): R {
  if (typeof accessor === "string") {
    // @ts-ignore
    return obj[accessor];
  } else {
    return accessor(obj);
  }
}

export function enrichTree<T extends IdObj>(
  model: T,
  hideRoot: boolean = false,
  getChildren: Accessor<T, T[] | undefined> = "children",
  getIsOpen: Accessor<T, boolean> = "isOpen",
  openByDefault: boolean = true
): Node<T> {
  function visitSelfAndChildren(
    model: T,
    level: number,
    parent: Node<T> | null
  ) {
    const isOpen = access<T, boolean | undefined>(model, getIsOpen);
    const node = createNode<T>(
      model,
      level,
      parent,
      null,
      isOpen === undefined ? openByDefault : isOpen
    );
    const children = access<T, T[] | undefined>(model, getChildren);

    if (children) {
      node.children = children.map((child: T) =>
        visitSelfAndChildren(child, level + 1, node)
      );
    }
    return node;
  }

  return visitSelfAndChildren(model, hideRoot ? -1 : 0, null);
}
