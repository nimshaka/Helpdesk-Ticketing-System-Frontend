'use client';

import Image from 'next/image';
import { useState } from 'react';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';

export default function LoginSection() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form onSubmit={(e) => e.preventDefault()} className="flex w-full flex-col space-y-5">
      <div className="space-y-5">
        <div className="space-y-1">
          <Input
            id="login-email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
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
          />
          <div className="flex justify-end pt-1">
            <button
              type="button"
              className="transition-smooth cursor-pointer text-sm leading-5 font-normal text-foreground-secondary hover:text-foreground"
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        size="free-lg"
        variant="primary"
        className="mt-6 h-[50px] w-full rounded-[15px]"
      >
        Login
      </Button>

      <div className="flex items-center gap-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
        <p className="text-center text-sm leading-5 font-semibold text-foreground">
          Or continue with
        </p>
        <div className="h-px flex-1 scale-y-[-1] rotate-180 bg-gradient-to-r from-transparent to-border" />
      </div>

      <div className="flex items-center justify-center gap-5">
        <button
          type="button"
          className="transition-smooth flex size-[58px] cursor-pointer items-center justify-center rounded-[10px] border border-border hover:border-border-hover lg:size-[66px]"
          aria-label="Login with Google"
        >
          <Image alt="Google" className="size-6" src="/icons/Google.webp" width={24} height={24} />
        </button>
      </div>
    </form>
  );
}