'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type LoaderProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  minDuration?: number;
};

const sizeClasses = {
  sm: 'w-16 h-16',
  md: 'w-24 h-24',
  lg: 'w-36 h-36',
};

const Loader: React.FC<LoaderProps> = ({
  className,
  size = 'md',
  fullScreen = false,
  minDuration = 800,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), minDuration);
    return () => clearTimeout(timer);
  }, [minDuration]);

  if (!visible) return null;

  const loader = (
    <div className={cn('animate-fade-in', className)}>
      <Image
        src="/logo/Logo.webp"
        alt="Loading..."
        width={128}
        height={128}
        className={cn('object-contain', sizeClasses[size])}
        unoptimized
        priority
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full min-h-screen">
      {loader}
    </div>
  );
};

export default Loader;
