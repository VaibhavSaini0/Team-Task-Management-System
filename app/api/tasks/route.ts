import { connectDB } from "@/lib/dbConnect";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { isAdmin } from "@/lib/permissions";

export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find()
      .populate("assignedTo", "_id email")
      .populate("project", "name")
      .populate("createdBy", "email role");

    return Response.json(tasks, { status: 200 });
  } catch (error) {
    console.error("Task Fetch Error:", error);
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(currentUser)) {
      return Response.json(
        { error: "Only admin can create tasks" },
        { status: 403 }
      );
    }

    const { title, status, dueDate, assignedTo, project } = await req.json();

    if (!title) {
      return Response.json({ error: "Task title required" }, { status: 400 });
    }

    const task = await Task.create({
      title,
      status,
      dueDate,
      assignedTo,
      project,
      createdBy: currentUser.id,
    });

    return Response.json(task, { status: 201 });
  } catch (error) {
    console.error("Task Create Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}