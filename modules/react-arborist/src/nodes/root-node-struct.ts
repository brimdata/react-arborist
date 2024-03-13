import { Accessor } from "./accessor";
import { NodeStruct, createNodeStruct } from "./node-struct";

export const ROOT_ID = "__REACT_ARBORIST_INTERNAL_ROOT__";

export function createRootNodeStruct<T>(data: T[], accessor: Accessor<T>) {
  const root: NodeStruct<T> = {
    id: ROOT_ID,
    data: null as unknown as T,
    level: -1,
    isLeaf: false,
    parent: null,
    children: null,
  };
  root.children = data.map((child) =>
    createNodeStruct({ data: child, parent: root, level: 0, accessor }),
  );
  return root;
}
