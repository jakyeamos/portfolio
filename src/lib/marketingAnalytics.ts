export interface PlausibleEventOptions {
  props?: Readonly<Record<string, string>>;
  u?: string;
}

export interface PlausibleFunction {
  (eventName: string, options?: PlausibleEventOptions): void;
  q?: Array<[string, PlausibleEventOptions?]>;
}

declare global {
  interface Window {
    plausible?: PlausibleFunction;
  }
}

const MARKETING_EVENTS = new Set([
  'project_detail_view',
  'source_repository_click',
  'resume_download',
  'contact_click',
]);

export function plausibleConfigured(): boolean {
  return Boolean(import.meta.env.VITE_PLAUSIBLE_DOMAIN);
}

export function ensurePlausibleQueue(): void {
  if (typeof window === 'undefined' || window.plausible) return;

  const queued: PlausibleFunction = (eventName, options) => {
    queued.q ??= [];
    queued.q.push([eventName, options]);
  };
  queued.q = [];
  window.plausible = queued;
}

export function trackMarketingEvent(
  eventName: string,
  props?: Readonly<Record<string, string>>,
): void {
  if (!MARKETING_EVENTS.has(eventName) || !plausibleConfigured()) return;
  ensurePlausibleQueue();
  window.plausible?.(eventName, props ? { props } : undefined);
}

export function trackMarketingPageview(): void {
  if (!plausibleConfigured()) return;
  ensurePlausibleQueue();
  window.plausible?.('pageview');
}

export function trackMarketingLinkClick(href: string): void {
  if (href.startsWith('mailto:')) {
    trackMarketingEvent('contact_click');
    return;
  }

  if (href.toLowerCase().includes('resume')) {
    trackMarketingEvent('resume_download');
  }
}
