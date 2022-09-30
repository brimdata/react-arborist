import React, { createContext, useContext, useMemo } from "react";
import { TreeApi } from "./interfaces/tree-api";
import { IdObj } from "./types/utils";

export const TreeApiContext = createContext<TreeApi<any> | null>(null);

export function useTreeApi<T extends IdObj>() {
  const value = useContext<TreeApi<T> | null>(
    TreeApiContext as unknown as React.Context<TreeApi<T> | null>
  );
  if (value === null) throw new Error("No Tree Api Provided");
  return value;
}
