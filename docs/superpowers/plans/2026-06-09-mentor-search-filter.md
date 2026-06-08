# Mentor Search & Filter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Indore-hardcoded, 8-capped, client-side mentor filtering with a backend endpoint that filters across all `showOnWebsite:true` mentors, ranks them (nearby → featured 2/2/2 → busy → prior-demo), and paginates — with the frontend rendering a featured strip + a "Load more" list.

**Architecture:** All hard filters, distance ranking, featured-bucket selection, and pagination move into a single MongoDB aggregation built by a new pure module `utils/mentorSearch.js`. The `/visible-mentors` route becomes a thin caller. The parent frontend (`Mentors.tsx`) drops in-memory `applyFilters` and instead sends filter state as query params, rendering `featured` + paginated `mentors`.

**Tech Stack:** Node.js, Express, Mongoose 8, MongoDB aggregation. Tests: Node built-in `node:test` + `node:assert` + `mongodb-memory-server`. Frontend: React + TypeScript + Vite + axios.

---

## Spec

Source spec: `docs/superpowers/specs/2026-06-09-mentor-search-filter-design.md`. Read it before starting.

## File Structure

**Backend:**
- Create `homentor-backend-main/utils/mentorSearch.js` — pure helpers: `buildMentorMatch(params)`, `buildMentorSearchPipeline(params)`, and `runMentorSearch(MentorModel, params)`. Single responsibility: turn query params into a filtered/ranked/paginated result.
- Create `homentor-backend-main/test/mentorSearch.test.js` — tests for the above (match builder unit tests + aggregation integration tests against in-memory Mongo).
- Modify `homentor-backend-main/routes/mentorRoutes.js` — rewrite the `/visible-mentors` handler to call `runMentorSearch`; delete the broken `isActive` city path and the old `buildRecommendationPipeline`.
- Modify `homentor-backend-main/package.json` — add `mongodb-memory-server` devDependency and a real `test` script.

**Frontend:**
- Modify `homentor-frontend/src/pages/Mentors.tsx` — replace client-side filtering with server-param fetch + pagination; render `featured` + `mentors`.

---

## Task 1: Backend test harness

**Files:**
- Modify: `homentor-backend-main/package.json`
- Create: `homentor-backend-main/test/smoke.test.js`

- [ ] **Step 1: Add devDependency and test script**

Run:
```bash
cd homentor-backend-main && npm install --save-dev mongodb-memory-server@^10
```

Then edit `homentor-backend-main/package.json` `scripts` block so `test` reads:
```json
"scripts": {
  "test": "node --test test/",
  "start": "node app.js"
},
```

- [ ] **Step 2: Write a smoke test that boots in-memory Mongo**

Create `homentor-backend-main/test/smoke.test.js`:
```js
const { test, before, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
});

after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

test("in-memory mongo connects", async () => {
  assert.equal(mongoose.connection.readyState, 1);
});
```

- [ ] **Step 3: Run the smoke test**

Run: `cd homentor-backend-main && npm test`
Expected: PASS (1 test). First run downloads a MongoDB binary — may take a minute.

- [ ] **Step 4: Commit**

```bash
git add "homentor-backend-main/package.json" "homentor-backend-main/package-lock.json" "homentor-backend-main/test/smoke.test.js"
git commit -m "test(backend): add node:test + mongodb-memory-server harness"
```

---

## Task 2: `buildMentorMatch` — hard filters

The `$match` stage that gates which mentors appear. Pure function, no DB.

**Files:**
- Create: `homentor-backend-main/utils/mentorSearch.js`
- Create/Modify test: `homentor-backend-main/test/mentorSearch.test.js`

- [ ] **Step 1: Write failing tests for `buildMentorMatch`**

