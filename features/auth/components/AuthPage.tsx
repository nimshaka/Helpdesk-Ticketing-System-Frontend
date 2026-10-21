'use client';

import { useState } from 'react';
import Logo from '@/components/shared/Logo';
import Toggle from '@/components/shared/Toggle';
import AuthCarousel from '@/features/auth/components/AuthCarousel';
import LoginSection from '@/features/auth/components/LoginSection';
import RegisterSection from '@/features/auth/components/RegisterSection';

type AuthMode = 'login' | 'signup';

export default function AuthPage({ defaultMode = 'login' }: { defaultMode?: AuthMode }) {
  const [authMode, setAuthMode] = useState<AuthMode>(defaultMode);

  const handleModeChange = (mode: string) => setAuthMode(mode as AuthMode);

  return (
    <div className="relative flex min-h-dvh w-full">
      <AuthCarousel />

      <div className="flex min-h-dvh w-full justify-center bg-background lg:ml-[50%] lg:w-1/2">
        <div className="flex w-full max-w-[420px] flex-col px-6 py-12 lg:py-16">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo variant="mobile" />
          </div>
          <div className="mb-8 hidden justify-center lg:flex">
            <Logo variant="desktop" />
          </div>

          <div className="mb-6 flex justify-center">
            <Toggle
              options={[
                { label: 'Login', value: 'login' },
                { label: 'Sign Up', value: 'signup' },
              ]}
              value={authMode}
              onChange={handleModeChange}
            />
          </div>

          <div className="mb-6 space-y-1 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-xs font-medium text-foreground-secondary">
              {authMode === 'login'
                ? 'Sign in to access your role-based ticketing portal'
                : 'Register as a customer to submit and manage support requests'}
            </p>
          </div>

          <div className="flex grow flex-col">
            {authMode === 'login' ? <LoginSection /> : <RegisterSection />}
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium">
            <p className="text-foreground-secondary">
              {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              type="button"
              onClick={() => handleModeChange(authMode === 'login' ? 'signup' : 'login')}
              className="cursor-pointer font-semibold text-primary hover:underline"
            >
              {authMode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
