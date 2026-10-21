'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import DemoAccounts from './DemoAccounts';
import { loginSchema } from '@/features/auth/schemas';
import { loginApi } from '@/features/auth/api';
import { toast } from '@/lib/toast/toastService';

export default function LoginSection() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSelectAccount = (selectedEmail: string) => {
    setEmail(selectedEmail);
    setPassword('password');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      for (const err of result.error.issues) {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await loginApi(result.data);
      if (!res.success || !res.user) {
        setErrors({ general: res.error || 'Invalid credentials' });
        return;
      }

      toast.success(`Welcome back, ${res.user.name}!`);
      router.push(`/${res.user.role}/dashboard`);
      router.refresh();
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-4">
        {errors.general && (
          <div className="rounded-xl border border-error/30 bg-error-light/50 p-3 text-xs text-error font-medium">
            {errors.general}
          </div>
        )}

        <div className="space-y-1">
          <Input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            autoComplete="email"
            errorMessage={errors.email}
          />
        </div>

        <div className="space-y-1">
          <Input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            errorMessage={errors.password}
          />
        </div>

        <Button
          type="submit"
          size="free-lg"
          variant="primary"
          className="mt-4 h-[48px] w-full rounded-[14px]"
          isLoading={loading}
          disabled={loading}
        >
          Sign In
        </Button>
      </form>

      <DemoAccounts onSelectAccount={handleSelectAccount} />
    </div>
  );
}
