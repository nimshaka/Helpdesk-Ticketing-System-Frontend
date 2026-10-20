'use client';

import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cva } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';
import { forwardRef, useState } from 'react';
import { cn } from '@/lib/utils';

const inputVariants = cva(
  cn(
    'h-[44px] md:h-[50px] w-full px-[15px]',
    'rounded-[10px]',
    'border border-border bg-transparent',
    'text-foreground',
    'transition-smooth',
    'hover:border-border-hover',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ),
  {
    variants: {
      variant: {
        default: '',
        error: 'border-error hover:border-accent-hover focus-visible:ring-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type PlaceholderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const placeholderSizeMap: Record<PlaceholderSize, string> = {
  xs: 'placeholder:text-xs',
  sm: 'placeholder:text-sm',
  md: 'placeholder:text-base',
  lg: 'placeholder:text-lg',
  xl: 'placeholder:text-xl',
};

type InputVariantProps = VariantProps<typeof inputVariants>;
type InputComponentProps = Omit<ComponentProps<'input'>, 'type'> & {
  type?: 'text' | 'email' | 'password' | 'phone';
  errorMessage?: string;
  placeholderSize?: PlaceholderSize;
};

type InputProps = InputComponentProps & InputVariantProps;

const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant,
  className,
  type = 'text',
  errorMessage,
  onChange,
  value,
  placeholderSize = 'md',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const isPhone = type === 'phone';
  const hasError = variant === 'error' || !!errorMessage;

  const placeholderClass = cn('placeholder:text-foreground-muted', placeholderSizeMap[placeholderSize]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPhone && onChange) {
      const input = e.target.value;
      const numbersOnly = input.replace(/\D/g, '');

      const limitedNumbers = numbersOnly.slice(0, 10);

      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: limitedNumbers,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(newEvent);
    } else if (onChange) {
      onChange(e);
    }
  };

  if (isPassword) {
    return (
      <div className="w-full">
        <div className="relative w-full">
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              inputVariants({ variant: hasError ? 'error' : variant, className }),
              placeholderClass,
              'pr-12',
            )}
            onChange={onChange}
            value={value}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-foreground transition-colors"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <Eye className="size-5" /> : <EyeOff className="size-5" />}
          </button>
        </div>
        {errorMessage && <p className="mt-1 text-sm text-error">{errorMessage}</p>}
      </div>
    );
  }

  if (isPhone) {
    return (
      <div className="w-full">
        <div
          className={cn(
            'flex h-[44px] w-full items-center px-[15px] md:h-[50px]',
            'rounded-[10px]',
            'border bg-transparent',
            'transition-smooth',
            hasError
              ? 'border-error focus-within:ring-1 focus-within:ring-error hover:border-accent-hover'
              : 'border-border focus-within:ring-1 focus-within:ring-ring hover:border-border-hover',
          )}
        >
          <span className="mr-2 text-foreground">+1</span>
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handlePhoneChange}
            className={cn(
              'flex-1 bg-transparent text-foreground focus-visible:outline-none',
              placeholderClass,
            )}
            {...props}
          />
        </div>
        {errorMessage && <p className="mt-1 text-sm text-error">{errorMessage}</p>}
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={ref}
        type={type}
        className={cn(
          inputVariants({ variant: hasError ? 'error' : variant, className }),
          placeholderClass,
        )}
        onChange={onChange}
        value={value}
        {...props}
      />
      {errorMessage && <p className="mt-1 text-sm text-error">{errorMessage}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
