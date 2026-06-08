# Admin Credentials Module Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a single admin "Credentials" page with Teachers/Parents tabs to view and edit name, email, phone, and password for every account in one place.

**Architecture:** Backend gets an `email` field on the parent `User` model and a new `PUT /api/auth/admin/update-credentials` endpoint (name/email/phone, with phone-collision checking). Password changes continue to flow through the existing `POST /api/auth/admin/reset-password` endpoint (which hashes + fires WhatsApp). The frontend adds one new page (`CredentialsPage.jsx`), a route, and a sidebar entry; the old prompt-based password button in `AllMentor.jsx` is removed.

**Tech Stack:** Node/Express + Mongoose (backend), React + Vite + axios + Tailwind + react-router-dom + lucide-react (admin panel).

**Note on testing:** The backend has no test framework (`npm test` is a stub) and the repo has zero automated tests. Per "follow existing patterns," this plan verifies the backend endpoint manually with `curl` and the frontend by running the dev server. Do not add a new test harness.

**Conventions confirmed from the codebase:**
- `VITE_API_BASE_URL` already includes the `/api` segment (existing calls are `${VITE_API_BASE_URL}/users`, `/mentor/approved-mentors`, `/auth/admin/reset-password`).
- Mentors fetched via `GET /mentor/approved-mentors` → `res.data.data` (array).
- Parents fetched via `GET /users` → `res.data.data` (array).
- `userType` is `"mentor"` for teachers, `"student"` for parents.
- `Mentor.phone` is a `String` and `unique`; `User.phone` is a `Number`.
- Mentor name field is `fullName`; parent name field is `parentName`.

---

## Task 1: Add `email` field to the parent User model

**Files:**
- Modify: `homentor-backend-main/models/User.js`

- [ ] **Step 1: Add the email field**

In `homentor-backend-main/models/User.js`, add an `email` field to the schema. Change the top of the schema from:

```js
const userSchema = new mongoose.Schema({
  phone: Number,
  password: { type: String },
  passwordPlain: { type: String },
  address: {
    type: Object
  },
  parentName: String,
```

to:

```js
const userSchema = new mongoose.Schema({
  phone: Number,
  email: { type: String },
  password: { type: String },
  passwordPlain: { type: String },
  address: {
    type: Object
  },
  parentName: String,
```

- [ ] **Step 2: Sanity-check the model loads**

Run: `cd homentor-backend-main && node -e "require('./models/User'); console.log('User model OK')"`
Expected: prints `User model OK` with no schema error.

- [ ] **Step 3: Commit**

```bash
cd homentor-backend-main
git add models/User.js
git commit -m "feat(user): add email field to parent model"
```

---

## Task 2: Add the update-credentials endpoint

**Files:**
- Modify: `homentor-backend-main/routes/authRoutes.js` (insert before the final `module.exports = router;` at the end of the file, after the `admin/reset-password` route)

`Mentor` and `User` are already imported in this file (used by the existing `admin/reset-password` route), so no new imports are needed.

- [ ] **Step 1: Add the endpoint**

In `homentor-backend-main/routes/authRoutes.js`, immediately after the closing `});` of the `router.post("/admin/reset-password", ...)` handler and before `module.exports = router;`, insert:

```js
// Admin-only: update name/email/phone (NOT password) for a User or Mentor.
// Password changes go through /admin/reset-password so hashing + WhatsApp stay in one place.
router.put("/admin/update-credentials", async (req, res) => {
  try {
    const { userId, userType, name, email, phone } = req.body;
    if (!userId || !userType) {
      return res.status(400).json({ success: false, message: "userId and userType are required" });
    }
    if (!["student", "mentor"].includes(userType)) {
      return res.status(400).json({ success: false, message: "Invalid userType" });
    }
    const Model = userType === "mentor" ? Mentor : User;
    const doc = await Model.findById(userId);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    // Phone change: normalize per model type and reject collisions.
    if (phone !== undefined && phone !== null && String(phone).trim() !== "" && String(phone) !== String(doc.phone)) {
      const normalizedPhone = userType === "mentor" ? String(phone) : Number(phone);
      const existing = await Model.findOne({ phone: normalizedPhone });
      if (existing && String(existing._id) !== String(doc._id)) {
        return res.status(409).json({ success: false, message: "Phone already in use" });
      }
      doc.phone = normalizedPhone;
    }

    if (name !== undefined) {
      if (userType === "mentor") doc.fullName = name;
      else doc.parentName = name;
    }
    if (email !== undefined) doc.email = email;

    await doc.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("admin update-credentials error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});
```

- [ ] **Step 2: Verify the file parses**

Run: `cd homentor-backend-main && node -e "require('./routes/authRoutes'); console.log('authRoutes OK')"`
Expected: prints `authRoutes OK` with no syntax error.

- [ ] **Step 3: Manually verify the validation paths (no DB needed)**

Start the server (`cd homentor-backend-main && npm start` in another terminal, or use the running instance), then run:

