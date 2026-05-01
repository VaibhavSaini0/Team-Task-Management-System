import { connectDB } from "@/lib/dbConnect";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const { status } = await req.json();

    const task = await Task.findById(id).populate("assignedTo", "_id email");

    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    const assignedUserId = task.assignedTo?._id?.toString();

    if (currentUser.role !== "ADMIN" && assignedUserId !== currentUser.id) {
      return Response.json(
        { error: "You can only update your assigned task" },
        { status: 403 }
      );
    }

    task.status = status;
    await task.save();

    return Response.json(task, { status: 200 });
  } catch (error) {
    console.error("Task Update Error:", error);
    return Response.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "ADMIN") {
      return Response.json(
        { error: "Only admin can delete task" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const task = await Task.findById(id);

    if (!task) {
      return Response.json({ error: "Task not found" }, { status: 404 });
    }

    await Task.findByIdAndDelete(id);

    return Response.json(
      { message: "Task deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Task Delete Error:", error);
    return Response.json({ error: "Failed to delete task" }, { status: 500 });
  }
}