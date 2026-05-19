export default function Loading() {
  return (
    <div className="bg-surface min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-3">
        <span
          className="inline-block rounded-full live-dot"
          style={{ width: 6, height: 6, background: 'var(--color-ink)' }}
        />
        <span className="eyebrow text-mute">Loading</span>
      </div>
    </div>
  );
}
