import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Leave from "../models/Leave.js";
import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// Admin dashboard summary
const getAdminSummary = async (req, res) => {
    try {
        const totalEmployees = await Employee.countDocuments();
        const totalDepartments = await Department.countDocuments();

        // Total monthly salary
        const employees = await Employee.find();
        const totalSalary = employees.reduce((sum, emp) => sum + (emp.salary || 0), 0);

        // Leave counts
        const totalLeaves = await Leave.countDocuments();
        const approvedLeaves = await Leave.countDocuments({ status: 'Approved' });
        const pendingLeaves = await Leave.countDocuments({ status: 'Pending' });
        const rejectedLeaves = await Leave.countDocuments({ status: 'Rejected' });

        return res.status(200).json({
            success: true,
            summary: {
                totalEmployees,
                totalDepartments,
                totalSalary,
                totalLeaves,
                approvedLeaves,
                pendingLeaves,
                rejectedLeaves,
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: "admin summary server error" });
    }
};

// Employee dashboard summary
const getEmployeeSummary = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({ success: true, summary: null });

        const employee = await Employee.findOne({ userId: user._id })
            .populate('department', 'dep_name');
        if (!employee) return res.status(200).json({ success: true, summary: null });

        // Attendance stats for current month
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const attendance = await Attendance.find({
            employeeId: employee._id,
            date: { $gte: startOfMonth }
        });

        const present = attendance.filter(a => a.status === 'Present').length;
        const late = attendance.filter(a => a.status === 'Late').length;
        const absent = attendance.filter(a => a.status === 'Absent').length;

        // Leave stats
        const totalLeaves = await Leave.countDocuments({ employeeId: employee._id });
        const approvedLeaves = await Leave.countDocuments({ employeeId: employee._id, status: 'Approved' });
        const pendingLeaves = await Leave.countDocuments({ employeeId: employee._id, status: 'Pending' });
        const rejectedLeaves = await Leave.countDocuments({ employeeId: employee._id, status: 'Rejected' });

        return res.status(200).json({
            success: true,
            summary: {
                employee: {
                    name: user.name,
                    email: user.email,
                    designation: employee.designation,
                    department: employee.department?.dep_name || 'N/A',
                    salary: employee.salary,
                    dob: employee.dob,
                    gender: employee.gender,
                    joinedDate: employee.createdAt,
                },
                attendance: { present, late, absent, total: present + late },
                leaves: { totalLeaves, approvedLeaves, pendingLeaves, rejectedLeaves },
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: "employee summary server error" });
    }
};

export { getAdminSummary, getEmployeeSummary };
