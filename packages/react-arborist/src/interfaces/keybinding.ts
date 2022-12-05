import { commands, Command } from "./commands";

export type Keybinding = Record<string, keyof typeof commands>;

export const DEFAULT_KEYBINDING: Keybinding = {
  Backspace: "Delete",
  Tab: "FocusOutsideNext",
  "Tab+shift": "FocusOutsidePrev",
  "ArrowDown+meta": "SelectAndActivate",
  ArrowDown: "Next",
  ArrowUp: "Prev",
  ArrowRight: "Right",
  ArrowLeft: "Left",
  "a+meta": "SelectAll",
  a: "CreateLeaf",
  A: "CreateInternal",
  Home: "FocusFirst",
  End: "FocusLast",
  Enter: "Rename",
  " ": "SelectOrToggle",
  "*": "OpenSiblings",
  PageUp: "PageUp",
  PageDown: "PageDown",
};

export const filterFalseyToString = (key: unknown): key is string => !!key;

type KeysToControl = [string[], Command];

export const parseKeybinding = (keybinding: Keybinding): KeysToControl[] =>
  Object.keys(keybinding).reduce((acc, key) => {
    const keys = key.toLowerCase().split(/[ +]/g).filter(filterFalseyToString);
    acc.push([keys, commands[keybinding[key]]]);
    return acc;
  }, [] as KeysToControl[]);
