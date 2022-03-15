import { useEffect } from "react";
export function useSelectionKeys(ref, api) {
    useEffect(() => {
        const el = ref.current;
        const cb = (e) => {
            if (e.code === "ArrowDown") {
                e.preventDefault();
                api.selectDownwards(e.shiftKey);
            }
            else if (e.code === "ArrowUp") {
                e.preventDefault();
                api.selectUpwards(e.shiftKey);
            }
        };
        el === null || el === void 0 ? void 0 : el.addEventListener("keydown", cb);
        return () => {
            el === null || el === void 0 ? void 0 : el.removeEventListener("keydown", cb);
        };
    }, [ref, api]);
}
