import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {ExternalLink, Navigation, Star} from 'lucide-react';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {STUDIO_DEFAULTS} from '../data/studioData';

const MAPS_API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined) || '';
const ATTRIBUTION_IDS = ['gmp_mcp_codeassist_v1_aistudio'];

export interface LiveGoogleReview {
  authorName: string;
  authorUri: string | null;
  authorPhotoUri: string | null;
  rating: number;
  relativeTime: string;
  text: string;
  googleMapsUri: string | null;
}

export interface StudioPlaceDetails {
  displayName: string;
  formattedAddress: string;
  location: {lat: number; lng: number};
  phoneDisplay: string;
  phoneHref: string;
  whatsappDigits: string;
  rating: number | null;
  userRatingCount: number | null;
  weekdayDescriptions: string[];
  reviews: LiveGoogleReview[];
  googleMapsUri: string;
  isLiveLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

const DEFAULT_PLACE_STATE: StudioPlaceDetails = {
  displayName: STUDIO_DEFAULTS.name,
  formattedAddress: STUDIO_DEFAULTS.address,
  location: STUDIO_DEFAULTS.coordinates,
  phoneDisplay: STUDIO_DEFAULTS.phoneDisplay,
  phoneHref: STUDIO_DEFAULTS.phoneHref,
  whatsappDigits: STUDIO_DEFAULTS.whatsappDigits,
  rating: null,
  userRatingCount: null,
  weekdayDescriptions: [],
  reviews: [],
  googleMapsUri: STUDIO_DEFAULTS.mapsShortUrl,
  isLiveLoaded: false,
  isLoading: Boolean(MAPS_API_KEY),
  error: null,
};

const StudioPlaceContext = createContext<StudioPlaceDetails>(DEFAULT_PLACE_STATE);

export function useStudioPlace(): StudioPlaceDetails {
  return useContext(StudioPlaceContext);
}

function isQuotaError(err: unknown): boolean {
  const text = String(err ?? '');
  return (
    text.includes('OVER_QUERY_LIMIT') ||
    text.includes('RESOURCE_EXHAUSTED') ||
    text.includes('QuotaExceededError') ||
    text.includes('429')
  );
}

function PlacesDataFetcher({
  onUpdate,
}: {
  onUpdate: React.Dispatch<React.SetStateAction<StudioPlaceDetails>>;
}) {
  const placesLib = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLib) return;

    let cancelled = false;

    async function loadStudioPlace() {
      try {
        const searchResult = await placesLib!.Place.searchByText({
          textQuery: 'Detailing Crew Islamabad',
          fields: ['id', 'displayName', 'location'],
          locationBias: STUDIO_DEFAULTS.coordinates,
          language: 'en',
          region: 'pk',
          maxResultCount: 1,
          internalUsageAttributionIds: ATTRIBUTION_IDS,
        });

        const matchedPlace = searchResult.places?.[0];
        if (!matchedPlace) {
          if (!cancelled) {
            onUpdate((prev) => ({...prev, isLoading: false}));
          }
          return;
        }

        await matchedPlace.fetchFields({
          fields: [
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'regularOpeningHours',
            'nationalPhoneNumber',
            'internationalPhoneNumber',
            'reviews',
            'googleMapsURI',
          ],
        });

        if (cancelled) return;

        const loc = matchedPlace.location;
        const resolvedLat = loc ? loc.lat() : STUDIO_DEFAULTS.coordinates.lat;
        const resolvedLng = loc ? loc.lng() : STUDIO_DEFAULTS.coordinates.lng;

        const rawPhone =
          matchedPlace.internationalPhoneNumber ||
          matchedPlace.nationalPhoneNumber ||
          STUDIO_DEFAULTS.phoneDisplay;
        const cleanDigits = rawPhone.replace(/[^\d]/g, '');
        const normalizedWhatsapp =
          cleanDigits.startsWith('0') && cleanDigits.length === 11
            ? `92${cleanDigits.slice(1)}`
            : cleanDigits.length >= 10
              ? cleanDigits
              : STUDIO_DEFAULTS.whatsappDigits;

        const rawReviews: google.maps.places.Review[] = matchedPlace.reviews || [];
        const mappedReviews: LiveGoogleReview[] = rawReviews
          .filter((rev: google.maps.places.Review) => Boolean(rev.text && rev.text.trim().length > 0))
          .map((rev: google.maps.places.Review) => ({
            authorName: rev.authorAttribution?.displayName || 'Google Reviewer',
            authorUri: rev.authorAttribution?.uri || null,
            authorPhotoUri: rev.authorAttribution?.photoURI || null,
            rating: rev.rating ?? 5,
            relativeTime: rev.relativePublishTimeDescription || '',
            text: rev.text || '',
            googleMapsUri: rev.googleMapsURI || null,
          }));

        onUpdate({
          displayName: matchedPlace.displayName || STUDIO_DEFAULTS.name,
          formattedAddress: matchedPlace.formattedAddress || STUDIO_DEFAULTS.address,
          location: {lat: resolvedLat, lng: resolvedLng},
          phoneDisplay: rawPhone,
          phoneHref: rawPhone.replace(/[^\d+]/g, '') || STUDIO_DEFAULTS.phoneHref,
          whatsappDigits: normalizedWhatsapp,
          rating: typeof matchedPlace.rating === 'number' ? matchedPlace.rating : null,
          userRatingCount:
            typeof matchedPlace.userRatingCount === 'number'
              ? matchedPlace.userRatingCount
              : null,
          weekdayDescriptions:
            matchedPlace.regularOpeningHours?.weekdayDescriptions || [],
          reviews: mappedReviews,
          googleMapsUri: matchedPlace.googleMapsURI || STUDIO_DEFAULTS.mapsShortUrl,
          isLiveLoaded: true,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) {
          onUpdate((prev) => ({
            ...prev,
            isLoading: false,
            error: 'Live Google listing details are temporarily unavailable.',
          }));
        }
      }
    }

    void loadStudioPlace();
    return () => {
      cancelled = true;
    };
  }, [placesLib, onUpdate]);

  return null;
}

