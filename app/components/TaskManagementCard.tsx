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

type Props = {
  task: Task;
  role: string;
  currentUserId: string;
  updatingTask: string;
  updateStatus: (id: string, status: Task["status"]) => void;
  deleteTask: (id: string) => void;
};

export default function TaskManagementCard({
  task,
  role,
  currentUserId,
  updatingTask,
  updateStatus,
  deleteTask,
}: Props) {
  const isOwner = task.assignedTo?._id === currentUserId;

  return (
    <div
      className={`p-5 rounded-2xl shadow border-l-4 bg-white hover:-translate-y-1 transition ${
        task.status === "PENDING"
          ? "border-yellow-400"
          : task.status === "IN_PROGRESS"
          ? "border-blue-500"
          : "border-green-500"
      }`}
    >
      <h3 className="font-bold text-lg">{task.title}</h3>

      <div className="mt-3 space-y-2 text-sm text-gray-600">
        <p>Status: {task.status}</p>
        <p>Due: {task.dueDate?.slice(0, 10) || "Not set"}</p>
        <p>Assigned: {task.assignedTo?.email || "Unassigned"}</p>
      </div>

      {/* USER ACTION */}
      {role === "USER" && isOwner && (
        <div className="mt-4">
          {task.status === "PENDING" && (
            <button
              disabled={updatingTask === task._id}
              onClick={() => updateStatus(task._id, "IN_PROGRESS")}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg"
            >
              {updatingTask === task._id ? "Updating..." : "Start Task"}
            </button>
          )}

          {task.status === "IN_PROGRESS" && (
            <button
              disabled={updatingTask === task._id}
              onClick={() => updateStatus(task._id, "DONE")}
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              {updatingTask === task._id ? "Updating..." : "Mark Done"}
            </button>
          )}

          {task.status === "DONE" && (
            <div className="text-center text-green-600 font-semibold mt-2">
              Completed ✓
            </div>
          )}
        </div>
      )}

      {/* ADMIN DELETE SMALL BUTTON */}
      {role === "ADMIN" && (
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => {
              const ok = confirm("Are you sure you want to delete this task?");
              if (ok) deleteTask(task._id);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}