Create `homentor-backend-main/test/mentorSearch.test.js`:
```js
const { test } = require("node:test");
const assert = require("node:assert");
const { buildMentorMatch } = require("../utils/mentorSearch");

test("base match always gates on showOnWebsite + Approved", () => {
  const m = buildMentorMatch({});
  assert.equal(m.showOnWebsite, true);
  assert.equal(m.status, "Approved");
});

test("offline mode filters city+state and offline-capable mode", () => {
  const m = buildMentorMatch({ mode: "offline", city: "Bhopal", state: "MP" });
  assert.equal(m["location.city"], "Bhopal");
  assert.equal(m["location.state"], "MP");
  assert.deepEqual(m.teachingMode.$in, ["offline", "both"]);
});

test("online mode ignores city/state and gates online-capable mode", () => {
  const m = buildMentorMatch({ mode: "online", city: "Bhopal", state: "MP" });
  assert.equal(m["location.city"], undefined);
  assert.equal(m["location.state"], undefined);
  assert.deepEqual(m.teachingMode.$in, ["online", "both"]);
});

test("any/unset mode keeps city restriction, no mode gate", () => {
  const m = buildMentorMatch({ city: "Indore" });
  assert.equal(m["location.city"], "Indore");
  assert.equal(m.teachingMode, undefined);
});

test("classKey gates that class key exists", () => {
  const m = buildMentorMatch({ classKey: "class-9-10" });
  assert.deepEqual(m["teachingPreferences.school.class-9-10"], { $exists: true, $ne: [] });
});

test("subjects intersect within class (ANY match)", () => {
  const m = buildMentorMatch({ classKey: "class-9-10", subjects: ["Maths", "Science"] });
  assert.deepEqual(m["teachingPreferences.school.class-9-10"].$in, ["Maths", "Science"]);
});

test("price range gates home tuition finalPrice when provided", () => {
  const m = buildMentorMatch({ minPrice: 1000, maxPrice: 5000 });
  assert.equal(m["teachingModes.homeTuition.selected"], true);
  assert.deepEqual(m["teachingModes.homeTuition.finalPrice"], { $gte: 1000, $lte: 5000 });
});

test("default price range (0..20000) is NOT applied", () => {
  const m = buildMentorMatch({ minPrice: 0, maxPrice: 20000 });
  assert.equal(m["teachingModes.homeTuition.finalPrice"], undefined);
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd homentor-backend-main && node --test test/mentorSearch.test.js`
Expected: FAIL — `Cannot find module '../utils/mentorSearch'`.

- [ ] **Step 3: Implement `buildMentorMatch`**

Create `homentor-backend-main/utils/mentorSearch.js`:
```js
"use strict";

const PRICE_FLOOR = 0;
const PRICE_CEIL = 20000;

/**
 * Build the $match (hard filters) for a parent mentor search.
 * Base gate: showOnWebsite:true AND status:"Approved".
 * Online mode ignores location; offline/any restricts to city (+state).
 */
function buildMentorMatch(params = {}) {
  const { mode, city, state, classKey, subjects, minPrice, maxPrice } = params;

  const match = {
    showOnWebsite: true,
    status: "Approved",
  };

  // Mode gate
  if (mode === "online") {
    match.teachingMode = { $in: ["online", "both"] };
  } else if (mode === "offline") {
    match.teachingMode = { $in: ["offline", "both"] };
  }
  // "any"/unset: no teachingMode restriction

  // Location gate — skipped only for explicit online
  if (mode !== "online") {
    if (city) match["location.city"] = city;
    if (state) match["location.state"] = state;
  }

  // Class gate
  if (classKey) {
    const subjectList = Array.isArray(subjects)
      ? subjects.filter(Boolean)
      : [];
    if (subjectList.length > 0) {
      // ANY selected subject taught for that class
      match[`teachingPreferences.school.${classKey}`] = { $in: subjectList };
    } else {
      match[`teachingPreferences.school.${classKey}`] = { $exists: true, $ne: [] };
    }
  }

  // Price gate — only when narrowed off the default range
  const hasMin = minPrice != null && Number(minPrice) > PRICE_FLOOR;
  const hasMax = maxPrice != null && Number(maxPrice) < PRICE_CEIL;
  if (hasMin || hasMax) {
    match["teachingModes.homeTuition.selected"] = true;
    const range = {};
    range.$gte = hasMin ? Number(minPrice) : PRICE_FLOOR;
    range.$lte = hasMax ? Number(maxPrice) : PRICE_CEIL;
    match["teachingModes.homeTuition.finalPrice"] = range;
  }

  return match;
}

module.exports = { buildMentorMatch, PRICE_FLOOR, PRICE_CEIL };
```

- [ ] **Step 4: Run to verify pass**

Run: `cd homentor-backend-main && node --test test/mentorSearch.test.js`
Expected: PASS (all `buildMentorMatch` tests).

- [ ] **Step 5: Commit**

```bash
git add "homentor-backend-main/utils/mentorSearch.js" "homentor-backend-main/test/mentorSearch.test.js"
git commit -m "feat(backend): add buildMentorMatch hard-filter builder for mentor search"
```

---

## Task 3: `buildMentorSearchPipeline` — scoring + facet + pagination

Builds the full aggregation: match → distance/score addFields → `$facet` with category buckets (featured), main paged list, and total count.

**Files:**
- Modify: `homentor-backend-main/utils/mentorSearch.js`
- Modify: `homentor-backend-main/test/mentorSearch.test.js`

