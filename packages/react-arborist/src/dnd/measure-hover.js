import { bound } from "../utils";
export function measureHover(el, offset, indent) {
    const nextEl = el.nextElementSibling;
    const prevEl = el.previousElementSibling;
    const rect = el.getBoundingClientRect();
    const x = offset.x - Math.round(rect.x);
    const y = offset.y - Math.round(rect.y);
    const height = rect.height;
    const inTopHalf = y < height / 2;
    const inBottomHalf = !inTopHalf;
    const pad = height / 4;
    const inMiddle = y > pad && y < height - pad;
    const maxLevel = Number(inBottomHalf ? el.dataset.level : prevEl ? prevEl.dataset.level : 0);
    const minLevel = Number(inTopHalf ? el.dataset.level : nextEl ? nextEl.dataset.level : 0);
    const level = bound(Math.floor(x / indent), minLevel, maxLevel);
    return { level, inTopHalf, inBottomHalf, inMiddle };
}
