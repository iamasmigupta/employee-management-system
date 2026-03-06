import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const leaveSchema = new Schema({
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
    leaveType: {
        type: String,
        enum: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave'],
        required: true,
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    appliedDate: { type: Date, default: Date.now },
});

const Leave = mongoose.model('Leave', leaveSchema);
export default Leave;
