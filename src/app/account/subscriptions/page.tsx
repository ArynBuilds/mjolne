import { auth } from '@/lib/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { persistence } from '@/lib/persistence';
import { AccountShell } from '@/components/account/account-shell';
import { SubscriptionCard } from '@/components/account/subscription-card';

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const subs = persistence.listSubscriptions(session.user.email);

  return (
    <AccountShell email={session.user.email}>
      <p className="eyebrow text-mute mb-6">— Subscriptions</p>
      {subs.length === 0 ? (
        <div className="bg-paper border border-hairline rounded-lg p-12 text-center">
          <p className="font-display text-h2 mb-3" style={{ fontWeight: 400 }}>
            No subscriptions yet.
          </p>
          <p className="text-mute mb-6">
            A subscription means a roast every Tuesday, automatic.
          </p>
          <Link href="/subscribe" className="pill-button pill-button-primary inline-flex">
            Build my subscription
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {subs.map((s) => (
            <SubscriptionCard key={s.id} subscription={s} />
          ))}
        </div>
      )}
    </AccountShell>
  );
}
