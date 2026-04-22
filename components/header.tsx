"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">AI Attendance Admin</h1>

        {/* Optional Search */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-1.5 rounded-md">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
          <Bell className="w-5 h-5 text-gray-600" />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium">
            A
          </div>
          <span className="text-sm text-gray-600 hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
