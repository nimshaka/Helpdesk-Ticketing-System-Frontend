'use client';

import Image from 'next/image';
import { useState } from 'react';
import Button from '@/components/shared/Button';
import Checkbox from '@/components/shared/Checkbox';
import Input from '@/components/shared/Input';
import PasswordStrengthIndicator from '@/components/shared/PasswordStrengthIndicator';

export default function RegisterSection() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex h-full w-full flex-col justify-between lg:justify-start"
    >
      <div className="mb-10 flex flex-col gap-5 text-center">
        <h2 className="text-[28px] leading-[34px] font-bold text-foreground">Create Account</h2>
        <p className="text-[16px] leading-6 font-medium text-foreground-secondary">
          Enter your details to get started
        </p>
      </div>

      <div className="mb-10 flex grow flex-col gap-5 lg:flex-none">
        <Input
          id="signup-fullname"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full Name"
          className="h-[50px] rounded-[12px] text-sm"
          autoComplete="name"
        />

        <Input
          id="signup-email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="h-[50px] rounded-[12px] text-sm"
          autoComplete="email"
        />

        <div className="space-y-1">
          <Input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-[50px] rounded-[12px] text-sm"
            autoComplete="new-password"
          />
          <PasswordStrengthIndicator password={password} showRequirements={false} className="mt-2" />
        </div>

        <Input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="h-[50px] rounded-[12px] text-sm"
          autoComplete="new-password"
        />

        <Checkbox checked={agreeToTerms} onCheckedChange={setAgreeToTerms}>
          <span className="text-sm text-foreground-secondary">
            I agree to the{' '}
            <span className="cursor-pointer text-primary hover:text-primary-hover">
              Terms & Conditions
            </span>{' '}
            and{' '}
            <span className="cursor-pointer text-primary hover:text-primary-hover">
              Privacy Policy
            </span>
          </span>
        </Checkbox>
      </div>

      <div className="flex flex-col gap-5">
        <Button
          type="submit"
          size="free-lg"
          variant="primary"
          className="h-[50px] w-full rounded-[15px]"
        >
          Sign Up
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
            aria-label="Sign up with Google"
          >
            <Image alt="Google" className="size-6" src="/icons/Google.webp" width={24} height={24} />
          </button>
        </div>
      </div>
    </form>
  );
}