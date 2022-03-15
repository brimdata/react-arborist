export function bound(n, min, max) {
    return Math.max(Math.min(n, max), min);
}
export const isFolder = (node) => !!node.children;
export function isItem(node) {
    return node && !isFolder(node);
}
export function isClosed(node) {
    return node && isFolder(node) && !node.isOpen;
}
/**
 * Is first param a decendent of the second param
 */
export const isDecendent = (a, b) => {
    let n = a;
    while (n) {
        if (n.id === b.id)
            return true;
        n = n.parent;
    }
    return false;
};
export const indexOf = (node) => {
    // This should probably not throw an error, but instead return null
    if (!node.parent)
        throw Error("Node does not have a parent");
    return node.parent.children.findIndex((c) => c.id === node.id);
};
export function noop() { }
