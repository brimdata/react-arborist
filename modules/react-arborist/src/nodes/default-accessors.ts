import { SourceDataAccessors } from "./source-data-accessor";

export function createDefaultAccessors<T>(): SourceDataAccessors<T> {
  return {
    id: (d: T) => {
      if (d && typeof d === "object" && "id" in d) {
        return d.id as string;
      } else {
        throw new Error("No id found for node data. Specify an id accessor.");
      }
    },
    children: (d: T) => {
      if (d && typeof d === "object" && "children" in d) {
        return d.children as T[];
      } else {
        return null;
      }
    },
    isLeaf: (d: T) => {
      if (d && typeof d === "object" && "children" in d) {
        return false;
      } else {
        return true;
      }
    },
    sortBy: [],
    sortOrder: [],
  };
}
