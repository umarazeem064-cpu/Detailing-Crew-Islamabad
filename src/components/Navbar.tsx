import {Menu, MessageCircle, Moon, Sun, X} from 'lucide-react';
import {useState} from 'react';
import {
  CURRENCIES,
  CurrencyCode,
  LanguageCode,
  TranslationCopy,
} from '../data/studioData';

interface NavbarProps {
  studioName: string;
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  currency: CurrencyCode;
  onCurrencyChange: (curr: CurrencyCode) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  whatsappHref: string;
  t: TranslationCopy;
}

const LANGUAGE_OPTIONS: {code: LanguageCode; label: string}[] = [
  {code: 'en', label: 'EN · English'},
  {code: 'ur', label: 'UR · اردو'},
  {code: 'ar', label: 'AR · العربية'},
  {code: 'es', label: 'ES · Español'},
];

export function Navbar({
  studioName,
  language,
  onLanguageChange,
  currency,
  onCurrencyChange,
  isDark,
  onToggleTheme,
  whatsappHref,
  t,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {href: '#home', label: t.nav.home},
    {href: '#services', label: t.nav.services},
    {href: '#packages', label: t.nav.packages},
    {href: '#gallery', label: t.nav.gallery},
    {href: '#reviews', label: t.nav.reviews},
    {href: '#contact', label: t.nav.contact},
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-[#F8F8F7]/90 backdrop-blur-md transition-colors duration-200 dark:border-white/10 dark:bg-[#0B0B0D]/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:gap-8 lg:px-8">
        {/* Zone 1: Clean Single-Line Brand Wordmark */}
        <a
          href="#home"
          className="flex items-center gap-2.5 whitespace-nowrap shrink-0 text-[#111215] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9933B] dark:text-[#F4F4F2]"
        >
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="h-7 w-7 shrink-0 text-[#A8741E] dark:text-[#D8A44C]"
            aria-hidden="true"
          >
            <polygon
              points="16,2 28,9 28,23 16,30 4,23 4,9"
              stroke="currentColor"
              strokeWidth="1.75"
              fill="none"
            />
            <path
              d="M11 19.5L14 12.5H18L21 19.5M12.75 16.8H19.25"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
          <span className="font-display text-base font-semibold tracking-tight sm:text-lg">
            {studioName}
          </span>
        </a>

        {/* Zone 2: Clean Single-Line Text Nav Links */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-6 xl:flex"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap shrink-0 text-sm font-medium text-neutral-600 underline-offset-8 transition-colors duration-150 hover:text-[#111215] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C9933B] dark:text-neutral-300 dark:hover:text-[#F4F4F2]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Interactive Controls & Primary CTA */}
        <div className="flex items-center gap-2 shrink-0 sm:gap-2.5">
          {/* Currency Selector */}
          <label className="sr-only" htmlFor="header-currency">
            Select currency
          </label>
          <select
            id="header-currency"
            value={currency}
            onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
            className="hidden h-9 cursor-pointer rounded-md border border-neutral-300 bg-white px-2.5 font-mono text-xs font-medium text-[#111215] transition-colors hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-[#C9933B] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:hover:border-white/30 sm:inline-block"
            aria-label="Currency selector"
          >
            {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
              <option key={code} value={code}>
                {CURRENCIES[code].label}
              </option>
            ))}
          </select>

          {/* Language Selector */}
          <label className="sr-only" htmlFor="header-language">
            Select language
          </label>
          <select
            id="header-language"
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            className="hidden h-9 cursor-pointer rounded-md border border-neutral-300 bg-white px-2.5 text-xs font-medium text-[#111215] transition-colors hover:border-neutral-400 focus-visible:outline-2 focus-visible:outline-[#C9933B] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:hover:border-white/30 md:inline-block"
            aria-label="Language selector"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Dark / Light Mode Switch */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-neutral-300 bg-white text-[#111215] transition-colors duration-150 hover:border-neutral-400 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-[#C9933B] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:hover:border-white/30 dark:hover:bg-white/10"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {/* Direct WhatsApp Chat */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.nav.whatsapp}
            title={t.nav.whatsapp}
            className="hidden h-9 items-center gap-1.5 whitespace-nowrap shrink-0 rounded-md border border-neutral-300 bg-white px-3 text-xs font-medium text-[#111215] transition-colors duration-150 hover:border-neutral-400 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-[#C9933B] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:hover:border-white/30 dark:hover:bg-white/10 lg:inline-flex"
          >
            <MessageCircle className="h-3.5 w-3.5 text-[#1E7E48] dark:text-[#4ADE80]" />
            <span>{t.nav.whatsapp}</span>
          </a>

          {/* Primary CTA */}
          <a
            href="#booking"
            className="inline-flex h-9 items-center justify-center whitespace-nowrap shrink-0 rounded-md bg-[#A8741E] px-4 text-xs font-semibold text-white transition-colors duration-150 hover:bg-[#8E6015] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9933B] dark:bg-[#D8A44C] dark:text-[#0B0B0D] dark:hover:bg-[#E5B562]"
          >
            {t.nav.bookNow}
          </a>

          {/* Mobile Drawer Trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-neutral-300 bg-white text-[#111215] transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-[#C9933B] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:hover:bg-white/10 xl:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-neutral-200 bg-[#F8F8F7] px-4 py-5 dark:border-white/10 dark:bg-[#0B0B0D] xl:hidden">
          <nav aria-label="Mobile" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-200/70 hover:text-[#111215] dark:text-neutral-200 dark:hover:bg-white/10 dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-neutral-200 pt-4 dark:border-white/10">
            <div>
              <label
                htmlFor="mobile-currency"
                className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400"
              >
                Currency
              </label>
              <select
                id="mobile-currency"
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 font-mono text-xs text-[#111215] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2]"
              >
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCIES[code].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="mobile-language"
                className="mb-1 block text-xs text-neutral-500 dark:text-neutral-400"
              >
                Language
              </label>
              <select
                id="mobile-language"
                value={language}
                onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-xs text-[#111215] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2]"
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white text-sm font-medium text-[#111215] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2]"
            >
              <MessageCircle className="h-4 w-4 text-[#1E7E48] dark:text-[#4ADE80]" />
              <span>{t.nav.whatsapp}</span>
            </a>
            <a
              href="#booking"
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-md bg-[#A8741E] text-sm font-semibold text-white dark:bg-[#D8A44C] dark:text-[#0B0B0D]"
            >
              {t.nav.bookNow}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
