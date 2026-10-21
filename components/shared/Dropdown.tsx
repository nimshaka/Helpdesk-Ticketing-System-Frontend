'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DropdownItem = {
  label: string;
  value: string;
  disabled?: boolean;
};

type DropdownProps = {
  items: DropdownItem[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export default function Dropdown({
  items,
  value,
  onChange,
  placeholder = 'Select an option',
  className,
  disabled = false,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    onChange?.(item.value);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-[44px] w-full items-center justify-between rounded-lg border border-border !bg-white dark:!bg-transparent bg-transparent px-3 text-sm transition-all',
          'hover:border-border-hover focus:border-primary focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          open && 'border-primary',
        )}
      >
        <span className={cn(selectedItem ? 'text-foreground' : 'text-foreground-muted')}>
          {selectedItem ? selectedItem.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'size-4 text-foreground-secondary transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card-bg shadow-lg">
          <ul className="max-h-[200px] overflow-y-auto py-1">
            {items.map((item) => (
              <li key={item.value}>
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'flex w-full items-center px-3 py-2.5 text-left text-sm transition-colors !bg-white dark:!bg-transparent',
                    item.value === value
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-background-tertiary !bg-white dark:!bg-transparent',
                    item.disabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
