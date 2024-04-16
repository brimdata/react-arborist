import { ShortcutAttrs } from "./types.js";

export const defaultShortcuts: ShortcutAttrs[] = [
  /* Keyboard Navigation */
  { key: "ArrowDown", command: "focusNext" },
  { key: "ArrowUp", command: "focusPrev" },
  { key: "ArrowLeft", command: "focusParent", when: "isLeaf || isClosed" },
  { key: "ArrowLeft", command: "close", when: "isOpen" },
  { key: "ArrowRight", command: "open", when: "isClosed" },
  { key: "ArrowRight", command: "focusNext", when: "isOpen" },
  { key: "Home", command: "focusFirst" },
  { key: "End", command: "focusLast" },
  { key: "PageDown", command: "focusNextPage" },
  { key: "PageUp", command: "focusPrevPage" },

  /* Tabbing Around */
  { key: "Tab", command: "focusOutsideNext" },
  { key: "Shift+Tab", command: "focusOutsidePrev" },

  /* CRUD */
  { key: "Backspace", command: "destroy" },
  { key: "a", command: "createLeaf" },
  { key: "Shift+A", command: "createInternal" },
  { key: "Enter", command: "edit" },

  /* Selection */
  { key: "Shift+ArrowUp", command: "moveSelectionStart" },
  { key: "Shift+ArrowDown", command: "moveSelectionEnd" },
  { key: " ", command: "toggle", when: "isInternal" },
  { key: " ", command: "select", when: "isLeaf" },
  { key: "Meta+a", command: "selectAll" },
  { key: "Control+a", command: "selectAll" },

  /* Opening */
  { key: "*", command: "openSiblings" },
];
