import { TreeProps } from "../types/tree-props";
import { IdObj } from "../types/utils";

export function validateProps<T extends IdObj>(
  props: TreeProps<T>
): TreeProps<T> {
  return props;
}
