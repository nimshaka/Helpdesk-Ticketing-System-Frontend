'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import Pagination from '@/components/shared/Pagination';
import type { TableColumn } from '@/components/shared/DataTable';

export interface DataCardProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  titleClassName?: string;
  count?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  rowKey?: (row: T, index: number) => string | number;
  onCardClick?: (row: T) => void;
  className?: string;
  showPagination?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  isFiltered?: boolean;
  emptyFilteredTitle?: string;
  emptyFilteredDescription?: string;
  showFirstColumnLabel?: boolean;
  pageSize?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card-bg p-4 space-y-3">
          <div className="h-4 w-1/2 animate-pulse rounded bg-border" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-border" />
          <div className="h-3 w-2/3 animate-pulse rounded bg-border" />
        </div>
      ))}
    </div>
  );
}

export default function DataCard<T = Record<string, unknown>>({
  data,
  columns,
  title,
  titleClassName,
  count,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  rowKey = (_, index) => index,
  onCardClick,
  className = '',
  showPagination = true,
  emptyTitle = 'No data found.',
  emptyDescription = 'No items to display.',
  emptyIcon,
  isLoading = false,
  isError = false,
  errorMessage,
  isFiltered = false,
  emptyFilteredTitle = 'No results found.',
  emptyFilteredDescription = 'Adjust filters and try again.',
  showFirstColumnLabel = false,
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageSizeChange,
}: DataCardProps<T>) {
  const getValue = (row: T, key: string): unknown => (row as Record<string, unknown>)[key];

  const bodyColumns = columns.filter((col) => col.key !== 'actions');
  const actionsColumn = columns.find((col) => col.key === 'actions');

  if (isLoading) {
    return (
      <div className={className}>
        {(title || count !== undefined) && (
          <div className="mb-3 flex items-center gap-2.5">
            {title && <h3 className={cn('text-base font-semibold text-foreground', titleClassName)}>{title}</h3>}
            {count !== undefined && (
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">{count}</span>
            )}
          </div>
        )}
        <CardSkeleton />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className={className}>
        <div className="flex flex-col items-center justify-center rounded-xl bg-card-bg py-14 text-center px-4">
          {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
          <p className="text-base font-semibold text-foreground">
            {isError ? errorMessage || 'Failed to load data' : isFiltered ? emptyFilteredTitle : emptyTitle}
          </p>
          <p className="mt-1.5 text-sm text-foreground-secondary">
            {isError ? 'Please try again later.' : isFiltered ? emptyFilteredDescription : emptyDescription}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {(title || count !== undefined) && (
        <div className="mb-3 flex items-center gap-2.5">
          {title && <h3 className={cn('text-base font-semibold text-foreground', titleClassName)}>{title}</h3>}
          {count !== undefined && (
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">{count}</span>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {data.map((row, index) => (
          <div
            key={rowKey(row, index)}
            className={cn(
              'rounded-xl border border-border bg-card-bg p-4',
              onCardClick && 'cursor-pointer active:bg-border/10',
            )}
            onClick={onCardClick ? () => onCardClick(row) : undefined}
          >
            {bodyColumns.length > 0 && (
              <div className="mb-3 border-b border-border pb-3">
                {showFirstColumnLabel && (
                  <span className="mb-1 block text-xs font-medium text-foreground-secondary">
                    {bodyColumns[0].label}
                  </span>
                )}
                <div className="text-sm font-medium text-foreground">
                  {bodyColumns[0].render
                    ? bodyColumns[0].render(getValue(row, bodyColumns[0].key), row, index)
                    : String(getValue(row, bodyColumns[0].key) ?? '')}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {bodyColumns.slice(1).map((col, colIdx, arr) => (
                <div
                  key={col.key}
                  className={cn(
                    'flex items-start justify-between gap-4',
                    colIdx < arr.length - 1 && 'border-b border-border pb-2',
                  )}
                >
                  <span className="flex-shrink-0 text-xs font-medium text-foreground-secondary">
                    {col.label}
                  </span>
                  <div className="text-right text-sm text-foreground">
                    {col.render
                      ? col.render(getValue(row, col.key), row, index)
                      : String(getValue(row, col.key) ?? '')}
                  </div>
                </div>
              ))}
            </div>

            {actionsColumn && (
              <div className="mt-3 flex justify-end border-t border-border pt-3">
                {actionsColumn.render
                  ? actionsColumn.render(getValue(row, actionsColumn.key), row, index)
                  : null}
              </div>
            )}
          </div>
        ))}
      </div>

      {showPagination && onPageChange && (totalPages > 1 || onPageSizeChange) && (
        <div className="mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={onPageChange}
            showControls
            pageSize={pageSize}
            totalItems={totalItems}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
