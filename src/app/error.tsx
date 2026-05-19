'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-surface min-h-screen flex items-center" style={{ paddingTop: 144 }}>
      <div className="container-page max-w-[640px]">
        <p className="eyebrow text-mute mb-6" style={{ letterSpacing: '0.26em' }}>
          — Something tripped
        </p>
        <h1
          className="font-display text-display-l mb-6 text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95 }}
        >
          We caught an error.
        </h1>
        <p className="text-body text-mute mb-9">
          You can retry the page or head back home. If this keeps happening, let us know.
        </p>
        <div className="flex items-center gap-4">
          <button onClick={reset} className="pill-button pill-button-primary">
            Try again
          </button>
          <Link href="/" className="pill-button border border-ink text-ink" style={{ background: 'transparent' }}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
