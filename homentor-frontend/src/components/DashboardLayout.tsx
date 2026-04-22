import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  PhoneCall,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Role = "student" | "mentor";

interface DashboardLayoutProps {
  role: Role;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navForRole = (role: Role): NavItem[] => {
  if (role === "mentor") {
    return [
      { label: "Dashboard", path: "/dashboard/mentor", icon: LayoutDashboard },
      { label: "Bookings", path: "/mentor/bookings", icon: CalendarDays },
    ];
  }
  return [
    { label: "Dashboard", path: "/dashboard/student", icon: LayoutDashboard },
    { label: "Bookings", path: "/parent/bookings", icon: CalendarDays },
  ];
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  title,
  subtitle,
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const phone = useMemo(() => {
    if (role === "mentor") return localStorage.getItem("mentor");
    return localStorage.getItem("usernumber");
  }, [role]);

  useEffect(() => {
    if (!phone) {
      navigate("/login");
    }
  }, [phone, navigate]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("usernumber");
    localStorage.removeItem("mentor");
    navigate("/login");
  };

  const items = navForRole(role);
  const roleLabel = role === "mentor" ? "Mentor" : "Student";
  const initials = roleLabel.charAt(0);

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-2 px-5 py-5 border-b border-gray-100 ${collapsed ? "justify-center px-2" : ""}`}>
        <div className="w-9 h-9 rounded-lg bg-homentor-blue text-white flex items-center justify-center font-bold shrink-0">
          H
        </div>
        {!collapsed && (
          <span className="font-semibold text-lg text-gray-900">Homentor</span>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-homentor-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 space-y-2">
        <a
          href="tel:9203149956"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Call Support" : undefined}
        >
          <PhoneCall className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Support</span>}
        </a>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-200 transition-all duration-200 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {SidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 sm:px-6 h-16">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="p-2 rounded-lg hover:bg-gray-100 hidden lg:inline-flex"
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {title || `${roleLabel} Dashboard`}
                </h1>
                {subtitle && (
                  <p className="text-xs text-gray-500 truncate hidden sm:block">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100">
                <div className="w-7 h-7 rounded-full bg-homentor-blue text-white flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
                <span className="text-sm text-gray-700">{phone || "—"}</span>
              </div>
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 text-red-600"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
