function createNode(model, level, parent, children, isOpen, isDraggable, isDroppable) {
    return {
        id: model.id,
        level,
        parent,
        children,
        isOpen,
        isDraggable,
        isDroppable,
        model,
        rowIndex: null,
    };
}
function access(obj, accessor) {
    if (typeof accessor === "boolean") {
        return accessor;
    }
    if (typeof accessor === "string") {
        return obj[accessor];
    }
    return accessor(obj);
}
export function enrichTree(model, hideRoot = false, getChildren = "children", isOpen = "isOpen", disableDrag = false, disableDrop = false, openByDefault = true) {
    function visitSelfAndChildren(model, level, parent) {
        const open = access(model, isOpen);
        const draggable = !access(model, disableDrag);
        const droppable = !access(model, disableDrop);
        const node = createNode(model, level, parent, null, open === undefined ? openByDefault : open, draggable, droppable);
        const children = access(model, getChildren);
        if (children) {
            node.children = children.map((child) => visitSelfAndChildren(child, level + 1, node));
        }
        return node;
    }
    return visitSelfAndChildren(model, hideRoot ? -1 : 0, null);
}
