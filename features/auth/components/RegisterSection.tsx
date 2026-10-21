'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { registerSchema } from '@/features/auth/schemas';
import { registerApi } from '@/features/auth/api';
import { toast } from '@/lib/toast/toastService';

export default function RegisterSection() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerSchema.safeParse({ name, email, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const err of result.error.issues) {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await registerApi(result.data);
      if (!res.success || !res.user) {
        setErrors({ general: res.error || 'Failed to create account.' });
        return;
      }

      toast.success('Account created! Welcome to our helpdesk portal.');
      router.push('/customer/dashboard');
      router.refresh();
    } catch {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col space-y-4">
      {errors.general && (
        <div className="rounded-xl border border-error/30 bg-error-light/50 p-3 text-xs text-error font-medium">
          {errors.general}
        </div>
      )}

      <div className="space-y-1">
        <Input
          id="reg-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          errorMessage={errors.name}
        />
      </div>

      <div className="space-y-1">
        <Input
          id="reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          errorMessage={errors.email}
        />
      </div>

      <div className="space-y-1">
        <Input
          id="reg-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min 6 characters)"
          errorMessage={errors.password}
        />
      </div>

      <div className="space-y-1">
        <Input
          id="reg-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          errorMessage={errors.confirmPassword}
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
        Create Customer Account
      </Button>
    </form>
  );
}
