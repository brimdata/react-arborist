import { toArray } from "../utils";
import { Comparator } from "./comparator";
import { Accessors } from "./types";

export class Sorter<T> {
  constructor(public access: Accessors<T>) {}

  sort(array: T[]) {
    const orders = toArray(this.access.sortOrder);
    const fields = toArray(this.access.sortBy);

    return array.sort((a, b) => {
      for (let i = 0; i < fields.length; i++) {
        const result = new Comparator(fields[i], orders[i]).compare(a, b);
        if (result !== 0) return result;
      }
      return 0;
    });
  }
}
