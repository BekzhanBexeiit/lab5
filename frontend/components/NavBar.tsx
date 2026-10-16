"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/filter", label: "Filter" },
  { href: "/about", label: "About" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 px-6 py-3 border-b border-sky-100 bg-white/80 backdrop-blur-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-6">
        <span className="text-2xl">🎓</span>
        <span className="font-bold text-sky-700 text-base tracking-tight">
          CourseCatalog
        </span>
      </Link>

      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-sky-500 text-white shadow-sm shadow-sky-200"
                  : "text-slate-600 hover:bg-sky-50 hover:text-sky-700"
              }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
