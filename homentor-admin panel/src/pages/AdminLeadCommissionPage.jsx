import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";

const API = import.meta.env.VITE_API_BASE_URL;

const CATEGORIES = ["", "gold", "silver", "budget"];

const getMonthly = (m) =>
  Number(m?.teachingModes?.homeTuition?.monthlyPrice || 0);

const previewText = (row) => {
  const type = row.commissionType || "flat";
  const raw = row.commissionOverride;
  if (raw === "" || raw == null) {
    return `Falls back to ${row.category || "silver"} default`;
  }
  const value = Number(raw) || 0;
  if (!value) return `Falls back to ${row.category || "silver"} default`;
  if (type === "percent") {
    const monthly = getMonthly(row);
    if (!monthly) return `${value}% of ? — no monthly fee set`;
    return `≈ ₹${Math.round((monthly * value) / 100)} per lead (${value}% of ₹${monthly})`;
  }
  return `₹${value} per lead`;
};

const AdminLeadCommissionPage = () => {
  const [adminData, setAdminData] = useState(null);
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [budget, setBudget] = useState(0);
  const [savingDefaults, setSavingDefaults] = useState(false);

  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [savingMentorId, setSavingMentorId] = useState(null);

  const loadAdmin = () => {
    axios.get(`${API}/admin`).then((res) => {
      const cfg = res.data?.data?.[0] || {};
      setAdminData(cfg);
      const c = cfg.commissionByCategory || {};
      setGold(c.gold || 0);
      setSilver(c.silver || 0);
      setBudget(c.budget || 0);
    });
  };

  const loadMentors = () => {
    setLoadingMentors(true);
    axios
      .get(`${API}/mentor/approved-mentors`)
      .then((res) => {
        const list = (res.data?.data || []).slice().reverse();
        setMentors(list);
      })
      .finally(() => setLoadingMentors(false));
  };

  useEffect(() => {
    loadAdmin();
    loadMentors();
  }, []);

  const saveDefaults = () => {
    if (!adminData?._id) return;
    setSavingDefaults(true);
    axios
      .put(`${API}/admin/${adminData._id}`, {
        commissionByCategory: {
          gold: Number(gold) || 0,
          silver: Number(silver) || 0,
          budget: Number(budget) || 0,
        },
      })
      .then(() => {
        alert("Category defaults updated");
        loadAdmin();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save defaults");
      })
      .finally(() => setSavingDefaults(false));
  };

  const updateRow = (id, patch) => {
    setMentors((prev) =>
      prev.map((m) => (m._id === id ? { ...m, ...patch } : m))
    );
  };

  const saveMentor = (m) => {
    setSavingMentorId(m._id);
    const payload = {
      commissionType: m.commissionType || "flat",
      commissionOverride:
        m.commissionOverride === "" || m.commissionOverride == null
          ? null
          : Number(m.commissionOverride),
    };
    axios
      .put(`${API}/mentor/${m._id}`, payload)
      .then(() => {
        // success — leave row as is, value already reflects what we sent
      })
      .catch((err) => {
        console.error(err);
        alert(`Failed to save commission for ${m.fullName || m.name || m._id}`);
      })
      .finally(() => setSavingMentorId(null));
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mentors.filter((m) => {
      if (categoryFilter && (m.category || "").toLowerCase() !== categoryFilter) {
        return false;
      }
      if (!q) return true;
      const name = (m.fullName || m.name || "").toLowerCase();
      const phone = (m.phone || m.phoneNo || "").toString().toLowerCase();
      return name.includes(q) || phone.includes(q);
    });
  }, [mentors, search, categoryFilter]);

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Lead Commission</h2>

        {/* Category defaults */}
        <div className="bg-white rounded-xl shadow p-5 mb-8 max-w-3xl">
          <h3 className="text-lg font-semibold mb-1">Category defaults (₹ per lead)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Used when a mentor below has no per-mentor override. Set 0 to auto-unlock leads.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gold</label>
              <input
                type="number"
                min="0"
                value={gold}
                onChange={(e) => setGold(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Silver</label>
              <input
                type="number"
                min="0"
                value={silver}
                onChange={(e) => setSilver(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                type="number"
                min="0"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
          </div>
          <button
            onClick={saveDefaults}
            disabled={savingDefaults || !adminData?._id}
            className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            {savingDefaults ? "Saving..." : "Save defaults"}
          </button>
        </div>

        {/* Per-mentor */}
        <div className="bg-white rounded-xl shadow p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-semibold">Per-mentor commission</h3>
              <p className="text-sm text-gray-500">
                Override the category default for individual mentors. Leave value empty to use the
                category default.
              </p>
            </div>
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name or phone"
                className="border rounded-lg px-3 py-2 text-sm w-56"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c ? c[0].toUpperCase() + c.slice(1) : "All categories"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-3 py-2">Mentor</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-right px-3 py-2">Monthly fee</th>
                  <th className="text-left px-3 py-2">Type</th>
                  <th className="text-left px-3 py-2">Value</th>
                  <th className="text-left px-3 py-2">Effective</th>
                  <th className="text-right px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {loadingMentors && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      Loading mentors...
                    </td>
                  </tr>
                )}
                {!loadingMentors && filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No mentors match.
                    </td>
                  </tr>
                )}
                {filtered.map((m) => {
                  const type = m.commissionType || "flat";
                  const val =
                    m.commissionOverride == null ? "" : m.commissionOverride;
                  return (
                    <tr key={m._id} className="border-t">
                      <td className="px-3 py-2">
                        <div className="font-medium text-gray-800">
                          {m.fullName || m.name || "—"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {m.phone || m.phoneNo || ""}
                        </div>
                      </td>
                      <td className="px-3 py-2 capitalize">
                        {m.category || "silver"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {getMonthly(m) ? `₹${getMonthly(m)}` : "—"}
                      </td>
                      <td className="px-3 py-2">
                        <select
                          value={type}
                          onChange={(e) =>
                            updateRow(m._id, { commissionType: e.target.value })
                          }
                          className="border rounded-md px-2 py-1 text-sm bg-white"
                        >
                          <option value="flat">Flat ₹</option>
                          <option value="percent">% of fee</option>
                        </select>
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          max={type === "percent" ? 100 : undefined}
                          step="1"
                          value={val}
                          placeholder="default"
                          onChange={(e) =>
                            updateRow(m._id, {
                              commissionOverride:
                                e.target.value === "" ? null : e.target.value,
                            })
                          }
                          className="border rounded-md px-2 py-1 text-sm w-28"
                        />
                        <span className="text-xs text-gray-400 ml-1">
                          {type === "percent" ? "%" : "₹"}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700">
                        {previewText(m)}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => saveMentor(m)}
                          disabled={savingMentorId === m._id}
                          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded-md"
                        >
                          {savingMentorId === m._id ? "Saving..." : "Save"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLeadCommissionPage;