```bash
curl -s -X PUT http://localhost:5000/api/auth/admin/update-credentials \
  -H "Content-Type: application/json" -d '{"userId":"x"}'
```
Expected: `{"success":false,"message":"userId and userType are required"}`

```bash
curl -s -X PUT http://localhost:5000/api/auth/admin/update-credentials \
  -H "Content-Type: application/json" -d '{"userId":"x","userType":"bogus"}'
```
Expected: `{"success":false,"message":"Invalid userType"}`

(If the server port differs, use the port from `homentor-backend-main` startup logs. If no DB is connected, the not-found/404 path may instead surface a 500 — the two validation responses above do not require a DB.)

- [ ] **Step 4: Commit**

```bash
cd homentor-backend-main
git add routes/authRoutes.js
git commit -m "feat(auth): add admin update-credentials endpoint for name/email/phone"
```

---

## Task 3: Create the CredentialsPage component

**Files:**
- Create: `homentor-admin panel/src/pages/CredentialsPage.jsx`

- [ ] **Step 1: Create the page**

Create `homentor-admin panel/src/pages/CredentialsPage.jsx` with this exact content:

```jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";

const API = import.meta.env.VITE_API_BASE_URL;

const CredentialsPage = () => {
  const [tab, setTab] = useState("teachers"); // "teachers" | "parents"
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState({}); // { [id]: { name, email, phone, password } }

  const isTeacher = tab === "teachers";
  const userType = isTeacher ? "mentor" : "student";
  const nameOf = (r) => (isTeacher ? r.fullName : r.parentName) || "";

  useEffect(() => {
    setSearch("");
    setEdit({});
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchRows = async () => {
    const url = isTeacher ? `${API}/mentor/approved-mentors` : `${API}/users`;
    const res = await axios.get(url);
    setRows(res.data.data || []);
  };

  const startEdit = (r) =>
    setEdit((s) => ({
      ...s,
      [r._id]: {
        name: nameOf(r),
        email: r.email || "",
        phone: r.phone ?? "",
        password: r.passwordPlain || "",
      },
    }));

  const cancelEdit = (id) =>
    setEdit((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });

  const setField = (id, field, value) =>
    setEdit((s) => ({ ...s, [id]: { ...s[id], [field]: value } }));

  const save = async (r) => {
    const e = edit[r._id];
    if (!e) return;
    try {
      // 1) name/email/phone via update-credentials
      await axios.put(`${API}/auth/admin/update-credentials`, {
        userId: r._id,
        userType,
        name: e.name,
        email: e.email,
        phone: e.phone,
      });

      // 2) password (only if changed) via reset-password — fires WhatsApp
      const newPwd = (e.password || "").trim();
      if (newPwd && newPwd !== (r.passwordPlain || "")) {
        if (newPwd.length < 4) {
          alert("Password must be at least 4 characters");
          return;
        }
        await axios.post(`${API}/auth/admin/reset-password`, {
          userId: r._id,
          userType,
          password: newPwd,
        });
      }

      // Update local row
      setRows((list) =>
        list.map((row) => {
          if (row._id !== r._id) return row;
          const updated = { ...row, email: e.email, phone: e.phone };
          if (isTeacher) updated.fullName = e.name;
          else updated.parentName = e.name;
          if (newPwd) updated.passwordPlain = newPwd;
          return updated;
        })
      );
      cancelEdit(r._id);
      alert("Saved");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save");
    }
  };

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      nameOf(r).toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
      String(r.phone ?? "").includes(search)
    );
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Credentials</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("teachers")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isTeacher ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Teachers
          </button>
          <button
            onClick={() => setTab("parents")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !isTeacher ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Parents
          </button>
        </div>

        {/* Search */}
        <input
          placeholder="Search by name, email or phone"
          className="border px-4 py-2 rounded-lg mb-4 w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">SNo.</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Password</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, index) => {
                const e = edit[r._id];
                return (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    {e ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            className="border px-2 py-1 rounded w-32 text-xs"
                            value={e.name}
                            onChange={(ev) => setField(r._id, "name", ev.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="border px-2 py-1 rounded w-40 text-xs"
                            value={e.email}
                            onChange={(ev) => setField(r._id, "email", ev.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="border px-2 py-1 rounded w-32 text-xs"
                            value={e.phone}
                            onChange={(ev) => setField(r._id, "phone", ev.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="border px-2 py-1 rounded w-32 text-xs"
                            value={e.password}
                            onChange={(ev) => setField(r._id, "password", ev.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => save(r)} className="text-green-700 text-xs underline">
                            Save
                          </button>
                          <button onClick={() => cancelEdit(r._id)} className="text-gray-500 text-xs underline">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">{nameOf(r) || "—"}</td>
                        <td className="px-4 py-3">{r.email || "—"}</td>
                        <td className="px-4 py-3">{r.phone ?? "—"}</td>
                        <td className="px-4 py-3">
                          <code className="text-xs">{r.passwordPlain || "—"}</code>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => startEdit(r)} className="text-blue-600 text-xs underline">
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CredentialsPage;
```

- [ ] **Step 2: Commit**