- [ ] **Step 1: Write a failing structural test**

Append to `homentor-backend-main/test/mentorSearch.test.js`:
```js
const { buildMentorSearchPipeline } = require("../utils/mentorSearch");

test("pipeline starts with $match and ends with a $facet", () => {
  const p = buildMentorSearchPipeline({ city: "Indore", page: 1, limit: 20 });
  assert.equal(Object.keys(p[0])[0], "$match");
  const facet = p.find((s) => s.$facet);
  assert.ok(facet, "expected a $facet stage");
  assert.ok(facet.$facet.featuredGold);
  assert.ok(facet.$facet.featuredSilver);
  assert.ok(facet.$facet.featuredBudget);
  assert.ok(facet.$facet.list);
  assert.ok(facet.$facet.total);
});

test("list facet paginates with skip/limit", () => {
  const p = buildMentorSearchPipeline({ city: "Indore", page: 2, limit: 10 });
  const facet = p.find((s) => s.$facet);
  const stages = facet.$facet.list;
  const skip = stages.find((s) => s.$skip != null);
  const limit = stages.find((s) => s.$limit != null);
  assert.equal(skip.$skip, 10); // (page-1)*limit
  assert.equal(limit.$limit, 10);
});

test("featured buckets cap at 2 each", () => {
  const p = buildMentorSearchPipeline({ city: "Indore" });
  const facet = p.find((s) => s.$facet);
  for (const key of ["featuredGold", "featuredSilver", "featuredBudget"]) {
    const lim = facet.$facet[key].find((s) => s.$limit != null);
    assert.equal(lim.$limit, 2);
  }
});

test("distance stages included only when lat/lon present", () => {
  const withGeo = buildMentorSearchPipeline({ lat: 22.7, lon: 75.8 });
  const noGeo = buildMentorSearchPipeline({});
  assert.ok(JSON.stringify(withGeo).includes("distanceKm"));
  assert.ok(!JSON.stringify(noGeo).includes("distanceKm"));
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd homentor-backend-main && node --test test/mentorSearch.test.js`
Expected: FAIL — `buildMentorSearchPipeline is not a function`.

- [ ] **Step 3: Implement the pipeline builder**

Edit `homentor-backend-main/utils/mentorSearch.js`. Add before `module.exports`:
```js
const DEFAULT_LIMIT = 20;

// Boosts: nearness dominates via distance bands; within a band the tail
// order is busy (currently teaching) > prior-demo > category.
const TEACHING_BOOST = 6;
const DEMO_BOOST = 3;
const CATEGORY_BOOST = { gold: 2, silver: 1, budget: 0 };

function haversineKm(parentLat, parentLon) {
  // Returns an aggregation expression computing great-circle distance in KM.
  return {
    $multiply: [
      6371,
      {
        $acos: {
          $min: [
            1,
            {
              $add: [
                {
                  $multiply: [
                    { $cos: { $degreesToRadians: parentLat } },
                    { $cos: { $degreesToRadians: { $ifNull: ["$location.lat", 0] } } },
                    {
                      $cos: {
                        $subtract: [
                          { $degreesToRadians: { $ifNull: ["$location.lon", 0] } },
                          { $degreesToRadians: parentLon },
                        ],
                      },
                    },
                  ],
                },
                {
                  $multiply: [
                    { $sin: { $degreesToRadians: parentLat } },
                    { $sin: { $degreesToRadians: { $ifNull: ["$location.lat", 0] } } },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
  };
}

/**
 * Build the score addFields stages.
 * With geo: score = (1000 - distanceBand*10) + boosts.  Nearer band wins.
 * Without geo: score = rating*10 + boosts.  (rating-led fallback)
 */
function buildScoreStages({ lat, lon }) {
  const hasGeo = lat != null && lon != null && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lon));
  const boosts = [
    { $cond: [{ $gt: [{ $ifNull: ["$runningBookingsCount", 0] }, 0] }, TEACHING_BOOST, 0] },
    { $cond: [{ $ifNull: ["$hasPriorDemo", false] }, DEMO_BOOST, 0] },
    {
      $switch: {
        branches: [
          { case: { $eq: ["$category", "gold"] }, then: CATEGORY_BOOST.gold },
          { case: { $eq: ["$category", "silver"] }, then: CATEGORY_BOOST.silver },
        ],
        default: CATEGORY_BOOST.budget,
      },
    },
  ];

  if (!hasGeo) {
    return [
      {
        $addFields: {
          priorityScore: {
            $add: [{ $multiply: [{ $ifNull: ["$rating", 0] }, 10] }, ...boosts],
          },
        },
      },
    ];
  }

  return [
    { $addFields: { distanceKm: haversineKm(Number(lat), Number(lon)) } },
    {
      $addFields: {
        distanceBand: { $floor: { $divide: ["$distanceKm", 2] } }, // 2km bands
      },
    },
    {
      $addFields: {
        priorityScore: {
          $add: [
            { $subtract: [1000, { $multiply: ["$distanceBand", 10] }] },
            ...boosts,
          ],
        },
      },
    },
  ];
}

function buildPriorDemoStages(parentObjectId) {
  if (!parentObjectId) {
    return [{ $addFields: { hasPriorDemo: false } }];
  }
  return [
    {
      $lookup: {
        from: "classbookings",
        let: { mentorId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$mentor", "$$mentorId"] },
                  { $eq: ["$parent", parentObjectId] },
                  { $eq: ["$isDemo", true] },
                ],
              },
            },
          },
          { $limit: 1 },
        ],
        as: "priorDemos",
      },
    },
    { $addFields: { hasPriorDemo: { $gt: [{ $size: "$priorDemos" }, 0] } } },
    { $project: { priorDemos: 0 } },
  ];
}

function buildMentorSearchPipeline(params = {}, parentObjectId = null) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || DEFAULT_LIMIT);
  const skip = (page - 1) * limit;

  const sortStage = { $sort: { priorityScore: -1, _id: 1 } };
  const featuredBucket = (category) => [
    { $match: { category } },
    sortStage,
    { $limit: 2 },
  ];

  return [
    { $match: buildMentorMatch(params) },
    ...buildPriorDemoStages(parentObjectId),
    ...buildScoreStages(params),
    {
      $facet: {
        featuredGold: featuredBucket("gold"),
        featuredSilver: featuredBucket("silver"),
        featuredBudget: featuredBucket("budget"),
        list: [sortStage, { $skip: skip }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ];
}
```

