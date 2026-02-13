import type { SiteConfig } from './schemas';

interface JSONLDRestaurant {
  '@context': string;
  '@type': string;
  name: string;
  url?: string;
  telephone?: string;
  email?: string;
  address?: {
    '@type': string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    '@type': string;
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification?: Array<{
    '@type': string;
    dayOfWeek: string;
    opens: string;
    closes: string;
  }>;
  servesCuisine?: string[];
  priceRange?: string;
  sameAs?: string[];
  hasMenu?: string[];
}

export function generateRestaurantSchema(
  siteConfig: SiteConfig,
  siteUrl: string
): JSONLDRestaurant {
  const schema: JSONLDRestaurant = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: siteConfig.businessName,
    url: siteUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.zip,
      addressCountry: siteConfig.address.country,
    },
    servesCuisine: siteConfig.cuisines,
    priceRange: siteConfig.priceRange,
  };

  // Add geo coordinates if available
  if (siteConfig.latitude && siteConfig.longitude) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.latitude,
      longitude: siteConfig.longitude,
    };
  }

  // Add opening hours
  const daysMap: Record<string, string> = {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
  };

  schema.openingHoursSpecification = Object.entries(siteConfig.hours).map(
    ([day, hours]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: daysMap[day],
      opens: hours.open,
      closes: hours.close,
    })
  );

  // Add social media links
  const sameAs: string[] = [];
  if (siteConfig.instagramUrl) sameAs.push(siteConfig.instagramUrl);
  if (siteConfig.facebookUrl) sameAs.push(siteConfig.facebookUrl);
  if (sameAs.length > 0) {
    schema.sameAs = sameAs;
  }

  // Add menu links
  schema.hasMenu = [`${siteUrl}/menu`, `${siteUrl}/drinks`];

  return schema;
}

export function generateJSONLD(schema: JSONLDRestaurant): string {
  return JSON.stringify(schema, null, 2);
}
