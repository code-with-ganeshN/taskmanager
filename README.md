# 📋 Task Manager Application

A comprehensive task management system with role-based access control for admins and employees. Built with modern web technologies for efficient team collaboration and task tracking.

**Live Demo:** 
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

---

## 🎯 Overview

Task Manager is a full-stack web application designed to streamline task assignment, tracking, and team collaboration. Admins can create and assign tasks, manage employees, and monitor progress. Employees can view assigned tasks, update status, add comments, and track task history.

**Test Credentials:**
- Admin: `admin@example.com` / `Admin@123`
- Employee: Any employee created through the admin panel

---

## 📚 Table of Contents

- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Assumptions & Design Decisions](#assumptions--design-decisions)
- [Bonus Features](#bonus-features)
- [Troubleshooting](#troubleshooting)

---

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library with hooks and functional components
- **React Router v7** - Nested routing with route protection
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Lucide React** - 50+ icons for UI elements
- **Axios** - HTTP client for API calls
- **Vite** - Fast development server and build tool
- **JavaScript (ES6+)** - Modern JavaScript with async/await

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Minimalist web framework
- **MongoDB** - NoSQL database (Atlas)
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing and encryption
- **JWT (jsonwebtoken)** - Token-based authentication
- **Nodemon** - Development server auto-reload

### Development Tools
- **Git & GitHub** - Version control
- **npm** - Package manager
- **dotenv** - Environment variable management
- **.gitignore** - Git ignore patterns for both frontend and backend

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskManagerdb
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   ```

4. **Start backend server:**
   ```bash
   node server.js
   ```
   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5174`

4. **Build for production:**
   ```bash
   npm run build
   ```

### Running Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 📁 Project Structure

```
taskManager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Login & registration
│   │   ├── taskController.js     # Task CRUD operations
│   │   └── employeeController.js # Employee management
│   ├── middlewares/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── roleMiddleware.js     # Role-based access
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Task.js               # Task schema with comments & history
│   │   └── Notification.js       # Notification schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── adminRoutes.js        # Admin endpoints
│   │   ├── taskRoutes.js         # Task endpoints
│   │   └── userRoutes.js         # Employee endpoints
│   ├── utils/
│   │   └── sendNotification.js   # Notification helper
│   ├── server.js                 # Express app setup
│   ├── package.json
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   └── node_modules/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   ├── EmployeeSidebar.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── UserNavbar.jsx
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── ProtectedAdminRoute.jsx
│   │   │   └── tasks/
│   │   │       ├── TaskCard.jsx
│   │   │       ├── StatusBadge.jsx
│   │   │       ├── CommentBox.jsx
│   │   │       └── NotificationItem.jsx
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminHome.jsx       # Dashboard
│   │   │   │   ├── Tasks.jsx           # Task management
│   │   │   │   ├── TaskDetails.jsx     # View task with history
│   │   │   │   ├── Employees.jsx       # Employee management & add employee
│   │   │   │   ├── DeletedEmployees.jsx
│   │   │   │   ├── EditTask.jsx        # Edit task form
│   │   │   │   ├── Profile.jsx         # Admin profile
│   │   │   │   └── Notifications.jsx   # Admin notifications
│   │   │   ├── employee/
│   │   │   │   ├── MyTasks.jsx         # Employee task list
│   │   │   │   ├── TaskDetails.jsx     # View/update task
│   │   │   │   ├── Notifications.jsx   # Employee notifications
│   │   │   │   ├── Profile.jsx         # Employee profile
│   │   │   │   └── UserDashboard.jsx   # Employee dashboard
│   │   │   ├── AdminDashboard.jsx      # Layout wrapper
│   │   │   ├── UserDashboard.jsx       # Layout wrapper
│   │   │   ├── Login.jsx               # Login page
│   │   │   └── Unauthorized.jsx        # 403 page
│   │   ├── services/
│   │   │   ├── api.js                  # Axios instance
│   │   │   └── userService.js
│   │   ├── context/
│   │   │   └── AuthContext.js          # Auth state management
│   │   ├── App.jsx                     # Route definitions
│   │   └── main.jsx
│   ├── .gitignore
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md                      # This file
└── .gitignore
```

---

## ✨ Features

### Admin Features

#### Dashboard
- 📊 Real-time statistics (total tasks, employees, completed tasks)
- 📋 Recent tasks overview
- 🔄 Quick access to all sections

#### Task Management
- ✅ Create tasks with title, description, priority, deadline
- 🔍 Search tasks by title/description
- 🏷️ Filter by status (All, Pending, In Progress, Completed)
- 👥 Assign tasks to single or multiple employees
- ✏️ Edit task details (title, description, category, priority, deadline)
- 🗑️ Soft delete with restore functionality
- 📝 View task comments and update history
- 👀 Click task to open detailed view with full history

#### Employee Management
- 👥 View all active employees
- ➕ Add new employees with validation
  - Email format validation
  - Password strength (min 6 characters)
  - Duplicate email prevention
  - Optional fields (job title, department, phone)
- 🔍 Search employees by name, email, or job title
- ✏️ Update employee information
- 🗑️ Soft delete with restore functionality

#### Notifications
- 🔔 Real-time task notifications
- 📧 Employee activity alerts
- 🗑️ Delete notifications

#### Profile
- 👤 View admin profile information
- ✏️ Edit profile details

### Employee Features

#### My Tasks Dashboard
- 📋 View all assigned tasks
- 🔍 Search tasks by title/description
- 🏷️ Filter by status with statistics
- 📊 Task statistics cards (Total, Completed, In Progress, Pending)
- 📌 Recent tasks display

#### Task Details
- 👀 View complete task information
- 💬 Add comments and view discussion history
- ⬆️ Update task status (Pending → In Progress → Completed)
- 📜 View full task history with timestamps and status changes
- 📅 See deadline and days remaining
- 👥 View assigned team members
- 🔙 Navigate back to task list

#### Notifications
- 🔔 View all notifications
- 📝 See notification details and timestamps
- 🗑️ Delete notifications

#### Profile
- 👤 View employee profile
- ✏️ Update profile information

### Common Features

#### Authentication & Security
- 🔐 JWT-based authentication
- 🛡️ Role-based access control (Admin/Employee)
- 🔒 Protected routes with automatic redirects
- 🚪 Secure logout

#### UI/UX
- 🎨 Modern gradient design with Tailwind CSS
- 📱 Responsive layout (mobile, tablet, desktop)
- ⚡ Smooth transitions and hover effects
- 🎯 Intuitive navigation with sidebars
- 💡 Color-coded status badges (green=completed, blue=in-progress, gray=pending)
- ⏳ Loading spinners during API calls
- ⚠️ Error messages and validation feedback
- ✅ Success notifications

#### Data Management
- 📊 Real-time data updates
- 🔍 Search and filter functionality
- 📈 Statistics and analytics
- 📜 Complete audit trail (history)

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - Create new user (admin only)

### Admin Routes
- `GET /admin/employees` - List all employees
- `GET /admin/employees/deleted` - List deleted employees
- `POST /admin/tasks` - Create task
- `GET /admin/tasks` - List all tasks
- `PUT /admin/tasks/:id` - Update task
- `PUT /admin/tasks/:id/delete` - Soft delete task
- `PUT /admin/tasks/:id/restore` - Restore task
- `PUT /admin/employees/:id` - Update employee
- `PUT /admin/employees/:id/delete` - Soft delete employee
- `PUT /admin/employees/:id/restore` - Restore employee

### Task Routes (Authenticated)
- `GET /tasks` - List tasks
- `GET /tasks/:id` - Get task details
- `POST /tasks/:id/comment` - Add comment
- `PUT /tasks/:id/status` - Update status

### User Routes (Employee)
- `GET /user/profile` - Get profile
- `PUT /user/profile` - Update profile
- `GET /user/tasks` - Get assigned tasks

---

## 💡 Assumptions & Design Decisions

### 1. Authentication Model
**Assumption**: Admin creates employees; employees cannot self-register.
- **Rationale**: Prevents unauthorized account creation and maintains organizational control.
- **Implementation**: Register endpoint is admin-only middleware protected.

### 2. Soft Delete Pattern
**Assumption**: Deleting employees/tasks should be reversible.
- **Rationale**: Allows recovery of accidentally deleted data; maintains data integrity.
- **Implementation**: `isDeleted` boolean flag instead of permanent deletion.

### 3. Task Status Workflow
**Assumption**: Tasks follow linear progression: Pending → In Progress → Completed
- **Rationale**: Simple, intuitive workflow that matches common project management practices.
- **Implementation**: Three status enum values in Task schema.

### 4. Comment History
**Assumption**: All task updates should be tracked in history.
- **Rationale**: Provides complete audit trail for compliance and troubleshooting.
- **Implementation**: Comments and status changes both logged in `history` array.

### 5. Real-time Notifications
**Assumption**: Create notifications for key events (task assignment, status changes, comments).
- **Rationale**: Keeps team members informed of important updates.
- **Implementation**: Notifications created by backend on specific actions.

### 6. Role-Based UI
**Assumption**: Admin and Employee interfaces should be completely separate.
- **Rationale**: Prevents confusion and reduces cognitive load; different workflows.
- **Implementation**: Separate sidebars, dashboards, and route hierarchies.

### 7. Layout Pattern
**Assumption**: Admins and Employees need consistent layout with sidebar + navbar.
- **Rationale**: Professional, familiar interface pattern.
- **Implementation**: Layout components (AdminDashboard, UserDashboard) wrap nested routes.

### 8. Form Validation
**Assumption**: Client-side validation for UX; server-side for security.
- **Rationale**: Immediate feedback to users; backend security.
- **Implementation**: Both frontend and backend validation.

---

## 🎁 Bonus Features Implemented

### 1. Advanced Search & Filter
- ✅ Real-time search across multiple fields
- ✅ Multi-status filtering on task lists
- ✅ Employee search by name/email/title

### 2. Task History & Audit Trail
- ✅ Complete task status change history
- ✅ Timestamps for all updates
- ✅ User attribution for each change
- ✅ Sticky sidebar view with newest-first chronology

### 3. Comment System with User Attribution
- ✅ Comments display who commented and when
- ✅ Comments embedded in task details
- ✅ Rich comment display with formatting

### 4. Enhanced Employee Management
- ✅ Add employees directly from admin panel
- ✅ Email validation and duplicate prevention
- ✅ Password strength requirements
- ✅ Optional fields (title, department, phone)
- ✅ Search functionality across all fields

### 5. Modern UI/UX Design
- ✅ Gradient backgrounds and buttons
- ✅ Hover effects and smooth transitions
- ✅ Color-coded status and priority badges
- ✅ Loading spinners and empty states
- ✅ Professional shadows and rounded corners
- ✅ 50+ lucide-react icons
- ✅ Responsive design for all screen sizes

### 6. Data Organization
- ✅ Separate deleted items section
- ✅ Statistics cards with icons
- ✅ Recent items overview
- ✅ Inline editing capabilities

### 7. Error Handling
- ✅ Comprehensive form validation
- ✅ User-friendly error messages
- ✅ Success notifications
- ✅ Loading states

### 8. Task Details Pages
- ✅ Admin TaskDetails with edit capabilities
- ✅ Employee TaskDetails with status update
- ✅ Full history sidebar with status changes
- ✅ Comment discussion threads

### 9. Dashboard Consistency
- ✅ Employee dashboard and MyTasks pages have consistent UI
- ✅ Both show statistics and task overview
- ✅ Unified navigation experience

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Try different port in .env if needed
PORT=5001
```

### MongoDB connection failed
```
Error: connect ECONNREFUSED
```
- Verify MongoDB URI in `.env`
- Check MongoDB Atlas network access (IP whitelist)
- Ensure internet connection
- Verify credentials in connection string

### Frontend won't load
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS errors
- Ensure backend is running on `http://localhost:5000`
- Check API endpoint URLs in `services/api.js`
- Verify proxy settings if behind corporate network

### Login not working
- Verify test credentials: `admin@example.com` / `Admin@123`
- Check browser console for error messages
- Ensure `.env` JWT_SECRET is set
- Clear localStorage and try again

### Pages not rendering after login
- Verify UserDashboard.jsx has `<Outlet />` component
- Check nested routes are properly defined in App.jsx
- Ensure layout components use `<Outlet />` to render child routes

---

## ✅ Verification Checklist

Before deployment, verify:
- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5174
- [ ] MongoDB connection successful
- [ ] Test login works with admin credentials
- [ ] Create and assign a task
- [ ] View task as employee
- [ ] Update task status
- [ ] Add comments to task
- [ ] View task history
- [ ] Add new employee
- [ ] Search functionality works
- [ ] Filter by status works
- [ ] Logout and re-login works
- [ ] No console errors
- [ ] Responsive design on mobile

---

## 📝 Development Notes

### Database Schema Highlights

**User Model:**
- Email (unique)
- Password (hashed with bcrypt)
- Name, Title, Department, Phone
- Role (admin/employee)
- Soft delete flag
- Assigned tasks array

**Task Model:**
- Title, Description
- Priority, Status, Category
- Assigned employees (array with reference)
- Deadline, Reminder time
- Comments array with user attribution and timestamps
- History array with status changes and timestamps
- Soft delete flag

**Notification Model:**
- User reference
- Message, Type
- Related task reference
- Timestamp
- Read status

### Building for Production

**Backend:** Already production-ready
**Frontend:**
```bash
npm run build
# Output in dist/ folder
# Deploy to hosting (Vercel, Netlify, AWS, etc.)
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages (F12)
3. Check backend server logs
4. Verify all environment variables are set correctly
5. Check `.env` file has correct values
6. Review MongoDB Atlas IP whitelist

---

## 📄 License

This project is for educational and demonstration purposes.

---

**Last Updated**: November 28, 2025
**Status**: ✅ Production Ready
