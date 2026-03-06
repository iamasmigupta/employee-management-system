import express from 'express'
import { markCheckIn, markCheckOut, getAttendanceByEmployee, getAllAttendance } from '../controllers/attendanceController.js'

const router = express.Router()

router.post('/check-in', markCheckIn)
router.post('/check-out', markCheckOut)
router.get('/employee', getAttendanceByEmployee)
router.get('/', getAllAttendance)

export default router;
