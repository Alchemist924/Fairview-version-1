export interface MetaEventParams {
  content_ids?: string[];
  content_name?: string;
  content_category?: string;
  search_string?: string;
  [key: string]: any;
}

// Track the last viewed property slug to prevent duplicate ViewContent triggers from Strict Mode/re-renders
let lastViewedSlug: string | null = null;

/**
 * Resets the page-level view content tracking cache.
 * Called automatically on router navigation changes.
 */
export function resetPageTracking() {
  lastViewedSlug = null;
  console.log("[Meta Pixel] Page tracking reset");
}

/**
 * Safely tracks a standard Meta Pixel event.
 * Checks for the existence of the global `fbq` function.
 */
export function trackMetaEvent(eventName: string, params?: MetaEventParams) {
  // Deduplicate ViewContent event using slug-specific tracking
  if (eventName === "ViewContent") {
    const slug = params?.content_ids?.[0];
    if (slug) {
      if (slug === lastViewedSlug) {
        console.log(`[Meta Pixel] Duplicate ViewContent event prevented for slug: ${slug}`);
        return;
      }
      lastViewedSlug = slug;
    }
  }

  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("track", eventName, params);
      console.log(`[Meta Pixel] Event tracked: ${eventName}`, params);
    } catch (error) {
      console.error(`[Meta Pixel] Failed to track event: ${eventName}`, error);
    }
  } else {
    console.warn(`[Meta Pixel] fbq not available on window. Event skipped: ${eventName}`, params);
  }
}
