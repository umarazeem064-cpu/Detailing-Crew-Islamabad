import {MoveHorizontal, ShieldCheck} from 'lucide-react';
import React, {useCallback, useRef, useState} from 'react';
import {STUDIO_IMAGES, TranslationCopy} from '../data/studioData';

interface BeforeAfterSliderProps {
  t: TranslationCopy;
}

type GalleryTab = 'paint' | 'ceramic' | 'interior';

function ResilientImage({
  src,
  alt,
  className,
  fallbackTitle,
}: {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 p-6 text-center text-neutral-300 ${className ?? ''}`}
      >
        <ShieldCheck className="mb-2 h-8 w-8 text-[#D8A44C]" />
        <span className="font-display text-sm font-medium">{fallbackTitle}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
      draggable={false}
    />
  );
}

export function BeforeAfterSlider({t}: BeforeAfterSliderProps) {
  const [activeTab, setActiveTab] = useState<GalleryTab>('paint');
  const [position, setPosition] = useState(52);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(96, Math.max(4, ratio)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  return (
    <section
      id="gallery"
      className="border-t border-neutral-200/80 py-20 dark:border-white/10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-[#A8741E] dark:text-[#D8A44C]">
              {t.gallery.kicker}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111215] text-balance dark:text-[#F4F4F2] sm:text-4xl">
              {t.gallery.title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t.gallery.subtitle}
            </p>
          </div>

          {/* Interactive Gallery Filter Tabs */}
          <div
            role="tablist"
            aria-label="Transformation showcase categories"
            className="inline-flex w-fit items-center gap-1 rounded-lg border border-neutral-200 bg-neutral-100 p-1 dark:border-white/10 dark:bg-[#131417]"
          >
            {(
              [
                {id: 'paint', label: t.gallery.tabPaint},
                {id: 'ceramic', label: t.gallery.tabCeramic},
                {id: 'interior', label: t.gallery.tabInterior},
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-pointer whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[#C9933B] ${
                    active
                      ? 'bg-white text-[#111215] shadow-sm dark:bg-[#23252B] dark:text-[#F4F4F2]'
                      : 'text-neutral-600 hover:text-[#111215] dark:text-neutral-400 dark:hover:text-[#F4F4F2]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab 1: Interactive Paint Correction Before/After Slider */}
        {activeTab === 'paint' && (
          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div
                ref={containerRef}
                dir="ltr"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative aspect-[4/3] w-full cursor-ew-resize select-none overflow-hidden rounded-xl border border-neutral-200 bg-neutral-950 touch-none dark:border-white/10"
              >
                {/* Base Layer: AFTER (Mirror 9H Ceramic Gloss) */}
                <ResilientImage
                  src={STUDIO_IMAGES.afterCeramic}
                  alt="Jet-black luxury car hood after multi-stage paint correction and 9H ceramic coating with mirror reflection"
                  fallbackTitle="After 9H Ceramic Coating"
                  className="h-full w-full object-cover"
                />

                {/* Clipped Overlay Layer: BEFORE (Swirl Marks & Oxidation) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{clipPath: `inset(0 ${100 - position}% 0 0)`}}
                >
                  <ResilientImage
                    src={STUDIO_IMAGES.beforeSwirls}
                    alt="Neglected jet-black car hood before detailing showing wash swirls, oxidation, and hard-water spots"
                    fallbackTitle="Before Paint Correction"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Measured bottom contrast captions */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/35 to-transparent px-4 pb-4 pt-12 text-xs font-medium text-white sm:px-6">
                  <span>{t.gallery.beforeLabel}</span>
                  <span>{t.gallery.afterLabel}</span>
                </div>

                {/* Vertical Divider & Tactile Handle */}
                <div
                  className="pointer-events-none absolute inset-y-0 w-[2px] bg-[#D8A44C]"
                  style={{left: `${position}%`}}
                >
                  <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#D8A44C] bg-[#0B0B0D]/90 text-[#F4F4F2] shadow-lg">
                    <MoveHorizontal className="h-4 w-4 text-[#D8A44C]" />
                  </div>
                </div>
              </div>

              {/* Accessible Range Control & Preset Snap Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t.gallery.dragHint}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPosition(88)}
                    className="cursor-pointer whitespace-nowrap rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/10"
                  >
                    {t.gallery.btnBefore}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition(50)}
                    className="cursor-pointer whitespace-nowrap rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/10"
                  >
                    {t.gallery.btnSplit}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition(12)}
                    className="cursor-pointer whitespace-nowrap rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-white/15 dark:text-neutral-300 dark:hover:bg-white/10"
                  >
                    {t.gallery.btnAfter}
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={4}
                max={96}
                value={Math.round(position)}
                onChange={(e) => setPosition(Number(e.target.value))}
                aria-label="Before and after paint correction comparison slider"
                className="sr-only"
              />
            </div>

            {/* Technical Inspection Breakdown Column */}
            <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-[#131417] lg:col-span-4 lg:p-8">
              <div>
                <p className="font-mono text-xs text-[#A8741E] dark:text-[#D8A44C]">
                  01 · Inspection Case
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#111215] dark:text-[#F4F4F2]">
                  3-Stage Optical Paint Correction & 9H Shield
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Harsh automated washes and mineral water spotting leave microscopic grooves that scatter light. Our progressive compounding and jeweling stages level the clear coat before locking depth beneath dual-layer 9H SiO2.
                </p>

                <dl className="mt-6 space-y-4 border-t border-neutral-200 pt-6 dark:border-white/10">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-xs text-neutral-500 dark:text-neutral-400">
                      Defect Elimination
                    </dt>
                    <dd className="font-mono text-sm font-medium tabular-nums text-[#111215] dark:text-[#F4F4F2]">
                      92% – 96% Swirl Removal
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-xs text-neutral-500 dark:text-neutral-400">
                      Gloss Reading (60° GU)
                    </dt>
                    <dd className="font-mono text-sm font-medium tabular-nums text-[#111215] dark:text-[#F4F4F2]">
                      68 GU → 96 GU
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-xs text-neutral-500 dark:text-neutral-400">
                      Water Contact Angle
                    </dt>
                    <dd className="font-mono text-sm font-medium tabular-nums text-[#111215] dark:text-[#F4F4F2]">
                      114° Hydrophobic
                    </dd>
                  </div>
                </dl>
              </div>

              <a
                href="#packages"
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-md border border-neutral-300 px-4 text-sm font-medium text-[#111215] transition-colors hover:border-[#A8741E] hover:text-[#A8741E] dark:border-white/15 dark:text-[#F4F4F2] dark:hover:border-[#D8A44C] dark:hover:text-[#D8A44C]"
              >
                {t.hero.secondaryCta}
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: 9H Ceramic Application & Hydrophobic Beading */}
        {activeTab === 'ceramic' && (
          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
            <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#131417]">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-900">
                <ResilientImage
                  src={STUDIO_IMAGES.ceramicCraft}
                  alt="Technician in black nitrile gloves applying liquid 9H ceramic coating with a microfiber applicator block onto metallic paintwork"
                  fallbackTitle="9H Ceramic Application"
                  className="h-full w-full object-cover object-left"
                />
              </div>
              <div className="p-6">
                <p className="font-mono text-xs text-[#A8741E] dark:text-[#D8A44C]">
                  Stage 01 · Molecular Bonding
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[#111215] dark:text-[#F4F4F2]">
                  Hand-Laid 9H SiO2 Ceramic Matrix
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  Cross-hatched panel by panel inside a dust-filtered bay, creating a covalent glass-like barrier against Islamabad summer UV rays, road tar, and bird droppings.
                </p>
              </div>
            </article>

            <article className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-white/10 dark:bg-[#131417]">
              <div className="aspect-[4/3] overflow-hidden bg-neutral-900">
                <ResilientImage
                  src={STUDIO_IMAGES.hydrophobicBeads}
                  alt="Tight crystal-clear water beads resting on a freshly 9H ceramic coated metallic dark hood"
                  fallbackTitle="Hydrophobic Water Beading"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-6">
                <p className="font-mono text-xs text-[#A8741E] dark:text-[#D8A44C]">
                  Stage 02 · Self-Cleaning Surface Tension
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-[#111215] dark:text-[#F4F4F2]">
                  Extreme Hydrophobic Water Sheeting
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  High surface tension forces water, monsoon mud, and dust to bead tightly and roll off cleanly—cutting routine wash times in half while preserving candy-wet depth.
                </p>
              </div>
            </article>
          </div>
        )}

        {/* Tab 3: Cabin Steam Sanitization & Matte Leather Care */}
        {activeTab === 'interior' && (
          <div className="mt-10 grid items-stretch gap-8 lg:grid-cols-12">
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-900 dark:border-white/10 lg:col-span-8">
              <ResilientImage
                src={STUDIO_IMAGES.interiorDetail}
                alt="Luxury saddle-tan quilted Nappa leather sports car interior and Alcantara steering wheel after deep steam restoration"
                fallbackTitle="Interior Deep Restoration"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-[#131417] lg:col-span-4 lg:p-8">
              <div>
                <p className="font-mono text-xs text-[#A8741E] dark:text-[#D8A44C]">
                  Cabin Atelier · Factory Matte Finish
                </p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-[#111215] dark:text-[#F4F4F2]">
                  Dry-Vapor Sanitization & Nappa Leather Conditioning
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  We never coat interiors in sticky silicone shine. Instead, 150°C dry steam sanitizes vents and stitching while pH-balanced leather balms restore supple, satin-matte showroom grain.
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-neutral-200 pt-6 text-sm text-neutral-700 dark:border-white/10 dark:text-neutral-300">
                  <li>· Safe Alcantara & suede fiber revival</li>
                  <li>· Perforated leather pore extraction</li>
                  <li>· Anti-static matte UV dash protection</li>
                  <li>· Odor-neutralizing HVAC steam flush</li>
                </ul>
              </div>

              <a
                href="#booking"
                className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-md bg-[#A8741E] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#8E6015] dark:bg-[#D8A44C] dark:text-[#0B0B0D] dark:hover:bg-[#E5B562]"
              >
                {t.hero.primaryCta}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
