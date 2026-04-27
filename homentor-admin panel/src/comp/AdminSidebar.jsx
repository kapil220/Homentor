import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import axios from "axios";

const navGroups = [
  {
    items: [{ label: "Dashboard", icon: LayoutDashboard, to: "/" }],
  },
  {
    title: "Mentors",
    items: [
      { label: "Mentor Requests", icon: UserPlus, to: "/mentor-request", countKey: "mentorRequests" },
      { label: "All Mentors", icon: Users, to: "/all-mentor" },
      { label: "Mentor Leads", icon: ClipboardList, to: "/mentor-leads" },
    ],
  },
  {
    title: "Parents",
    items: [
      { label: "All Parents", icon: Users, to: "/parents" },
      { label: "Parent Leads", icon: ClipboardList, to: "/parent-leads" },
    ],
  },
  {
    title: "Bookings",
    items: [
      { label: "Pending Approvals", icon: CalendarCheck, to: "/class-booking", countKey: "bookings" },
      { label: "Booking Record", icon: ScrollText, to: "/booking-record" },
    ],
  },
  {
    title: "Calls",
    items: [
      { label: "Call Logs", icon: Phone, to: "/calling-sheet", countKey: "calls" },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Orders", icon: Receipt, to: "/all-orders" },
      { label: "Fees Margin", icon: Percent, to: "/margin-rules" },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Degree Master", icon: GraduationCap, to: "/degree-master" },
    ],
  },
  {
    items: [{ label: "Settings", icon: Settings, to: "/setting" }],
  },
];

const Badge = ({ count }) => {
  if (!count || count === 0) return null;
  return (
    <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
      {count > 9 ? "9+" : count}
    </span>
  );
};

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState({});
  const navigate = useNavigate();

  const fetchCounts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin`);
      setCounts(res.data || {});
    } catch (err) {
      console.error("Failed to fetch sidebar counts", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleLogout = () => {
    try {
      localStorage.clear();
    } catch {
      /* ignore */
    }
    navigate("/");
    window.location.reload();
  };

  return (
    <aside
      className={`h-screen bg-white border-r flex flex-col justify-between
      transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Top */}
      <div className="overflow-y-auto">
        <div className="flex items-center justify-between p-5">
          {!collapsed && <h1 className="text-xl font-bold text-blue-700">Admin Panel</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
            title={collapsed ? "Expand" : "Collapse"}
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <nav className="px-3 pb-4 space-y-4">
          {navGroups.map((group, gi) => (
            <div key={gi} className="space-y-1">
              {group.title && !collapsed && (
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
                  {group.title}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const count = item.countKey ? counts[item.countKey] : 0;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium text-sm
                      ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    {Icon && <Icon className="h-5 w-5 shrink-0" />}
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && <Badge count={count} />}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <UserCircle className="h-8 w-8 text-blue-600 shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-800 truncate">Admin</p>
              <p className="text-xs text-gray-400 truncate">Homentor</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
