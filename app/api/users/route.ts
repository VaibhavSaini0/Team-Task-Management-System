import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET(req: Request) {
  try {
    await connectDB();

    const currentUser = getCurrentUser(req);

    if (!currentUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await User.find().select("_id email role");

    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error("Users Fetch Error:", error);
    return Response.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}