Update `module.exports` to:
```js
module.exports = {
  buildMentorMatch,
  buildMentorSearchPipeline,
  PRICE_FLOOR,
  PRICE_CEIL,
};
```

- [ ] **Step 4: Run to verify pass**

Run: `cd homentor-backend-main && node --test test/mentorSearch.test.js`
Expected: PASS (all structural tests).

- [ ] **Step 5: Commit**

```bash
git add "homentor-backend-main/utils/mentorSearch.js" "homentor-backend-main/test/mentorSearch.test.js"
git commit -m "feat(backend): add buildMentorSearchPipeline with scoring, featured buckets, pagination"
```

---

## Task 4: `runMentorSearch` — execute + shape response, integration tested

Runs the pipeline against the model, assembles `{ featured, mentors, page, limit, total, hasMore }`, and excludes featured ids from the main list. Integration test seeds real mentors in in-memory Mongo and asserts behavior.

**Files:**
- Modify: `homentor-backend-main/utils/mentorSearch.js`
- Modify: `homentor-backend-main/test/mentorSearch.test.js`

- [ ] **Step 1: Write failing integration tests**

Append to `homentor-backend-main/test/mentorSearch.test.js`:
```js
const { test: itest, before: ibefore, after: iafter } = require("node:test");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Mentor = require("../models/Mentor");
const { runMentorSearch } = require("../utils/mentorSearch");

let mongod2;

ibefore(async () => {
  mongod2 = await MongoMemoryServer.create();
  await mongoose.connect(mongod2.getUri());
});

iafter(async () => {
  await mongoose.disconnect();
  await mongod2.stop();
});

function mentorDoc(over = {}) {
  return {
    name: over.name || "M",
    status: "Approved",
    showOnWebsite: true,
    category: "budget",
    teachingMode: "offline",
    location: { city: "Indore", state: "MP", lat: 22.72, lon: 75.86 },
    teachingPreferences: { school: { "class-9-10": ["Maths"] } },
    teachingModes: { homeTuition: { selected: true, finalPrice: 3000 } },
    runningBookingsCount: 0,
    rating: 3,
    ...over,
  };
}

itest("returns only showOnWebsite:true mentors in the matched city", async () => {
  await Mentor.deleteMany({});
  await Mentor.create([
    mentorDoc({ name: "visible-indore" }),
    mentorDoc({ name: "hidden", showOnWebsite: false }),
    mentorDoc({ name: "other-city", location: { city: "Bhopal", state: "MP", lat: 23.2, lon: 77.4 } }),
  ]);
  const res = await runMentorSearch(Mentor, { city: "Indore", state: "MP" });
  const names = res.mentors.map((m) => m.name);
  assert.ok(names.includes("visible-indore"));
  assert.ok(!names.includes("hidden"));
  assert.ok(!names.includes("other-city"));
});

itest("online mode ignores city and returns online mentors from anywhere", async () => {
  await Mentor.deleteMany({});
  await Mentor.create([
    mentorDoc({ name: "online-far", teachingMode: "online", location: { city: "Delhi", state: "DL", lat: 28.6, lon: 77.2 } }),
    mentorDoc({ name: "offline-local", teachingMode: "offline" }),
  ]);
  const res = await runMentorSearch(Mentor, { mode: "online", city: "Indore" });
  const names = res.mentors.map((m) => m.name);
  assert.ok(names.includes("online-far"));
  assert.ok(!names.includes("offline-local"));
});

itest("subject filter matches ANY selected subject", async () => {
  await Mentor.deleteMany({});
  await Mentor.create([
    mentorDoc({ name: "teaches-science", teachingPreferences: { school: { "class-9-10": ["Science"] } } }),
    mentorDoc({ name: "teaches-hindi", teachingPreferences: { school: { "class-9-10": ["Hindi"] } } }),
  ]);
  const res = await runMentorSearch(Mentor, { city: "Indore", classKey: "class-9-10", subjects: ["Maths", "Science"] });
  const names = res.mentors.map((m) => m.name);
  assert.ok(names.includes("teaches-science"));
  assert.ok(!names.includes("teaches-hindi"));
});

itest("featured returns up to 2 gold + 2 silver + 2 budget and excludes them from list", async () => {
  await Mentor.deleteMany({});
  const docs = [];
  for (let i = 0; i < 3; i++) docs.push(mentorDoc({ name: `gold-${i}`, category: "gold" }));
  for (let i = 0; i < 3; i++) docs.push(mentorDoc({ name: `silver-${i}`, category: "silver" }));
  for (let i = 0; i < 3; i++) docs.push(mentorDoc({ name: `budget-${i}`, category: "budget" }));
  await Mentor.create(docs);
  const res = await runMentorSearch(Mentor, { city: "Indore", limit: 50 });
  assert.equal(res.featured.length, 6); // 2 each
  const featuredIds = new Set(res.featured.map((m) => String(m._id)));
  for (const m of res.mentors) {
    assert.ok(!featuredIds.has(String(m._id)), "featured mentor leaked into main list");
  }
});

itest("currently-teaching mentor outranks idle one at same distance", async () => {
  await Mentor.deleteMany({});
  await Mentor.create([
    mentorDoc({ name: "idle", runningBookingsCount: 0 }),
    mentorDoc({ name: "busy", runningBookingsCount: 2 }),
  ]);
  const res = await runMentorSearch(Mentor, { lat: 22.72, lon: 75.86, city: "Indore", limit: 50 });
  const order = res.mentors.map((m) => m.name);
  assert.ok(order.indexOf("busy") < order.indexOf("idle"));
});

itest("pagination reports hasMore and total", async () => {
  await Mentor.deleteMany({});
  const docs = [];
  for (let i = 0; i < 25; i++) docs.push(mentorDoc({ name: `m-${i}`, category: "budget" }));
  await Mentor.create(docs);
  const page1 = await runMentorSearch(Mentor, { city: "Indore", page: 1, limit: 10 });
  assert.equal(page1.total, 25);
  assert.equal(page1.mentors.length, 10);
  assert.equal(page1.hasMore, true);
  const page3 = await runMentorSearch(Mentor, { city: "Indore", page: 3, limit: 10 });
  assert.equal(page3.hasMore, false);
  assert.equal(page3.featured.length, 0); // featured only on page 1
});

itest("does not expose phone/email (sanitized)", async () => {
  await Mentor.deleteMany({});
  await Mentor.create(mentorDoc({ name: "p", phone: "9999999999", email: "x@y.com" }));
  const res = await runMentorSearch(Mentor, { city: "Indore" });
  assert.equal(res.mentors[0].phone, undefined);
  assert.equal(res.mentors[0].email, undefined);
});
```

