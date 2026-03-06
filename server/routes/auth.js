import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { syncUser, getUserRole } from '../controllers/authController.js'

const router = express.Router()

// Sync Clerk user to MongoDB — no auth needed (called right after signup before token is ready)
router.post('/sync', syncUser)

// Get user role — no auth needed (called by authContext to check role)
router.get('/role', getUserRole)

export default router;