```bash
cd "homentor-admin panel"
git add src/pages/CredentialsPage.jsx
git commit -m "feat(admin): add Credentials page with Teachers/Parents tabs"
```

---

## Task 4: Wire the route and sidebar entry

**Files:**
- Modify: `homentor-admin panel/src/App.jsx`
- Modify: `homentor-admin panel/src/comp/AdminSidebar.jsx`

- [ ] **Step 1: Import the page in App.jsx**

In `homentor-admin panel/src/App.jsx`, add this import alongside the other page imports (e.g. right after the `import ParentsPage from "./pages/ParentsPage";` line):

```js
import CredentialsPage from "./pages/CredentialsPage";
```

- [ ] **Step 2: Add the route in App.jsx**

In `homentor-admin panel/src/App.jsx`, add this route inside `<Routes>` (e.g. right after the `/parents` route):

```jsx
      <Route path="/credentials" element={<CredentialsPage/>}></Route>
```

- [ ] **Step 3: Add the sidebar entry**

In `homentor-admin panel/src/comp/AdminSidebar.jsx`, add a "Credentials" item. Add `KeyRound` to the existing `lucide-react` import (append it to the destructured list), then add the nav item to the bottom group so it sits next to Settings. Change:

```js
  {
    items: [{ label: "Settings", icon: Settings, to: "/setting" }],
  },
```

to:

```js
  {
    items: [
      { label: "Credentials", icon: KeyRound, to: "/credentials" },
      { label: "Settings", icon: Settings, to: "/setting" },
    ],
  },
```

And update the import line to include `KeyRound`:

```js
import {
  LayoutDashboard,
  UserPlus,
  Users,
  ScrollText,
  Settings,
  LogOut,
  UserCircle,
  Menu,
  Phone,
  CalendarCheck,
  ClipboardList,
  Receipt,
  Percent,
  GraduationCap,
  KeyRound,
} from "lucide-react";
```

- [ ] **Step 4: Verify the admin panel builds**

Run: `cd "homentor-admin panel" && npm run build`
Expected: build completes successfully (warnings OK, no errors). The `/credentials` route resolves and `CredentialsPage` compiles.

- [ ] **Step 5: Commit**

```bash
cd "homentor-admin panel"
git add src/App.jsx src/comp/AdminSidebar.jsx
git commit -m "feat(admin): route and sidebar entry for Credentials page"
```

---

## Task 5: Remove the old prompt-based password button from AllMentor

**Files:**
- Modify: `homentor-admin panel/src/pages/AllMentor.jsx` (the password `<button>` in the actions cell, currently ~lines 376-395)

- [ ] **Step 1: Delete the password button block**

In `homentor-admin panel/src/pages/AllMentor.jsx`, remove the entire `<button>` that opens the `window.prompt` password dialog (the block starting with `<button` whose `onClick` calls `window.prompt(` and ending at the matching `</button>` that wraps the `Password` label). Concretely, delete:

```jsx
                    <button
                      onClick={async () => {
                        const next = window.prompt(
                          `Set/reset password for ${mentor.fullName || mentor.phone}.\nCurrent: ${mentor.passwordPlain || "(none)"}`,
                          mentor.passwordPlain || ""
                        );
                        if (!next || next.length < 4) return;
                        try {
                          await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/admin/reset-password`, {
                            userId: mentor._id, userType: "mentor", password: next,
                          });
                          mentor.passwordPlain = next;
                          alert("Password updated");
                        } catch (e) { alert(e?.response?.data?.message || "Failed"); }
                      }}
                      className="px-2 py-1 text-purple-700 hover:underline"
                      title={mentor.passwordPlain ? `Current: ${mentor.passwordPlain}` : "Set password"}
                    >
                      Password
                    </button>

```

Leave the surrounding `View` and `Reject` buttons intact.

- [ ] **Step 2: Verify the admin panel still builds**

Run: `cd "homentor-admin panel" && npm run build`
Expected: build completes successfully with no errors (no unused-variable error; `axios` is still used elsewhere in the file).

- [ ] **Step 3: Commit**

```bash
cd "homentor-admin panel"
git add src/pages/AllMentor.jsx
git commit -m "refactor(admin): remove old prompt password reset from AllMentor (moved to Credentials)"
```

---

## Final manual verification (after all tasks)

- [ ] Start backend and admin panel dev server (`cd "homentor-admin panel" && npm run dev`).
- [ ] Open the admin panel → click "Credentials" in the sidebar.
- [ ] Teachers tab: edit a teacher's name/email/phone → Save → confirm the row updates and a reload (`fetchRows` via tab switch) shows persisted values.
- [ ] Teachers tab: change a teacher's password → Save → confirm WhatsApp message fires (same behavior as the old reset-password flow).
- [ ] Parents tab: edit a parent's name/email/phone and password → Save → confirm persistence and WhatsApp on password change.
- [ ] Enter a phone number already used by another account of the same type → Save → confirm the inline alert shows "Phone already in use" (409).
- [ ] Search box filters by name, email, and phone within the active tab.
- [ ] Confirm the old "Password" button no longer appears on the All Mentors page.
