"use client";

import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-gray-100 px-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-xl w-full text-center">
        
        <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">404</h1>

        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-500 leading-7 mb-8">
          The page you are looking for does not exist or may have been moved.
          Please return back to the dashboard or homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Go Home
          </button>

          <button
            onClick={() => router.push("/dashboard")}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}