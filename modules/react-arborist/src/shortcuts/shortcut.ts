import { ShortcutAttrs } from "./types.js";
import { evaluate } from "when-clause";

export class Shortcut<Context> {
  constructor(public attrs: ShortcutAttrs) {}

  get key() {
    return this.attrs.key;
  }

  get command() {
    return this.attrs.command;
  }

  get when() {
    return this.attrs.when;
  }

  matches(context: Context) {
    const { when } = this;
    if (!when) return true;
    return evaluate(when, context);
  }
}
