import * as nodes from "../types/nodes-partial-controller";
import {
  SourceDataAccessor,
  SourceDataAccessors,
} from "./source-data-accessor";
import { SourceDataProxy } from "./source-data-proxy";

export class TreeManager<T> {
  nodes: SourceDataProxy<T>[];
  accessor: SourceDataAccessor<T>;

  constructor(
    public sourceData: T[],
    public accessors: SourceDataAccessors<T>,
  ) {
    this.accessor = new SourceDataAccessor(accessors);
    this.nodes = sourceData.map((data) => {
      return new SourceDataProxy(null, data, this.accessor);
    });
  }

  create(args: nodes.CreatePayload<T>) {
    const { parentId, index, data } = args;
    const parent = parentId ? find(parentId, this.root) : this.root;
    if (!parent) return null;
    const siblings = this.accessor.getChildren(parent.data)!;

    siblings.splice(index, 0, data);
  }

  update(args: nodes.UpdatePayload<T>) {
    const { id, changes } = args;
    const node = find(id, this.root);

    if (node) node.data = { ...node.data, ...changes };
  }

  move(args: nodes.MovePayload<T>) {
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

  destroy(args: nodes.DestroyPayload<T>) {
    const nodes = args.ids
      .map((id) => find(id, this.root))
      .filter((node) => !!node) as NodeStruct<T>[];

    for (const node of nodes) {
      const siblings = this.accessor.getChildren(node.parent!.data)!;
      const index = siblings.indexOf(node.data);
      siblings.splice(index);
    }
  }

  findNodeObject(id: string) {
    
  }

  find(id: string, cursor?: SourceDataProxy<T>): SourceDataProxy<T> | null {
    if (!cursor) return null;
    if (current.id === id) return current;
    if (current.children) {
      for (let child of current.children) {
        const found = find(id, child);
        if (found) return found;
      }
      return null;
    }
    return null;
  }
}
