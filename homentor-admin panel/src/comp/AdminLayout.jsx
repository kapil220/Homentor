import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop

  const sidebarWidth = collapsed ? "w-20" : "w-72";

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
      fixed md:relative top-0 left-0 h-full
      transition-all duration-300
      ${collapsed ? "w-[0]" : "auto"}
    `}
      >
        {/* Mobile header */}
        <div className="md:hidden flex justify-between items-center px-4 py-3 border-b">
          <h2 className="text-lg font-bold text-blue-700">Admin Menu</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto transition-all duration-300">
        {/* Top bar (mobile) */}
        <div className="md:hidden p-4 flex items-center justify-between border-b bg-white">
          <h1 className="text-xl font-bold text-blue-700">{title}</h1>
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-blue-700" />
          </button>
        </div>

        {/* Title (desktop) */}
        <div className="hidden md:block px-6 pt-6">
          <h1 className="text-2xl font-bold text-blue-800 mb-4">{title}</h1>
        </div>

        {/* Page Content */}
        <main className="flex-1 bg-gradient-to-br from-white via-slate-100 to-blue-50 px-4 sm:px-6 lg:px-8 pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
