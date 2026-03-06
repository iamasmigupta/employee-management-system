import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import authRouter from './routes/auth.js';
import departmentRouter from './routes/department.js';
import employeeRouter from './routes/employee.js';
import leaveRouter from './routes/leave.js';
import attendanceRouter from './routes/attendance.js';
import dashboardRouter from './routes/dashboard.js';
import notificationRouter from './routes/notification.js';
import announcementRouter from './routes/announcement.js';
import holidayRouter from './routes/holiday.js';
import connectToDatabase from './db/db.js';

connectToDatabase();

const app = express();
const port = process.env.PORT || 5001;

// CORS: allow frontend domains
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',')
  : ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed.trim()))) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all in dev; tighten in prod if needed
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.static('public'));

// Clerk middleware
app.use(clerkMiddleware());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRouter);
app.use('/api/department', departmentRouter);
app.use('/api/employee', employeeRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/notification', notificationRouter);
app.use('/api/announcement', announcementRouter);
app.use('/api/holiday', holidayRouter);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});
