import { toArray } from "../utils";
import { createDefaultAccessors } from "./default-accessors";

type GetSortField<T> = (d: T) => number | string | boolean;
type SortOrder = "asc" | "desc";

export type SourceDataAccessors<T> = {
  id: (d: T) => string;
  children: (d: T) => T[] | null;
  isLeaf: (d: T) => boolean;
  sortBy: GetSortField<T> | GetSortField<T>[];
  sortOrder: SortOrder | SortOrder[];
};

export class SourceDataAccessor<T> {
  access: SourceDataAccessors<T>;

  constructor(accessors: Partial<SourceDataAccessors<T>> = {}) {
    this.access = { ...createDefaultAccessors(), ...accessors };
  }

  getId(d: T): string {
    return this.access.id(d);
  }

  getChildren(d: T): null | T[] {
    return this.access.children(d);
  }

  getIsLeaf(d: T): boolean {
    return this.access.isLeaf(d);
  }

  sort(array: T[]) {
    const orders = toArray(this.access.sortOrder);
    const compares = toArray(this.access.sortBy);

    return array.sort((a, b) => {
      for (let i = 0; i < compares.length; i++) {
        const comparator = this.createComparator(
          compares[i],
          orders[i] || "asc",
        );
        const result = comparator(a, b);
        if (result !== 0) return result;
      }
      return 0;
    });
  }

  get asc() {
    return this.access.sortOrder === "asc";
  }

  createComparator(getField: GetSortField<T>, sortOrder: SortOrder) {
    return (a: T, b: T) => {
      const first = getField(a);
      const second = getField(b);

      if (sortOrder === "asc") {
        if (first < second) return -1;
        if (first > second) return 1;
      } else {
        if (first < second) return 1;
        if (first > second) return -1;
      }
      return 0;
    };
  }
}
