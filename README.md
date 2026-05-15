# Team Task Manager

A full-stack team collaboration and task management application built with Next.js, MongoDB, JWT Authentication, and Tailwind CSS.

This platform allows administrators to create projects, assign tasks to members, monitor progress, and manage workflow in one centralized dashboard. Team members can log in, view their assigned work, and update task completion status in real time.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure Login / Register system
- JWT based token authentication
- Role based access control (Admin / User)
- Protected dashboard routes

### 👨‍💼 Admin Capabilities
- Create new projects
- Delete projects with dependency validation
- Create tasks and assign tasks to team members
- Delete tasks
- View all team progress from dashboard

### 👨‍💻 Member Capabilities
- View only assigned tasks
- Update task status:
  - Pending
  - In Progress
  - Done
- Track deadlines and assignments

### 📊 Dashboard Monitoring
- Total active projects
- Pending tasks
- In progress tasks
- Completed tasks
- Quick overview cards
- Limited task preview with View More navigation

### 🗂 Project Management
- Project wise task linking
- Prevent project deletion if linked tasks exist

### ✅ Task Management
- Task assignment system
- Task filtering
- Dynamic task status UI updates
- Confirmation before destructive actions

---

## 🛠 Tech Stack

### Frontend
- Next.js 16 (App Router)
- React 19
- Tailwind CSS

### Backend / API
- Next.js API Routes
- JWT Authentication
- Cookie Handling

### Database
- MongoDB
- Mongoose ODM

### Other Libraries
- bcryptjs
- jsonwebtoken

### DEMO LOGIN
- Admin Account:
- Email: Vaibhav@gmail.com
- Password: Vaibhav@123

- Member Account:
- Email: Vibhu@gmail.com
- Password: Vaibhav@123

---

## 📁 Folder Structure

```bash
app/
 ┣ api/
 ┃ ┣ auth/
 ┃ ┣ tasks/
 ┃ ┣ projects/
 ┃ ┗ users/
 ┣ dashboard/
 ┃ ┣ page.tsx
 ┃ ┣ tasks/
 ┃ ┗ projects/
components/
 ┣ DashboardTaskCard.tsx
 ┣ TaskManagementCard.tsx
 ┗ ProjectCard.tsx
lib/
 ┣ axiosClient.ts
 ┣ dbConnect.ts
 ┣ getCurrentUser.ts
 ┗ permissions.ts
models/
 ┣ User.ts
 ┣ Task.ts
 ┗ Project.ts
