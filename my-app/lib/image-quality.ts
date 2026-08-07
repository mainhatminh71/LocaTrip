/**
 * Defaults for next/image when optimization is enabled.
 * On Cloudflare Workers we ship `images.unoptimized` (IMAGES binding has poor
 * cache), so these mainly affect local `next dev` with the optimizer.
 */
export const LT_IMAGE_QUALITY = 75;

/** Full-bleed heroes / large section media */
export const LT_IMAGE_QUALITY_HERO = 78;

/** Small UI chrome (logo mark) */
export const LT_IMAGE_QUALITY_UI = 85;
