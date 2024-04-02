import { ShortcutAttrs } from "./types";

export const defaultShortcuts: ShortcutAttrs[] = [
  /* Arrow Navigation */
  { key: "ArrowDown", command: "focusNext" },
  { key: "ArrowUp", command: "focusPrev" },
  { key: "ArrowLeft", command: "focusParent", when: "isLeaf || isClosed" },
  { key: "ArrowLeft", command: "close", when: "isOpen" },
  { key: "ArrowRight", command: "open", when: "isClosed" },
  { key: "ArrowRight", command: "focusNext", when: "isOpen" },
  
  /* Tabbing Around */
  {key: "Tab", command: "focusOutsideNext"},
  {key: "Shift+Tab", command: "focusOutsidePrev"}

  // { key: "Backspace", command: "destroy" },
  // { key: "Tab", command: "focusNextOutside" },
  // { key: "Shift+Tab", command: "focusNextOutside" },
  // { key: "Shift+Tab", command: "focusNextOutside" },
  // { key: "Meta+ArrowDown", command: "activate" },
  // { key: "Shift+ArrowDown", command: "extendSelectionDown" },
  // { key: "Shift+ArrowUp", command: "extendSelectionUp" },
  // { key: "ArrowLeft", command: "close", when: "isOpen" },
  // { key: "ArrowLeft", command: "focusParent", when: "isLeaf || isClosed" },
  // { key: "ArrowRight", command: "focusChildren" },
  // { key: "Meta+A", command: "selectAll" },
  // { key: "Control+A", command: "selectAll" },
  // { key: "a", command: "createLeaf" },
  // { key: "Shift+A", command: "createInternal" },
  // { key: "Home", command: "focusFirst" },
  // { key: "End", command: "focusLast" },
  // { key: "Enter", command: "" },
];
