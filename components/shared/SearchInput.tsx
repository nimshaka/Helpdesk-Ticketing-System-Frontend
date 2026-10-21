'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchInput({ value, onChange, placeholder = 'Search...', className }: SearchInputProps) {
  return (
    <div className={cn('relative flex-1', className)}>
      <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-foreground-secondary" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[44px] w-full rounded-lg border border-border bg-card-bg pl-10 pr-10 text-sm text-foreground placeholder:text-foreground-muted transition-colors focus:border-primary focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-foreground-muted transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
