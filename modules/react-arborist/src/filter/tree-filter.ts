import { NodeObject } from "../nodes/types.js";
import { matchesStringProperties } from "./match.js";
import { FilterOptions } from "./use-filter.js";

type BoolMap = Record<string, boolean>;

export class TreeFilter<T> {
  term: string;
  isMatch: (node: NodeObject<T>, term: string) => boolean;

  constructor(opts: FilterOptions<T>) {
    this.term = (opts.term || "").trim();
    this.isMatch = opts.isMatch || matchesStringProperties;
  }

  get isPresent() {
    return this.term.length > 0;
  }

  getVisibility(nodes: NodeObject<T>[], value: BoolMap = {}) {
    for (const node of nodes) {
      if (this.isMatch(node, this.term)) {
        for (const id of [node.id, ...this.ancestorIds(node)]) {
          value[id] = true;
        }
      } else {
        value[node.id] = false;
      }
      if (node.children) this.getVisibility(node.children, value);
    }
    return value;
  }

  ancestorIds(node: NodeObject<T>) {
    const ids = [];
    let parent = node.parent;
    while (parent) {
      ids.push(parent.id);
      parent = parent.parent;
    }
    return ids;
  }
}
