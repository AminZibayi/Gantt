'use client';
import { useRouter } from 'next/navigation';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const router = useRouter();

  return (
    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
      {['en', 'fa'].map((locale) => (
        <button
          key={locale}
          onClick={() => router.push(`/${locale}`)}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            currentLocale === locale
              ? 'bg-indigo-600 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
