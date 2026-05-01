import { verifyToken } from "./authHelpers";

export const getCurrentUser = (req: Request) => {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  const user = verifyToken(token);

  return user || null;
};