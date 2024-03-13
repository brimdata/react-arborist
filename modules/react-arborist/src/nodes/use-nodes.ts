import { useEffect, useState } from "react";
import { Accessor, NodeDataAccessors } from "./accessor";
import { createRootNodeStruct } from "./root-node-struct";

type Options<T> = NodeDataAccessors<T>;

export function useNodes<T>(data: T[], options: Partial<Options<T>> = {}) {
  const accessor = new Accessor(options);
  const [value, set] = useState(() => createRootNodeStruct(data, accessor));

  useEffect(() => {
    set(createRootNodeStruct(data, accessor));
  }, [data]);

  return {
    value,
    set,
  };
}
