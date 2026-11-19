import {ArrowRight, Check, Clock, ShieldCheck} from 'lucide-react';
import {useEffect, useState} from 'react';
import {BeforeAfterSlider} from './components/BeforeAfterSlider';
import {BookingSection} from './components/BookingSection';
import {FooterSection} from './components/FooterSection';
import {Navbar} from './components/Navbar';
import {Preloader} from './components/Preloader';
import {ReviewsAndCredentials} from './components/ReviewsAndCredentials';
import {StudioMapsProvider, useStudioPlace} from './components/StudioMapAndPlaceProvider';
import {
  CURRENCIES,
  CurrencyCode,
  formatConvertedPrice,
  LanguageCode,
  PackageId,
  SERVICE_PACKAGES,
  STUDIO_IMAGES,
  TRANSLATIONS,
  VEHICLE_MULTIPLIERS,
  VehicleSize,
} from './data/studioData';

function StudioExperience() {
  const place = useStudioPlace();

  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = window.localStorage.getItem('dc_theme');
    return saved ? saved === 'dark' : true;
  });
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [currency, setCurrency] = useState<CurrencyCode>('PKR');
  const [vehicleSize, setVehicleSize] = useState<VehicleSize>('sedan');
  const [selectedPackageId, setSelectedPackageId] = useState<PackageId>('ceramic');
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [heroImgFailed, setHeroImgFailed] = useState(false);

  const t = TRANSLATIONS[language];

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('dc_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    document.documentElement.dir = t.isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, t.isRtl]);

  useEffect(() => {
    const onQuotaExceeded = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', onQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', onQuotaExceeded);
  }, []);

  const handleSelectPackage = (pkgId: PackageId) => {
    setSelectedPackageId(pkgId);
    const bookingEl = document.getElementById('booking');
    if (bookingEl) {
      bookingEl.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  };

  const whatsappHref = `https://wa.me/${place.whatsappDigits}`;

  return (
    <div className="min-h-screen bg-[#F8F8F7] text-[#111215] transition-colors duration-200 dark:bg-[#0B0B0D] dark:text-[#F4F4F2]">
      <Preloader studioName={place.displayName} />

      {/* Google Maps Platform Demo Key Quota Banner (Non-Intrusive Top Bar) */}
      {quotaExceeded && (
        <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs text-amber-900 shadow-sm md:text-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-amber-950 underline hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      <Navbar
        studioName={place.displayName}
        language={language}
        onLanguageChange={setLanguage}
        currency={currency}
        onCurrencyChange={setCurrency}
        isDark={isDark}
        onToggleTheme={() => setIsDark((prev) => !prev)}
        whatsappHref={whatsappHref}
        t={t}
      />

      <main>
        {/* 1. Hero Section */}
        <section id="home" className="relative overflow-hidden bg-[#0B0B0D]">
          <div className="relative min-h-[76vh] w-full lg:min-h-[82vh]">
            {heroImgFailed ? (
              <div className="absolute inset-0 bg-gradient-to-br from-[#131417] via-[#0B0B0D] to-[#1A1610]" />
            ) : (
              <img
                src={STUDIO_IMAGES.heroBay}
                alt="Obsidian black Porsche sports sedan parked inside a modern hexagonal LED-lit luxury ceramic detailing bay"
                referrerPolicy="no-referrer"
                onError={() => setHeroImgFailed(true)}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            )}

            {/* Measured multi-stop scrim guaranteeing >= 7:1 text legibility */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#0B0B0D]/92 via-[#0B0B0D]/68 to-[#0B0B0D]/30"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/30"
            />

            <div className="relative mx-auto flex min-h-[76vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 lg:min-h-[82vh] lg:justify-center lg:px-8 lg:pb-20">
              <div className="max-w-2xl">
                <p className="text-xs font-medium tracking-wide text-[#D8A44C]">
                  {t.hero.kicker}
                </p>

                <h1 className="mt-4 font-display text-[clamp(2.35rem,4.6vw,4.15rem)] font-semibold leading-[1.06] tracking-tight text-[#F4F4F2] text-balance">
                  {t.hero.headline}
                </h1>

                <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                  {t.hero.subheadline}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#booking"
                    className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-md bg-[#D8A44C] px-6 text-sm font-semibold text-[#0B0B0D] transition-colors duration-150 hover:bg-[#E5B562] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D8A44C]"
                  >
                    <span>{t.hero.primaryCta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#packages"
                    className="inline-flex h-12 items-center whitespace-nowrap rounded-md border border-white/25 bg-black/30 px-6 text-sm font-medium text-[#F4F4F2] backdrop-blur-sm transition-colors duration-150 hover:border-white/50 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {t.hero.secondaryCta}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width Studio Specification Strip Below Hero Split */}
          <div className="border-t border-white/10 bg-[#101114] text-[#F4F4F2]">
            <div className="mx-auto grid max-w-7xl grid-cols-2 divide-y divide-white/10 px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:px-8">
              <div className="py-5 pr-4">
                <p className="font-mono text-lg font-semibold tabular-nums text-[#D8A44C]">
                  {place.rating !== null
                    ? `${place.rating.toFixed(1)} / 5.0`
                    : 'Google Verified'}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {place.userRatingCount !== null
                    ? `${t.hero.statRatingLabel} · ${place.userRatingCount} reviews`
                    : t.hero.statRatingLabel}
                </p>
              </div>
              <div className="py-5 lg:px-6">
                <p className="font-mono text-lg font-semibold tabular-nums">9H SiO₂</p>
                <p className="mt-0.5 text-xs text-neutral-400">{t.hero.statHardnessLabel}</p>
              </div>
              <div className="py-5 pr-4 lg:px-6">
                <p className="font-mono text-lg font-semibold tabular-nums">3-Stage</p>
                <p className="mt-0.5 text-xs text-neutral-400">{t.hero.statCorrectionLabel}</p>
              </div>
              <div className="py-5 lg:pl-6">
                <p className="font-mono text-lg font-semibold tabular-nums">pH-Neutral</p>
                <p className="mt-0.5 text-xs text-neutral-400">{t.hero.statChemistryLabel}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Live Before/After Transformation Gallery */}
        <BeforeAfterSlider t={t} />

        {/* 3. Services & Dynamic Multi-Currency Pricing Packages */}
        <section
          id="packages"
          className="border-t border-neutral-200/80 py-20 dark:border-white/10 lg:py-28"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-medium text-[#A8741E] dark:text-[#D8A44C]">
                  {t.packages.kicker}
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111215] text-balance dark:text-[#F4F4F2] sm:text-4xl">
                  {t.packages.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {t.packages.subtitle}
                </p>
              </div>

              {/* Interactive Vehicle Class & Live Currency Controls */}
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <div
                  role="group"
                  aria-label={t.packages.vehicleClassLabel}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-white/10 dark:bg-[#131417]"
                >
                  {(Object.keys(VEHICLE_MULTIPLIERS) as VehicleSize[]).map((sizeKey) => {
                    const active = vehicleSize === sizeKey;
                    return (
                      <button
                        key={sizeKey}
                        type="button"
                        onClick={() => setVehicleSize(sizeKey)}
                        className={`cursor-pointer whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#C9933B] ${
                          active
                            ? 'bg-white text-[#111215] shadow-sm dark:bg-[#23252B] dark:text-[#F4F4F2]'
                            : 'text-neutral-600 hover:text-[#111215] dark:text-neutral-400 dark:hover:text-[#F4F4F2]'
                        }`}
                      >
                        {VEHICLE_MULTIPLIERS[sizeKey].label[language]}
                      </button>
                    );
                  })}
                </div>
                <p className="font-mono text-[11px] tabular-nums text-neutral-500 dark:text-neutral-400">
                  {CURRENCIES[currency].label} · {t.packages.currencyNote}
                </p>
              </div>
            </div>

            {/* 3-Package Pricing Architecture */}
            <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-3">
              {SERVICE_PACKAGES.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                const priceDisplay = formatConvertedPrice(pkg.basePricePkr, currency, vehicleSize);

                return (
                  <article
                    key={pkg.id}
                    className={`flex flex-col justify-between rounded-xl border p-6 transition-colors duration-150 lg:p-8 ${
                      pkg.featured
                        ? 'border-[#A8741E] bg-white dark:border-[#D8A44C]/60 dark:bg-[#15161A]'
                        : 'border-neutral-200 bg-white dark:border-white/10 dark:bg-[#131417]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-mono font-medium text-[#A8741E] dark:text-[#D8A44C]">
                          {pkg.index}
                          {pkg.featured ? ` · ${t.packages.signatureLabel}` : ''}
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono tabular-nums text-neutral-500 dark:text-neutral-400">
                          <Clock className="h-3.5 w-3.5" />
                          {pkg.duration[language]}
                        </span>
                      </div>

                      <h3 className="mt-3 font-display text-xl font-semibold leading-snug text-[#111215] dark:text-[#F4F4F2]">
                        {pkg.name[language]}
                      </h3>

                      <p className="mt-2.5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {pkg.subtitle[language]}
                      </p>

                      <div className="mt-6 border-y border-neutral-200 py-5 dark:border-white/10">
                        <p className="font-mono text-3xl font-semibold tabular-nums text-[#111215] dark:text-[#F4F4F2]">
                          {priceDisplay}
                        </p>
                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          {VEHICLE_MULTIPLIERS[vehicleSize].label[language]} · {t.packages.estimatedTime}:{' '}
                          {pkg.duration[language]}
                        </p>
                      </div>

                      <ul className="mt-6 space-y-3">
                        {pkg.features[language].map((feat) => (
                          <li
                            key={feat}
                            className="flex items-start gap-2.5 text-sm text-neutral-700 dark:text-neutral-300"
                          >
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#A8741E] dark:text-[#D8A44C]" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`mt-8 inline-flex h-11 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 text-sm font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9933B] ${
                        pkg.featured || isSelected
                          ? 'bg-[#A8741E] text-white hover:bg-[#8E6015] dark:bg-[#D8A44C] dark:text-[#0B0B0D] dark:hover:bg-[#E5B562]'
                          : 'border border-neutral-300 bg-transparent text-[#111215] hover:border-[#A8741E] hover:text-[#A8741E] dark:border-white/15 dark:text-[#F4F4F2] dark:hover:border-[#D8A44C] dark:hover:text-[#D8A44C]'
                      }`}
                    >
                      {isSelected && <ShieldCheck className="h-4 w-4" />}
                      <span>{isSelected ? t.packages.selectedBtn : t.packages.selectBtn}</span>
                    </button>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Studio Credentials & Live Verified Google Reviews */}
        <ReviewsAndCredentials t={t} />

        {/* 5. Interactive Appointment Booking System */}
        <BookingSection
          language={language}
          currency={currency}
          selectedPackageId={selectedPackageId}
          onSelectPackageId={setSelectedPackageId}
          vehicleSize={vehicleSize}
          onSelectVehicleSize={setVehicleSize}
          t={t}
        />
      </main>

      {/* 6. Footer & Interactive Google Maps Location */}
      <FooterSection isDark={isDark} t={t} />
    </div>
  );
}

export default function App() {
  return (
    <StudioMapsProvider>
      <StudioExperience />
    </StudioMapsProvider>
  );
}
