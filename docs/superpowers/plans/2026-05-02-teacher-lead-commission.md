# Teacher Lead & Commission System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a parent clicks "Call Teacher", a locked lead appears in the teacher's dashboard; teacher pays a commission (set by admin per category) to reveal the parent's phone and address.

**Architecture:** New `TeacherLead` MongoDB model stores one lead per parent-teacher pair. The existing `POST /api/call-intent/create` route upserts a TeacherLead on every call. Teacher fetches their leads via `GET /api/teacher-leads/mine` (phone/address stripped server-side if unpaid). Teacher submits payment via `ManualPaymentModal` → admin approves → lead unlocks.

**Tech Stack:** Node.js/Express/Mongoose (backend), React/TypeScript/Axios (frontend), existing `ManualPaymentModal` component for payment UI.

---

## File Map

### Backend — Create
- `homentor-backend-main/models/TeacherLead.js` — new Mongoose model
- `homentor-backend-main/routes/teacherLeadRoutes.js` — GET /mine, POST /:id/pay, admin approve + list

### Backend — Modify
- `homentor-backend-main/models/Admin.js` — add `commissionByCategory` field
- `homentor-backend-main/models/Mentor.js` — add `commissionOverride` field
- `homentor-backend-main/routes/callIntent.js` — upsert TeacherLead on call create
- `homentor-backend-main/app.js` — register `/api/teacher-leads` route

### Frontend (teacher) — Create
- `homentor-frontend/src/comp/LeadCard.tsx` — single lead card (locked / submitted / unlocked states)
- `homentor-frontend/src/comp/LeadsTab.tsx` — fetches and renders teacher's leads list

### Frontend (teacher) — Modify
- `homentor-frontend/src/pages/MentorDashboard.tsx` — add Leads tab, render `<LeadsTab />`

### Admin Panel — Modify
- `homentor-admin panel/src/pages/Setting.jsx` — add commission-by-category inputs
- `homentor-admin panel/src/pages/AdminBookingsPage.jsx` — add teacher leads approval section (or new page)

### Admin Panel — Create
- `homentor-admin panel/src/pages/AdminTeacherLeadsPage.jsx` — list submitted leads, approve button

---

## Task 1: TeacherLead Model

**Files:**
- Create: `homentor-backend-main/models/TeacherLead.js`

- [ ] **Step 1: Create the model file**

```js
// homentor-backend-main/models/TeacherLead.js
const mongoose = require("mongoose");

const teacherLeadSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
    },
    parentName: { type: String, default: "" },
    parentClass: { type: String, default: "" },
    parentSubjects: { type: String, default: "" },
    parentLocation: {
      city: { type: String, default: "" },
      area: { type: String, default: "" },
    },
    callCount: { type: Number, default: 1 },
    lastCalledAt: { type: Date, default: Date.now },
    commissionPaid: { type: Boolean, default: false },
    commissionAmount: { type: Number, default: 0 },
    paymentRef: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["pending", "submitted", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// One lead per parent-teacher pair
teacherLeadSchema.index({ mentorId: 1, parentPhone: 1 }, { unique: true });

module.exports = mongoose.model("TeacherLead", teacherLeadSchema);
```

- [ ] **Step 2: Commit**

```bash
git add homentor-backend-main/models/TeacherLead.js
git commit -m "feat(model): add TeacherLead model with commission fields"
```

---

## Task 2: Extend Admin & Mentor Models

**Files:**
- Modify: `homentor-backend-main/models/Admin.js`
- Modify: `homentor-backend-main/models/Mentor.js`

- [ ] **Step 1: Add commissionByCategory to Admin model**

Open `homentor-backend-main/models/Admin.js`. Add these fields inside `AdminCreationSchema`:

```js
commissionByCategory: {
  Premium: { type: Number, default: 0 },
  Regular: { type: Number, default: 0 },
  Trial:   { type: Number, default: 0 },
},
```

