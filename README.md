# 🏢 WorkSphere — Employee Management System

A full-stack **Employee Management System** built with React, Node.js, Express, and MongoDB. Manage employees, departments, attendance, leaves, salaries, and more — with a premium modern UI.

🔗 **Live Demo**: [worksphere-management-system.vercel.app](https://worksphere-management-system.vercel.app)

---

## ✨ Features

### Admin Dashboard
- 📊 **Dashboard** with charts (department distribution, salary stats, leave breakdown)
- 👤 **Employee CRUD** — Add, Edit, View, Delete employees with profile photos
- 🏬 **Department Management** — Create, edit, delete departments
- 📅 **Attendance Management** — Track attendance with filters, search, and PDF export
- 🏖️ **Leave Management** — Approve/reject leaves with filters and PDF export
- 💰 **Salary Management** — View/edit salaries, export payroll PDF
- 🔔 **Notifications** — Auto-notifications for leave requests, approvals, new employees

### Employee Dashboard
- 👤 **Profile** — View personal info and edit phone/address
- 📅 **Attendance Calendar** — Visual monthly calendar with status colors
- 🏖️ **Apply Leave** — Submit leave requests
- 💰 **Salary & Payslips** — View salary breakdown and download PDF payslips
- 🔔 **Notifications** — Personal notifications for leave updates

### General
- 🌙 **Dark Mode** — Toggle between light and dark themes
- 📱 **Responsive** — Works on desktop and mobile
- 🔐 **Authentication** — Powered by Clerk (Google OAuth + Email)
- 📄 **PDF Export** — Export attendance, leaves, and salary reports

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | Clerk |
| **Charts** | Recharts |
| **PDF** | jsPDF + jspdf-autotable |
| **Icons** | React Icons |
| **Hosting** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
employee-management-system/
├── ems/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # Auth & Theme context
│   │   ├── pages/          # Page layouts
│   │   └── utils/          # API config
│   └── vercel.json         # Vercel SPA routing config
│
├── server/                 # Backend (Express)
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── db/                 # Database connection
│   └── public/uploads/     # Uploaded files
│
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+
- **MongoDB** (local or Atlas)
- **Clerk Account** — [clerk.com](https://clerk.com) (free)

### 1. Clone the repo
```bash
git clone https://github.com/iamasmigupta/employee-management-system.git
cd employee-management-system
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file in the `server/` folder:
```env
PORT=5001
MONGODB_URL=mongodb://localhost:27017/ems
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

Start the server:
```bash
node index.js
```

### 3. Setup Frontend
```bash
cd ems
npm install
```

Create a `.env` file in the `ems/` folder:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:5001
```

Start the dev server:
```bash
npm run dev
```

### 4. Get Clerk Keys
1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Enable **Email** and **Google** sign-in methods
4. Go to **API Keys** — copy your Publishable Key and Secret Key
5. Paste them in the `.env` files above

---

## 🔑 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5001) |
| `MONGODB_URL` | MongoDB connection string |
| `CLERK_SECRET_KEY` | Clerk secret key (from dashboard) |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key (from dashboard) |

### Frontend (`ems/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `VITE_API_URL` | Backend API URL (default: `http://localhost:5001`) |

---

## 🌐 Deployment

### Backend → Render.com
1. Create a **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repo
3. Set **Root Directory** to `server`
4. **Build Command**: `npm install`
5. **Start Command**: `node index.js`
6. Add all backend environment variables
7. Set `MONGODB_URL` to your MongoDB Atlas connection string

### Frontend → Vercel
1. Import your repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `ems`
3. Set **Framework Preset** to `Vite`
4. Add frontend environment variables
5. Set `VITE_API_URL` to your Render backend URL

### Database → MongoDB Atlas
1. Create a free cluster on [mongodb.com/atlas](https://mongodb.com/atlas)
2. Allow access from anywhere (`0.0.0.0/0`)
3. Use the connection string as `MONGODB_URL`

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👩💻 Author

**Asmi Gupta**
- GitHub: [@iamasmigupta](https://github.com/iamasmigupta)
- LinkedIn: [Asmi Gupta](https://www.linkedin.com/in/asmi-gupta/)
- Email: [itsasmigupta@gmail.com](mailto:itsasmigupta@gmail.com)

---

⭐ **Star this repo if you found it helpful!**
