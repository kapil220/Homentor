import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";

type StudentRow = {
  parentId: string;
  parentName: string;
  parentPhone: string;
  studentNames: string[];
  activeBookings: number;
  totalBookings: number;
  classesDone: number;
  totalClasses: number;
  lastSubject: string;
};

const MentorStudents = () => {
  const phone = localStorage.getItem("mentor");
  const [bookings, setBookings] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const me = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/mentor/login-check`,
          { phone }
        );
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/class-bookings/mentor/${me.data.data._id}`
        );
        setBookings(res.data.data || []);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [phone]);

  const rows = useMemo<StudentRow[]>(() => {
    const map = new Map<string, StudentRow>();
    bookings.forEach((b) => {
      const id = b.parent?._id || b.parent;
      if (!id) return;
      const key = String(id);
      const existing = map.get(key);
      const classesDone = Math.floor((b.progress || 0) / 60);
      const total = Number(b.duration) || 22;
      const isActive = b.status === "scheduled" || b.status === "running";
      if (!existing) {
        map.set(key, {
          parentId: key,
          parentName: b.parent?.parentName || b.parent?.name || "—",
          parentPhone: String(b.parent?.phone || ""),
          studentNames: b.studentName ? [b.studentName] : [],
          activeBookings: isActive ? 1 : 0,
          totalBookings: 1,
          classesDone,
          totalClasses: total,
          lastSubject: b.subject || "",
        });
      } else {
        existing.totalBookings += 1;
        if (isActive) existing.activeBookings += 1;
        existing.classesDone += classesDone;
        existing.totalClasses += total;
        if (b.studentName && !existing.studentNames.includes(b.studentName)) {
          existing.studentNames.push(b.studentName);
        }
        if (b.subject) existing.lastSubject = b.subject;
      }
    });
    return Array.from(map.values()).sort((a, b) => b.activeBookings - a.activeBookings);
  }, [bookings]);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? rows.filter(
        (r) =>
          r.parentName.toLowerCase().includes(q) ||
          r.parentPhone.includes(q) ||
          r.studentNames.some((n) => n.toLowerCase().includes(q))
      )
    : rows;

  return (
    <DashboardLayout
      role="mentor"
      title="My Students"
      subtitle="Parents and children across all your bookings"
    >
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search by parent, student, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:max-w-md border rounded-lg px-3 py-2 text-sm"
        />

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="p-6 text-sm text-gray-500 text-center">No students yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Parent</th>
                    <th className="px-4 py-3 text-left">Students</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Active</th>
                    <th className="px-4 py-3 text-left">Total</th>
                    <th className="px-4 py-3 text-left">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((r) => (
                    <tr key={r.parentId} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.parentName}</div>
                        <div className="text-xs text-gray-500">{r.parentPhone}</div>
                      </td>
                      <td className="px-4 py-3">
                        {r.studentNames.length ? r.studentNames.join(", ") : "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{r.lastSubject || "—"}</td>
                      <td className="px-4 py-3">
                        {r.activeBookings ? (
                          <Badge className="bg-green-100 text-green-700">
                            {r.activeBookings}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">0</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{r.totalBookings}</td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        {r.classesDone} / {r.totalClasses} classes
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorStudents;
