import { RowStruct } from "../nodes/flatten";

export const createIndex = <T>(rows: RowStruct<T>[]) => {
  return rows.reduce<{ [id: string]: number }>((map, row, index) => {
    map[row.node.id] = index;
    return map;
  }, {});
};
