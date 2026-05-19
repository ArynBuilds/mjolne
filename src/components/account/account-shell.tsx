'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/subscriptions', label: 'Subscriptions' },
  { href: '/account/settings', label: 'Settings' },
];

interface AccountShellProps {
  email?: string;
  children: React.ReactNode;
}

export function AccountShell({ email, children }: AccountShellProps) {
  const pathname = usePathname();
  return (
    <div className="bg-surface min-h-screen" style={{ paddingTop: 144, paddingBottom: 'var(--space-10)' }}>
      <div className="container-page max-w-[1080px]">
        <p className="eyebrow text-mute mb-6" style={{ letterSpacing: '0.26em' }}>
          — Account
        </p>
        <h1 className="font-display text-display-l mb-12 text-balance" style={{ fontWeight: 400 }}>
          Hello{email ? `, ${email}` : ''}.
        </h1>
        <div className="grid grid-cols-[200px_1fr] gap-12">
          <nav className="flex flex-col gap-2">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'block py-2 text-body transition-colors',
                    active ? 'text-ink' : 'text-mute hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <form action="/api/auth/signout" method="post" className="mt-6 pt-6 border-t border-hairline">
              <button
                type="submit"
                className="text-caption uppercase tracking-[0.18em] text-mute hover:text-ink underline-expand"
              >
                Sign out
              </button>
            </form>
          </nav>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
