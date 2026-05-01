"use client";

import { useEffect, useState } from "react";
import { API, authFetch } from "@/lib/axiosClient";
import { useRouter } from "next/navigation";
import DashboardTaskCard from "../components/DashboardTaskCard";
type User = {
  _id: string;
  email: string;
  role: "ADMIN" | "USER";
};

type Task = {
  _id: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
  assignedTo?: User;
};

type Project = {
  _id: string;
  name: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [title, setTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [status, setStatus] = useState<Task["status"]>("PENDING");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading,setLoading]=useState(false);
  const fetchData = async () => {
    try {setLoading(true);
      const [taskRes, userRes, projectRes] = await Promise.all([
        authFetch(API.tasks),
        authFetch(API.users),
        authFetch(API.projects),
      ]);

      const taskData = await taskRes.json();
      const userData = await userRes.json();
      const projectData = await projectRes.json();

      setTasks(Array.isArray(taskData) ? taskData : []);
      setUsers(Array.isArray(userData) ? userData : []);
      setProjects(Array.isArray(projectData) ? projectData : []);
    } catch (error) {
      console.error("Fetch Data Error:", error);
      setTasks([]);
      setUsers([]);
      setProjects([]);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    fetchData();
  }, []);

  const createProject = async () => {
    if (!projectName) return alert("Project name required");

    await authFetch(API.projects, {
      method: "POST",
      body: JSON.stringify({ name: projectName }),
    });

    setProjectName("");
    fetchData();
  };

  const createTask = async () => {
    if (!title) return alert("Task title required");

    await authFetch(API.tasks, {
      method: "POST",
      body: JSON.stringify({
        title,
        status,
        dueDate,
        assignedTo,
      }),
    });

    setTitle("");
    setDueDate("");
    setAssignedTo("");
    setStatus("PENDING");
    fetchData();
  };

  if (!currentUser) return null;

  const pendingTasks = tasks.filter((t) => t.status === "PENDING").length;
  const progressTasks = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const doneTasks = tasks.filter((t) => t.status === "DONE").length;

  const previewTasks =
    currentUser.role === "USER"
      ? tasks.filter((t) => t.assignedTo?._id === currentUser._id).slice(0, 3)
      : tasks.slice(0, 3);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading Workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {currentUser.role}
        </h1>
        <p className="text-gray-500 mt-1">
          Monitor team progress, projects and assignments from one place.
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-4 gap-5">
        <SummaryCard title="Total Projects" value={projects.length} />
        <SummaryCard title="Pending Tasks" value={pendingTasks} />
        <SummaryCard title="In Progress" value={progressTasks} />
        <SummaryCard title="Completed" value={doneTasks} />
      </div>

      {/* ADMIN PANELS */}
      {currentUser.role === "ADMIN" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow p-6 card-hover">
            <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

            <input
              className="border p-3 rounded-xl w-full mb-4"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <button
              onClick={createProject}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700"
            >
              + Add Project
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow p-6 card-hover">
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

            <input
              className="border p-3 rounded-xl w-full mb-3"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="date"
              className="border p-3 rounded-xl w-full mb-3"
              onChange={(e) => setDueDate(e.target.value)}
            />

            <select
              className="border p-3 rounded-xl w-full mb-3"
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>

            <select
              className="border p-3 rounded-xl w-full mb-4"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Assign User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.email}
                </option>
              ))}
            </select>

            <button
              onClick={createTask}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800"
            >
              + Add Task
            </button>
          </div>
        </div>
      )}

      {/* PROJECT LIST */}
      <div className="bg-white rounded-2xl shadow p-6 card-hover">
        <h2 className="text-xl font-semibold mb-4">Active Projects</h2>

        <div className="flex flex-wrap gap-3">
          {projects.map((p) => (
            <span
              key={p._id}
              className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium"
            >
              {p.name}
            </span>
          ))}
        </div>
      </div>

      {/* TASK PREVIEW */}
      <div className="bg-white rounded-2xl shadow p-6 card-hover">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-semibold">
            {currentUser.role === "USER" ? "My Assigned Tasks" : "Recent Tasks"}
          </h2>

          <button
            onClick={() => router.push("/dashboard/tasks")}
            className="text-indigo-600 font-medium hover:underline"
          >
            View More Tasks →
          </button>
        </div>

        {previewTasks.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No tasks available.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {previewTasks.map((t) => (
              <DashboardTaskCard key={t._id} task={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow card-hover">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
