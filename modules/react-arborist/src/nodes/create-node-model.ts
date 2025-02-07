import { NodeModel } from "./node-model.js";
import { Sorter } from "./sorter.js";
import { Accessors } from "./types.js";

export function createNodeModel<T>(
  parent: NodeModel<T>,
  sourceData: T,
  access: Accessors<T>,
) {
  const node = new NodeModel<T>({
    id: access.id(sourceData),
    level: parent.level + 1,
    isLeaf: access.isLeaf(sourceData),
    sourceData,
    sourceChildren: access.children(sourceData),
    parent,
    children: null /* for now until later */,
    access,
  });
  node.attrs.children = createChildren(
    node,
    access.children(sourceData),
    access,
  );
  return node;
}

export function createChildren<T>(
  parent: NodeModel<T>,
  sourceArray: T[] | null,
  access: Accessors<T>,
) {
  if (!sourceArray) return null;
  return new Sorter(access)
    .sort(sourceArray)
    .map((sourceData) => createNodeModel(parent, sourceData, access));
}
