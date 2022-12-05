import { TreeApi } from "../interfaces/tree-api";

export type BindingFunctions<T extends any> = Pick<TreeApi<T>, "create">;

export type Keybindings<T extends any> = Record<
  string,
  keyof BindingFunctions<T>
>;
