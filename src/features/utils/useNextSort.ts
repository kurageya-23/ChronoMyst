import { useMemo } from "react";

/** リストアイテムのソートの最新値を提供 */
export const useNextSort = (items: { sort: number }[]): number =>
  useMemo(() => {
    if (!items.length) return 1;
    return Math.max(...items.map((i) => i.sort)) + 1;
  }, [items]);
