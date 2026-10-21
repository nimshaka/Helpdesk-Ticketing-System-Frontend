import Image from 'next/image';
import Link from 'next/link';

type LogoProps = {
  variant?: 'desktop' | 'mobile' | 'sidebar';
  clickable?: boolean;
  className?: string;
  priority?: boolean;
};

export default function Logo({
  variant = 'desktop',
  clickable = true,
  className = '',
  priority = true,
}: LogoProps) {
  const dimensions =
    variant === 'desktop'
      ? { width: 140, height: 85.75 }
      : variant === 'sidebar'
        ? { width: 130, height: 80 }
        : variant === 'mobile'
          ? { width: 50, height: 50 }
          : { width: 140, height: 85.75 };

  const aspectRatio =
    variant === 'desktop' ? '100/61.25' : variant === 'sidebar' ? '130/80' : '18/11';

  const logoImage = (
    <Image
      src="/logo/Logo.webp"
      alt="Helpdesk Logo"
      width={dimensions.width}
      height={dimensions.height}
      priority={priority}
      className={`object-contain h-auto w-auto ${className}`}
      style={{
        aspectRatio,
      }}
    />
  );

  if (clickable) {
    return (
      <Link href="/" className="inline-block" aria-label="TutorWorld Home">
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}
