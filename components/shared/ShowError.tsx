'use client';

import { Home, RotateCcw, TriangleAlert } from 'lucide-react';
import Link from 'next/link';

export default function ShowError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in-up text-center">
        {}
        <div className="relative mb-6">
          <span className="text-[120px] font-extrabold leading-none text-accent/15 sm:text-[160px]">
            500
          </span>
        </div>

        {}
        <h1 className="mb-2 text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          Something Went Wrong <TriangleAlert className="inline size-7 text-accent" />
        </h1>
        <p className="mb-8 text-sm text-foreground-secondary">
          An unexpected error occurred. Please try again or return to the home page.
        </p>

        {}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            <RotateCcw className="size-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border-2 border-primary px-5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            <Home className="size-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

