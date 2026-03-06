import express from 'express'
import { getAdminSummary, getEmployeeSummary } from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/admin', getAdminSummary)
router.get('/employee', getEmployeeSummary)

export default router;
