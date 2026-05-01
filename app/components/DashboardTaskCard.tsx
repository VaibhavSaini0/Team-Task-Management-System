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

export default function DashboardTaskCard({ task }: { task: Task }) {
  return (
    <div
      className={`rounded-2xl shadow p-5 border-l-4 bg-white hover:-translate-y-1 transition ${
        task.status === "PENDING"
          ? "border-yellow-400"
          : task.status === "IN_PROGRESS"
          ? "border-blue-500"
          : "border-green-500"
      }`}
    >
      <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>

      <div className="mt-3 space-y-2 text-sm text-gray-600">
        <p>
          Status:{" "}
          <span className="font-semibold">{task.status}</span>
        </p>

        <p>Due: {task.dueDate?.slice(0, 10) || "Not set"}</p>
        <p>Assigned: {task.assignedTo?.email || "Unassigned"}</p>
      </div>
    </div>
  );
}