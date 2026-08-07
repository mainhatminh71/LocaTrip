# Prompt: Refactor book-a-trip generate logic (layout frozen)

Copy-paste this entire document into an agent working in **`c:\LocaTrip\my-app`**.

You are refactoring **how** trips are created so the UI matches LocalTrip API planner v1 (Anchor-based scheduling, hop distance, round-trip). **Do not redesign layout, visual chrome, or phase structure.**

---

## Non-negotiables

1. **Keep layout / phases** in `components/book-a-trip/BookATripView.tsx`:
   - Prefs form → location prompt → loading → options (multi itinerary) → itinerary + map → replace-place modal.
2. **Keep Vietnamese** UI copy and existing chip/form styling (`AutoTripPrefsFields`, CSS modules).
3. **Do not** add a new page, wizard redesign, or discovery Q&A flow.
4. **Do not** implement a full **cart** generate UI in this pass (see Appendix only).
5. **Keep** auth gate as today: must be logged in before generate / regenerate / save (`openAuth` + `apiFetch` Bearer).
6. City remains **Đà Lạt** (`"dalat"`) unless already parameterized without layout change.
7. **Out of scope:** Keycloak login/register theme, realm JSON, or any IdP UI — do not touch `keycloak/` or restyle auth screens; only keep existing `openAuth` / Bearer.

---

## Do

- Extend draft + types + `buildAutoTripRequest` for **`isRoundTrip`** and **`maxDistance`**.
- Add **minimal controls inside the existing prefs form** (same column/section as radius/pace — not a new screen).
- Client-validate: require **`tripType` OR ≥ 1 preference tag** before location prompt / regenerate (match API).
- Surface API error  
  `Bạn phải chọn ít nhất 1 Chủ đề chuyến đi (tripType) hoặc 1 Sở thích (preferences).`  
  clearly if somehow still returned.
- Keep `showRoad: true` in the builder (map needs polylines) unless you add a real toggle that works.
- Optionally enrich **`createSavedTrip`** body with generate params the API already accepts (`preferences`, `pace`, `budgetLevel`, `radiusKm`/`maxDistance`, `isRoundTrip` / `roundTrip`, `tripType`, `targetCustomer`, times, startCoords) — only if types already support them; do not invent breaking API fields.

## Don’t

- Don’t restyle hero, map, option cards, or itinerary list.
- Don’t restyle or edit **Keycloak** (theme, realm, login FTL/CSS) — not part of this task.
- Don’t call `/trips/generate/cart` yet.
- Don’t remove auth or call generate without Bearer.
- Don’t assume multi-day auto (API auto is **always 1 day**).
- Don’t send empty `preferences` **and** omit `tripType` (400).

---

## Why (backend logic changed)

LocalTrip `POST /trips/generate/auto` now:

| Behavior | Field / rule |
|----------|----------------|
| Hop limit between stops (anti-zigzag) | `maxDistance` (km), default **5** |
| Return to start at end of day | `isRoundTrip`, default **true** |
| Don’t schedule visits that eat into meal windows | Anchor-based (server-only; no new FE control) |
| Must choose tripType and/or soft prefs | `tripType` **or** non-empty `preferences[]` |
| Auth on all `/trips/*` including generate | Bearer + role `traveller` \| `admin` |

Upstream (via Next proxy): `POST {LOCALTRIP_API_URL}/trips/generate/auto`  
Same-origin: `POST /api/trips/generate/auto/` (existing).

---

## Target auto payload

Update `AutoTripRequest` and the JSON body to:

| Field | Type | UI | Default if omitted |
|-------|------|-----|--------------------|
| `startLatitude` | number | Preset / GPS | required |
| `startLongitude` | number | Preset / GPS | required |
| `radiusKm` | number | Existing “bán kính tìm kiếm” | `10` |
| `budgetLevel` | `budget` \| `mid-range` \| `luxury` | Existing | `mid-range` |
| `tripType` | string? | Existing chips | omit if null |
| `targetCustomer` | string? | Existing chips | omit if null |
| `preferences` | `string[]` | Atmosphere/food/activities/constraints → tags | `[]` |
| `pace` | `relaxed` \| `moderate` \| `active` | Existing | `moderate` |
| `showRoad` | boolean | Keep `true` in builder | `true` |
| `startTimePerDay` / `endTimePerDay` | `"HH:MM"` | Existing hours | `08:30` / `21:30` |
| **`maxDistance`** | number | **NEW** control | **5**, clamp `≥ 1` |
| **`isRoundTrip`** | boolean | **NEW** toggle “Khứ hồi” | **true** |

Do **not** send `durationDays` on auto (ignored / not in contract).

`tourTripType` is legacy alias server-side — prefer `tripType` only.

---

## Minimal UI additions (inside existing prefs form)

In `AutoTripPrefsFields.tsx` (or equivalent section next to radius/pace):