export function StudioMapsProvider({children}: {children: React.ReactNode}) {
  const [placeState, setPlaceState] = useState<StudioPlaceDetails>(DEFAULT_PLACE_STATE);

  if (!MAPS_API_KEY) {
    return (
      <StudioPlaceContext.Provider
        value={{...placeState, isLoading: false}}
      >
        {children}
      </StudioPlaceContext.Provider>
    );
  }

  return (
    <APIProvider
      apiKey={MAPS_API_KEY}
      libraries={['places', 'marker']}
      language="en"
      region="PK"
    >
      <PlacesDataFetcher onUpdate={setPlaceState} />
      <StudioPlaceContext.Provider value={placeState}>
        {children}
      </StudioPlaceContext.Provider>
    </APIProvider>
  );
}

interface StudioLocationMapProps {
  isDark: boolean;
  directionsLabel: string;
  openMapsLabel: string;
}

export function StudioLocationMap({
  isDark,
  directionsLabel,
  openMapsLabel,
}: StudioLocationMapProps) {
  const place = useStudioPlace();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.location.lat},${place.location.lng}`;

  if (!MAPS_API_KEY) {
    return (
      <div className="flex h-[420px] w-full flex-col items-center justify-center rounded-xl border border-neutral-200 bg-neutral-100 p-8 text-center dark:border-white/10 dark:bg-[#131417] lg:h-full lg:min-h-[440px]">
        <p className="font-display text-lg font-semibold text-[#111215] dark:text-[#F4F4F2]">
          {place.displayName}
        </p>
        <p className="mt-2 max-w-md text-sm text-neutral-600 dark:text-neutral-400">
          {place.formattedAddress}
        </p>
        <a
          href={place.googleMapsUri}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-md bg-[#A8741E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#8E6015] dark:bg-[#D8A44C] dark:text-[#0B0B0D]"
        >
          <span>{openMapsLabel}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-neutral-200 dark:border-white/10 lg:h-full lg:min-h-[460px]">
      <GoogleMap
        mapId="DEMO_MAP_ID"
        defaultCenter={place.location}
        center={place.location}
        defaultZoom={15}
        gestureHandling="cooperative"
        colorScheme={isDark ? 'DARK' : 'LIGHT'}
        internalUsageAttributionIds={ATTRIBUTION_IDS}
        className="h-full w-full"
      >
        <AdvancedMarker
          ref={markerRef}
          position={place.location}
          title={place.displayName}
          onClick={() => setInfoOpen((prev) => !prev)}
        >
          <Pin
            background="#C9933B"
            borderColor="#0B0B0D"
            glyphColor="#0B0B0D"
            scale={1.2}
          />
        </AdvancedMarker>

        {infoOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={270}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-1 text-neutral-900">
              <p className="font-display text-sm font-semibold text-neutral-950">
                {place.displayName}
              </p>
              <p className="mt-1 text-xs leading-snug text-neutral-600">
                {place.formattedAddress}
              </p>
              {place.rating !== null && (
                <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-neutral-900">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="font-mono tabular-nums">{place.rating.toFixed(1)}</span>
                  {place.userRatingCount !== null && (
                    <span className="text-neutral-500">({place.userRatingCount})</span>
                  )}
                </div>
              )}
              <div className="mt-3 flex items-center gap-3 border-t border-neutral-200 pt-2 text-xs font-medium">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-800 hover:underline"
                >
                  <Navigation className="h-3 w-3" />
                  <span>{directionsLabel}</span>
                </a>
                <a
                  href={place.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-neutral-700 hover:underline"
                >
                  <span>{openMapsLabel}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
