import {ExternalLink, ShieldCheck, Star} from 'lucide-react';
import {useEffect, useRef, useState} from 'react';
import {STUDIO_IMAGES, TranslationCopy} from '../data/studioData';
import {LiveGoogleReview, useStudioPlace} from './StudioMapAndPlaceProvider';

function useCountUp(target: number, durationMs = 1100, startWhenVisible = true) {
  const [value, setValue] = useState(0);
  const [triggered, setTriggered] = useState(!startWhenVisible);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!startWhenVisible || triggered) return;
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setTriggered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setTriggered(true);
          observer.disconnect();
        }
      },
      {threshold: 0.25}
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [startWhenVisible, triggered]);

  useEffect(() => {
    if (!triggered) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setValue(target);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - startTime) / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [triggered, target, durationMs]);

  return {ref, value};
}

function ReviewerAvatar({
  photoUri,
  name,
}: {
  photoUri: string | null;
  name: string;
}) {
  const [imgError, setImgError] = useState(false);
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  if (!photoUri || imgError) {
    return (
      <div
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-neutral-300 bg-neutral-100 font-display text-xs font-semibold text-[#111215] dark:border-white/15 dark:bg-white/10 dark:text-[#F4F4F2]"
      >
        {initials || 'G'}
      </div>
    );
  }

  return (
    <img
      src={photoUri}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setImgError(true)}
      className="h-10 w-10 shrink-0 rounded-full border border-neutral-200 object-cover dark:border-white/15"
    />
  );
}

