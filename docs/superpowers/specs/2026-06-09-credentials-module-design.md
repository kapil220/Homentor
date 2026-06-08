# Admin Credentials Module — Design

**Date:** 2026-06-09
**Status:** Approved

## Goal

A single admin page ("Credentials") with two tabs (Teachers / Parents) where an
admin can view and edit **name, email, phone, and password** for each account in
one place. This replaces the buried `window.prompt()` password reset currently in
`AllMentor.jsx` and brings parents and teachers to feature parity.

## Background / Current State

- **Parents** (`User` model): password view/edit exists in
  `homentor-admin panel/src/pages/ParentsPage.jsx`. No `email` field on the model today.
- **Teachers** (`Mentor` model): password reset exists via a `window.prompt()` modal
  in `homentor-admin panel/src/pages/AllMentor.jsx` (lines ~376-395). Has `fullName`,
  `email`, `phone`.
- Both models store `passwordPlain` (plaintext) alongside the bcrypt `password`, so
  admins can view the actual password.
- Existing endpoint `POST /api/auth/admin/reset-password` (`routes/authRoutes.js`)
  sets both `password` + `passwordPlain`, fires a WhatsApp message with the new password.
- `GET /api/users` (`routes/userRoutes.js`) returns all parents including `passwordPlain`.

## Decisions (from brainstorming)

- Layout: **one page, two tabs** (Teachers | Parents).
- Editable fields: **password, email, name, phone**.
- Notifications: **WhatsApp fires only on password change** (existing behavior).
- Remove the old prompt-based password reset from `AllMentor.jsx` once this exists.
- Add an `email` field to the parent `User` model.

## Frontend

**New page:** `homentor-admin panel/src/pages/CredentialsPage.jsx`

- Tab switcher: **Teachers** | **Parents**.
- Each tab: a search box (filter by name / phone / email) + a table with columns:
  Name, Email, Phone, Password (plaintext shown), Actions.
- Inline row edit: editable text inputs for name / email / phone, a password input,
  and **Save** / **Cancel** buttons.
- Save behavior:
  - If password changed → `POST /api/auth/admin/reset-password`
    (`{ userId, userType, password }`). WhatsApp notification fires.
  - If name / email / phone changed → `PUT /api/auth/admin/update-credentials`
    (`{ userId, userType, name, email, phone }`). No notification.
  - If both changed → call both endpoints.
- `userType` is `"mentor"` for the Teachers tab, `"student"` for the Parents tab
  (matching the existing reset-password endpoint convention).

**Sidebar:** add a "Credentials" nav entry routing to the new page (follow the existing
routing/sidebar pattern used by `ParentsPage` / `AllMentor`).

**Data sources:**
- Teachers: existing mentor list endpoint (same one `AllMentor.jsx` uses).
- Parents: existing `GET /api/users`.
- Both already return `passwordPlain`.

## Backend

**User model** (`models/User.js`): add `email: String`.

**New endpoint:** `PUT /api/auth/admin/update-credentials`
- Body: `{ userId, userType, name, email, phone }`.
- Selects `Mentor` (userType `"mentor"`) or `User` (userType `"student"`).
- On phone change: check for a collision (another account of the same type with that
  phone) → respond `409` if taken. (Mentor.phone is `unique`.)
- Updates the name field (`fullName` for mentor, `parentName` for user), `email`, `phone`.
- Does **not** touch the password (kept on the reset-password endpoint to preserve
  hashing + WhatsApp).

**Password change:** reuse existing `POST /api/auth/admin/reset-password`.

## Cleanup

- Remove the old `window.prompt()`-based password reset button/handler from
  `AllMentor.jsx`.

## Error Handling

- Phone collision → 409 with a clear message; frontend surfaces it inline on the row.
- Missing/invalid `userType` → 400.
- User/Mentor not found → 404.

## Out of Scope

- Migrating away from `passwordPlain` plaintext storage (separate security concern).
- Bulk editing / CSV import.
- Audit logging of credential changes.

## Testing

- Backend: update-credentials updates each field; phone collision returns 409;
  unknown userType returns 400; not-found returns 404.
- Manual: edit a teacher and a parent's name/email/phone in the UI; change a password
  and confirm WhatsApp fires; confirm search filters correctly across both tabs.
