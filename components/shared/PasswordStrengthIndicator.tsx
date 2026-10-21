import * as React from 'react';
import { cn } from '@/lib/utils';
import { validatePasswordStrength } from '@/features/auth/schemas';

export interface PasswordStrengthIndicatorProps {
  password: string;
  showRequirements?: boolean;
  className?: string;
}

const PasswordStrengthIndicator = React.forwardRef<
  HTMLDivElement,
  PasswordStrengthIndicatorProps
>(({ password, showRequirements = true, className }, ref) => {
  const { strength, checks } = validatePasswordStrength(password);

  if (!password) return null;

  const getStrengthColor = () => {
    switch (strength) {
      case 'strong':
        return 'bg-success';
      case 'medium':
        return 'bg-warning';
      default:
        return 'bg-error';
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case 'strong':
        return 'w-full';
      case 'medium':
        return 'w-2/3';
      default:
        return 'w-1/3';
    }
  };

  return (
    <div ref={ref} className={cn('w-full space-y-2', className)}>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-card-bg">
        <div
          className={cn(
            'h-full transition-all duration-300',
            getStrengthColor(),
            getStrengthWidth()
          )}
        />
      </div>

      <p className="text-xs font-medium capitalize text-foreground-secondary">
        Password strength: <span className={cn(
          strength === 'strong' && 'text-success',
          strength === 'medium' && 'text-warning',
          strength === 'weak' && 'text-error'
        )}>{strength}</span>
      </p>

      {showRequirements && (
        <ul className="space-y-1 text-xs text-foreground-secondary">
          <li className={cn('flex items-center gap-2', checks.hasMinLength && 'text-success')}>
            <span>{checks.hasMinLength ? '✓' : '○'}</span>
            At least 8 characters
          </li>
          <li className={cn('flex items-center gap-2', checks.hasUpperCase && 'text-success')}>
            <span>{checks.hasUpperCase ? '✓' : '○'}</span>
            One uppercase letter
          </li>
          <li className={cn('flex items-center gap-2', checks.hasLowerCase && 'text-success')}>
            <span>{checks.hasLowerCase ? '✓' : '○'}</span>
            One lowercase letter
          </li>
          <li className={cn('flex items-center gap-2', checks.hasNumber && 'text-success')}>
            <span>{checks.hasNumber ? '✓' : '○'}</span>
            One number
          </li>
        </ul>
      )}
    </div>
  );
});

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

export default PasswordStrengthIndicator;