function ReviewCard({review}: {review: LiveGoogleReview}) {
  const stars = Math.round(review.rating);

  return (
    <article className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-[#131417]">
      <div>
        <div className="flex items-center justify-between gap-3">
          <div
            className="flex items-center gap-0.5 text-[#C9933B] dark:text-[#D8A44C]"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {Array.from({length: 5}).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < stars ? 'fill-current' : 'text-neutral-300 dark:text-neutral-700'
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
            {review.rating.toFixed(1)} · Google
          </span>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
          “{review.text}”
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-neutral-200 pt-4 dark:border-white/10">
        <ReviewerAvatar photoUri={review.authorPhotoUri} name={review.authorName} />
        <div className="min-w-0 flex-1">
          {review.authorUri ? (
            <a
              href={review.authorUri}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm font-semibold text-[#111215] hover:text-[#A8741E] hover:underline dark:text-[#F4F4F2] dark:hover:text-[#D8A44C]"
            >
              {review.authorName}
            </a>
          ) : (
            <p className="truncate text-sm font-semibold text-[#111215] dark:text-[#F4F4F2]">
              {review.authorName}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            <span>Verified Google Reviewer</span>
            {review.relativeTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{review.relativeTime}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ReviewsAndCredentials({t}: {t: TranslationCopy}) {
  const place = useStudioPlace();
  const carsCounter = useCountUp(1500, 1200);
  const yearsCounter = useCountUp(10, 900);
  const [craftImgFailed, setCraftImgFailed] = useState(false);

  return (
    <>
      {/* Why Choose Us & Studio Credentials */}
      <section
        id="services"
        className="border-t border-neutral-200/80 py-20 dark:border-white/10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#A8741E] dark:text-[#D8A44C]">
              {t.credentials.kicker}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111215] text-balance dark:text-[#F4F4F2] sm:text-4xl">
              {t.credentials.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t.credentials.subtitle}
            </p>
          </div>

          {/* Animated Studio Metrics Strip */}
          <div
            ref={carsCounter.ref}
            className="mt-10 grid grid-cols-2 divide-y divide-neutral-200 border-y border-neutral-200 dark:divide-white/10 dark:border-white/10 lg:grid-cols-4 lg:divide-x lg:divide-y-0"
          >
            <div className="py-6 pr-6">
              <p className="font-mono text-3xl font-semibold tabular-nums text-[#111215] dark:text-[#F4F4F2] sm:text-4xl">
                {carsCounter.value.toLocaleString('en-US')}+
              </p>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                {t.credentials.statCars}
              </p>
            </div>
            <div ref={yearsCounter.ref} className="py-6 lg:px-6">
              <p className="font-mono text-3xl font-semibold tabular-nums text-[#111215] dark:text-[#F4F4F2] sm:text-4xl">
                {yearsCounter.value}+
              </p>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                {t.credentials.statYears}
              </p>
            </div>
            <div className="py-6 pr-6 lg:px-6">
              <p className="font-mono text-3xl font-semibold tabular-nums text-[#A8741E] dark:text-[#D8A44C] sm:text-4xl">
                {place.rating !== null ? `${place.rating.toFixed(1)} ★` : 'Google ★'}
              </p>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                {place.userRatingCount !== null
                  ? `${t.credentials.statRating} (${place.userRatingCount})`
                  : t.credentials.statRating}
              </p>
            </div>
            <div className="py-6 lg:pl-6">
              <p className="font-mono text-3xl font-semibold tabular-nums text-[#111215] dark:text-[#F4F4F2] sm:text-4xl">
                9H SiO₂
              </p>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                {t.credentials.statCoatings}
              </p>
            </div>
          </div>

          {/* 2-Column Editorial Credentials Split */}
          <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-12">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-900 dark:border-white/10 lg:col-span-5">
              {craftImgFailed ? (
                <div className="flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-neutral-300">
                  <ShieldCheck className="mb-3 h-9 w-9 text-[#D8A44C]" />
                  <p className="font-display text-base font-medium">
                    9H SiO₂ Studio Bay Protocol
                  </p>
                </div>
              ) : (
                <img
                  src={STUDIO_IMAGES.ceramicCraft}
                  alt="Certified automotive technician carefully laying liquid 9H ceramic protection onto corrected metallic clear coat"
                  referrerPolicy="no-referrer"
                  onError={() => setCraftImgFailed(true)}
                  className="h-full min-h-[320px] w-full object-cover object-left"
                />
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
              {t.credentials.pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-[#131417]"
                >
                  <div>
                    <h3 className="font-display text-lg font-semibold text-[#111215] dark:text-[#F4F4F2]">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Authentic Google Maps Reviews Section */}
      <section
        id="reviews"
        className="border-t border-neutral-200/80 py-20 dark:border-white/10 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-medium text-[#A8741E] dark:text-[#D8A44C]">
                {t.reviews.kicker}
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111215] text-balance dark:text-[#F4F4F2] sm:text-4xl">
                {t.reviews.title}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
                {t.reviews.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {place.rating !== null && (
                <div className="flex items-center gap-2 text-sm text-[#111215] dark:text-[#F4F4F2]">
                  <Star className="h-4 w-4 fill-[#C9933B] text-[#C9933B] dark:fill-[#D8A44C] dark:text-[#D8A44C]" />
                  <span className="font-mono font-semibold tabular-nums">
                    {place.rating.toFixed(1)}
                  </span>
                  {place.userRatingCount !== null && (
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      · {place.userRatingCount} {t.reviews.basedOn}
                    </span>
                  )}
                </div>
              )}

              <a
                href={place.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-md border border-neutral-300 bg-white px-4 text-xs font-medium text-[#111215] transition-colors hover:border-[#A8741E] hover:text-[#A8741E] dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:hover:border-[#D8A44C] dark:hover:text-[#D8A44C]"
              >
                <span>{t.reviews.viewOnMaps}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Live Google Reviews States */}
          {place.isLoading ? (
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[0, 1, 2].map((skeleton) => (
                <div
                  key={skeleton}
                  className="h-56 animate-pulse rounded-xl border border-neutral-200 bg-neutral-100 p-6 dark:border-white/10 dark:bg-[#131417]"
                >
                  <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-white/10" />
                  <div className="mt-5 space-y-2.5">
                    <div className="h-3 w-full rounded bg-neutral-200 dark:bg-white/10" />
                    <div className="h-3 w-5/6 rounded bg-neutral-200 dark:bg-white/10" />
                    <div className="h-3 w-4/6 rounded bg-neutral-200 dark:bg-white/10" />
                  </div>
                </div>
              ))}
              <p className="text-xs text-neutral-500 dark:text-neutral-400 md:col-span-3">
                {t.reviews.loadingText}
              </p>
            </div>
          ) : place.reviews.length > 0 ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {place.reviews.slice(0, 6).map((rev, idx) => (
                <ReviewCard key={`${rev.authorName}-${idx}`} review={rev} />
              ))}
            </div>
          ) : (
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-8 dark:border-white/10 dark:bg-[#131417] sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-lg font-semibold text-[#111215] dark:text-[#F4F4F2]">
                  {t.reviews.verifiedSource} · {place.displayName}
                </p>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {t.reviews.emptyNotice}
                </p>
              </div>
              <a
                href={place.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-[#A8741E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#8E6015] dark:bg-[#D8A44C] dark:text-[#0B0B0D] dark:hover:bg-[#E5B562]"
              >
                <span>{t.reviews.viewOnMaps}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          )}

          <p className="mt-6 text-xs text-neutral-500 dark:text-neutral-400">
            Powered by Google Maps Platform · {t.reviews.verifiedSource}
          </p>
        </div>
      </section>
    </>
  );
}