The full schema should look like:
```js
const AdminCreationSchema = new mongoose.Schema({
  callingNo : Number,
  callingMode: { type: String, enum: ["exotel", "direct"], default: "direct" },
  onlinePaymentMode: { type: String, enum: ["gateway", "manual"], default: "gateway" },
  upiId: { type: String, default: "" },
  bankAccountName: { type: String, default: "" },
  bankAccountNumber: { type: String, default: "" },
  bankIfsc: { type: String, default: "" },
  bankName: { type: String, default: "" },
  paymentInstructions: { type: String, default: "" },
  commissionByCategory: {
    Premium: { type: Number, default: 0 },
    Regular: { type: Number, default: 0 },
    Trial:   { type: Number, default: 0 },
  },
});
```

- [ ] **Step 2: Add commissionOverride to Mentor model**

Open `homentor-backend-main/models/Mentor.js`. Find the schema definition and add:

```js
commissionOverride: { type: Number, default: null },
```

- [ ] **Step 3: Commit**

```bash
git add homentor-backend-main/models/Admin.js homentor-backend-main/models/Mentor.js
git commit -m "feat(model): add commissionByCategory to Admin, commissionOverride to Mentor"
```

---

## Task 3: Commission Resolution Utility

**Files:**
- Create: `homentor-backend-main/utils/resolveCommission.js`

- [ ] **Step 1: Create the utility**

```js
// homentor-backend-main/utils/resolveCommission.js
const Admin = require("../models/Admin");

/**
 * Resolves the commission amount for a mentor.
 * Priority: mentor.commissionOverride → admin.commissionByCategory[mentor.category] → 0
 */
async function resolveCommission(mentor) {
  if (mentor.commissionOverride != null && mentor.commissionOverride > 0) {
    return mentor.commissionOverride;
  }
  const admin = await Admin.findOne().select("commissionByCategory");
  if (!admin) return 0;
  const category = mentor.category || "Regular";
  return admin.commissionByCategory?.[category] || 0;
}

module.exports = resolveCommission;
```

- [ ] **Step 2: Commit**

```bash
git add homentor-backend-main/utils/resolveCommission.js
git commit -m "feat(util): add resolveCommission helper for per-category commission lookup"
```

---

## Task 4: Teacher Lead Routes

**Files:**
- Create: `homentor-backend-main/routes/teacherLeadRoutes.js`

- [ ] **Step 1: Create the route file**

```js
// homentor-backend-main/routes/teacherLeadRoutes.js
const express = require("express");
const router = express.Router();
const TeacherLead = require("../models/TeacherLead");
const Mentor = require("../models/Mentor");

// Soft auth: requires x-mentor-phone header, resolves to mentor._id
async function resolveMentor(req, res) {
  const rawPhone = req.headers["x-mentor-phone"];
  if (!rawPhone) {
    res.status(401).json({ success: false, message: "Missing x-mentor-phone header" });
    return null;
  }
  const phone = String(rawPhone).replace(/\D/g, "");
  const mentor = await Mentor.findOne({ $or: [{ phone }, { phone: Number(phone) }] }).select("_id category commissionOverride");
  if (!mentor) {
    res.status(403).json({ success: false, message: "Mentor not found" });
    return null;
  }
  return mentor;
}

// GET /api/teacher-leads/mine
// Returns teacher's leads. Phone + location stripped if commissionPaid: false.
router.get("/mine", async (req, res) => {
  try {
    const mentor = await resolveMentor(req, res);
    if (!mentor) return;

    const leads = await TeacherLead.find({ mentorId: mentor._id }).sort({ lastCalledAt: -1 });

    const masked = leads.map((lead) => {
      const obj = lead.toObject();
      if (!obj.commissionPaid) {
        obj.parentPhone = null;
        obj.parentLocation = null;
      }
      return obj;
    });

    res.json({ success: true, data: masked });
  } catch (err) {
    console.error("GET /teacher-leads/mine error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/teacher-leads/:id/pay
// Teacher submits payment screenshot; sets paymentStatus to "submitted"
router.post("/:id/pay", async (req, res) => {
  try {
    const mentor = await resolveMentor(req, res);
    if (!mentor) return;

    const { paymentRef } = req.body;
    if (!paymentRef) {
      return res.status(400).json({ success: false, message: "paymentRef (screenshot URL) is required" });
    }

    const lead = await TeacherLead.findOne({ _id: req.params.id, mentorId: mentor._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    if (lead.commissionPaid) {
      return res.status(400).json({ success: false, message: "Lead already unlocked" });
    }

    lead.paymentRef = paymentRef;
    lead.paymentStatus = "submitted";
    await lead.save();

    res.json({ success: true, data: lead });
  } catch (err) {
    console.error("POST /teacher-leads/:id/pay error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/teacher-leads/admin/pending
// Admin: list all leads with paymentStatus "submitted"
router.get("/admin/pending", async (req, res) => {
  try {
    const leads = await TeacherLead.find({ paymentStatus: "submitted" })
      .populate("mentorId", "fullName phone category")
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: leads });
  } catch (err) {
    console.error("GET /teacher-leads/admin/pending error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/teacher-leads/admin/:id/approve
// Admin: approve payment, unlock lead
router.put("/admin/:id/approve", async (req, res) => {
  try {
    const lead = await TeacherLead.findByIdAndUpdate(
      req.params.id,
      { commissionPaid: true, paymentStatus: "approved" },
      { new: true }
    );
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    console.error("PUT /teacher-leads/admin/:id/approve error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
```

