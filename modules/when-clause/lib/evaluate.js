import { parse } from "../build/parser.js";

export function evaluate(script, variables = {}) {
  const tree = parse(script);
  const evaluator = new Evaluator(variables);
  return evaluator.eval(tree);
}

class Evaluator {
  constructor(variables = {}) {
    this.variables = variables;
  }

  eval(node) {
    if ("op" in node) {
      return this.op(node);
    } else {
      return this.value(node);
    }
  }

  op({ left, op, right }) {
    switch (op) {
      case "+":
        return this.eval(left) + this.eval(right);
      case "-":
        return this.eval(left) - this.eval(right);
      case "*":
        return this.eval(left) * this.eval(right);
      case "/":
        return this.eval(left) / this.eval(right);

      case "||":
        return this.eval(left) || this.eval(right);
      case "&&":
        return this.eval(left) && this.eval(right);

      case "==":
        return this.eval(left) == this.eval(right);
      case "!=":
        return this.eval(left) != this.eval(right);

      case ">":
        return this.eval(left) > this.eval(right);
      case ">=":
        return this.eval(left) >= this.eval(right);
      case "<":
        return this.eval(left) < this.eval(right);
      case "<=":
        return this.eval(left) <= this.eval(right);
    }
    throw new Error("Unknown Operation '" + op + "'");
  }

  value({ type, value }) {
    switch (type) {
      case "int":
        return parseInt(value);
      case "var":
        return this.getVar(value);
      case "bool":
        return value === "true";
    }
    throw new Error("Unknown Type '" + type + "'");
  }

  getVar(name) {
    if (name in this.variables) {
      return this.variables[name];
    } else {
      throw new Error("Unknown Variable '" + name + "'");
    }
  }
}
