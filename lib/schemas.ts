import { z } from 'zod';

// Site Configuration Schema
export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zip: z.string(),
  country: z.string(),
});

export const HoursSchema = z.object({
  open: z.string().regex(/^\d{2}:\d{2}$/),
  close: z.string().regex(/^\d{2}:\d{2}$/),
});

export const WeeklyHoursSchema = z.object({
  sunday: HoursSchema,
  monday: HoursSchema,
  tuesday: HoursSchema,
  wednesday: HoursSchema,
  thursday: HoursSchema,
  friday: HoursSchema,
  saturday: HoursSchema,
});

export const DeliveryPlatformSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  logo: z.string().optional(),
});

export const SiteConfigSchema = z.object({
  businessName: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  description: z.string(),
  address: AddressSchema,
  phone: z.string(),
  email: z.string().email(),
  hours: WeeklyHoursSchema,
  orderUrl: z.string().url().nullable(),
  instagramUrl: z.string().url().nullable(),
  facebookUrl: z.string().url().nullable(),
  googleMapsUrl: z.string().url().nullable(),
  googlePlaceId: z.string().nullable(),
  cuisines: z.array(z.string()),
  priceRange: z.string(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  features: z.array(z.string()),
  deliveryPlatforms: z.array(DeliveryPlatformSchema),
});

// Menu Schemas
export const MenuItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.string().optional(),
  dietary: z.array(z.enum(['v', 'vg', 'gf', 'df', 'n'])).optional(),
  addOns: z.array(z.object({
    name: z.string(),
    price: z.string(),
  })).optional(),
  spicy: z.boolean().optional(),
});

export const MenuSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  items: z.array(MenuItemSchema),
});

export const MenuSchema = z.object({
  lastUpdatedISO: z.string(),
  showSampleMenu: z.boolean().optional(),
  sections: z.array(MenuSectionSchema),
});

// Events Schemas
export const RecurringEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  dayOfWeek: z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']),
  time: z.string(),
});

export const UpcomingEventSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  time: z.string(),
  endDate: z.string().optional(),
});

export const HappyHourSchema = z.object({
  enabled: z.boolean(),
  days: z.array(z.enum(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string(),
  items: z.array(z.object({
    name: z.string(),
    price: z.string(),
  })).optional(),
}).nullable();

export const PrivatePartiesSchema = z.object({
  enabled: z.boolean(),
  description: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
});

export const EventsSchema = z.object({
  recurringEvents: z.array(RecurringEventSchema),
  upcomingEvents: z.array(UpcomingEventSchema),
  happyHour: HappyHourSchema,
  privateParties: PrivatePartiesSchema,
});

// Type exports
export type SiteConfig = z.infer<typeof SiteConfigSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type Hours = z.infer<typeof HoursSchema>;
export type WeeklyHours = z.infer<typeof WeeklyHoursSchema>;
export type DeliveryPlatform = z.infer<typeof DeliveryPlatformSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type MenuSection = z.infer<typeof MenuSectionSchema>;
export type Menu = z.infer<typeof MenuSchema>;
export type RecurringEvent = z.infer<typeof RecurringEventSchema>;
export type UpcomingEvent = z.infer<typeof UpcomingEventSchema>;
export type HappyHour = z.infer<typeof HappyHourSchema>;
export type PrivateParties = z.infer<typeof PrivatePartiesSchema>;
export type Events = z.infer<typeof EventsSchema>;
