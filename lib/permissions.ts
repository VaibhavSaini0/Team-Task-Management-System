export const isAdmin = (user: any) => {
  return user.role === "ADMIN";
};