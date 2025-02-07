import { Press } from "./press.js";
import { Shortcut } from "./shortcut.js";
import { ShortcutAttrs } from "./types.js";

export class ShortcutManager<Context> {
  shortcuts: Shortcut<Context>[];

  constructor(shortcuts: ShortcutAttrs[]) {
    this.shortcuts = shortcuts.map((attrs) => new Shortcut<Context>(attrs));
  }

  find(event: KeyboardEvent, context: Context) {
    const press = new Press(event);
    return this.shortcuts
      .filter((shortcut) => press.isEqual(shortcut.key))
      .find((shortcut) => shortcut.matches(context));
  }
}
