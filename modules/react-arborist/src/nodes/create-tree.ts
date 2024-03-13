import { NodesOnChangeEvent } from "../types/tree-props";
import { Accessor, NodeDataAccessors } from "./accessor";
import { createRootNodeStruct } from "./root-node-struct";
import { TreeStruct } from "./tree-struct";

type Options<T> = NodeDataAccessors<T>;

export function createTree<T>(data: T[], options: Partial<Options<T>> = {}) {
  const accessor = new Accessor(options);
  const root = createRootNodeStruct(data, accessor);
  const tree = new TreeStruct(root, accessor);

  return {
    nodes: tree.nodes,
    handleChange: (event: NodesOnChangeEvent<T>) => {
      switch (event.type) {
        case "create":
          tree.create(event.payload);
          break;
        case "move":
          tree.move(event.payload);
          break;
        case "update":
          tree.update(event.payload);
          break;
        case "destroy":
          tree.destroy(event.payload);
          break;
      }
      return tree.data;
    },
  };
}
