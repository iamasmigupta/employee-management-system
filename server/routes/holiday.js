import express from 'express';
import { getHolidays, addHoliday, deleteHoliday } from '../controllers/holidayController.js';

const router = express.Router();
router.get('/', getHolidays);
router.post('/', addHoliday);
router.delete('/:id', deleteHoliday);

export default router;
