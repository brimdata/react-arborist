import { GetSortField, SortOrder } from "./types.js";

export class Comparator<T> {
  constructor(
    public getField: GetSortField<T>,
    public order: SortOrder = "asc",
  ) {}

  compare(a: T, b: T) {
    const first = this.getField(a);
    const second = this.getField(b);

    if (this.order === "asc") {
      if (first < second) return -1;
      if (first > second) return 1;
    } else {
      if (first < second) return 1;
      if (first > second) return -1;
    }
    return 0;
  }
}
