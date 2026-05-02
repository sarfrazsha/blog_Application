import Link from 'next/link';

import { cn } from '@kit/ui/utils';

function LogoImage({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-8 w-8', className)}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Blog logo"
    >
      <defs>
        <linearGradient
          id="g"
          x1="96"
          y1="112"
          x2="416"
          y2="400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#22D3EE" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="512" height="512" rx="112" fill="#0B1220" />

      <path
        d="M138 172c0-18.8 15.2-34 34-34h104c24.3 0 46.1 10.8 61 27.9 14.9-17.1 36.7-27.9 61-27.9h12c18.8 0 34 15.2 34 34v196c0 18.8-15.2 34-34 34h-12c-27.2 0-51.9 9.8-71 26.1-19.1-16.3-43.8-26.1-71-26.1H172c-18.8 0-34-15.2-34-34V172Z"
        fill="#0F172A"
        stroke="url(#g)"
        strokeWidth="14"
      />

      <path
        d="M256 156v278"
        stroke="url(#g)"
        strokeWidth="12"
        strokeLinecap="round"
      />

      <path
        d="M334 250 290 294c-7.8 7.8-12.2 18.4-12.2 29.4V358l34.6-12.2c11-3.9 21.6-10.5 29.4-18.3l44-44-62-62Z"
        fill="url(#g)"
      />

      <path
        d="M334 250 290 294c-7.8 7.8-12.2 18.4-12.2 29.4V358l34.6-12.2c11-3.9 21.6-10.5 29.4-18.3l44-44-62-62Z"
        stroke="#E2E8F0"
        strokeOpacity="0.25"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      <circle cx="332" cy="312" r="12" fill="#0B1220" />
    </svg>
  );
}

export function AppLogo({
  href,
  label,
  className,
}: {
  href?: string | null;
  className?: string;
  label?: string;
}) {
  if (href === null) {
    return <LogoImage className={className} />;
  }

  return (
    <Link aria-label={label ?? 'Home Page'} href={href ?? '/'}>
      <LogoImage className={className} />
    </Link>
  );
}

