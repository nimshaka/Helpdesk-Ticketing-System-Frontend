'use client';

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Pagination from '@/components/shared/Pagination';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  className?: string;
  classNameTd?: string;
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  headerRender?: () => React.ReactNode;
  columnHidden?: boolean;
  alignment?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  title?: string;
  titleClassName?: string;
  count?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  rowKey?: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  className?: string;
  tableClassName?: string;
  showPagination?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyIcon?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  headerExtra?: React.ReactNode;
  isFiltered?: boolean;
  emptyFilteredTitle?: string;
  emptyFilteredDescription?: string;
  pageSize?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

function SortIcon({ columnKey, sortKey, sortDirection }: { columnKey: string; sortKey?: string; sortDirection?: 'asc' | 'desc' }) {
  if (sortKey !== columnKey) return <ArrowDown className="h-3.5 w-3.5 opacity-30" />;
  return sortDirection === 'asc'
    ? <ArrowUp className="h-3.5 w-3.5 text-primary" />
    : <ArrowDown className="h-3.5 w-3.5 text-primary" />;
}

function TableSkeleton<T>({ columns }: { columns: TableColumn<T>[] }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i}>
          {columns.map((col) => (
            <td key={col.key} className="px-5 py-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function getAlignmentClass(alignment: 'left' | 'right' | 'center' = 'left') {
  if (alignment === 'right') return 'text-right';
  if (alignment === 'center') return 'text-center';
  return 'text-left';
}

function getJustifyClass(alignment: 'left' | 'right' | 'center' = 'left') {
  if (alignment === 'right') return 'justify-end';
  if (alignment === 'center') return 'justify-center';
  return 'justify-start';
}

export default function DataTable<T = Record<string, unknown>>({
  data,
  columns,
  title,
  titleClassName,
  count,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSort,
  sortKey,
  sortDirection,
  rowKey = (_, index) => index,
  onRowClick,
  className = '',
  tableClassName = '',
  showPagination = true,
  emptyTitle = 'No data found.',
  emptyDescription = 'No items to display.',
  emptyIcon,
  isLoading = false,
  isError = false,
  errorMessage,
  headerExtra,
  isFiltered = false,
  emptyFilteredTitle = 'No results found.',
  emptyFilteredDescription = 'Adjust filters and try again.',
  pageSize,
  totalItems,
  pageSizeOptions,
  onPageSizeChange,
}: DataTableProps<T>) {
  const handleSort = (column: TableColumn<T>) => {
    if (!column.sortable || !onSort) return;
    const newDirection = sortKey === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  const getValue = (row: T, key: string): unknown => (row as Record<string, unknown>)[key];

  return (
    <div className={cn('overflow-hidden rounded-xl bg-card-bg', className)}>
      {(title || count !== undefined || headerExtra) && (
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            {title && <h3 className={cn('text-base font-semibold text-foreground', titleClassName)}>{title}</h3>}
            {count !== undefined && (
              <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">{count}</span>
            )}
          </div>
          {headerExtra && <div>{headerExtra}</div>}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className={cn('w-full table-auto', tableClassName)}>
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-5 py-3.5 text-sm font-medium text-foreground-secondary',
                    col.sortable && !col.headerRender && 'cursor-pointer select-none hover:text-foreground',
                    getAlignmentClass(col.alignment),
                    col.className,
                  )}
                  onClick={col.headerRender ? undefined : () => handleSort(col)}
                >
                  {col.headerRender ? col.headerRender() : (
                    <div className={cn('flex items-center gap-1.5', getJustifyClass(col.alignment))}>
                      {!col.columnHidden && col.label}
                      {col.sortable && !col.columnHidden && (
                        <SortIcon columnKey={col.key} sortKey={sortKey} sortDirection={sortDirection} />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton columns={columns} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-0">
                  <div className="flex flex-col items-center justify-center py-14">
                    {emptyIcon && <div className="mb-4">{emptyIcon}</div>}
                    <p className="text-base font-semibold text-foreground">
                      {isError ? errorMessage || 'Failed to load data' : isFiltered ? emptyFilteredTitle : emptyTitle}
                    </p>
                    <p className="mt-1.5 text-sm text-foreground-secondary">
                      {isError ? 'Please try again later.' : isFiltered ? emptyFilteredDescription : emptyDescription}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={rowKey(row, index)}
                  className={cn('border-b border-border transition-colors hover:bg-border/10', onRowClick && 'cursor-pointer')}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn('px-5 py-4 text-sm', getAlignmentClass(col.alignment), col.classNameTd, col.className)}
                    >
                      {col.render ? col.render(getValue(row, col.key), row, index) : String(getValue(row, col.key) ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && onPageChange && (totalPages > 1 || onPageSizeChange) && (
        <div className="border-t border-border px-5 py-4">
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
