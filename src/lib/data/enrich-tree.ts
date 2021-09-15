import { IdObj, Node } from "../types";

const defaultGetIsOpen = (m: any) => m.isOpen as boolean;
const defaultGetChildren = <T>(m: any) => m.children as T[] | undefined;

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

export function enrichTree<T extends IdObj>(
  model: T,
  hideRoot: boolean = false,
  getChildren: (m: T) => T[] | undefined = defaultGetChildren,
  getIsOpen: (m: T) => boolean = defaultGetIsOpen
): Node<T> {
  function visitSelfAndChildren(
    model: T,
    level: number,
    parent: Node<T> | null
  ) {
    const isOpen = getIsOpen(model);
    const node = createNode<T>(model, level, parent, null, isOpen);
    const children = getChildren(model);

    if (children) {
      node.children = children.map((child: T) =>
        visitSelfAndChildren(child, level + 1, node)
      );
    }
    return node;
  }

  return visitSelfAndChildren(model, hideRoot ? -1 : 0, null);
}
