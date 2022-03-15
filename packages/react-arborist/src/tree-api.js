import memoizeOne from "memoize-one";
import { flattenTree } from "./data/flatten-tree";
import { actions } from "./reducer";
export class TreeApi {
    constructor(dispatch, state, props, list) {
        this.dispatch = dispatch;
        this.state = state;
        this.props = props;
        this.list = list;
    }
    assign(dispatch, state, props, list) {
        this.dispatch = dispatch;
        this.state = state;
        this.props = props;
        this.list = list;
    }
    getNode(id) {
        if (id in this.idToIndex)
            return this.visibleNodes[this.idToIndex[id]] || null;
        else
            return null;
    }
    getSelectedIds() {
        return this.state.selection.ids;
    }
    edit(id) {
        this.dispatch(actions.edit(id ? id.toString() : null));
    }
    select(index, meta, shift) {
        this.dispatch(actions.select(index, meta, shift));
    }
    selectUpwards(shiftKey) {
        this.dispatch(actions.stepUp(shiftKey, this.visibleIds));
    }
    selectDownwards(shiftKey) {
        this.dispatch(actions.stepDown(shiftKey, this.visibleIds));
    }
    hideCursor() {
        this.dispatch(actions.setCursorLocation({ type: "none" }));
    }
    showCursor(cursor) {
        this.dispatch(actions.setCursorLocation(cursor));
    }
    scrollToId(id) {
        if (!this.list)
            return;
        const index = this.idToIndex[id];
        if (index) {
            this.list.scrollToItem(index, "start");
        }
        else {
            this.openParents(id);
            // This appears to be synchronous
            // But I've only tested it in the console and
            // not in an event handler which will be batched...
            // We may need to wrap this in a timeout or trigger an effect somehow
            setTimeout(() => {
                var _a;
                const index = this.idToIndex[id];
                if (index) {
                    (_a = this.list) === null || _a === void 0 ? void 0 : _a.scrollToItem(index, "start");
                }
            });
        }
    }
    open(id) {
        this.props.onToggle(id, true);
    }
    openParents(id) {
        const node = dfs(this.props.root, id);
        let parent = node === null || node === void 0 ? void 0 : node.parent;
        while (parent) {
            this.open(parent.id);
            parent = parent.parent;
        }
    }
    get visibleIds() {
        return getIds(this.visibleNodes);
    }
    get idToIndex() {
        return createIndex(this.visibleNodes);
    }
    get visibleNodes() {
        return createList(this.props.root);
    }
}
const getIds = memoizeOne((nodes) => nodes.map((n) => n.id));
const createIndex = memoizeOne((nodes) => {
    return nodes.reduce((map, node, index) => {
        map[node.id] = index;
        return map;
    }, {});
});
const createList = memoizeOne(flattenTree);
function dfs(node, id) {
    if (!node)
        return null;
    if (node.id === id)
        return node;
    if (node.children) {
        for (let child of node.children) {
            const result = dfs(child, id);
            if (result)
                return result;
        }
    }
    return null;
}
