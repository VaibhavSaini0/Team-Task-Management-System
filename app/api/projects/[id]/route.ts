import { connectDB } from "@/lib/dbConnect";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { getCurrentUser } from "@/lib/getCurrentUser";

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
        { error: "Only admin can delete project" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const project = await Project.findById(id);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    const relatedTasks = await Task.find({ project: id });

    if (relatedTasks.length > 0) {
      return Response.json(
        {
          error:
            "Cannot delete project. Some tasks are assigned under this project.",
        },
        { status: 400 }
      );
    }

    await Project.findByIdAndDelete(id);

    return Response.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Project Delete Error:", error);
    return Response.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}