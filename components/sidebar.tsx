"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Link2,
  CalendarCheck,
} from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Teachers", href: "/teachers", icon: GraduationCap },
  { name: "Students", href: "/students", icon: Users },
  { name: "Subjects", href: "/subjects", icon: BookOpen },
  { name: "Subjects & Students", href: "/subject-students", icon: Link2 },
  { name: "Attendance", href: "/attendance", icon: CalendarCheck },
  {
    name: "Manage Attendance",
    href: "/manage-attendance",
    icon: CalendarCheck,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 
      bg-gradient-to-b from-zinc-950 to-zinc-900 
      text-white border-r border-zinc-800 flex flex-col shadow-lg"
    >
      {/* Logo */}
      <div className="p-6 border-b border-zinc-800">
        <h2 className="text-xl font-semibold tracking-tight">AI Admin</h2>
        <p className="text-xs text-zinc-400 mt-1">Attendance System</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin scrollbar-thumb-zinc-700">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${
                isActive
                  ? "bg-white text-black shadow-md"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/70"
              }`}
            >
              {/* Icon */}
              <Icon
                className={`w-4 h-4 transition-transform duration-200
                ${isActive ? "scale-110" : "group-hover:scale-110"}`}
              />

              {/* Label */}
              <span className="text-sm">{link.name}</span>

              {/* Active indicator */}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-black rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/60 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-semibold shadow-md">
            A
          </div>

          <div className="flex-1">
            <p className="text-sm font-medium leading-none">Admin</p>
            <p className="text-xs text-zinc-400 mt-1">Logged in</p>
          </div>

          {/* Status dot */}
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </aside>
  );
}
