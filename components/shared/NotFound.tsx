'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, Frown } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-fade-in-up text-center">
        {}
        <div className="relative mb-6">
          <span className="text-[120px] font-extrabold leading-none text-primary/15 sm:text-[160px]">
            404
          </span>
         
        </div>

        {}
        <h1 className="mb-2 text-2xl font-bold text-foreground  flex items-center justify-center gap-2">
          Page Not Found <Frown className="inline size-7 text-accent" />
        </h1>
        
        <p className="mb-8 text-sm text-foreground-secondary">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            <Home className="size-4" />
            Go Home
          </Link>
          <button
            onClick={() => router.back()}
            type="button"
            className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border-2 border-primary px-5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
