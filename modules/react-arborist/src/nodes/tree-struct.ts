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
    return this.root; // maybe this returns an array
  }

  create(args: { parentId: string | null; index: number; data: T }) {
    const { parentId, index, data } = args;
    const parent = parentId ? find(parentId, this.root) : this.root;
    if (!parent) return null;
    const siblings = this.accessor.getChildren(parent.data)!;

    siblings.splice(index, 0, data);
  }

  update(args: { id: string; changes: Partial<T> }) {
    const { id, changes } = args;
    const node = find(id, this.root);

    if (node) node.data = { ...node.data, ...changes };
  }

  move(args: { id: string; parentId: string | null; index: number }) {
    const { id, parentId, index } = args;
    const node = find(id, this.root);
    const parent = parentId ? find(parentId, this.root) : this.root;
    if (!node || !parent) return;
    const newSiblings = this.accessor.getChildren(parent.data)!;
    const oldSiblings = this.accessor.getChildren(node.parent!.data)!;
    const oldIndex = oldSiblings.indexOf(node.data);

    newSiblings.splice(index, 0, node.data); // Add to new parent
    oldSiblings.splice(oldIndex, 1); // Remove from old parent
  }

  destroy(args: { id: string }) {
    const node = find(args.id, this.root);
    if (!node) return;
    const siblings = this.accessor.getChildren(node.parent!.data)!;
    const index = siblings.indexOf(node.data);
    siblings.splice(index);
  }
}
