import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";

// Apply for leave (employee)
const applyLeave = async (req, res) => {
    try {
        const { email, leaveType, startDate, endDate, reason } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) return res.status(404).json({ success: false, error: "Employee not found" });

        const leave = new Leave({
            employeeId: employee._id,
            userId: user._id,
            leaveType,
            startDate,
            endDate,
            reason,
        });
        await leave.save();

        // Notify admin about new leave request
        await createNotification({
            role: 'admin',
            title: 'New Leave Request',
            message: `${user.name} applied for ${leaveType} leave`,
            type: 'leave',
        });

        return res.status(200).json({ success: true, leave });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "apply leave server error" });
    }
};

// Get leaves by employee email
const getLeavesByEmployee = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({ success: true, leaves: [] });

        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) return res.status(200).json({ success: true, leaves: [] });

        const leaves = await Leave.find({ employeeId: employee._id }).sort({ appliedDate: -1 });
        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        return res.status(500).json({ success: false, error: "get leaves server error" });
    }
};

// Get all leaves (admin)
const getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate({
                path: 'employeeId',
                populate: { path: 'userId', select: 'name email' }
            })
            .sort({ appliedDate: -1 });
        return res.status(200).json({ success: true, leaves });
    } catch (error) {
        return res.status(500).json({ success: false, error: "get all leaves server error" });
    }
};

// Update leave status (admin approve/reject)
const updateLeaveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const leave = await Leave.findByIdAndUpdate(id, { status }, { new: true })
            .populate({ path: 'employeeId', populate: { path: 'userId', select: 'name email' } });
        if (!leave) return res.status(404).json({ success: false, error: "Leave not found" });

        // Notify employee about leave status change
        if (leave.employeeId?.userId?._id) {
            await createNotification({
                userId: leave.employeeId.userId._id,
                title: `Leave ${status}`,
                message: `Your ${leave.leaveType} leave has been ${status.toLowerCase()}`,
                type: status === 'Approved' ? 'success' : 'warning',
            });
        }

        return res.status(200).json({ success: true, leave });
    } catch (error) {
        return res.status(500).json({ success: false, error: "update leave server error" });
    }
};

export { applyLeave, getLeavesByEmployee, getAllLeaves, updateLeaveStatus };