> Note: featured mentors count toward `total` and toward the page's positions. With 25 budget mentors and limit 10, page 1 list = 10 (the 2 featured budget excluded, next 10 shown), page 3 still has remainder → `hasMore:false`. The assertions above only check counts that hold regardless of exact featured overlap; keep them as written.

- [ ] **Step 2: Run to verify it fails**

Run: `cd homentor-backend-main && node --test test/mentorSearch.test.js`
Expected: FAIL — `runMentorSearch is not a function`.

- [ ] **Step 3: Implement `runMentorSearch`**

Edit `homentor-backend-main/utils/mentorSearch.js`. Add `require` at top (below `"use strict"`):
```js
const mongoose = require("mongoose");
const sanitizeMentorForStudent = require("./sanitizeMentorForStudent");
```

Add before `module.exports`:
```js
/**
 * Execute the search and shape the parent-facing response.
 * Returns { success, featured, mentors, page, limit, total, hasMore }.
 * `featured` is populated only on page 1 and excluded from `mentors`.
 */
async function runMentorSearch(MentorModel, params = {}) {
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || DEFAULT_LIMIT);

  const parentObjectId =
    params.parentId && mongoose.Types.ObjectId.isValid(params.parentId)
      ? new mongoose.Types.ObjectId(params.parentId)
      : null;

  const pipeline = buildMentorSearchPipeline(params, parentObjectId);
  const [result] = await MentorModel.aggregate(pipeline);

  const total = result?.total?.[0]?.count || 0;

  let featured = [];
  if (page === 1) {
    featured = [
      ...(result?.featuredGold || []),
      ...(result?.featuredSilver || []),
      ...(result?.featuredBudget || []),
    ];
  }
  const featuredIds = new Set(featured.map((m) => String(m._id)));

  const mentors = (result?.list || []).filter(
    (m) => !featuredIds.has(String(m._id))
  );

  const hasMore = page * limit < total;

  return {
    success: true,
    featured: featured.map(sanitizeMentorForStudent),
    mentors: mentors.map(sanitizeMentorForStudent),
    page,
    limit,
    total,
    hasMore,
  };
}
```

