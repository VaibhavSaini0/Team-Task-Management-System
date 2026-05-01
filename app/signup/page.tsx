"use client";

import { useState } from "react";

type Role = "USER" | "ADMIN";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("USER");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email || !password) {
      return alert("Email and Password required");
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      alert("Signup successful 🎉");
      window.location.href = "/login";
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 card-hover">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Create Your Account
        </h1>

        <p className="text-center text-gray-500 mb-6 text-sm">
          Join TaskFlow and start managing your team efficiently.
        </p>

        <input
          className="w-full mb-4 p-3 border rounded-xl"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 p-3 border rounded-xl"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <select
          className="w-full mb-5 p-3 border rounded-xl"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="USER">User Account</option>
          <option value="ADMIN">Admin Account</option>
        </select>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating Account..." : "Signup"}
        </button>

        <p className="text-sm text-center mt-5 text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => (window.location.href = "/login")}
            className="text-indigo-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}