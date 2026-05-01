export const API = {
  signup: "/api/auth/signup",
  login: "/api/auth/login",
  projects: "/api/projects",
  tasks: "/api/tasks",
  users: "/api/users",
};

export const authFetch = async (
  url: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem("token");

  return fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
};