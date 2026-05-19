import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { persistence } from '@/lib/persistence';
import { AccountShell } from '@/components/account/account-shell';
import { formatTRY } from '@/lib/format';

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const orders = persistence.listOrders(session.user.email);

  return (
    <AccountShell email={session.user.email}>
      <p className="eyebrow text-mute mb-6">— Orders</p>
      {orders.length === 0 ? (
        <div className="bg-paper border border-hairline rounded-lg p-12 text-center">
          <p className="font-display text-h2 mb-3" style={{ fontWeight: 400 }}>
            No orders yet.
          </p>
          <p className="text-mute">When you check out, your orders will appear here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-hairline border-y border-hairline">
          {orders.map((o) => (
            <li key={o.id} className="py-6 grid grid-cols-[1fr_auto_auto_auto] gap-6 items-center">
              <div>
                <p className="font-mono text-caption text-mute">{o.id}</p>
                <p className="text-body">
                  {new Date(o.createdAt).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <span className="font-mono text-caption">
                {formatTRY(o.amount)}
              </span>
              <span className="text-caption uppercase tracking-[0.18em] text-mute">
                {o.status}
              </span>
              <a
                href={`#order-${o.id}`}
                className="text-caption uppercase tracking-[0.18em] underline-expand"
              >
                Details →
              </a>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
