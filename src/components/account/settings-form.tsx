'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SettingsFormProps {
  email: string;
  initialLocale: 'tr' | 'en';
}

export function SettingsForm({ email, initialLocale }: SettingsFormProps) {
  const [locale, setLocale] = useState<'tr' | 'en'>(initialLocale);
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  function save(e: React.FormEvent) {
    e.preventDefault();
    document.cookie = `mjolne_locale=${locale}; path=/; max-age=31536000`;
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={save} className="grid gap-6 max-w-[480px]">
      <div>
        <label className="eyebrow text-mute block mb-2">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="w-full bg-fog border border-hairline rounded-md px-4 py-3 text-mute"
        />
        <p className="text-caption text-mute mt-1">Email is your sign-in identity. Contact us to change it.</p>
      </div>

      <div>
        <label htmlFor="name" className="eyebrow text-mute block mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-paper border border-hairline rounded-md px-4 py-3 outline-none focus:border-ink transition-colors"
        />
      </div>

      <div>
        <span className="eyebrow text-mute block mb-2">Language</span>
        <div className="flex items-center gap-2">
          {(['tr', 'en'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLocale(l)}
              className={`pill-button border ${locale === l ? 'pill-button-primary' : 'border-hairline text-ink hover:border-mute'}`}
              style={{ height: 40, background: locale === l ? undefined : 'transparent' }}
            >
              {l === 'tr' ? 'Türkçe' : 'English'}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="pill-button pill-button-primary w-fit">
        Save
      </button>
      {saved ? <p className="text-caption text-peru">Saved.</p> : null}
    </form>
  );
}
