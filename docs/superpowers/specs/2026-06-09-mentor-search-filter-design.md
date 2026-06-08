# Mentor Search & Filter — Design Spec

**Date:** 2026-06-09
**Author:** Kapil Rajput (with Claude)
**Status:** Approved for planning

## Problem

When parents search for mentors, the filters (class, subject, state, city, mode, price) do not work reliably, and only ~8 mentors ever appear even though many more exist.

### Root causes (confirmed in code)

1. **Location hardcoded.** `buildRecommendationPipeline()` in `homentor-backend-main/routes/mentorRoutes.js` (line ~502) has `$match: { "location.city": "Indore" }` hardcoded. Geo search ignores the parent's actual location.
2. **Hard 8-mentor cap everywhere.** Geo path returns 2 gold + 2 silver + 4 budget = 8. City and default paths use `.limit(8)`.
3. **Real filtering is client-side on those 8.** `homentor-frontend/src/pages/Mentors.tsx` `applyFilters()` filters class/subject/price/mode *in memory* over the 8 returned mentors, so subject/price filters frequently return nothing or wrong results.

## Goal

Filter across **all** mentors with `showOnWebsite: true` (display on), apply the parent's filters as real constraints, and return a ranked, paginated list following a defined priority order. The frontend keeps its existing filter UI.

## Decisions (from brainstorming)

