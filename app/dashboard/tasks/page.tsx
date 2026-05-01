"use client";

import { useEffect, useState } from "react";
import { API, authFetch } from "@/lib/axiosClient";
import TaskManagementCard from "../../components/TaskManagementCard";
type User = {
  _id: string;
  email: string;
};

type Task = {
  _id: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "DONE";
  dueDate?: string;
  assignedTo?: User;
};

const TABS = ["ALL", "PENDING", "IN_PROGRESS", "DONE", "MY"];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("ALL");

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Task["status"]>("PENDING");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [role, setRole] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [updatingTask, setUpdatingTask] = useState("");
  const [loading,setLoading]=useState(false)
  // ================= FETCH =================
  const fetchTasks = async () => {
    
    try {
      setLoading(true)
      const [taskRes, userRes] = await Promise.all([
        authFetch(API.tasks),
        authFetch(API.users),
      ]);

      const taskData = await taskRes.json();
      const userData = await userRes.json();

      setTasks(Array.isArray(taskData) ? taskData : []);
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      const parsed = JSON.parse(user);
      setRole(parsed.role);
      setCurrentUserId(parsed._id);
    }

    fetchTasks();
  }, []);

  // ================= CREATE =================
  const createTask = async () => {
    if (!title) return alert("Title required");

    await authFetch(API.tasks, {
      method: "POST",
      body: JSON.stringify({ title, status, dueDate, assignedTo }),
    });

    setTitle("");
    setDueDate("");
    setAssignedTo("");
    setStatus("PENDING");

    fetchTasks();
  };

  // ================= UPDATE =================
  const updateStatus = async (id: string, status: Task["status"]) => {
    try {
      setUpdatingTask(id);

      await authFetch(`/api/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      fetchTasks();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTask("");
    }
  };
  const deleteTask = async (id: string) => {
    try {
      const res = await authFetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(data.error || "Delete failed");
      }

      fetchTasks();
    } catch (error) {
      console.error("Delete Task Error:", error);
    }
  };
  // ================= FILTER =================
  const filteredTasks = tasks
    .filter((t) => {
      if (activeTab === "ALL") return true;
      if (activeTab === "MY") return t.assignedTo?._id === currentUserId;
      return t.status === activeTab;
    })
    .sort((a, b) => {
      const order = { PENDING: 1, IN_PROGRESS: 2, DONE: 3 };
      return order[a.status] - order[b.status];
    });

  // ================= COUNTS =================
  const pending = tasks.filter((t) => t.status === "PENDING").length;
  const progress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
  const done = tasks.filter((t) => t.status === "DONE").length;
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading Workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold">Task Center</h1>
        <p className="text-gray-500">Manage all your tasks easily</p>
      </div>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-5">
        <Card title="Pending" value={pending} />
        <Card title="In Progress" value={progress} />
        <Card title="Done" value={done} />
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-3 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm ${
              activeTab === tab ? "bg-indigo-600 text-white" : "bg-gray-100"
            }`}
          >
            {tab === "MY" ? "My Tasks" : tab}
          </button>
        ))}
      </div>

      {/* ADMIN PANEL */}
      {role === "ADMIN" && (
        <div className="bg-white p-6 rounded-xl shadow space-y-3">
          <h2 className="font-semibold">Create Task</h2>

          <div className="grid md:grid-cols-5 gap-3">
            <input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded"
            />

            <input
              type="date"
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-2 rounded"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Task["status"])}
              className="border p-2 rounded"
            >
              <option>PENDING</option>
              <option>IN_PROGRESS</option>
              <option>DONE</option>
            </select>

            <select
              onChange={(e) => setAssignedTo(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Assign</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.email}
                </option>
              ))}
            </select>

            <button
              onClick={createTask}
              className="bg-indigo-600 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* TASK GRID */}
      <div className="grid md:grid-cols-3 gap-5">
        {filteredTasks.map((t) => (
          <TaskManagementCard
            key={t._id}
            task={t}
            role={role}
            currentUserId={currentUserId}
            updatingTask={updatingTask}
            updateStatus={updateStatus}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
}

// small reusable card
function Card({ title, value }: any) {
  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
