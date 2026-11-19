import {Calendar, CheckCircle2, Clock, MapPin, MessageCircle, X} from 'lucide-react';
import React, {useEffect, useMemo, useState} from 'react';
import {
  CurrencyCode,
  formatConvertedPrice,
  LanguageCode,
  PackageId,
  SERVICE_PACKAGES,
  TranslationCopy,
  VEHICLE_MULTIPLIERS,
  VehicleSize,
} from '../data/studioData';
import {useStudioPlace} from './StudioMapAndPlaceProvider';

interface BookingSectionProps {
  language: LanguageCode;
  currency: CurrencyCode;
  selectedPackageId: PackageId;
  onSelectPackageId: (id: PackageId) => void;
  vehicleSize: VehicleSize;
  onSelectVehicleSize: (size: VehicleSize) => void;
  t: TranslationCopy;
}

interface BookingReceipt {
  refCode: string;
  fullName: string;
  phone: string;
  whatsapp: string;
  vehicle: string;
  vehicleSizeLabel: string;
  packageName: string;
  priceFormatted: string;
  duration: string;
  date: string;
  timeSlot: string;
  notes: string;
}

const TIME_SLOTS = ['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'];

export function BookingSection({
  language,
  currency,
  selectedPackageId,
  onSelectPackageId,
  vehicleSize,
  onSelectVehicleSize,
  t,
}: BookingSectionProps) {
  const place = useStudioPlace();

  const todayIso = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  const [vehicle, setVehicle] = useState('');
  const [date, setDate] = useState(todayIso);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);

  useEffect(() => {
    if (sameAsPhone) {
      setWhatsapp(phone);
    }
  }, [phone, sameAsPhone]);

  const activePackage =
    SERVICE_PACKAGES.find((pkg) => pkg.id === selectedPackageId) || SERVICE_PACKAGES[2];

  const livePrice = formatConvertedPrice(activePackage.basePricePkr, currency, vehicleSize);
  const activeDuration = activePackage.duration[language];
  const vehicleSizeLabel = VEHICLE_MULTIPLIERS[vehicleSize].label[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};

    if (fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    const phoneDigits = phone.replace(/[^\d]/g, '');
    if (phoneDigits.length < 7) {
      nextErrors.phone = 'Please enter a valid contact number.';
    }
    const effectiveWhatsapp = sameAsPhone ? phone : whatsapp;
    if (effectiveWhatsapp.replace(/[^\d]/g, '').length < 7) {
      nextErrors.whatsapp = 'Please enter a valid WhatsApp number.';
    }
    if (vehicle.trim().length < 3) {
      nextErrors.vehicle = 'Please specify your vehicle make, model, and year.';
    }
    if (!date) {
      nextErrors.date = 'Please pick your preferred date.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    setReceipt({
      refCode: `DC-ISB-${randomCode}`,
      fullName: fullName.trim(),
      phone: phone.trim(),
      whatsapp: effectiveWhatsapp.trim(),
      vehicle: vehicle.trim(),
      vehicleSizeLabel,
      packageName: activePackage.name[language],
      priceFormatted: livePrice,
      duration: activeDuration,
      date,
      timeSlot,
      notes: notes.trim(),
    });
  };

  const whatsappConfirmUrl = useMemo(() => {
    if (!receipt) return `https://wa.me/${place.whatsappDigits}`;
    const lines = [
      `Hello ${place.displayName}, I have reserved a detailing slot:`,
      `Ref: ${receipt.refCode}`,
      `Client: ${receipt.fullName}`,
      `Vehicle: ${receipt.vehicle} (${receipt.vehicleSizeLabel})`,
      `Package: ${receipt.packageName} (${receipt.priceFormatted})`,
      `Preferred Schedule: ${receipt.date} at ${receipt.timeSlot}`,
      receipt.notes ? `Notes: ${receipt.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    return `https://wa.me/${place.whatsappDigits}?text=${encodeURIComponent(lines)}`;
  }, [receipt, place.displayName, place.whatsappDigits]);

  const directConciergeUrl = useMemo(() => {
    const msg = `Hello ${place.displayName}, I would like to inquire about "${activePackage.name.en}" (${livePrice}) for my ${vehicle || vehicleSizeLabel}.`;
    return `https://wa.me/${place.whatsappDigits}?text=${encodeURIComponent(msg)}`;
  }, [place.displayName, place.whatsappDigits, activePackage.name.en, livePrice, vehicle, vehicleSizeLabel]);

  return (
    <section
      id="booking"
      className="border-t border-neutral-200/80 py-20 dark:border-white/10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-medium text-[#A8741E] dark:text-[#D8A44C]">
            {t.booking.kicker}
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#111215] text-balance dark:text-[#F4F4F2] sm:text-4xl">
            {t.booking.title}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-neutral-600 dark:text-neutral-400">
            {t.booking.subtitle}
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
          {/* Left Summary & Concierge Column */}
          <aside className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-[#131417] lg:col-span-4 lg:p-8">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              {t.booking.summaryTitle}
            </p>
            <h3 className="mt-2 font-display text-xl font-semibold text-[#111215] dark:text-[#F4F4F2]">
              {activePackage.index}. {activePackage.name[language]}
            </h3>

            <div className="mt-6 space-y-4 border-y border-neutral-200 py-5 dark:border-white/10">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t.booking.estimatedTotal}
                </span>
                <span className="font-mono text-2xl font-semibold tabular-nums text-[#A8741E] dark:text-[#D8A44C]">
                  {livePrice}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t.packages.vehicleClassLabel}
                </span>
                <span className="text-sm font-medium text-[#111215] dark:text-[#F4F4F2]">
                  {vehicleSizeLabel}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {t.booking.studioDuration}
                </span>
                <span className="font-mono text-sm tabular-nums text-[#111215] dark:text-[#F4F4F2]">
                  {activeDuration}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A8741E] dark:text-[#D8A44C]" />
                <span>{place.formattedAddress}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#A8741E] dark:text-[#D8A44C]" />
                <span>
                  {place.weekdayDescriptions.length > 0
                    ? place.weekdayDescriptions[0]
                    : t.footer.hoursUnavailable}
                </span>
              </div>
            </div>

            <a
              href={directConciergeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-neutral-300 bg-neutral-50 px-4 text-sm font-medium text-[#111215] transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-white/15 dark:bg-white/5 dark:text-[#F4F4F2] dark:hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 text-[#1E7E48] dark:text-[#4ADE80]" />
              <span>{t.booking.conciergeLabel}</span>
            </a>
          </aside>

          {/* Right Interactive Booking Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-white/10 dark:bg-[#131417] lg:col-span-8 lg:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="booking-name"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t.booking.fullName} *
                </label>
                <input
                  id="booking-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Hamza Tariq"
                  className="h-11 w-full rounded-md border border-neutral-300 bg-transparent px-3.5 text-sm text-[#111215] placeholder:text-neutral-400 focus:border-[#A8741E] focus:outline-none dark:border-white/15 dark:text-[#F4F4F2] dark:placeholder:text-neutral-500 dark:focus:border-[#D8A44C]"
                />
                {errors.fullName && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="booking-phone"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t.booking.phone} *
                </label>
                <input
                  id="booking-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="h-11 w-full rounded-md border border-neutral-300 bg-transparent px-3.5 font-mono text-sm text-[#111215] placeholder:text-neutral-400 focus:border-[#A8741E] focus:outline-none dark:border-white/15 dark:text-[#F4F4F2] dark:placeholder:text-neutral-500 dark:focus:border-[#D8A44C]"
                />
                {errors.phone && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label
                    htmlFor="booking-whatsapp"
                    className="block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    {t.booking.whatsapp} *
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <input
                      type="checkbox"
                      checked={sameAsPhone}
                      onChange={(e) => setSameAsPhone(e.target.checked)}
                      className="h-3.5 w-3.5 accent-[#A8741E] dark:accent-[#D8A44C]"
                    />
                    <span>{t.booking.sameAsPhone}</span>
                  </label>
                </div>
                <input
                  id="booking-whatsapp"
                  type="tel"
                  required
                  disabled={sameAsPhone}
                  value={sameAsPhone ? phone : whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="h-11 w-full rounded-md border border-neutral-300 bg-transparent px-3.5 font-mono text-sm text-[#111215] placeholder:text-neutral-400 focus:border-[#A8741E] focus:outline-none disabled:opacity-60 dark:border-white/15 dark:text-[#F4F4F2] dark:placeholder:text-neutral-500 dark:focus:border-[#D8A44C]"
                />
                {errors.whatsapp && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.whatsapp}
                  </p>
                )}
              </div>

              {/* Vehicle Make, Model & Year */}
              <div>
                <label
                  htmlFor="booking-vehicle"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t.booking.vehicleLabel} *
                </label>
                <input
                  id="booking-vehicle"
                  type="text"
                  required
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value)}
                  placeholder={t.booking.vehiclePlaceholder}
                  className="h-11 w-full rounded-md border border-neutral-300 bg-transparent px-3.5 text-sm text-[#111215] placeholder:text-neutral-400 focus:border-[#A8741E] focus:outline-none dark:border-white/15 dark:text-[#F4F4F2] dark:placeholder:text-neutral-500 dark:focus:border-[#D8A44C]"
                />
                {errors.vehicle && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.vehicle}
                  </p>
                )}
              </div>

              {/* Vehicle Class */}
              <div>
                <label
                  htmlFor="booking-vehicle-size"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t.packages.vehicleClassLabel}
                </label>
                <select
                  id="booking-vehicle-size"
                  value={vehicleSize}
                  onChange={(e) => onSelectVehicleSize(e.target.value as VehicleSize)}
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3.5 text-sm text-[#111215] focus:border-[#A8741E] focus:outline-none dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:focus:border-[#D8A44C]"
                >
                  {(Object.keys(VEHICLE_MULTIPLIERS) as VehicleSize[]).map((sizeKey) => (
                    <option key={sizeKey} value={sizeKey}>
                      {VEHICLE_MULTIPLIERS[sizeKey].label[language]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Service Package */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="booking-package"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t.booking.packageLabel}
                </label>
                <select
                  id="booking-package"
                  value={selectedPackageId}
                  onChange={(e) => onSelectPackageId(e.target.value as PackageId)}
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3.5 text-sm text-[#111215] focus:border-[#A8741E] focus:outline-none dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:focus:border-[#D8A44C]"
                >
                  {SERVICE_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.index}. {pkg.name[language]} —{' '}
                      {formatConvertedPrice(pkg.basePricePkr, currency, vehicleSize)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label
                  htmlFor="booking-date"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t.booking.dateLabel} *
                </label>
                <div className="relative">
                  <input
                    id="booking-date"
                    type="date"
                    min={todayIso}
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 w-full rounded-md border border-neutral-300 bg-transparent px-3.5 font-mono text-sm text-[#111215] focus:border-[#A8741E] focus:outline-none dark:border-white/15 dark:text-[#F4F4F2] dark:focus:border-[#D8A44C]"
                  />
                </div>
                {errors.date && (
                  <p role="alert" className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.date}
                  </p>
                )}
              </div>

              {/* Preferred Time */}
              <div>
                <label
                  htmlFor="booking-time"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t.booking.timeLabel}
                </label>
                <select
                  id="booking-time"
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3.5 font-mono text-sm text-[#111215] focus:border-[#A8741E] focus:outline-none dark:border-white/15 dark:bg-[#131417] dark:text-[#F4F4F2] dark:focus:border-[#D8A44C]"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="booking-notes"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  {t.booking.notesLabel}
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.booking.notesPlaceholder}
                  className="w-full rounded-md border border-neutral-300 bg-transparent px-3.5 py-2.5 text-sm text-[#111215] placeholder:text-neutral-400 focus:border-[#A8741E] focus:outline-none dark:border-white/15 dark:text-[#F4F4F2] dark:placeholder:text-neutral-500 dark:focus:border-[#D8A44C]"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col items-stretch justify-between gap-4 border-t border-neutral-200 pt-6 dark:border-white/10 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <Calendar className="h-4 w-4 text-[#A8741E] dark:text-[#D8A44C]" />
                <span>No advance payment required to lock your inspection bay</span>
              </div>
              <button
                type="submit"
                className="inline-flex h-12 cursor-pointer items-center justify-center whitespace-nowrap rounded-md bg-[#A8741E] px-7 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#8E6015] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C9933B] dark:bg-[#D8A44C] dark:text-[#0B0B0D] dark:hover:bg-[#E5B562]"
              >
                {t.booking.submitBtn}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Instant Confirmation Modal */}
      {receipt && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-lg rounded-xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-white/15 dark:bg-[#131417] sm:p-8">
            <button
              type="button"
              onClick={() => setReceipt(null)}
              aria-label={t.booking.doneBtn}
              className="absolute right-4 top-4 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-[#111215] dark:text-neutral-400 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-7 w-7 shrink-0 text-[#1E7E48] dark:text-[#4ADE80]" />
              <div>
                <h3
                  id="booking-modal-title"
                  className="font-display text-2xl font-semibold text-[#111215] dark:text-[#F4F4F2]"
                >
                  {t.booking.modalTitle}
                </h3>
                <p className="font-mono text-xs text-[#A8741E] dark:text-[#D8A44C]">
                  {t.booking.refCode}: {receipt.refCode}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              {t.booking.modalSubtitle}
            </p>

            <dl className="mt-6 space-y-3 border-y border-neutral-200 py-5 text-sm dark:border-white/10">
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-neutral-400">{t.booking.fullName}</dt>
                <dd className="font-medium text-[#111215] dark:text-[#F4F4F2]">{receipt.fullName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-neutral-400">{t.booking.vehicleLabel}</dt>
                <dd className="font-medium text-[#111215] dark:text-[#F4F4F2]">
                  {receipt.vehicle} · {receipt.vehicleSizeLabel}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-neutral-400">{t.booking.packageLabel}</dt>
                <dd className="text-right font-medium text-[#111215] dark:text-[#F4F4F2]">
                  {receipt.packageName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-neutral-400">{t.booking.estimatedTotal}</dt>
                <dd className="font-mono font-semibold tabular-nums text-[#A8741E] dark:text-[#D8A44C]">
                  {receipt.priceFormatted}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-neutral-400">{t.booking.dateLabel}</dt>
                <dd className="font-mono tabular-nums text-[#111215] dark:text-[#F4F4F2]">
                  {receipt.date} · {receipt.timeSlot}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-neutral-500 dark:text-neutral-400">{t.footer.addressLabel}</dt>
                <dd className="max-w-[65%] text-right text-xs text-neutral-600 dark:text-neutral-300">
                  {place.formattedAddress}
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappConfirmUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-md bg-[#A8741E] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#8E6015] dark:bg-[#D8A44C] dark:text-[#0B0B0D] dark:hover:bg-[#E5B562]"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{t.booking.sendWhatsApp}</span>
              </a>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="inline-flex h-11 cursor-pointer items-center justify-center rounded-md border border-neutral-300 px-5 text-sm font-medium text-[#111215] transition-colors hover:bg-neutral-100 dark:border-white/15 dark:text-[#F4F4F2] dark:hover:bg-white/10"
              >
                {t.booking.doneBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