1. **Khứ hồi** — boolean toggle bound to `draft.isRoundTrip` (default `true`).  
   Helper text (VN), e.g. *Cuối ngày có đoạn về điểm xuất phát.*
2. **Khoảng cách giữa các điểm (km)** — number input or compact control bound to `draft.maxDistance` (default `"5"` or `5`; parse like `radiusKm`; min 1).  
   Helper: *Giới hạn quãng đường giữa hai điểm liên tiếp (không phải bán kính tìm kiếm).*
3. Clarify labels if needed so users don’t confuse **`radiusKm`** (search area) vs **`maxDistance`** (hop between stops).

### Client validation

Before `setShowLocationPrompt(true)` / `runGenerate` / `applyPrefsAndRegenerate`:

```ts
const prefs = buildPreferences(draft);
if (!draft.tripType && prefs.length === 0) {
  setError("Bạn phải chọn ít nhất 1 Chủ đề chuyến đi hoặc 1 Sở thích.");
  return;
}
```

Keep existing radius parse errors from `buildAutoTripRequest`.

---

## Files to touch (expected)

| File | Change |
|------|--------|
| `lib/trip.ts` | Add `maxDistance?`, `isRoundTrip?` to `AutoTripRequest` |
| `lib/auto-trip-form.ts` | Add to `AutoTripDraft` + `DEFAULT_AUTO_TRIP_DRAFT` |
| `lib/build-auto-trip-request.ts` | Parse/send `maxDistance`, `isRoundTrip` |
| `components/book-a-trip/AutoTripPrefsFields.tsx` | Controls + props wiring |
| `components/book-a-trip/BookATripView.tsx` | Validation gate; pass new draft fields; error copy |
| `lib/api/trips.ts` | Types only if needed; optional richer `createSavedTrip` body |
| `app/api/trips/generate/auto/route.ts` | Usually **no change** (already proxies JSON) |

Do not invent new routes.

---

## Auth / errors (keep behavior)

- Unauthenticated → `openAuth({ next: "/book-a-trip/" })` (already).
- `apiFetch` attaches Bearer; on 401 show re-login hint (already).
- Map generate failures: missing prefs (400 VN), no places nearby (500 VN from API), network 502 from Next proxy.

---

## Test checklist

- [ ] Logged out → submit opens auth; no generate call.
- [ ] Logged in, no tripType and no prefs → **client** error; no API call.
- [ ] tripType only → generate 200; options/itinerary render as before.
- [ ] preferences only (no tripType) → generate 200.
- [ ] `isRoundTrip` on → itinerary can include return travel leg near end of day.
- [ ] `isRoundTrip` off → no forced return-home travel (or shorter day end).
- [ ] `maxDistance` small (e.g. 2) vs large (e.g. 15) changes hop spread (sanity check).
- [ ] `radiusKm` still controls search area independently of `maxDistance`.
- [ ] Map still shows roads (`showRoad: true`).
- [ ] Save trip still works; layout unchanged.
- [ ] Regenerate from prefs tab runs same validation + new fields.

---

## Acceptance

- Layout/phases/visuals unchanged aside from **two small prefs controls** + validation message.
- Every auto generate request includes `isRoundTrip` and `maxDistance` (or relies on documented defaults only if intentionally omitted — prefer **always send** explicit values from draft).
- No cart UI shipped.
- Typecheck / lint clean on touched files.

---

## Appendix A — Cart contract (later; do not implement now)

`POST /trips/generate/cart` (also requires Bearer).

**Request**

| Field | Required | Notes |
|-------|----------|--------|
| `placeIds` | yes | non-empty `string[]` |
| `durationDays` | no | positive int; default 1; **multi-day is cart-only** |
| `startTimePerDay` / `endTimePerDay` | no | `HH:MM` |
| `startLatitude` / `startLongitude` | no | both or neither |
| `pace` | no | |
| `showRoad` | no | default true |

Cart does **not** take `radiusKm`, `budgetLevel`, `tripType`, `preferences`, `maxDistance`, `isRoundTrip` (scheduler may still default round-trip internally).

**Response (shape differs from auto)**

```ts
{
  itinerary: DayItinerary[];
  unscheduledItems: { placeId?: string; title: string; reason: string }[];
  warnings: { type: string; message: string; affectedPlaceId?: string }[];
  suggestions: { type: string; message: string; suggestedPlaces: unknown[] }[];
}
```

Auto returns `{ totalItineraries, itineraries: [{ optionId, title, tripStyle, totalEstimatedCost, summary, itinerary }] }`.

When adding cart later: new Next proxy `app/api/trips/generate/cart/route.ts` + client helper; still avoid layout redesign.

---

## Implementation order (suggested)

1. Types + draft defaults.  
2. Builder.  
3. Prefs fields UI.  
4. Validation in `BookATripView`.  
5. Manual test checklist.  
6. Optional save-body enrichment.
