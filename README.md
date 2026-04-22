# TenantFlow 🚀

**A production-grade multi-tenant SaaS starter kit with workspace isolation, JWT authentication, and role-based access control.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)
![MongoDB](https://img.shields.io/badge/mongodb-%3E%3D4.4-green)
![Status](https://img.shields.io/badge/status-stable-brightgreen)

---

> **Built to solve the "how do I architect multi-tenancy?" problem that every B2B SaaS developer faces.** This project demonstrates battle-tested patterns for tenant isolation, authentication flows, and RBAC implementation.

---

## 🎯 What Problem Does This Solve?

Building multi-tenant SaaS applications is hard. You need to handle:

* **Tenant isolation** - ensuring data doesn't leak between workspaces
* **Flexible membership** - users belonging to multiple organizations
* **Role-based permissions** - different access levels per workspace
* **Secure authentication** - JWT flows with HTTP-only cookie security
* **Clean architecture** - MVC structure that doesn't turn into spaghetti

**TenantFlow gives you all of this, fully implemented and debugged.**

This isn't a tutorial project - it's the architecture I wish I had when starting my first SaaS product.

---

## ✨ Key Features

* 🏢 **Multi-workspace architecture** - Users can create and join multiple workspaces
* 🔐 **Secure Auth** - JWT-based authentication using **HTTP-only cookies** for protection against XSS
* 🎭 **Role-based access control** - Owner, Admin, and Member roles per workspace
* 🔗 **Smart Invite System** - Shareable workspace invite links with one-click copy and link reset functionality
* 📊 **Interactive Kanban Board** - Drag-and-drop task status updates powered by **SortableJS**
* 🌅 **"My Day" Dashboard** - Personalized workspace overview with progress tracking and prioritized task lists
* 🔄 **True tenant isolation** - Each workspace is a completely separate tenant context
* 🏗️ **Clean MVC Architecture** - Dedicated controllers for UI and API, separated from route definitions
* 🌐 **Full-stack integration** - Premium EJS frontend with modular JavaScript and a centralized API handler

---

## 🛠️ Technology Stack

* **Backend Framework:** Node.js, Express.js
* **Database & ORM:** MongoDB, Mongoose
* **Template Engine:** EJS
* **Frontend Logic:** Vanilla JS (ES6+), SortableJS
* **Authentication:** JSON Web Tokens (JWT) + HTTP-only Cookies
* **Validation:** express-validator
* **Styling:** Tailwind CSS (via CDN)

---

## 📊 Project Status

**[██████████] 100% Complete - Production Ready**

### ✅ Core Capabilities

* ✓ **Security Overhaul**: Fully transitioned to HTTP-only cookies for maximum auth security.
* ✓ **Kanban Workflow**: Real-time status persistence with interactive drag-and-drop.
* ✓ **Workspace Invitations**: Replaced static forms with shareable, resettable invite links.
* ✓ **Dashboard Intelligence**: Dynamic progress calculation and personalized greetings.
* ✓ **Zero-Logic Routes**: Clean routing files that only import and export (Pure MVC).
* ✓ **Robust Error Handling**: Standardized API responses with sanitized validation feedback.

---

## 🚀 Quick Start

### Prerequisites

* Node.js >= 14.x (`node --version`)
* A free account on MongoDB Atlas or a local MongoDB instance

---

### Installation & Setup

```bash
git clone https://github.com/Amruth0-0/Multi-tenant-backend-saas.git
cd Multi-tenant-backend-saas

# Install dependencies
npm install

# Create environment file based on example
cp .env.example .env
```

---

### ▶️ Run Application

To run the application in production mode:
```bash
npm start
```

To run the application in development mode with auto-reload (nodemon):
```bash
npm run dev
```

---

## 📁 Project Structure

```
tenantflow/
├── config/              # Database and configuration files
├── controllers/         # Route handlers and business logic
├── middleware/          # Express middlewares (auth, validation, etc.)
├── models/              # Mongoose schema definitions
├── public/              # Static assets (CSS, JS, images)
├── routes/              # Express API and page routes
├── services/            # Reusable business logic services
├── utils/               # Utility functions and helpers
├── validators/          # Input validation schemas (express-validator)
├── views/               # EJS templates
├── .env                 # Environment variables
├── package.json         # Project metadata and scripts
└── server.js            # Entry point for the application
```

---

## 🔧 Configuration

Add the following inside your `.env` file:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/tenantflow?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```
> Make sure `MONGO_URI` is used as the key, as it is referenced in the database configuration instead of `MONGODB_URI`.

---

## 💡 API Documentation

### Base URL
`http://localhost:3000/api`

### 🔐 Authentication
```http
POST /api/auth/register    # Register a new user
POST /api/auth/login       # Login (Sets HTTP-only cookie)
POST /api/auth/logout      # Logout (Clears cookie)
```

### 🏢 Workspace & Team
```http
POST /api/workspace               # Create workspace
GET  /api/workspace/:id           # Get workspace details (Invite Code)
POST /api/workspace/:id/reset-invite # Reset the invite link
GET  /api/workspace-members/:id/members # List members
```

### 📁 Projects & Tasks
```http
POST /api/projects            # Create a new project
GET  /api/projects            # Get all projects for current workspace
GET  /api/projects/:projectId # Get project details

POST /api/tasks/:projectId          # Create a new task in a project
GET  /api/tasks/project/:projectId  # Get all tasks for a specific project
GET  /api/tasks/me                  # Get user's assigned tasks (Dashboard)
PUT  /api/tasks/:taskId             # Update task status (Kanban Drag & Drop)
```

---

## 🔑 Authentication

TenantFlow uses **HTTP-only Cookies** as the primary authentication mechanism for the web frontend to protect against XSS attacks. 

For standalone API clients, the **Authorization Header** is also supported:

```http
Authorization: Bearer <your-jwt-token>
```

---

> ℹ️ Note: Additional routes exist for update and delete operations following standard REST patterns.

---

## 🐛 Common Issues & Solutions

### Cannot GET /api/auth/register
Use POST request instead of browser GET.

### 401 Unauthorized
Ensure you are logged in. The server checks for a `token` cookie. If using an API client, ensure the `Authorization` header is set.

### Unexpected token '<'
Wrong API route returning HTML instead of JSON. Usually happens when `fetch` hits a UI route instead of an API route (check your `/api` prefix).

### callApi not defined
Ensure `api.js` is loaded before other scripts in the HTML.

### 422 Unprocessable Entity
Ensure correct request payload structure matching the express-validator schemas.

### Missing Authentication
The frontend uses `credentials: 'include'` in `fetch` calls to send cookies. Ensure your browser is not blocking third-party cookies if running across different domains.

### Silent frontend failures
Check response type before parsing JSON. Ensure you're wrapping `await fetch` in `try...catch`.

---

## 🧪 Development

### Debug Tips

* Check `localStorage` in browser dev tools for your JWT token.
* Use the **Network tab** to inspect full requests and responses.
* Decode JWT at [jwt.io](https://jwt.io) to ensure correct user object payload including `id` and `workspaceId`.
* Verify MongoDB connection state on application startup.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!
Feel free to check out the [issues page](https://github.com/Amruth0-0/Multi-tenant-backend-saas/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
