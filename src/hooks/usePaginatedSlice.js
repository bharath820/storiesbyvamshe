import { useCallback, useMemo, useState } from "react";

export function usePaginatedSlice(items, step = 12) {
  const [count, setCount] = useState(step);

  const visible = useMemo(() => items.slice(0, count), [items, count]);
  const hasMore = count < items.length;

  const loadMore = useCallback(() => {
    setCount((prev) => prev + step);
  }, [step]);

  const reset = useCallback(() => {
    setCount(step);
  }, [step]);

  return useMemo(
    () => ({ visible, hasMore, loadMore, reset }),
    [visible, hasMore, loadMore, reset]
  );
}
