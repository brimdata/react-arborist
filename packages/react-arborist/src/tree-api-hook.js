import { useLayoutEffect, useMemo } from "react";
import { actions } from "./reducer";
import { TreeApi } from "./tree-api";
export function useTreeApi(state, dispatch, props, list) {
    /**
     * We only ever want one instance of the api object
     * It will get updated as the props change, but the
     * reference will not.
     */
    const api = useMemo(() => new TreeApi(dispatch, state, props, list), 
    // eslint-disable-next-line
    []);
    api.assign(dispatch, state, props, list);
    /**
     * This ensures that the selection remains correct even
     * after opening and closing a folders
     */
    useLayoutEffect(() => {
        dispatch(actions.setVisibleIds(api.visibleIds, api.idToIndex));
    }, [dispatch, api, props.root]);
    return api;
}