Update `module.exports`:
```js
module.exports = {
  buildMentorMatch,
  buildMentorSearchPipeline,
  runMentorSearch,
  PRICE_FLOOR,
  PRICE_CEIL,
};
```

- [ ] **Step 4: Run to verify pass**

Run: `cd homentor-backend-main && node --test test/mentorSearch.test.js`
Expected: PASS (all unit + integration tests).

- [ ] **Step 5: Commit**

```bash
git add "homentor-backend-main/utils/mentorSearch.js" "homentor-backend-main/test/mentorSearch.test.js"
git commit -m "feat(backend): add runMentorSearch with sanitized, paginated featured+list response"
```

---

## Task 5: Wire the `/visible-mentors` route

Replace the three-case handler with a single call to `runMentorSearch`; delete the broken `isActive` path and the dead `buildRecommendationPipeline`. Keep `lastShownAt` rotation update.

**Files:**
- Modify: `homentor-backend-main/routes/mentorRoutes.js`

- [ ] **Step 1: Replace the `/visible-mentors` handler**

In `homentor-backend-main/routes/mentorRoutes.js`, replace the entire `router.get('/visible-mentors', ...)` block (lines ~203–286) with:
```js
router.get('/visible-mentors', async (req, res) => {
  try {
    const { runMentorSearch } = require("../utils/mentorSearch");

    const result = await runMentorSearch(Mentor, req.query);

    // Rotation bookkeeping: mark shown mentors so ties rotate over time.
    const shownIds = [...result.featured, ...result.mentors]
      .map((m) => m._id)
      .filter(Boolean);
    if (shownIds.length) {
      await Mentor.updateMany(
        { _id: { $in: shownIds } },
        { $set: { lastShownAt: new Date() } }
      );
    }

    return res.json(result);
  } catch (error) {
    console.error("Mentor search error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});
```

- [ ] **Step 2: Delete the dead `buildRecommendationPipeline` function**

Delete the entire `function buildRecommendationPipeline(...) { ... }` definition (lines ~485–784). Verify nothing else references it:

Run: `cd homentor-backend-main && grep -rn "buildRecommendationPipeline" .`
Expected: no matches (or only this plan/spec docs outside the repo code).

- [ ] **Step 3: Verify the file still parses**

Run: `cd homentor-backend-main && node -e "require('./routes/mentorRoutes.js'); console.log('ok')"`
Expected: prints `ok` (the route file loads without syntax errors). If it errors about a DB connection, that's a different issue — only a SyntaxError fails this step.

- [ ] **Step 4: Run the full backend test suite**

Run: `cd homentor-backend-main && npm test`
Expected: PASS, all tests.

- [ ] **Step 5: Manual smoke (optional, needs a running backend + DB)**

Run (with the backend running locally):
```bash
curl "http://localhost:5000/api/mentor/visible-mentors?city=Indore&state=MP&page=1&limit=20" | head -c 600
```
Expected: JSON with `featured`, `mentors`, `total`, `hasMore`. (Adjust port/base path to your setup.)

- [ ] **Step 6: Commit**

