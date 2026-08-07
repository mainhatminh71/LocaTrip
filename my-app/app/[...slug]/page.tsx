import { notFound } from "next/navigation";

/** Unknown paths → React not-found (no scrape HTML fallback). */
export default function CatchAllUnknown() {
  notFound();
}
