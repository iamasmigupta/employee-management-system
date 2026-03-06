import express from 'express'
import { applyLeave, getLeavesByEmployee, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController.js'

const router = express.Router()

router.post('/apply', applyLeave)
router.get('/employee', getLeavesByEmployee)
router.get('/', getAllLeaves)
router.put('/:id', updateLeaveStatus)

export default router;