```bash
git add "homentor-backend-main/routes/mentorRoutes.js"
git commit -m "refactor(backend): point /visible-mentors at runMentorSearch; drop Indore hardcode, 8-cap, broken isActive path"
```

---

## Task 6: Frontend — fetch by params, drop client-side filtering

Map the existing filter state to query params, fetch the server result, and store `featured` + `mentors` + paging meta. Reset to page 1 on any filter change. Debounce.

**Files:**
- Modify: `homentor-frontend/src/pages/Mentors.tsx`

> Before editing, read the current file to confirm exact state variable names (`selectedClass`, `selectedSubjects`, `selectedState`, `selectedCity`, `selectedMode`, `priceRange`, `userLocation`/area coords, `parentId`). The names below assume those; adapt to whatever the file actually uses.

- [ ] **Step 1: Read the current filter + fetch code**

Run: `sed -n '230,300p;400,600p' "homentor-frontend/src/pages/Mentors.tsx"`
Note the exact names of the filter state variables, the axios fetch, and where `filteredMentors`/`mentorsData` are set.

- [ ] **Step 2: Add a query-param builder + state for paging**

Near the other `useState` declarations in `Mentors.tsx`, add:
```tsx
const [featured, setFeatured] = useState<any[]>([]);
const [mentors, setMentors] = useState<any[]>([]);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(false);
const [total, setTotal] = useState(0);
const [loadingMore, setLoadingMore] = useState(false);
```

Add a param builder (place above the fetch effect). Use the real variable names found in Step 1:
```tsx
const buildParams = (pageArg: number) => {
  const params: Record<string, string | number> = {
    page: pageArg,
    limit: 20,
  };
  if (selectedMode && selectedMode !== "any") params.mode = selectedMode;
  if (selectedState) params.state = selectedState;
  if (selectedCity) params.city = selectedCity;
  if (selectedClass) params.classKey = selectedClass; // already in "class-9-10" form
  if (selectedSubjects?.length) params.subjects = selectedSubjects.join(",");
  if (priceRange && (priceRange[0] > 0 || priceRange[1] < 20000)) {
    params.minPrice = priceRange[0];
    params.maxPrice = priceRange[1];
  }
  if (areaCoords?.lat && areaCoords?.lon) {
    params.lat = areaCoords.lat;
    params.lon = areaCoords.lon;
  }
  if (parentId) params.parentId = parentId;
  return params;
};
```

> If `selectedSubjects` is sent as repeated params elsewhere, axios serializes an array fine; the backend reads CSV OR array — `buildMentorMatch` expects an array. To be safe the route should accept both. Confirm in Step 1 whether subjects is a string[] and adjust: if axios sends `subjects=Maths&subjects=Science`, Express gives `req.query.subjects` as an array — `buildMentorMatch` handles arrays. Sending `.join(",")` gives a string; in that case split in the route (see Step 6 fallback).

- [ ] **Step 3: Replace the fetch effect**

