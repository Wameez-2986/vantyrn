"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-swiggy-light dark:bg-black transition-colors duration-300">
      {/* Sidebar - Toggleable on mobile, fixed on desktop */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
        {/* Topbar - Passing toggle function */}
        <Topbar onMenuClick={toggleSidebar} />

        {/* Scrollable Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
          <div 
            key={pathname}
            className="max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-500"
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
