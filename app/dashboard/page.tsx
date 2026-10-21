'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/stores/session-store';
import Loader from '@/components/shared/Loader';

export default function DashboardRedirect() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    if (user && user.is_active) {
      router.replace(`/${user.role}/dashboard`);
    } else {
      router.replace('/login');
    }
  }, [user, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Loader />
    </div>
  );
}
