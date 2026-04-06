import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Bed,
  Users,
  FileWarning,
  Zap,
  Utensils,
  ScrollText,
  Settings,
  LogOut,
  UserCircle,
  Menu,
} from "lucide-react";
import axios from "axios";

/**
 * Map sidebar label -> backend count key
 */
const COUNT_KEY_MAP = {
  "Mentor Requests": "mentorRequests",
  "Class Booking": "bookings",
  "Calling Sheet": "calls"
};

const navLinks = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Mentor Requests", icon: Bed, to: "/mentor-request" },
  { label: "All Mentor", icon: Users, to: "/all-mentor" },
  { label: "All Parents", icon: Users, to: "/parents" },
  { label: "All Orders", icon: FileWarning, to: "/all-orders" },
  { label: "Calling Sheet", icon: ScrollText, to: "/calling-sheet" },
  { label: "Fees Margin", icon: Zap, to: "/margin-rules" },
  { label: "Degree Master", icon: ScrollText, to: "/degree-master" },
  { label: "Class Booking", icon: Utensils, to: "/class-booking" },
  { label: "Booking Record", icon: Utensils, to: "/booking-record" },
  { label: "Mentor Leads", icon: ScrollText, to: "/mentor-leads" },
  { label: "Parent Leads", icon: ScrollText, to: "/parent-leads" },
  { label: "Settings", icon: Settings, to: "/setting" },
];

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [counts, setCounts] = useState({});

  // 🔴 Badge Component
  const Badge = ({ count }) => {
    if (!count || count === 0) return null;

    return (
      <span className="ml-auto bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full">
        {count > 9 ? "9+" : count}
      </span>
    );
  };

  // 🔥 Fetch sidebar counts
  const fetchCounts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin`
      );
      console.log(res.data)
      setCounts(res.data);
    } catch (err) {
      console.error("Failed to fetch sidebar counts", err);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <aside
      className={`h-screen bg-white border-r flex flex-col justify-between
      transition-all duration-300 ease-in-out
      ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Top */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          {!collapsed && (
            <h1 className="text-xl font-bold text-blue-700">Admin Panel</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-2">
          {navLinks.map((item) => {
            const countKey = COUNT_KEY_MAP[item.label];
            const count = countKey ? counts[countKey] : 0;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition font-medium
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />

                {!collapsed && <span>{item.label}</span>}

                {!collapsed && <Badge count={count} />}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <UserCircle className="h-8 w-8 text-blue-600 shrink-0" />
          {!collapsed && (
            <div>
              <p className="font-semibold text-sm text-gray-800">Admin</p>
              <p className="text-xs text-gray-400">admin@hostel.com</p>
            </div>
          )}
        </div>

        <button
          onClick={() => alert("Logout logic here")}
          className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
