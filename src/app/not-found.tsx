import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-surface min-h-screen flex items-center" style={{ paddingTop: 144 }}>
      <div className="container-page max-w-[640px]">
        <p className="eyebrow text-mute mb-6" style={{ letterSpacing: '0.26em' }}>
          — 404
        </p>
        <h1
          className="font-display text-display-l mb-6 text-balance"
          style={{ fontWeight: 400, lineHeight: 0.95 }}
        >
          This page is not on the shelf.
        </h1>
        <p className="text-lead text-mute mb-9 max-w-[480px]">
          Either it was never roasted, or it has moved. Let us point you somewhere that brews.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/" className="pill-button pill-button-primary inline-flex">
            Home
          </Link>
          <Link href="/#collection" className="pill-button border border-ink text-ink" style={{ background: 'transparent' }}>
            See coffees
          </Link>
        </div>
      </div>
    </div>
  );
}