- [ ] **Step 2: Commit**

```bash
git add homentor-backend-main/routes/teacherLeadRoutes.js
git commit -m "feat(route): add teacher lead routes (mine, pay, admin pending/approve)"
```

---

## Task 5: Upsert TeacherLead on Call Click

**Files:**
- Modify: `homentor-backend-main/routes/callIntent.js`

- [ ] **Step 1: Add imports at the top of callIntent.js**

After the existing requires at the top of the file, add:

```js
const TeacherLead = require("../models/TeacherLead");
const Mentor = require("../models/Mentor");
const User = require("../models/User");
const resolveCommission = require("../utils/resolveCommission");
```

- [ ] **Step 2: Add upsert logic inside the POST /create handler**

Find the `POST /create` handler. After the line `const callIntent = await CallIntent.create(...)`, add the upsert block before the `return res.status(201)` line:

```js
    // Upsert TeacherLead — one per parent-teacher pair
    if (mentorId) {
      try {
        const mentor = await Mentor.findById(mentorId).select("category commissionOverride");
        if (mentor) {
          const existingLead = await TeacherLead.findOne({ mentorId, parentPhone });

          if (existingLead) {
            // Repeat call — just update count and timestamp
            existingLead.callCount += 1;
            existingLead.lastCalledAt = new Date();
            await existingLead.save();
          } else {
            // First call — resolve commission and pull parent details
            const commissionAmount = await resolveCommission(mentor);

            let parentName = "";
            let parentClass = "";
            let parentSubjects = "";
            let parentCity = "";
            let parentArea = "";

            // Pull from User model if parent is logged in
            const user = await User.findOne({
              $or: [{ phone: Number(parentPhone) }, { phone: parentPhone }],
            }).select("parentName children address");

            if (user) {
              parentName = user.parentName || "";
              const firstChild = Array.isArray(user.children) ? user.children[0] : null;
              if (firstChild) {
                parentClass = firstChild.class || firstChild.grade || firstChild.className || "";
                parentSubjects = Array.isArray(firstChild.subjects)
                  ? firstChild.subjects.join(", ")
                  : firstChild.subjects || "";
              }
              const addr = user.address || {};
              parentCity = addr.city || "";
              parentArea = addr.area || "";
            }

            await TeacherLead.create({
              mentorId,
              parentPhone,
              parentName,
              parentClass,
              parentSubjects,
              parentLocation: { city: parentCity, area: parentArea },
              commissionAmount,
              // Auto-unlock if commission is 0 (not configured)
              commissionPaid: commissionAmount === 0,
              paymentStatus: commissionAmount === 0 ? "approved" : "pending",
            });
          }
        }
      } catch (leadErr) {
        // Non-fatal — call intent already saved, don't block the response
        console.error("TeacherLead upsert error:", leadErr);
      }
    }
```

- [ ] **Step 3: Verify the full POST /create handler looks correct**

The handler should now: validate inputs → create CallIntent → upsert TeacherLead → return 201.

- [ ] **Step 4: Commit**

```bash
git add homentor-backend-main/routes/callIntent.js
git commit -m "feat(route): upsert TeacherLead on call-intent create"
```

---

## Task 6: Register Routes in app.js

