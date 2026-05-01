import jwt from "jsonwebtoken";

type TokenPayload = {
  id: string;
  email: string;
  role: "ADMIN" | "USER";
};

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
  } catch (error) {
    return null;
  }
};