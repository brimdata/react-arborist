import { FixedSizeList } from "react-window";
import { useDataUpdates, useTreeApi } from "../context";
import { ListOuterElement } from "./list-outer-element";
import { ListInnerElement } from "./list-inner-element";
import { RowContainer } from "./row-container";
import { SearchForNode } from "../interfaces/commands";
import {
  parseKeybinding,
  filterFalseyToString,
} from "../interfaces/keybinding";

/**
 * All these keyboard shortcuts seem like they should be configurable.
 * Each operation should be a given a name and separated from
 * the event handler. Future clean up welcome.
 */
export function DefaultContainer() {
  useDataUpdates();
  const tree = useTreeApi();
  return (
    <div
      style={{
        height: tree.height,
        width: tree.width,
        minHeight: 0,
        minWidth: 0,
      }}
      onContextMenu={tree.props.onContextMenu}
      onClick={tree.props.onClick}
      tabIndex={0}
      onFocus={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          tree.onFocus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          tree.onBlur();
        }
      }}
      onKeyDown={(e) => {
        if (tree.isEditing) {
          return;
        }

        const keybinding = tree.keybinding;

        const keysToControls = parseKeybinding(keybinding);

        const currentKeys = [
          e.key,
          e.shiftKey ? "shift" : false,
          e.metaKey ? "meta" : false,
        ].filter(filterFalseyToString);

        const matches = keysToControls.filter((keysToControl) => {
          const keys = keysToControl[0];
          return (
            keys.length === currentKeys.length &&
            keys.every((key) => currentKeys.includes(key))
          );
        });

        if (matches.length > 0) {
          e.preventDefault();
          matches.forEach((match) => {
            const control = match[1];
            control(tree, e);
          });
        } else {
          SearchForNode(tree, e);
        }
      }}
    >
      <FixedSizeList
        className={tree.props.className}
        outerRef={tree.listEl}
        itemCount={tree.visibleNodes.length}
        height={tree.height}
        width={tree.width}
        itemSize={tree.rowHeight}
        itemKey={(index) => tree.visibleNodes[index]?.id || index}
        outerElementType={ListOuterElement}
        innerElementType={ListInnerElement}
        onScroll={tree.props.onScroll}
        onItemsRendered={tree.onItemsRendered.bind(tree)}
        ref={tree.list}
      >
        {RowContainer}
      </FixedSizeList>
    </div>
  );
}
