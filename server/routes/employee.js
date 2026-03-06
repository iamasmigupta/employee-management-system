import express from 'express';
import { addEmployee, getEmployees, getEmployeeByEmail, editEmployee, updateProfile, deleteEmployee, upload } from '../controllers/employeeController.js'

const router = express.Router();

router.get('/', getEmployees)
router.get('/by-email', getEmployeeByEmail)
router.post('/add', upload.single('image'), addEmployee)
router.put('/update-profile', updateProfile)
router.put('/:id', editEmployee)
router.delete('/:id', deleteEmployee)

export default router;