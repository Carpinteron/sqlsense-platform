import { useMemo, useState } from 'react';

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const paginated = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize, totalPages]);

  const goToPage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const resetPage = () => setPage(1);

  return {
    page: Math.min(page, totalPages),
    totalPages,
    paginated,
    goToPage,
    resetPage,
    pageSize,
    total: items.length,
  };
}
