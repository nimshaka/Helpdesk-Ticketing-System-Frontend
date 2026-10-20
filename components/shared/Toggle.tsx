import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type ToggleOption = {
  label: string;
  value: string;
};

type ToggleProps = {
  options: [ToggleOption, ToggleOption];
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md' | 'lg';
} & Omit<ComponentProps<'div'>, 'onChange'>;

export default function Toggle({
  options,
  value,
  onChange,
  size = 'lg',
  className,
  ...props
}: ToggleProps) {
  const activeIndex = options.findIndex((option) => option.value === value);

  const sizeClasses = {
    sm: {
      container: 'h-[60px] w-[339px]',
      text: 'text-[14px] leading-4',
    },
    md: {
      container: 'h-[60px] min-w-[350px]',
      text: 'text-base leading-5',
    },
    lg: {
      container: 'h-[60px] w-full max-w-[560px]',
      text: 'text-base leading-5',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div
      className={cn(
        'relative rounded-[15px] border-[1.5px] border-secondary',
        'inline-flex',
        currentSize.container,
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'absolute top-[5.5px] h-[46px] rounded-[10px] bg-primary',
          'transition-all duration-300 ease-in-out',
          'z-0',
        )}
        style={{
          width: 'calc(50% - 5.46px)',
          left: activeIndex === 0 ? '5.46px' : 'calc(50% + 0px)',
        }}
      />

      {options.map((option, index) => {
        const isActive = value === option.value;
        const isFirst = index === 0;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              'relative z-10 flex h-[46px] flex-1 items-center justify-center',
              'rounded-[10px] px-[15px]',
              'font-semibold',
              'transition-colors duration-200',
              isFirst ? 'ml-[5.46px]' : 'mr-[5.46px]',
              'my-[5.5px]',
              currentSize.text,
              isActive ? 'text-foreground' : 'cursor-pointer text-foreground-muted hover:text-foreground-secondary',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