- **Location match:** exact `city` + `state`. Area/lat-lon is used only for *ranking* nearness, not for hiding.
- **Online mode ignores location.** `mode=online` → no city restriction (online mentors teach anywhere). `mode=offline`/`any`/unset → city+state restricted (defaults to local).
- **Subject match:** mentor shows if they teach **any** selected subject for the chosen class.
- **Priority order:** Nearby → featured 2 gold / 2 silver / 2 budget → currently-teaching → prior-demo → rest.
- **Layout:** a **Featured strip** (2 gold + 2 silver + 2 budget, drawn from the filtered set) above a **main ranked list**.
- **Loading:** paginated ("Load more").
- **Featured strip respects active filters** (filtered to the parent's class/subject/price/location, not random gold mentors).

## Architecture

Backend does all hard filtering, ranking, and pagination via a single MongoDB aggregation. Frontend sends filter state as query params and renders the response.

### Endpoint

Rework `GET /api/mentor/visible-mentors` (keep the same path; extend it). Query params:

| Param | Type | Meaning |
|---|---|---|
| `state` | string | exact state filter (offline/any only) |
| `city` | string | exact city filter (offline/any only) |
| `mode` | `online`\|`offline`\|`any` | teaching mode filter |
| `classKey` | string | e.g. `class-9-10` |
| `subjects` | string (csv) or repeated | selected subjects |
| `minPrice` `maxPrice` | number | price range; ignored when both at default (0 / 20000) |
| `lat` `lon` | number | parent area coords for nearness ranking (optional) |
| `parentId` | string | optional; enables prior-demo boost |
| `page` | number | 1-based, default 1 |
| `limit` | number | page size, default 20 |

### Hard filters (mentor must pass ALL)

Base (always): `status: "Approved"`, `showOnWebsite: true`.

| Filter | Rule |
|---|---|
| Location | `mode∈{offline,any,unset}` → `location.city===city` AND (`state` ⇒ `location.state===state`). `mode=online` → no location filter. |
| Mode | `offline` → `teachingMode ∈ {offline, both}`. `online` → `teachingMode ∈ {online, both}`. `any`/unset → no mode restriction. |
| Class | `teachingPreferences.school[classKey]` exists and is non-empty. Skipped if no `classKey`. |
| Subject | intersection of `teachingPreferences.school[classKey]` and selected `subjects` is non-empty (ANY match). Skipped if no subjects. |
| Price | `teachingModes.homeTuition.selected === true` AND `finalPrice` (or `monthlyPrice + margin`) within `[minPrice, maxPrice]`. Skipped when slider at default. |

Note: `runningBookingsCount` and `lastShownAt` are referenced but not declared in the Mentor schema. Treat missing values defensively with `$ifNull` (default `runningBookingsCount` → 0). Optionally add explicit schema fields (non-breaking) during implementation.

### Ranking — composite `priorityScore`

Computed over the filtered set (higher = earlier). Distance is the dominant term so nearby mentors lead.

1. **Nearness** (dominant): Haversine distance from parent `lat/lon` to `location.lat/lon`. Nearer → higher. When parent coords absent, fall back to `rating` as the primary key.
2. **Category** tie-break: gold > silver > budget (mild boost).
3. **Currently teaching**: `runningBookingsCount > 0` → boost.
4. **Prior demo** with this parent (`classbookings` where `mentor`+`parent`+`isDemo:true` exists) → boost.

Concrete weights are an implementation detail; the ordering invariant is: a clearly-nearer mentor outranks a farther one; among similar distance, category then currently-teaching then prior-demo break ties.

### Response shape

```json
{
  "success": true,
  "featured": [ /* up to 6: top 2 gold + 2 silver + 2 budget from filtered set */ ],
  "mentors": [ /* ranked page of the main list, featured 6 excluded */ ],
  "page": 1,
  "limit": 20,
  "total": 137,
  "hasMore": true,
  "mode": "geo|city|online"
}
```

- `featured` returned only on `page === 1`; empty array on later pages.
- All mentor objects pass through `sanitizeMentorForStudent()` (strips phone/email/exact coords) as today.
- The 6 featured mentors are excluded from `mentors` to avoid duplicates.

### Aggregation outline

Single pipeline:
1. `$match` — base + hard filters.
2. `$addFields` — `distanceKm` (Haversine, guarded for missing coords), `distanceScore`, `hasPriorDemo` (via `$lookup` on `classbookings` when `parentId` present), `priorityScore`.
3. `$facet`:
   - `featuredGold` / `featuredSilver` / `featuredBudget`: `$match category`, `$sort priorityScore desc`, `$limit 2`.
   - `list`: `$sort priorityScore desc`, then `$skip`/`$limit` for pagination (exclude featured ids).
   - `totalCount`: `$count`.
4. Post-process in JS: assemble `featured`, exclude featured ids from `list`, compute `hasMore`, sanitize.

Replaces the Indore-hardcoded `buildRecommendationPipeline`. Keep `lastShownAt` rotation update behavior (update shown mentors' `lastShownAt`).

## Frontend changes — `homentor-frontend/src/pages/Mentors.tsx`

- Keep all filter UI components (ClassSelect, MultiSubjectSelect, StateSelect, city, area, mode, PriceSlider, search).
- Replace in-memory `applyFilters()` with a **debounced fetch** that maps current filter state → query params and calls the endpoint. Debounce ~300–400ms.
- Render `featured` in the existing Gold/Featured strip; render `mentors` in the main grid.
- Add **"Load more"** (or infinite scroll) that fetches the next `page` and appends to `mentors`.
- Reset to `page=1` whenever any filter changes.
- Remove the separate `/gold-mentor` fetch; `featured` replaces it.
- Free-text search term: send as a `q` param (optional, can be a follow-up) or keep client-side over the loaded page — decide in plan; not core to this spec.

## Out of scope

- Redesigning mentor cards (`TornCard.tsx`) beyond wiring data already returned.
- Admin-side controls for category assignment (uses existing `category` field).
- Changing how `category`, `demoType`, or `inHouse` are set.

## Testing

- Backend: unit/integration tests for the endpoint — location restriction (offline vs online), class/subject/price filters, featured strip composition, pagination (`hasMore`, no duplicates), and ranking invariants (nearer outranks farther; category/teaching/demo tie-breaks). Use a seeded set of mentors across cities/categories/prices.
- Frontend: filter changes refetch and reset paging; "Load more" appends; empty-result state renders cleanly.
- Manual: verify a non-Indore city now returns its local mentors, and that subject/price filters meaningfully narrow results.
