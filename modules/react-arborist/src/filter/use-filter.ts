import { useState } from "react";
import { OpensOnChangeEvent, OpensState } from "../opens/types.js";
import { TreeFilter } from "./tree-filter.js";
import { NodeObject } from "../nodes/types.js";

export type FilterOptions<T> = {
  term?: string;
  isMatch?: (node: NodeObject<T>, term: string) => boolean;
  openByDefault?: (isFiltered: boolean) => boolean;
};

export function useFilter<T>(
  nodes: NodeObject<T>[],
  options: FilterOptions<T> = {},
) {
  const filter = new TreeFilter(options);
  const [opens, setOpens] = useState<OpensState>({});
  const [filteredOpens, setFilteredOpens] = useState<OpensState>({});

  return {
    visible: {
      value: filter.isPresent ? filter.getVisibility(nodes) : {},
      onChange: () => {},
    },
    opens: {
      value: filter.isPresent ? filteredOpens : opens,
      onChange: (e: OpensOnChangeEvent) => {
        filter.isPresent ? setFilteredOpens(e.value) : setOpens(e.value);
      },
    },
    openByDefault: options.openByDefault
      ? options.openByDefault(filter.isPresent)
      : true,
  };
}