Replace the existing `useEffect` that calls `/visible-mentors` + `applyFilters` with a debounced fetch that resets to page 1 when filters change:
```tsx
useEffect(() => {
  const controller = new AbortController();
  const handle = setTimeout(async () => {
    try {
      setIsLoading(true);
      setPage(1);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/visible-mentors`,
        { params: buildParams(1), signal: controller.signal }
      );
      setFeatured(res.data.featured || []);
      setMentors(res.data.mentors || []);
      setHasMore(!!res.data.hasMore);
      setTotal(res.data.total || 0);
    } catch (e) {
      if (!axios.isCancel(e)) console.error("mentor search failed", e);
    } finally {
      setIsLoading(false);
    }
  }, 350);
  return () => {
    clearTimeout(handle);
    controller.abort();
  };
  // re-run whenever any filter changes
}, [selectedMode, selectedState, selectedCity, selectedClass, selectedSubjects, priceRange, areaCoords, parentId]);
```

- [ ] **Step 4: Add a `loadMore` handler**

```tsx
const loadMore = async () => {
  if (loadingMore || !hasMore) return;
  const next = page + 1;
  try {
    setLoadingMore(true);
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/mentor/visible-mentors`,
      { params: buildParams(next) }
    );
    setMentors((prev) => [...prev, ...(res.data.mentors || [])]);
    setHasMore(!!res.data.hasMore);
    setPage(next);
  } catch (e) {
    console.error("load more failed", e);
  } finally {
    setLoadingMore(false);
  }
};
```

- [ ] **Step 5: Remove the old client-side filtering code**

Delete the `applyFilters` function and the `filteredMentors`/`mentorsData` state and any `setFilteredMentors` calls, plus the standalone `/gold-mentor` fetch (featured replaces it). Search for leftovers:

Run: `grep -n "applyFilters\|filteredMentors\|mentorsData\|gold-mentor" "homentor-frontend/src/pages/Mentors.tsx"`
Expected after edits: no matches.

- [ ] **Step 6: Type-check / build**

Run: `cd homentor-frontend && npm run build`
Expected: build succeeds. Fix any TypeScript errors about removed/renamed variables.

- [ ] **Step 7: Commit**

```bash
git add "homentor-frontend/src/pages/Mentors.tsx"
git commit -m "feat(frontend): fetch mentors by server filters with pagination; drop client-side filtering"
```

---

## Task 7: Frontend — render featured strip + paginated list

**Files:**
- Modify: `homentor-frontend/src/pages/Mentors.tsx`

- [ ] **Step 1: Render featured + main grid**

Replace the old `filteredMentors.map(...)` render block. Render the featured strip (only when non-empty) above the main grid:
```tsx
{featured.length > 0 && (
  <section className="mb-8">
    <h2 className="text-lg font-semibold mb-3">Featured Mentors</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {featured.map((mentor, i) => (
        <TornCard key={mentor._id || `f-${i}`} mentor={mentor} />
      ))}
    </div>
  </section>
)}

<section>
  <h2 className="text-lg font-semibold mb-3">
    All Mentors{total ? ` (${total})` : ""}
  </h2>
  {mentors.length === 0 && !isLoading ? (
    <p className="text-gray-500">No mentors match your filters. Try widening them.</p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {mentors.map((mentor, i) => (
        <TornCard key={mentor._id || `m-${i}`} mentor={mentor} />
      ))}
    </div>
  )}
</section>
```

> Match the existing grid class names in the file rather than the placeholders above if they differ, to keep styling consistent.

- [ ] **Step 2: Add the "Load more" button**

Below the main grid:
```tsx
{hasMore && (
  <div className="flex justify-center mt-6">
    <button
      onClick={loadMore}
      disabled={loadingMore}
      className="px-6 py-2 rounded-md border font-medium disabled:opacity-50"
    >
      {loadingMore ? "Loading…" : "Load more"}
    </button>
  </div>
)}
```

- [ ] **Step 3: Build**

Run: `cd homentor-frontend && npm run build`
Expected: build succeeds.

- [ ] **Step 4: Manual verification checklist** (needs backend + DB running with several `showOnWebsite:true` mentors across cities/categories/prices)

- [ ] Open the Mentors page with no filters → see a Featured strip (up to 6) + a list, and the count reflects all display-on local mentors (not 8/12).
- [ ] Select a different city → only that city's mentors appear; an empty city shows the empty-state message.
- [ ] Select Online mode → mentors from other cities appear (location ignored).
- [ ] Select a class + subject → only mentors teaching that subject for that class remain.
- [ ] Drag the price slider → list narrows to in-range home-tuition mentors.
- [ ] If more than 20 match → "Load more" appears and appends the next page without duplicating featured mentors.
- [ ] Change any filter → list resets to page 1.

- [ ] **Step 5: Commit**

```bash
git add "homentor-frontend/src/pages/Mentors.tsx"
git commit -m "feat(frontend): render featured strip + paginated mentor list with Load more"
```

---

## Self-Review Notes

- **Spec coverage:** location exact-match (Task 2 match + Task 4 test), online-ignores-location (Task 2 + Task 4 test), ANY-subject (Task 2 + Task 4 test), price gate (Task 2), nearby-first ranking (Task 3 score + Task 4 busy-outranks test), featured 2/2/2 (Task 3 + Task 4 test), busy > prior-demo tail (Task 3 boosts), pagination/Load more (Task 4 + Tasks 6–7), showOnWebsite source set + remove caps/Indore/isActive (Task 5), sanitization (Task 4 test). All covered.
- **Subjects param shape:** the route receives `req.query` directly; `buildMentorMatch` accepts an array. If the frontend sends CSV (`.join(",")`), add a one-line normalization in the route before calling `runMentorSearch`: `if (typeof req.query.subjects === "string") req.query.subjects = req.query.subjects.split(",").filter(Boolean);`. Apply this in Task 5 Step 1 if Step 2 of Task 6 sends CSV. (Decide based on the actual frontend serialization.)
- **Type consistency:** `buildMentorMatch`, `buildMentorSearchPipeline`, `runMentorSearch` names are used identically across tasks. Response keys `featured/mentors/page/limit/total/hasMore` match between Task 4 and Tasks 6–7.
- **Free-text search (`q`):** deferred per spec; the search box can stay client-side over loaded pages for now, or be added later as a `q` param. Not implemented in this plan.
