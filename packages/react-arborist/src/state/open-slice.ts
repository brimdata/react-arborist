/* Types */
export type OpenSlice = { [id: string]: boolean };

/* Actions */
export function open(id: string) {
  return { type: "OPEN" as const, id };
}

export function close(id: string) {
  return { type: "CLOSE" as const, id };
}

export function toggle(id: string) {
  return { type: "TOGGLE" as const, id };
}

/* Reducer */
export function reducer(
  state: OpenSlice = {},
  action:
    | ReturnType<typeof open>
    | ReturnType<typeof close>
    | ReturnType<typeof toggle>
) {
  if (action.type === "OPEN") {
    return { ...state, [action.id]: true };
  } else if (action.type === "CLOSE") {
    return { ...state, [action.id]: false };
  } else if (action.type === "TOGGLE") {
    const prev = state[action.id];
    return { ...state, [action.id]: !prev };
  } else {
    return state;
  }
}
