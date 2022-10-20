import { AnyAction } from "redux";
import { NodeApi } from "../interfaces/node-api";

export interface IdObj {
  id: string;
}

export type Identity = string | IdObj | null;

// Forward ref can't forward generics without this little re-declare
// https://fettblog.eu/typescript-react-generic-forward-refs/
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<T>) => React.ReactElement | null;
}

export type BoolFunc<T> = (data: T) => boolean;

export type ActionTypes<
  Actions extends { [name: string]: (...args: any[]) => AnyAction }
> = ReturnType<Actions[keyof Actions]>;

export type SelectOptions = { multi?: boolean; contiguous?: boolean };

export type NodesById<T extends IdObj> = { [id: string]: NodeApi<T> };
