import {
  CreatePayload,
  DestroyPayload,
  MovePayload,
  UpdatePayload,
} from "../types/tree-props";
import { Accessor } from "./accessor";
import { NodeStruct, find } from "./node-struct";

/* We wrap and mutate the data provided */
export class TreeStruct<T> {
  constructor(
    public root: NodeStruct<T>,
    public accessor: Accessor<T>,
  ) {}

  get data() {
    return this.root.children?.map((node) => node.data);
  }

  get nodes() {
    return this.root.children;
  }

  create(args: CreatePayload<T>) {
    const { parentId, index, data } = args;
    const parent = parentId ? find(parentId, this.root) : this.root;
    if (!parent) return null;
    const siblings = this.accessor.getChildren(parent.data)!;

    siblings.splice(index, 0, data);
  }

  update(args: UpdatePayload<T>) {
    const { id, changes } = args;
    const node = find(id, this.root);

    if (node) node.data = { ...node.data, ...changes };
  }

  move(args: MovePayload<T>) {
    const { dragIds, parentId, index } = args;
    const parent = parentId ? find(parentId, this.root) : this.root;
    const nodes = dragIds
      .map((id) => find(id, this.root))
      .filter((node) => !!node) as NodeStruct<T>[];

    if (!parent || !nodes.length) return;
    // Add to new parent
    const newSiblings = this.accessor.getChildren(parent.data)!;
    const draggedData = nodes.map((node) => node.data);
    newSiblings.splice(index, 0, ...draggedData);

    // Remove from old parent
    for (const node of nodes) {
      const oldSiblings = this.accessor.getChildren(node.parent!.data)!;
      const oldIndex = oldSiblings.indexOf(node!.data);
      oldSiblings.splice(oldIndex, 1);
    }
  }

  destroy(args: DestroyPayload<T>) {
    const nodes = args.ids
      .map((id) => find(id, this.root))
      .filter((node) => !!node) as NodeStruct<T>[];

    for (const node of nodes) {
      const siblings = this.accessor.getChildren(node.parent!.data)!;
      const index = siblings.indexOf(node.data);
      siblings.splice(index);
    }
  }
}
