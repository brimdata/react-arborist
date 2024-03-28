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
    accessors: Partial<SourceDataAccessors<T>>,
  ) {
    this.accessor = new SourceDataAccessor(accessors);
    this.nodes = this.accessor.sort(sourceData).map((data) => {
      return new SourceDataProxy(null, data, this.accessor);
    });
  }

  create(args: { parentId: string | null; index: number; data: T }) {
    const { parentId, index, data } = args;
    if (!parentId) {
      this.insertChildren(index, data);
    } else {
      this.find(parentId)?.insertChildren(index, data);
    }
  }

  update(args: { id: string; changes: Partial<T> }) {
    const { id, changes } = args;
    const target = this.find(id);
    if (target) {
      target.update(changes);
    }
  }

  move(args: {
    sourceIds: string[];
    targetParentId: string | null;
    targetIndex: number;
  }) {
    const { sourceIds, targetParentId, targetIndex } = args;
    const sourceData = this.findAll(sourceIds).map((d) => d.sourceData);
    if (!targetParentId) {
      this.destroy({ ids: sourceIds });
      this.insertChildren(targetIndex, ...sourceData);
    } else {
      const parent = this.find(targetParentId);
      if (parent) {
        this.destroy({ ids: sourceIds });
        parent.insertChildren(targetIndex, ...sourceData);
      }
    }
  }

  destroy(args: { ids: string[] }) {
    for (const node of this.findAll(args.ids)) {
      const parent = node.parent;
      if (!parent) {
        this.deleteChild(node.sourceData);
      } else {
        parent.deleteChild(node.sourceData);
      }
    }
  }

  findAll(ids: string[]) {
    return ids
      .map((id) => this.find(id))
      .filter((node) => !!node) as SourceDataProxy<T>[];
  }

  find(id: string) {
    for (let cursor of this.nodes) {
      const found = this.findNodeObject(id, cursor);
      if (found) return found;
    }
    return null;
  }

  findNodeObject(
    id: string,
    cursor: SourceDataProxy<T>,
  ): SourceDataProxy<T> | null {
    if (!cursor) {
      return null;
    } else if (cursor.id === id) {
      return cursor;
    } else if (cursor.children) {
      for (let child of cursor.children) {
        const found = this.findNodeObject(id, child);
        if (found) return found;
      }
      return null;
    } else {
      return null;
    }
  }

  insertChildren(index: number, ...data: T[]) {
    this.sourceData.splice(index, 0, ...data);
  }

  deleteChild(data: T) {
    const index = this.sourceData.indexOf(data);
    this.sourceData.splice(index, 1);
  }
}
