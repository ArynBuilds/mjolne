import { auth } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AccountShell } from '@/components/account/account-shell';
import { SettingsForm } from '@/components/account/settings-form';
import { localeCookieName, type Locale, defaultLocale, locales } from '@/i18n/config';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');

  const cookieStore = cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value as Locale | undefined;
  const initial: Locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  return (
    <AccountShell email={session.user.email}>
      <p className="eyebrow text-mute mb-6">— Settings</p>
      <SettingsForm email={session.user.email} initialLocale={initial} />
    </AccountShell>
  );
}
