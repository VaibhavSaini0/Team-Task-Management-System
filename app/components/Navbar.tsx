"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    document.cookie = "token=; Max-Age=0";
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-indigo-700 tracking-wide">
          TaskFlow
        </h1>

        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-indigo-600 transition">
            Dashboard
          </Link>
          <Link href="/dashboard/projects" className="hover:text-indigo-600 transition">
            Projects
          </Link>
          <Link href="/dashboard/tasks" className="hover:text-indigo-600 transition">
            Tasks
          </Link>

          <button
            onClick={logout}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}