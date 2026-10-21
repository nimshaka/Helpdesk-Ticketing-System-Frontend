'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getPaginationItems, type PaginationItem } from '@/lib/pagination.utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onChange?: (page: number) => void;
  className?: string;
  loop?: boolean;
  isDisabled?: boolean;
  showControls?: boolean;
  pageSize?: number;
  totalItems?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
}

const DEFAULT_PER_PAGE_OPTIONS = [6, 12, 24, 48];

function PerPageDropdown({
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  isDropdownOpen,
  setIsDropdownOpen,
  isLoading,
  isDisabled,
  dropdownRef,
  menuRef,
}: {
  pageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (pageSize: number) => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  isLoading: boolean;
  isDisabled: boolean;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = pageSizeOptions.length * 40 + 8;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUpward = spaceBelow < menuHeight + 10;

      setDropdownStyle({
        position: 'fixed',
        left: rect.left,
        ...(openUpward ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
        zIndex: 9999,
      });
    }
  }, [isDropdownOpen, pageSizeOptions.length]);

  const dropdownContent =
    isDropdownOpen && mounted ? (
      <div
        ref={menuRef}
        className="min-w-[70px] rounded-lg border border-border bg-card-bg py-1 shadow-lg"
        style={dropdownStyle}
      >
        {pageSizeOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPageSizeChange(option);
              setIsDropdownOpen(false);
            }}
            className={cn(
              'w-full cursor-pointer px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-primary/10',
              option === pageSize && 'bg-primary/10 font-semibold text-primary',
            )}
          >
            {option}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDropdownOpen(!isDropdownOpen);
        }}
        disabled={isLoading || isDisabled}
        className={cn(
          'flex h-8 min-w-[44px] cursor-pointer items-center justify-between gap-1 rounded-lg border border-border bg-card-bg px-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary',
          (isLoading || isDisabled) && 'cursor-not-allowed opacity-60',
        )}
      >
        <span>{pageSize}</span>
        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', isDropdownOpen && 'rotate-180')} />
      </button>
      {dropdownContent && createPortal(dropdownContent, document.body)}
    </div>
  );
}

export default function Pagination({
  currentPage,
  totalPages,
  isLoading = false,
  onChange,
  className = '',
  loop = false,
  isDisabled = false,
  showControls = true,
  pageSize,
  totalItems,
  pageSizeOptions = DEFAULT_PER_PAGE_OPTIONS,
  onPageSizeChange,
}: PaginationProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);
      const isOutsideMenu = menuRef.current && !menuRef.current.contains(target);
      if (isOutsideDropdown && isOutsideMenu) setIsDropdownOpen(false);
    };

    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const showingStart = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : 0;
  const showingEnd = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : 0;

  if (!totalPages || (totalPages <= 1 && !onPageSizeChange)) return null;

  const change = (page: number) => {
    if (isLoading || isDisabled) return;
    const next = Math.max(1, Math.min(totalPages, page));
    if (next === currentPage) return;
    onChange?.(next);
  };

  const items = getPaginationItems(currentPage, totalPages, 7);
  const mobileItems = getPaginationItems(currentPage, totalPages, 5);

  const renderPageButtons = (pageItems: PaginationItem[], keyPrefix: string) =>
    pageItems.map((it, idx) => {
      if (typeof it === 'number') {
        return (
          <button
            key={`${keyPrefix}-${it}-${idx}`}
            type="button"
            onClick={() => change(it)}
            disabled={isLoading || isDisabled}
            className={cn(
              'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200',
              it === currentPage
                ? 'bg-primary text-foreground shadow-sm'
                : 'text-foreground-secondary hover:bg-primary/10 hover:text-foreground',
              (isLoading || isDisabled) && 'cursor-not-allowed opacity-60',
            )}
          >
            {it}
          </button>
        );
      }
      return (
        <button
          key={`${keyPrefix}-${it}-${idx}`}
          type="button"
          onClick={() => {
            if (it === 'left-ellipsis') change(Math.max(1, currentPage - 3));
            else change(Math.min(totalPages, currentPage + 3));
          }}
          disabled={isLoading || isDisabled}
          className={cn(
            'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-sm text-foreground-secondary transition-colors hover:bg-primary/10 hover:text-foreground',
            (isLoading || isDisabled) && 'cursor-not-allowed opacity-60',
          )}
          aria-label={it === 'left-ellipsis' ? 'Jump back' : 'Jump forward'}
        >
          &hellip;
        </button>
      );
    });

  const paginationControls = (
    <div className="flex items-center gap-1">
      {showControls && (
        <button
          type="button"
          onClick={() => change(currentPage === 1 && loop ? totalPages : currentPage - 1)}
          disabled={(currentPage === 1 && !loop) || isLoading || isDisabled}
          className={cn(
            'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border transition-all duration-200 hover:border-primary hover:text-primary',
            ((currentPage === 1 && !loop) || isLoading || isDisabled) && 'cursor-not-allowed opacity-40',
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div className="hidden items-center gap-0.5 md:flex">{renderPageButtons(items, 'desktop')}</div>

      <div className="flex items-center gap-0.5 md:hidden">{renderPageButtons(mobileItems, 'mobile')}</div>

      {showControls && (
        <button
          type="button"
          onClick={() => change(currentPage === totalPages && loop ? 1 : currentPage + 1)}
          disabled={(currentPage === totalPages && !loop) || isLoading || isDisabled}
          className={cn(
            'flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-border transition-all duration-200 hover:border-primary hover:text-primary',
            ((currentPage === totalPages && !loop) || isLoading || isDisabled) && 'cursor-not-allowed opacity-40',
          )}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );

  if (pageSize !== undefined && totalItems !== undefined && onPageSizeChange) {
    return (
      <nav className={cn('flex w-full flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between', className)}>
        <div className="flex items-center gap-2">
          <PerPageDropdown
            pageSize={pageSize}
            pageSizeOptions={pageSizeOptions}
            onPageSizeChange={onPageSizeChange}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            isLoading={isLoading}
            isDisabled={isDisabled}
            dropdownRef={dropdownRef}
            menuRef={menuRef}
          />
          <span className="text-sm font-semibold text-foreground-secondary">per page</span>
          <span className="text-foreground-muted">|</span>
          <span className="text-sm text-foreground-secondary">
            Showing {showingStart}–{showingEnd} of {totalItems}
          </span>
        </div>
        {paginationControls}
      </nav>
    );
  }

  return (
    <nav className={cn('flex w-full items-center justify-center gap-2', className)}>
      {paginationControls}
    </nav>
  );
}
