import { createAccessor } from "./accessor.js";
import { NodeModel } from "./node-model.js";
import { RootNodeModel } from "./root-node-model.js";
import { Accessors, NodeType } from "./types.js";

export class TreeModel<T> {
  root: RootNodeModel<T>;
  nodes: NodeModel<T>[];
  access: Accessors<T>;

  constructor(
    public sourceData: T[],
    accessors: Partial<Accessors<T>>,
  ) {
    this.access = createAccessor(accessors);
    this.root = new RootNodeModel<T>(this.sourceData, this.access);
    this.nodes = this.root.children!;
  }

  initialize(args: { nodeType: NodeType }): T {
    return this.access.initialize(args);
  }

  create(args: { parentId: string | null; index: number; data: T }) {
    this.findParent(args.parentId)?.insertChildren(args.index, args.data);
  }

  update(args: { id: string; changes: Partial<T> }) {
    this.find(args.id)?.update(args.changes);
  }

  move(args: {
    sourceIds: string[];
    targetParentId: string | null;
    targetIndex: number;
  }) {
    const sourceNodes = this.findAll(args.sourceIds);
    const targetParent = this.findParent(args.targetParentId);
    if (!targetParent) return;
    targetParent.insertChildren(
      args.targetIndex,
      ...sourceNodes.map((node) => node.sourceData),
    );
    sourceNodes.forEach((node) => node.drop());
  }

  destroy(args: { ids: string[] }) {
    this.findAll(args.ids).forEach((node) => node.drop());
  }

  find(id: string) {
    for (let cursor of this.nodes) {
      const found = this.recursiveFind(id, cursor);
      if (found) return found;
    }
    return null;
  }

  findAll(ids: string[]) {
    return ids
      .map((id) => this.find(id))
      .filter((node) => !!node) as NodeModel<T>[];
  }

  findParent(id: string | null) {
    if (id === null) return this.root;
    else return this.find(id);
  }

  recursiveFind(id: string, cursor: NodeModel<T>): NodeModel<T> | null {
    if (!cursor) return null;
    if (cursor.id === id) return cursor;
    for (let child of cursor.children ?? []) {
      const found = this.recursiveFind(id, child);
      if (found) return found;
    }
    return null;
  }
}
