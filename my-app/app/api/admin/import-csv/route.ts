import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → LocalTrip `POST /admin/import-csv` (multipart). */
export async function POST(request: Request) {
  const base = getUpstreamBase();
  try {
    const form = await request.formData();
    const headers = upstreamHeaders(request);
    // Let fetch set multipart boundary — do not set Content-Type manually.
    headers.delete("Content-Type");

    const upstream = await fetch(`${base}/admin/import-csv`, {
      method: "POST",
      headers,
      body: form,
      cache: "no-store",
    });
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}
