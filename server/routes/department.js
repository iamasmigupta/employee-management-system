import express from 'express'
import { addDepartment, getDepartments, editDepartment, deleteDepartment } from '../controllers/departmentController.js'

const router = express.Router()

router.get('/', getDepartments)
router.post('/add', addDepartment)
router.put('/:id', editDepartment)
router.delete('/:id', deleteDepartment)

export default router;
