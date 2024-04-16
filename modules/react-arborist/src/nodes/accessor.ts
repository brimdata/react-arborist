import { Accessors } from "./types.js";

export function createAccessor<T>(
  accessors: Partial<Accessors<T>>,
): Accessors<T> {
  return {
    ...createDefaultAccessors(),
    ...accessors,
  };
}

function createDefaultAccessors<T>(): Accessors<T> {
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
    initialize: ({ nodeType }) => {
      const data = {
        id: new Date().getTime().toString(),
        name: "",
      } as any;
      if (nodeType === "internal") data.children = [];
      return data;
    },
    sortBy: [],
    sortOrder: [],
  };
}
