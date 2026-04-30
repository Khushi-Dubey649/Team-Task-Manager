# TaskMaster Pro: Full-Stack Team Task Manager

A robust, full-stack task management application designed with strict Role-Based Access Control (RBAC), a modular monorepo architecture, and a premium glassmorphic UI.

**[🌐 View Live on Railway](#)** *(Insert Railway link here before submission)*  
**[🐙 View GitHub Repository](#)** *(Insert Repo link here before submission)*

---

## 🚀 Tech Stack

**Frontend:**
- **React (Vite)**: Lightning-fast development and optimized build.
- **Tailwind CSS**: Utility-first styling with custom animations, glassmorphism, and responsive design.
- **Axios**: Centralized API instance with a JWT Request Interceptor.
- **Lucide React**: Beautiful, consistent iconography.

**Backend:**
- **Node.js & Express**: Fast, unopinionated routing and middleware architecture.
- **PostgreSQL**: Relational database for structured, consistent data.
- **Prisma (ORM)**: Type-safe database interactions mapping out the complex join tables.
- **JSON Web Tokens (JWT) & bcrypt.js**: Industry-standard authentication and password hashing.

---

## 🛡️ Core Features (The "Wow" Factor)

### 1. Robust Role-Based Access Control (RBAC)
Security is enforced on both ends. 
- **Backend:** Middleware intercepts requests and blocks actions (like `createProject` or updating someone else's task status) using a strict `restrictTo('Admin')` layer.
- **Frontend:** The `ProtectedRoute` component forces unauthenticated users to `/login`. The UI dynamically morphs based on the user's role—Admins see "New Project" buttons and Team Management lists, while Members see a simplified, focused view.

### 2. Premium Design Aesthetics
The application strays away from generic themes. It utilizes custom Tailwind configurations to inject:
- **Glassmorphism**: Translucent, frosted-glass auth pages.
- **Dynamic Micro-Animations**: Buttons and cards that subtly react to hovers (`hover:-translate-y-1`, smooth progress bar transitions).
- **Status Badges**: Color-coded task priorities and role indicators making the dashboard scannable in seconds.

### 3. Automated Demo Quick-Win
To make reviewing this project effortless:
- **First-User Admin Logic**: The very first user registered in the database is automatically assigned the `Admin` role. Every subsequent user is a `Member`.
- **Creator Persistence**: When an Admin creates a new project, the backend automatically inserts a `ProjectMember` relational record ensuring they never lose access to their own creation.

---

## 💻 Local Development Setup

Because this is a configured monorepo, spinning up the app is just a few commands away.

### Prerequisites
- Node.js (v16+)
- PostgreSQL running locally (or a cloud URL like Supabase/Neon)

### 1. Environment Variables
Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="your_super_secret_jwt_key_here"
```

*(Optional)* Create a `.env` in the `client` directory:
```env
VITE_API_URL="http://localhost:5000/api"
```

### 2. Install & Run
Run these commands from the **root** of the project:

```bash
# 1. Install all dependencies across root, client, and server
npm run install-all

# 2. Push the Prisma Schema to your database
cd server
npx prisma db push
cd ..

# 3. Start the application (Requires two terminals)
# Terminal 1: Start Backend
npm start

# Terminal 2: Start Frontend
cd client
npm run dev
```

---

## 🎥 Recommended Demo Flow (2-5 Minutes)

1. **Sign Up (Admin)**: Register your first account. Mention that the backend automatically assigns the first user as an Admin.
2. **Dashboard Overview**: Show off the premium UI, stats, and the "Admin" badge in the navigation.
3. **Create a Project**: Navigate to Projects. Create a new one.
4. **Team Management**: Show the `/team` route that fetches registered users.
5. **The Security Check**: Log out, sign up as a second user (Member). Notice the "Create Project" button is gone. Try to mark a task assigned to someone else as complete to trigger the `403 Forbidden` toast!
