import type { VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
//dsfdfsdsfds
const buttonVariants = cva(
  cn(
    'font-semibold',
    'flex items-center justify-center gap-2',
    'cursor-pointer',
    'transition-smooth',
    'group/btn',
    'focus-visible:outline focus-visible:outline-primary focus-visible:outline-offset-2',
    'disabled:cursor-not-allowed  disabled:text-foreground-muted disabled:shadow-none',
  ),
  {
    variants: {
      variant: {
        primary: cn(
          'bg-primary text-foreground',
          'not-disabled:active:scale-[0.98] not-disabled:hover:bg-primary-hover',
          'disabled:text-foreground',
        ),
        secondary: cn(
          'bg-card-bg text-foreground font-semibold not-disabled:hover:bg-card-bg-hover',
          'not-disabled:active:scale-[0.98] active:shadow-none disabled:bg-background-secondary border border-border',
        ),
        text: cn(
          'bg-transparent text-foreground text-right not-disabled:hover:bg-primary-hover',
          'text-base font-medium leading-6',
          'p-0 w-auto h-auto',
          'not-disabled:hover:opacity-80',
        ),
        'text-blue': cn(
          'bg-transparent text-primary text-right',
          'text-base font-medium leading-6',
          'p-0 w-auto h-auto',
          'not-disabled:hover:opacity-80',
        ),
        link: 'p-0 text-primary hover:underline',
      },
      size: {
        sm: 'h-[50px] min-w-[310px] rounded-[15px] px-[15px] text-base leading-4',
        lg: 'h-[60px] min-w-[350px] rounded-[20px] px-[15px] text-base leading-none',
        'free-sm': 'h-[50px] w-full rounded-[15px] px-[15px] text-base leading-4',
        'free-lg': 'h-[60px] w-full rounded-[20px] px-[15px] text-base leading-none',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
    },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;
type ButtonComponentProps = ComponentProps<'button'>;

type ButtonProps = ButtonComponentProps &
  ButtonVariantProps & {
    loading?: boolean;
    isLoading?: boolean;
    spinnerPlacement?: 'start' | 'end';
  };

export default function Button({
  variant,
  size,
  className,
  loading,
  isLoading,
  spinnerPlacement = 'end',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const isButtonLoading = Boolean(loading ?? isLoading);
  const isDisabled = disabled || isButtonLoading;

  const spinnerSize = size === 'sm' || size === 'free-sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isDisabled}
      aria-busy={isButtonLoading}
      aria-disabled={isDisabled}
      {...rest}
    >
      {isButtonLoading ? (
        <>
          {spinnerPlacement === 'start' && <Spinner className={spinnerSize} />}
          {children}
          {spinnerPlacement === 'end' && <Spinner className={spinnerSize} />}
        </>
      ) : (
        children
      )}
    </button>
  );
}
