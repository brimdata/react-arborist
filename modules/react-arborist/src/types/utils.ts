export interface IdObj {
  id: string;
}

export type Identity = string | IdObj | null;

export type BoolFunc<T> = (data: T) => boolean;

export type PartialController<Value, Event> = {
  value: Value;
  onChange: (event: Event) => void;
};
