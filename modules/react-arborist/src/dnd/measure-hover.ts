import { XY } from "./types.js";

export function measureHover(
  el: HTMLElement,
  offset: XY,
  direction: "ltr" | "rtl",
) {
  const rect = el.getBoundingClientRect();
  const x = direction === "ltr" ? offset.x : rect.width - offset.x;
  const y = offset.y;
  const height = rect.height;
  const inTopHalf = y < height / 2;
  const inBottomHalf = !inTopHalf;
  const pad = height / 4;
  const inMiddle = y > pad && y < height - pad;
  const atTop = !inMiddle && inTopHalf;
  const atBottom = !inMiddle && inBottomHalf;

  const result = { x, inTopHalf, inBottomHalf, inMiddle, atTop, atBottom };
  return result;
}

export type HoverData = ReturnType<typeof measureHover>;
