'use client';

import { useState } from 'react';
import Logo from '@/components/shared/Logo';
import Toggle from '@/components/shared/Toggle';
import AuthCarousel from '@/features/auth/components/AuthCarousel';
import LoginSection from '@/features/auth/components/LoginSection';
import RegisterSection from '@/features/auth/components/RegisterSection';


type AuthMode = 'login' | 'signup';

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const handleModeChange = (mode: string) => setAuthMode(mode as AuthMode);

  return (
    <div className="relative flex min-h-dvh w-full">
      <AuthCarousel />

      <div className="flex min-h-dvh w-full justify-center bg-background lg:ml-[50%] lg:w-1/2">
        <div className="flex w-full max-w-[402px] flex-col px-[26px] py-16 lg:py-18">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo variant="mobile" />
          </div>
          <div className="mb-[50px] hidden justify-center lg:flex">
            <Logo variant="desktop" />
          </div>

          <div className="mb-[35px] flex justify-center lg:mb-[60px]">
            <Toggle
              options={[
                { label: 'Login', value: 'login' },
                { label: 'Sign Up', value: 'signup' },
              ]}
              value={authMode}
              onChange={handleModeChange}
            />
          </div>

          {authMode === 'login' && (
            <div className="mb-10 space-y-5 text-center transition-all duration-300 ease-in-out">
              <h2 className="text-[20px] leading-7 font-bold text-foreground lg:text-[28px]">
                Welcome Back
              </h2>
              <p className="text-sm leading-5 font-medium text-foreground-secondary lg:text-base">
                Log in to access your support portal
              </p>
            </div>
          )}

          <div className="flex grow flex-col transition-all duration-300 ease-in-out">
            {authMode === 'login' ? <LoginSection /> : <RegisterSection />}
          </div>

          <div className="mt-4 flex items-center justify-center gap-2.5 text-sm leading-5 font-semibold">
            <p className="text-foreground opacity-50">
              {authMode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </p>
            <button
              type="button"
              onClick={() => handleModeChange(authMode === 'login' ? 'signup' : 'login')}
              className="transition-smooth cursor-pointer text-primary hover:text-primary-hover"
            >
              {authMode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}