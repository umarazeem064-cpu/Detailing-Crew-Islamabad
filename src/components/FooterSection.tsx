import {Clock, ExternalLink, MapPin, MessageCircle, Navigation, Phone} from 'lucide-react';
import {STUDIO_DEFAULTS, TranslationCopy} from '../data/studioData';
import {StudioLocationMap, useStudioPlace} from './StudioMapAndPlaceProvider';

interface FooterSectionProps {
  isDark: boolean;
  t: TranslationCopy;
}

export function FooterSection({isDark, t}: FooterSectionProps) {
  const place = useStudioPlace();

  const todayName = new Intl.DateTimeFormat('en-US', {weekday: 'long'}).format(new Date());
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`;
  const whatsappUrl = `https://wa.me/${place.whatsappDigits}`;

  return (
    <footer
      id="contact"
      className="border-t border-neutral-200/80 bg-white pt-20 pb-12 dark:border-white/10 dark:bg-[#0E0F12] lg:pt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#A8741E] dark:text-[#D8A44C]">
            {t.footer.locationKicker}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111215] text-balance dark:text-[#F4F4F2] sm:text-4xl">
            {t.footer.locationTitle}
          </h2>
        </div>

        {/* Interactive Google Map + Live Hours & Contact Split */}
        <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <StudioLocationMap
              isDark={isDark}
              directionsLabel={t.footer.directionsBtn}
              openMapsLabel={t.footer.openMapsBtn}
            />
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-[#F8F8F7] p-6 dark:border-white/10 dark:bg-[#131417] lg:col-span-5 lg:p-8">
            <div className="space-y-6">
              {/* Studio Address */}
              <div>
                <p className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  <MapPin className="h-3.5 w-3.5 text-[#A8741E] dark:text-[#D8A44C]" />
                  <span>{t.footer.addressLabel}</span>
                </p>
                <p className="mt-2 font-display text-lg font-semibold text-[#111215] dark:text-[#F4F4F2]">
                  {place.displayName}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {place.formattedAddress}
                </p>
                <p className="mt-1 font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                  {place.location.lat.toFixed(5)}° N, {place.location.lng.toFixed(5)}° E
                </p>
              </div>

              {/* Direct Phone & WhatsApp */}
              <div className="border-t border-neutral-200 pt-5 dark:border-white/10">
                <p className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  <Phone className="h-3.5 w-3.5 text-[#A8741E] dark:text-[#D8A44C]" />
                  <span>{t.footer.phoneLabel}</span>
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                  <a
                    href={`tel:${place.phoneHref}`}
                    className="font-mono text-base font-medium tabular-nums text-[#111215] hover:text-[#A8741E] dark:text-[#F4F4F2] dark:hover:text-[#D8A44C]"
                  >
                    {place.phoneDisplay}
                  </a>
                  <span aria-hidden="true" className="text-neutral-400">
                    ·
                  </span>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1E7E48] hover:underline dark:text-[#4ADE80]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t.footer.whatsappSupport}</span>
                  </a>
                </div>
              </div>

              {/* Live Opening & Closing Hours */}
              <div className="border-t border-neutral-200 pt-5 dark:border-white/10">
                <p className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  <Clock className="h-3.5 w-3.5 text-[#A8741E] dark:text-[#D8A44C]" />
                  <span>{t.footer.hoursLabel}</span>
                </p>

                {place.weekdayDescriptions.length > 0 ? (
                  <ul className="mt-3 space-y-1.5 font-mono text-xs tabular-nums">
                    {place.weekdayDescriptions.map((line) => {
                      const isToday = line.toLowerCase().startsWith(todayName.toLowerCase());
                      return (
                        <li
                          key={line}
                          className={`flex justify-between gap-4 py-0.5 ${
                            isToday
                              ? 'font-semibold text-[#A8741E] dark:text-[#D8A44C]'
                              : 'text-neutral-600 dark:text-neutral-300'
                          }`}
                        >
                          <span>{line}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="mt-2.5 text-sm text-neutral-600 dark:text-neutral-400">
                    {t.footer.hoursUnavailable}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-neutral-200 pt-6 dark:border-white/10">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#A8741E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#8E6015] dark:bg-[#D8A44C] dark:text-[#0B0B0D] dark:hover:bg-[#E5B562]"
              >
                <Navigation className="h-3.5 w-3.5" />
                <span>{t.footer.directionsBtn}</span>
              </a>
              <a
                href={place.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md border border-neutral-300 bg-white px-4 text-xs font-medium text-[#111215] transition-colors hover:border-neutral-400 dark:border-white/15 dark:bg-transparent dark:text-[#F4F4F2] dark:hover:border-white/30"
              >
                <span>{t.footer.openMapsBtn}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Navigation, Socials & Quiet Legal Footer */}
        <div className="mt-16 flex flex-col justify-between gap-8 border-t border-neutral-200 pt-8 dark:border-white/10 md:flex-row md:items-center">
          <div>
            <p className="font-display text-base font-semibold text-[#111215] dark:text-[#F4F4F2]">
              {place.displayName}
            </p>
            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} {place.displayName}. {t.footer.rights} · {t.footer.credit}
            </p>
            <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-500">
              Interactive map & listing details powered by Google Maps Platform. Subject to{' '}
              <a
                href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-800 dark:hover:text-neutral-300"
              >
                Google Maps Terms
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/privacy?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-neutral-800 dark:hover:text-neutral-300"
              >
                Google Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <span className="text-neutral-400 dark:text-neutral-500">{t.footer.followUs}:</span>
            <a
              href={STUDIO_DEFAULTS.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#A8741E] dark:hover:text-[#D8A44C]"
            >
              Instagram
            </a>
            <a
              href={STUDIO_DEFAULTS.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#A8741E] dark:hover:text-[#D8A44C]"
            >
              TikTok
            </a>
            <a
              href={STUDIO_DEFAULTS.socials.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#A8741E] dark:hover:text-[#D8A44C]"
            >
              YouTube
            </a>
            <a
              href={STUDIO_DEFAULTS.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[#A8741E] dark:hover:text-[#D8A44C]"
            >
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
