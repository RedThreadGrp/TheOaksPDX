/**
 * Centralized site configuration for ordering and other features
 * Controls online ordering behavior across the entire site
 */

export type OrderMode = 'pickup' | 'delivery' | 'both';

export interface SiteOrderingConfig {
  orderOnlineUrl: string;
  orderMode: OrderMode;
  orderLabel: string;
}

// Load configuration from environment variables
export const siteConfig: SiteOrderingConfig = {
  orderOnlineUrl: process.env.OAKS_ORDER_ONLINE_URL?.trim() || '',
  orderMode: (process.env.OAKS_ORDER_MODE?.trim() || 'pickup') as OrderMode,
  orderLabel: process.env.OAKS_ORDER_LABEL?.trim() || 'Order Pickup',
};

/**
 * Helper to check if online ordering is enabled
 * Returns true only if a valid ordering URL is configured
 */
export const hasOrdering = Boolean(siteConfig.orderOnlineUrl);

/**
 * Get the appropriate order label based on mode
 * Provides sensible defaults for different ordering modes
 */
export function getOrderLabel(): string {
  // If custom label is set, use it
  if (process.env.OAKS_ORDER_LABEL?.trim()) {
    return process.env.OAKS_ORDER_LABEL.trim();
  }
  
  // Otherwise use mode-based defaults
  switch (siteConfig.orderMode) {
    case 'delivery':
      return 'Order Delivery';
    case 'both':
      return 'Order Online';
    case 'pickup':
    default:
      return 'Order Pickup';
  }
}
