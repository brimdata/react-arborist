import { createDefaultAccessors } from "./default-accessors";

export type SourceDataAccessors<T> = {
  id: (d: T) => string;
  children: (d: T) => T[] | null;
  isLeaf: (d: T) => boolean;
  sortBy: (d: T) => number | string | boolean;
  sortOrder: "asc" | "desc";
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
    return array.sort((a, b) => {
      const first = this.access.sortBy(a);
      const second = this.access.sortBy(b);

      if (this.asc) {
        return first < second ? -1 : 1;
      } else {
        return first > second ? -1 : 1;
      }
    });
  }

  get asc() {
    return this.access.sortOrder === "asc";
  }
}
