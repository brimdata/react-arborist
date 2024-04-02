import test from "node:test";
import { parse } from "../build/parser.js";

const inputs = [
  "abc123",
  "isLeaf",
  "55",
  "1== 2",
  "isLeaf != true",
  "you <= me",
  "you > me && me < you",
  "you >= me",
  "you != me",
  "me == you",
  "me && you",
  "you || me",
  "1 + 1",
  "1 - 1",
  "2 * 4",
  "4/4",
  "(1 + 1) * 2",
  "1 + 1 * 2",
  'name == "james"',
  "isLeaf || isOpen || isClosed",
  "isClosed",
];

for (const input of inputs) {
  test(`parses ${input}`, () => {
    console.log(input, parse(input));
  });
}
