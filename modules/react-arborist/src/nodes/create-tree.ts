import { useEffect, useState } from "react";
import { Accessor, NodeDataAccessors } from "./accessor";
import { createRootNodeStruct } from "./root-node-struct";
import { TreeStruct } from "./tree-struct";

type Options<T> = NodeDataAccessors<T>;

export function createTree<T>(data: T[], options: Partial<Options<T>> = {}) {
  const accessor = new Accessor(options);
  const root = createRootNodeStruct(data, accessor));
  const tree =  new TreeStruct(root, accessor)

  return {
    nodes: tree.nodes
  }
}
