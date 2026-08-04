import { notFound } from "next/navigation";

/**
 * Catch-all for unknown paths → React not-found.
 * Ported marketing routes use dedicated page files under app/.
 * Static scrape assets (if any) should live under /scrape/ via public/.
 */
export default function CatchAllUnknown() {
  notFound();
}