**Files:**
- Modify: `homentor-backend-main/app.js`

- [ ] **Step 1: Add teacher leads route registration**

Open `homentor-backend-main/app.js`. After the line:
```js
app.use("/api/call-intent", require("./routes/callIntent.js"));
```

Add:
```js
app.use("/api/teacher-leads", require("./routes/teacherLeadRoutes.js"));
```

- [ ] **Step 2: Commit**

```bash
git add homentor-backend-main/app.js
git commit -m "feat(app): register /api/teacher-leads route"
```

---

## Task 7: Manually Test Backend Routes

- [ ] **Step 1: Start the backend**

```bash
cd homentor-backend-main && npm start
```

- [ ] **Step 2: Test call-intent creates a lead**

```bash
curl -X POST http://localhost:5000/api/call-intent/create \
  -H "Content-Type: application/json" \
  -d '{"parentPhone":"9876543210","mentorPhone":"9999999999","mentorId":"<any-valid-mentor-id>"}'
```

Expected: `{"success":true,"data":{...}}` and a TeacherLead document created in MongoDB.

- [ ] **Step 3: Test GET /mine**

```bash
curl http://localhost:5000/api/teacher-leads/mine \
  -H "x-mentor-phone: 9999999999"
```

Expected: Array of leads with `parentPhone: null` and `parentLocation: null` if unpaid.

- [ ] **Step 4: Test repeat call increments count**

Run the same POST /call-intent/create again with the same parentPhone + mentorId.
Expected: Same TeacherLead document, `callCount` incremented to 2.

---

## Task 8: Admin Commission Settings UI

**Files:**
- Modify: `homentor-admin panel/src/pages/Setting.jsx`

- [ ] **Step 1: Add commission state variables**

Inside the `Setting` component, after the existing state declarations, add:

```jsx
const [commissionPremium, setCommissionPremium] = useState(0);
const [commissionRegular, setCommissionRegular] = useState(0);
const [commissionTrial, setCommissionTrial] = useState(0);
```

- [ ] **Step 2: Load commission values in getAdminData**

Inside the `.then((res) => {...})` of `getAdminData`, add:

```jsx
const commission = cfg.commissionByCategory || {};
setCommissionPremium(commission.Premium || 0);
setCommissionRegular(commission.Regular || 0);
setCommissionTrial(commission.Trial || 0);
```

- [ ] **Step 3: Include commission in postNumber save**

In the `postNumber` function, add `commissionByCategory` to the PUT payload:

```jsx
axios.put(`${import.meta.env.VITE_API_BASE_URL}/admin/${adminData._id}`, {
  callingNo,
  callingMode,
  onlinePaymentMode,
  upiId,
  bankAccountName,
  bankAccountNumber,
  bankIfsc,
  bankName,
  paymentInstructions,
  commissionByCategory: {
    Premium: Number(commissionPremium),
    Regular: Number(commissionRegular),
    Trial:   Number(commissionTrial),
  },
})
```

- [ ] **Step 4: Add commission inputs to the JSX**

Find the closing `</div>` of the last settings card in the JSX. Before it (or after the payment section), add a new card:

```jsx
<div className="bg-white rounded-xl shadow p-4 mb-6 max-w-xl">
  <h3 className="text-lg font-semibold mb-3">Lead Commission (₹)</h3>
  <p className="text-sm text-gray-500 mb-4">
    Amount teacher pays to unlock a parent's contact details. Set 0 to auto-unlock.
  </p>
  {[
    { label: "Premium Teacher", value: commissionPremium, set: setCommissionPremium },
    { label: "Regular Teacher", value: commissionRegular, set: setCommissionRegular },
    { label: "Trial Teacher",   value: commissionTrial,   set: setCommissionTrial },
  ].map(({ label, value, set }) => (
    <div className="mb-3" key={label}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) => set(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm w-full"
      />
    </div>
  ))}
</div>
```

- [ ] **Step 5: Commit**

```bash
git add "homentor-admin panel/src/pages/Setting.jsx"
git commit -m "feat(admin): add commission-by-category inputs to Settings page"
```

---

## Task 9: Admin Teacher Leads Review Page

**Files:**
- Create: `homentor-admin panel/src/pages/AdminTeacherLeadsPage.jsx`

