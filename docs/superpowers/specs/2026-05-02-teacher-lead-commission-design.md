# Teacher Lead & Commission System — Design Spec
Date: 2026-05-02

## Overview

When a parent clicks "Call Teacher", a lead is created in the teacher's dashboard. The teacher sees partial info (name, class, subjects) but phone and address are hidden until they pay a commission. Commission amounts are configured by admin per teacher category, with optional per-teacher overrides.

---

## 1. Data Models

### New: `TeacherLead`

```js
{
  mentorId:         ObjectId → ref Mentor       // teacher who receives the lead
  parentPhone:      String                       // from CallIntent (unique key with mentorId)
  parentName:       String
  parentClass:      String                       // grade/class the parent needs
  parentSubjects:   String
  parentLocation: {
    city:           String,
    area:           String
  }                                              // hidden until commission paid
  callCount:        Number  (default: 1)         // increments on repeat calls
  lastCalledAt:     Date
  commissionPaid:   Boolean (default: false)
  commissionAmount: Number                       // snapshot at lead creation time
  paymentRef:       String                       // screenshot URL or transaction ref
  paymentStatus:    enum ["pending", "submitted", "approved"]  (default: "pending")
  timestamps:       true
}

// Compound unique index: { mentorId: 1, parentPhone: 1 }
```

### Extend: `Admin` model

```js
commissionByCategory: {
  Premium: Number,
  Regular: Number,
  Trial:   Number
}
```

### Extend: `Mentor` model

```js
commissionOverride: Number   // null = use category default from Admin
```

---

## 2. Commission Resolution Logic

At lead creation time, resolve commission amount:
1. Check `mentor.commissionOverride` — use if set (not null/0)
2. Else look up `admin.commissionByCategory[mentor.category]`
3. Snapshot the resolved amount into `TeacherLead.commissionAmount`

This snapshot ensures price changes by admin don't retroactively affect existing leads.

---

## 3. API Endpoints

### Existing (modified)
| Method | Route | Change |
|--------|-------|--------|
| `POST` | `/api/call-intent` | After saving CallIntent, upsert TeacherLead (create or increment callCount + update lastCalledAt) |

### New: Teacher Lead Routes (`/api/teacher-leads`)
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/teacher-leads/mine` | Mentor JWT | Returns teacher's leads. Strips phone + location from response if `commissionPaid: false` — masking is server-side |
| `POST` | `/api/teacher-leads/:id/pay` | Mentor JWT | Saves paymentRef/screenshot URL, sets `paymentStatus: "submitted"` |

### New: Admin Routes
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| `GET` | `/api/admin/commission-config` | Admin | Returns current commission amounts by category |
| `PUT` | `/api/admin/commission-config` | Admin | Updates commissionByCategory on Admin document |
| `GET` | `/api/admin/teacher-leads` | Admin | Lists all leads with `paymentStatus: "submitted"` for review |
| `PUT` | `/api/admin/teacher-leads/:id/approve` | Admin | Sets `commissionPaid: true`, `paymentStatus: "approved"` |

---

## 4. Lead Upsert Logic (on call click)

```
On POST /api/call-intent:
  1. Save CallIntent as usual
  2. Find TeacherLead where { mentorId, parentPhone }
  3. If not found:
     - Resolve commissionAmount (override → category → 0). If resolved to 0 (admin hasn't configured), set `commissionPaid: true` automatically — lead is free.
     - Create TeacherLead with parentName/class/subjects/location from User record (if logged in) or CallIntent fields
     - callCount = 1
  4. If found:
     - Increment callCount
     - Update lastCalledAt
     - Do NOT change commissionPaid or commissionAmount
```

**Parent data source:** If the parent is logged in, pull from the User model:
- Name → `user.parentName`
- Class/subjects → `user.children[0]` (first child's details from the children array)
- Location → `user.address`

If anonymous (no JWT), store only phone from CallIntent. Teacher will see "Anonymous" for name and empty class/subjects — lead is still useful once phone is unlocked.

---

## 5. Frontend — Teacher Dashboard

**Location:** New "Leads" tab in `MentorDashboard.tsx`

### Lead Card States

**Locked (commissionPaid: false, paymentStatus: pending)**
- Shows: Name, class, subjects, call count, last called date
- Phone: `••••••••••` (blurred/placeholder)
- Location: `Hidden`
- CTA: `Unlock Lead — ₹{commissionAmount}` button

**Submitted (paymentStatus: submitted)**
- Same locked view
- Badge: "Payment under review"
- No CTA (awaiting admin approval)

**Unlocked (commissionPaid: true)**
- Full details: phone as `tel:` link, city + area shown
- Badge: "Unlocked"
- No CTA

### Unlock Flow
1. Teacher clicks "Unlock Lead — ₹X"
2. Opens existing `ManualPaymentModal` (or gateway) via `usePaymentFlow` hook
3. Amount pre-filled from `lead.commissionAmount`
4. On payment submit → `POST /api/teacher-leads/:id/pay` with screenshot URL
5. Card switches to "Payment under review" state

---

## 6. Frontend — Admin Panel

### Commission Settings Page
- Input fields: Premium / Regular / Trial (number inputs)
- Save button → `PUT /api/admin/commission-config`
- Per-teacher override: editable field on individual teacher record page

### Teacher Leads Review Page
- Table of leads with `paymentStatus: "submitted"`
- Columns: Teacher name, Parent name, Amount, Screenshot link, Date submitted
- "Approve" button per row → `PUT /api/admin/teacher-leads/:id/approve`

---

## 7. Security Notes

- Phone and location are stripped **server-side** in `GET /mine` response when `commissionPaid: false`. Frontend never receives the data to display.
- All teacher-facing routes require mentor JWT. All admin routes require admin auth.
- `commissionAmount` is snapshotted at creation — admin price changes don't affect existing leads.

---

## 8. Future: Exotel Upgrade

When Exotel is live, the lead creation trigger moves from "call click" to Exotel's call-connected webhook. No model or API changes needed — only the insertion point in the backend changes (from `POST /call-intent` to the Exotel webhook handler).

---

## Out of Scope

- Lead expiry / TTL
- Teacher wallet / prepaid credit system
- Notifications to teacher on new lead (can be added later)
- Bulk lead unlock
