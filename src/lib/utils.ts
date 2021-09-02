import { Node, NodeModel } from "./types";
import { nanoid } from "nanoid";

export function bound(n: number, min: number, max: number) {
  return Math.max(Math.min(n, max), min);
}

export const isFolder = (node: Node<any>) => !!node.children;

export const isHiddenRoot = (node: Node) => node.id === "HIDDEN";
/**
 * Is first param a decendent of the second param
 */
export const isDecendent = (a: Node, b: Node) => {
  let n: Node | null = a;
  while (n) {
    if (n.id === b.id) return true;
    n = n.parent;
  }
  return false;
};

export const indexOf = (node: Node) => {
  if (!node.parent) throw Error("Node does not have a parent");
  return node.parent.children!.findIndex((c) => c.id === node.id);
};

export function enrichTree(model: NodeModel, hideRoot: boolean = false): Node {
  function visitSelfAndChildren(
    m: NodeModel,
    level: number,
    parent: Node | null
  ) {
    const n = createNode(m, level, parent, null);
    if (m.children) {
      n.children = m.children.map((child) =>
        visitSelfAndChildren(child, level + 1, n)
      );
    }
    return n;
  }
  return visitSelfAndChildren(model, hideRoot ? -1 : 0, null);
}

export function flattenTree(root: Node): Node[] {
  const list: Node[] = [];
  let index = 0;
  function collect(node: Node) {
    if (node.level >= 0) {
      node.rowIndex = index++;
      list.push(node);
    }
    if (node.isOpen) {
      node.children?.forEach(collect);
    }
  }
  collect(root);
  return list;
}

export function createNode(
  model: NodeModel,
  level: number,
  parent: Node | null,
  children: Node[] | null
): Node {
  return {
    id: model.id,
    level,
    parent,
    children,
    isOpen: !!model.isOpen,
    model,
    rowIndex: null,
  };
}

export function noop() {}

const gotLineage = `House Arryn
 Jon
  Robin
House Tully
 Hoster
  Lysa
  Edmure
  Catelyn
House Stark
 Rickard
  Brandon
  Eddard
   Robb
   Sansa
   Arya
   Brandon
   Rckon
  Benjen
  Lyanna
House Targaryen
 Aerys II (the Mad)
  Rhaegar
   Jon Snow
  Viserys
  Daenerys
House Baratheon
 Steffon
  Robert
  Stannis
   Shireen
  Renly
House Lanister
 Tywin
  Jaime
  Cersei
   Joffery
   Myrcella
   Tommen
  Tyrion
House Tyrell
 Olenna
  Mace
   Margaery
   Loras
House Martell
 Doran
  Trystane
 Elia
 Oberyn
  Sand Snakes
`;

export function makeTree(string: string) {
  const root = { id: "ROOT", isOpen: true };
  let prevNode = root;
  let prevLevel = -1;
  string.split("\n").forEach((line) => {
    const name = line.trimStart();
    const level = line.length - name.length;
    const diff = level - prevLevel;
    const node = { id: nanoid(), name, isOpen: true };
    if (diff === 1) {
      // First child
      //@ts-ignore
      node.parent = prevNode;
      //@ts-ignore
      prevNode.children = [node];
    } else {
      // Find the parent and go up
      //@ts-ignore
      let parent = prevNode.parent;
      for (let i = diff; i < 0; i++) {
        parent = parent.parent;
      }
      //@ts-ignore
      node.parent = parent;
      parent.children.push(node);
    }
    prevNode = node;
    prevLevel = level;
  });

  return root;
}
