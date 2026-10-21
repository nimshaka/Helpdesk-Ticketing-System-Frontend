export type PaginationItem = number | 'left-ellipsis' | 'right-ellipsis';

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
  maxItems: 5 | 7 = 7,
): PaginationItem[] {
  if (!totalPages || totalPages <= 1) return [];

  if (maxItems === 5) {
    if (totalPages <= 5) {
      const pages: PaginationItem[] = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const out: PaginationItem[] = [];

    if (currentPage <= 2) {
      out.push(1, 2, 3, 'right-ellipsis', totalPages);
      return out;
    }

    if (currentPage >= totalPages - 1) {
      out.push(1, 'left-ellipsis', totalPages - 2, totalPages - 1, totalPages);
      return out;
    }

    out.push(1, 'left-ellipsis', currentPage, 'right-ellipsis', totalPages);
    return out;
  }

  if (totalPages <= 6) {
    const pages: PaginationItem[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  const out: PaginationItem[] = [];

  if (currentPage <= 2) {
    out.push(1, 2, 3, 'right-ellipsis', totalPages - 2, totalPages - 1, totalPages);
    return out;
  }

  if (currentPage === 3) {
    out.push(1, 2, 3, 4, 'right-ellipsis', totalPages - 1, totalPages);
    return out;
  }

  if (currentPage >= totalPages - 1) {
    out.push(1, 2, 3, 'right-ellipsis', totalPages - 2, totalPages - 1, totalPages);
    return out;
  }

  if (currentPage === totalPages - 2) {
    out.push(1, 2, 'right-ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    return out;
  }

  out.push(
    1,
    'left-ellipsis',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'right-ellipsis',
    totalPages,
  );
  return out;
}
