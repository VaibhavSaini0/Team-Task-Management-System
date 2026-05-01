"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-5">
        Organize Work.  
        <span className="text-indigo-600"> Empower Teams.</span>
      </h1>

      <p className="max-w-2xl text-gray-600 text-lg mb-10">
        TaskFlow helps teams create projects, assign tasks, track deadlines,
        and collaborate with secure role-based access.
      </p>

      <div className="flex flex-wrap justify-center gap-5">
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-indigo-700"
        >
          Open Dashboard
        </button>

        <button
          onClick={() => router.push("/login")}
          className="bg-white px-8 py-3 rounded-xl border shadow hover:bg-gray-50"
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          className="bg-black text-white px-8 py-3 rounded-xl shadow hover:bg-gray-800"
        >
          Signup
        </button>
      </div>
    </div>
  );
}