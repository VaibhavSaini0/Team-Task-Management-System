"use client";

import { useEffect, useState } from "react";
import { API, authFetch } from "@/lib/axiosClient";
type Project = {
  _id: string;
  name: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await authFetch(API.projects);
      const data = await res.json();

      console.log("PROJECT PAGE DATA:", data);

      setProjects(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Projects Error:", error);
      setProjects([]);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      window.location.href = "/login";
    } else {
      const parsedUser = JSON.parse(user);
      setRole(parsedUser.role);
    }

    fetchProjects();
  }, []);

  const createProject = async () => {
    if (!name) return alert("Project name required");

    await authFetch(API.projects, {
      method: "POST",
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchProjects();
  };
  const deleteProject = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this project?");

    if (!ok) return;

    try {
      const res = await authFetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Project delete failed");
      }

      fetchProjects();
    } catch (error) {
      console.error("Delete Project Error:", error);
    }
  };
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Project Workspace</h1>
        <p className="text-gray-500 mt-1">
          Create and organize all active team projects in one place.
        </p>
      </div>

      {/* TOP SUMMARY */}
      <div className="bg-white rounded-2xl shadow p-6 card-hover">
        <p className="text-gray-500">Total Active Projects</p>
        <h2 className="text-4xl font-bold mt-2 text-indigo-600">
          {projects.length}
        </h2>
      </div>

      {/* ADMIN CREATE */}
      {role === "ADMIN" && (
        <div className="bg-white rounded-2xl shadow p-6 card-hover">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              className="border border-gray-200 p-3 rounded-xl flex-1 outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              onClick={createProject}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300"
            >
              + Add Project
            </button>
          </div>
        </div>
      )}

      {/* PROJECT GRID */}
      <div>
        <h2 className="text-2xl font-semibold mb-5">Project List</h2>

        {Array.isArray(projects) && projects.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-500">
            No projects created yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {Array.isArray(projects) &&
              projects.map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl shadow p-5 card-hover border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>

                  <p className="text-sm text-gray-500 mt-2 leading-6">
                    Team collaboration project workspace with member task
                    tracking.
                  </p>

                  <div className="mt-5 flex justify-between items-center">
                    <span className="px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                      Active Project
                    </span>

                    {role === "ADMIN" && (
                      <button
                        onClick={() => deleteProject(p._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