- [ ] **Step 1: Create the page**

```jsx
// homentor-admin panel/src/pages/AdminTeacherLeadsPage.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import AdminLayout from "../comp/AdminLayout";

export default function AdminTeacherLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/teacher-leads/admin/pending`
      );
      setLeads(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch teacher leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const approve = async (id) => {
    if (!window.confirm("Approve this commission payment and unlock the lead?")) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/teacher-leads/admin/${id}/approve`
      );
      fetchLeads();
    } catch (err) {
      alert("Failed to approve");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Teacher Lead Payments</h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && leads.length === 0 && (
          <p className="text-gray-500">No pending commission payments.</p>
        )}
        {leads.map((lead) => (
          <div key={lead._id} className="bg-white rounded-xl shadow p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">
                  Teacher: {lead.mentorId?.fullName || "—"} ({lead.mentorId?.category})
                </p>
                <p className="text-sm text-gray-600">Parent: {lead.parentName || "Anonymous"} · {lead.parentPhone}</p>
                <p className="text-sm text-gray-600">Class: {lead.parentClass || "—"} · Subjects: {lead.parentSubjects || "—"}</p>
                <p className="text-sm text-gray-600">Amount: ₹{lead.commissionAmount}</p>
                {lead.paymentRef && (
                  <a
                    href={lead.paymentRef}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    View Screenshot
                  </a>
                )}
              </div>
              <button
                onClick={() => approve(lead._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
```

- [ ] **Step 2: Add route in admin panel router**

Find the admin panel's router file (likely `src/App.jsx` or `src/main.jsx`). Add:

```jsx
import AdminTeacherLeadsPage from "./pages/AdminTeacherLeadsPage";

// Inside <Routes>:
<Route path="/teacher-leads" element={<AdminTeacherLeadsPage />} />
```

- [ ] **Step 3: Add nav link**

Find the admin sidebar/nav component (`AdminLayout` or similar). Add a nav item:

```jsx
<NavLink to="/teacher-leads">Teacher Lead Payments</NavLink>
```

- [ ] **Step 4: Commit**

```bash
git add "homentor-admin panel/src/pages/AdminTeacherLeadsPage.jsx" "homentor-admin panel/src/App.jsx"
git commit -m "feat(admin): add AdminTeacherLeadsPage for commission payment review"
```

---

## Task 10: LeadCard Component

**Files:**
- Create: `homentor-frontend/src/comp/LeadCard.tsx`

- [ ] **Step 1: Create LeadCard**

```tsx
// homentor-frontend/src/comp/LeadCard.tsx
import { useState } from "react";
import axios from "axios";
import ManualPaymentModal from "./ManualPaymentModal";

type Lead = {
  _id: string;
  parentName: string;
  parentClass: string;
  parentSubjects: string;
  parentPhone: string | null;
  parentLocation: { city: string; area: string } | null;
  callCount: number;
  lastCalledAt: string;
  commissionPaid: boolean;
  commissionAmount: number;
  paymentStatus: "pending" | "submitted" | "approved";
};

type AdminPaymentDetails = {
  upiId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  paymentInstructions: string;
};

type Props = {
  lead: Lead;
  adminPaymentDetails: AdminPaymentDetails;
  mentorPhone: string;
  onPaymentSubmitted: () => void;
};

export default function LeadCard({ lead, adminPaymentDetails, mentorPhone, onPaymentSubmitted }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async ({
    paymentReference,
    paymentScreenshot,
  }: {
    paymentReference: string;
    paymentScreenshot: string;
  }) => {
    setSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/teacher-leads/${lead._id}/pay`,
        { paymentRef: paymentScreenshot || paymentReference },
        { headers: { "x-mentor-phone": mentorPhone } }
      );
      setModalOpen(false);
      onPaymentSubmitted();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to submit payment");
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = () => {
    if (lead.commissionPaid) return <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Unlocked</span>;
    if (lead.paymentStatus === "submitted") return <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Payment under review</span>;
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-3 border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{lead.parentName || "Anonymous"}</p>
          <p className="text-sm text-gray-500">
            Class: {lead.parentClass || "—"} · Subjects: {lead.parentSubjects || "—"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Called {lead.callCount}× · Last: {new Date(lead.lastCalledAt).toLocaleDateString()}
          </p>

          {lead.commissionPaid ? (
            <div className="mt-2">
              <a href={`tel:${lead.parentPhone}`} className="text-blue-600 font-medium text-sm">
                📞 {lead.parentPhone}
              </a>
              {lead.parentLocation && (
                <p className="text-sm text-gray-600 mt-1">
                  📍 {lead.parentLocation.area}, {lead.parentLocation.city}
                </p>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <p className="text-sm text-gray-400">📞 ••••••••••</p>
              <p className="text-sm text-gray-400">📍 Hidden</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 ml-3">
          {statusBadge()}
          {!lead.commissionPaid && lead.paymentStatus === "pending" && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-blue-600 text-white text-sm px-3 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
            >
              Unlock — ₹{lead.commissionAmount}
            </button>
          )}
        </div>
      </div>

      <ManualPaymentModal
        open={modalOpen}
        amount={lead.commissionAmount}
        details={adminPaymentDetails}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add homentor-frontend/src/comp/LeadCard.tsx
git commit -m "feat(ui): add LeadCard component for teacher lead display"
```

---

## Task 11: LeadsTab Component

**Files:**
- Create: `homentor-frontend/src/comp/LeadsTab.tsx`

- [ ] **Step 1: Create LeadsTab**

```tsx
// homentor-frontend/src/comp/LeadsTab.tsx
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import LeadCard from "./LeadCard";

type Lead = {
  _id: string;
  parentName: string;
  parentClass: string;
  parentSubjects: string;
  parentPhone: string | null;
  parentLocation: { city: string; area: string } | null;
  callCount: number;
  lastCalledAt: string;
  commissionPaid: boolean;
  commissionAmount: number;
  paymentStatus: "pending" | "submitted" | "approved";
};

type AdminPaymentDetails = {
  upiId: string;
  bankAccountName: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;
  paymentInstructions: string;
};

type Props = {
  mentorPhone: string;
};

export default function LeadsTab({ mentorPhone }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminDetails, setAdminDetails] = useState<AdminPaymentDetails>({
    upiId: "", bankAccountName: "", bankAccountNumber: "",
    bankIfsc: "", bankName: "", paymentInstructions: "",
  });
  const loadedRef = useRef(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/teacher-leads/mine`,
        { headers: { "x-mentor-phone": mentorPhone } }
      );
      setLeads(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!mentorPhone) return;
    fetchLeads();

    if (loadedRef.current) return;
    loadedRef.current = true;
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin`).then((res) => {
      const cfg = res.data?.data?.[0] || {};
      setAdminDetails({
        upiId: cfg.upiId || "",
        bankAccountName: cfg.bankAccountName || "",
        bankAccountNumber: cfg.bankAccountNumber || "",
        bankIfsc: cfg.bankIfsc || "",
        bankName: cfg.bankName || "",
        paymentInstructions: cfg.paymentInstructions || "",
      });
    }).catch(() => {});
  }, [mentorPhone]);

  if (loading) return <p className="text-gray-400 p-4">Loading leads...</p>;
  if (leads.length === 0) return <p className="text-gray-400 p-4">No leads yet. When a parent calls you, they'll appear here.</p>;

  return (
    <div className="p-4">
      <p className="text-sm text-gray-500 mb-3">
        Pay the commission to reveal a parent's phone number and address.
      </p>
      {leads.map((lead) => (
        <LeadCard
          key={lead._id}
          lead={lead}
          adminPaymentDetails={adminDetails}
          mentorPhone={mentorPhone}
          onPaymentSubmitted={fetchLeads}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add homentor-frontend/src/comp/LeadsTab.tsx
git commit -m "feat(ui): add LeadsTab component with lead list and admin payment details"
```

---

## Task 12: Wire LeadsTab into MentorDashboard

**Files:**
- Modify: `homentor-frontend/src/pages/MentorDashboard.tsx`

- [ ] **Step 1: Add LeadsTab import**

At the top of `MentorDashboard.tsx`, add:

```tsx
import LeadsTab from "@/comp/LeadsTab";
```

- [ ] **Step 2: Add "Leads" to the tab list**

Find where the dashboard tabs are defined (look for something like `["Bookings", "Schedule", ...]` or tab button rendering). Add `"Leads"` as a tab option.

- [ ] **Step 3: Render LeadsTab in the tab panel**

Find where tab content is rendered. Add a case for Leads:

```tsx
{activeTab === "Leads" && <LeadsTab mentorPhone={phone} />}
```

Where `phone` is the mentor's phone already in the component (`localStorage.getItem("mentor")`).

- [ ] **Step 4: Commit**

```bash
git add homentor-frontend/src/pages/MentorDashboard.tsx
git commit -m "feat(dashboard): add Leads tab to MentorDashboard"
```

---

---

## Task 13: Per-Teacher Commission Override in Admin Mentor Edit Modal

**Files:**
- Modify: `homentor-admin panel/src/comp/MentorEditModal.jsx`

The `commissionOverride` field is on the Mentor model but needs an admin UI to set it.

- [ ] **Step 1: Find the fees/category section in MentorEditModal**

Search for `fees` or `category` in the modal JSX — the override input goes near that section since it's financially related.

- [ ] **Step 2: Add the input field**

Find an existing numeric input block in the modal (e.g., the `fees` field) and add a similar block right after it:

```jsx
<div className="mb-3">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Commission Override (₹) — leave 0 to use category default
  </label>
  <input
    type="number"
    min="0"
    value={mentor.commissionOverride || 0}
    onChange={(e) => updateField("commissionOverride", Number(e.target.value))}
    className="border rounded-lg px-3 py-2 text-sm w-full"
  />
</div>
```

- [ ] **Step 3: Commit**

```bash
git add "homentor-admin panel/src/comp/MentorEditModal.jsx"
git commit -m "feat(admin): add commissionOverride field to MentorEditModal"
```

---

## Task 14: End-to-End Manual Test

*(previously Task 13 — renumbered)*

- [ ] **Step 1: Set commission amounts in admin Settings**
  - Go to admin panel → Settings → Lead Commission section
  - Set Regular = 500, Premium = 300, Trial = 200
  - Save and verify no errors

- [ ] **Step 2: Trigger a call as a parent**
  - From the frontend, navigate to any teacher profile
  - Click the call button (this creates a CallIntent + TeacherLead)
  - Verify in MongoDB: `TeacherLead` document exists with `commissionPaid: false`

- [ ] **Step 3: Check teacher dashboard**
  - Log in as the teacher
  - Go to Leads tab
  - Verify: lead appears with name/class shown, phone shows `••••••••••`, "Unlock — ₹500" button visible

- [ ] **Step 4: Submit commission payment**
  - Click "Unlock — ₹500"
  - Fill in payment reference + upload screenshot
  - Submit
  - Verify: button disappears, "Payment under review" badge appears
  - Verify in MongoDB: `paymentStatus: "submitted"`, `paymentRef` set

- [ ] **Step 5: Approve in admin panel**
  - Go to admin panel → Teacher Lead Payments
  - Verify the submitted lead appears with teacher name, parent name, amount, screenshot link
  - Click Approve
  - Verify: lead disappears from pending list
  - Verify in MongoDB: `commissionPaid: true`, `paymentStatus: "approved"`

- [ ] **Step 6: Check lead is unlocked**
  - Back in teacher dashboard → Leads tab
  - Verify: parent's phone is now a clickable tel: link, location shows city/area

- [ ] **Step 7: Test repeat call**
  - Trigger another call from the same parent to the same teacher
  - Verify: no new TeacherLead created, `callCount` incremented to 2

- [ ] **Step 8: Test commissionOverride**
  - In admin panel → edit a specific teacher → set Commission Override to 150 → save
  - Trigger a call from a new parent to that teacher
  - Verify TeacherLead.commissionAmount = 150 (not the category default)

- [ ] **Step 9: Build for production**

```bash
cd homentor-frontend && npm run build
cd "../homentor-admin panel" && npm run build
```

Expected: both build without errors.

---

## Exotel Upgrade Note (future)

When Exotel goes live, move the TeacherLead upsert from `POST /api/call-intent/create` to the Exotel webhook handler in `homentor-backend-main/routes/exotelCall.js`. Change the trigger condition from "call initiated" to "call status === connected". No model or frontend changes needed.
