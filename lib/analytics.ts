// Analytics tracking utilities
// Uses Vercel Analytics when available

export type EventName =
  | 'cta_call_click'
  | 'cta_directions_click'
  | 'cta_order_click'
  | 'cta_menu_click'
  | 'menu_filter_used'
  | 'contact_form_submit'
  | 'order_modal_open'
  | 'order_platform_click';

interface EventData {
  [key: string]: string | number | boolean;
}

export function trackEvent(name: EventName, data?: EventData): void {
  // Track with Vercel Analytics if available
  if (typeof window !== 'undefined' && 'va' in window && typeof (window as any).va === 'function') {
    (window as any).va('event', name, data);
  }
  
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${name}`, data);
  }
}
