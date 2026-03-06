import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const attendanceSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: { type: Date, required: true },
    checkIn: { type: String },
    checkOut: { type: String },
    status: {
        type: String,
        enum: ['Present', 'Late', 'Absent', 'Leave', 'Weekend'],
        default: 'Present',
    },
    workingHours: { type: String },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
