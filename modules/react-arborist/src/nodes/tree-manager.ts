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
    if (!parentId) {
      this.insertChildren(index, data);
    } else {
      this.find(parentId)?.insertChildren(index, data);
    }
  }

  update(args: nodes.UpdatePayload<T>) {
    const { id, changes } = args;
    this.find(id)?.update(changes);
  }

  move(args: nodes.MovePayload<T>) {
    const { dragIds, parentId, index } = args;
    const draggedData = this.findAll(dragIds).map((d) => d.sourceData);
    if (!parentId) {
      this.insertChildren(index, ...draggedData);
      this.destroy({ ids: dragIds });
    } else {
      const parent = this.find(parentId);
      if (parent) {
        parent.insertChildren(index, ...draggedData);
        this.destroy({ ids: dragIds });
      }
    }
  }

  destroy(args: nodes.DestroyPayload<T>) {
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
    return this.nodes.find((nodeObject) => this.findNodeObject(id, nodeObject));
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
