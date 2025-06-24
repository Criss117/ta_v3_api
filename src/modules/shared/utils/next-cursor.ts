export function calculateNextCursor<T>(data: T[], limit: number) {
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const lastItem = data[data.length - 1];

  return {
    items,
    hasMore,
    lastItem,
  };
}
