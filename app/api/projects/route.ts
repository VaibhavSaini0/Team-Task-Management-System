import { connectDB } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { isAdmin } from "@/lib/permissions";

export async function GET() {
  try {
    await connectDB();

    const projects = await Project.find().populate("owner members");

    return Response.json(projects, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Failed to fetch projects" }, { status: 500 });
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
      return Response.json({ error: "Only admin can create projects" }, { status: 403 });
    }

    const { name, description } = await req.json();

    if (!name) {
      return Response.json({ error: "Project name required" }, { status: 400 });
    }

    const project = await Project.create({
      name,
      description,
      owner: currentUser.id,
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error("Project Create Error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}