import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import User from "../models/User.js";

// Mark attendance (check-in)
const markCheckIn = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) return res.status(404).json({ success: false, error: "Employee not found" });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already checked in today
        let record = await Attendance.findOne({ employeeId: employee._id, date: today });
        if (record) {
            return res.status(400).json({ success: false, error: "Already checked in today" });
        }

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeStr = `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

        record = new Attendance({
            employeeId: employee._id,
            userId: user._id,
            date: today,
            checkIn: timeStr,
            status: hours >= 10 ? 'Late' : 'Present',
        });
        await record.save();

        return res.status(200).json({ success: true, attendance: record });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "check-in server error" });
    }
};

// Mark check-out
const markCheckOut = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, error: "User not found" });

        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) return res.status(404).json({ success: false, error: "Employee not found" });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const record = await Attendance.findOne({ employeeId: employee._id, date: today });
        if (!record) {
            return res.status(400).json({ success: false, error: "Not checked in yet" });
        }
        if (record.checkOut) {
            return res.status(400).json({ success: false, error: "Already checked out" });
        }

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const timeStr = `${hours > 12 ? hours - 12 : hours}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;

        record.checkOut = timeStr;

        // Calculate working hours
        const checkInParts = record.checkIn.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (checkInParts) {
            let inHour = parseInt(checkInParts[1]);
            if (checkInParts[3] === 'PM' && inHour !== 12) inHour += 12;
            if (checkInParts[3] === 'AM' && inHour === 12) inHour = 0;
            const diff = hours - inHour;
            const diffMin = minutes - parseInt(checkInParts[2]);
            record.workingHours = `${diff}h ${diffMin >= 0 ? diffMin : 60 + diffMin}m`;
        }

        await record.save();
        return res.status(200).json({ success: true, attendance: record });
    } catch (error) {
        return res.status(500).json({ success: false, error: "check-out server error" });
    }
};

// Get attendance by employee
const getAttendanceByEmployee = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ email });
        if (!user) return res.status(200).json({ success: true, attendance: [] });

        const employee = await Employee.findOne({ userId: user._id });
        if (!employee) return res.status(200).json({ success: true, attendance: [] });

        const attendance = await Attendance.find({ employeeId: employee._id }).sort({ date: -1 });
        return res.status(200).json({ success: true, attendance });
    } catch (error) {
        return res.status(500).json({ success: false, error: "get attendance server error" });
    }
};

// Get all attendance (admin)
const getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find()
            .populate({
                path: 'employeeId',
                populate: { path: 'userId', select: 'name email' }
            })
            .sort({ date: -1 });
        return res.status(200).json({ success: true, attendance });
    } catch (error) {
        return res.status(500).json({ success: false, error: "get all attendance server error" });
    }
};

export { markCheckIn, markCheckOut, getAttendanceByEmployee, getAllAttendance };
