import multer from "multer";
import Employee from "../models/Employee.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import path from "path";
import { createClerkClient } from "@clerk/backend";
import { createNotification } from "./notificationController.js";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Add employee
const addEmployee = async (req, res) => {
  try {
    const {
      name, email, employeeId, dob, gender,
      maritalStatus, designation, department, salary, password, role,
    } = req.body;

    // Check if employee record already exists
    let user = await User.findOne({ email });

    if (user) {
      const existingEmployee = await Employee.findOne({ userId: user._id });
      if (existingEmployee) {
        return res.status(400).json({ success: false, error: "Employee record already exists for this user" });
      }
      user.name = name || user.name;
      user.role = role || 'employee';
      if (req.file) user.profileImage = req.file.filename;
      await user.save();
    } else {
      // Step 1: Create a Clerk account so employee can login
      try {
        await clerkClient.users.createUser({
          emailAddress: [email],
          password: password,
          firstName: name,
          skipPasswordChecks: true,
        });
        console.log(`Clerk account created for ${email}`);
      } catch (clerkErr) {
        console.error('Clerk user creation error:', clerkErr.errors || clerkErr.message);
        // If user already exists in Clerk, continue (they can still login)
        if (clerkErr.status !== 422) {
          return res.status(400).json({ success: false, error: clerkErr.errors?.[0]?.longMessage || "Failed to create login account" });
        }
      }

      // Step 2: Create MongoDB user
      const hashPassword = await bcrypt.hash(password, 10);
      user = new User({
        name, email,
        password: hashPassword,
        role: role || 'employee',
        profileImage: req.file ? req.file.filename : ""
      });
      await user.save();
    }

    const newEmployee = new Employee({
      userId: user._id,
      employeeId, dob, gender, maritalStatus,
      designation, department, salary,
    });
    await newEmployee.save();

    // Notify admin about new employee
    await createNotification({
      role: 'admin',
      title: 'New Employee Added',
      message: `${formData?.name || name} has been added as an employee`,
      type: 'employee',
    });

    return res.status(200).json({ success: true, message: "Employee added successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, error: "server error in adding employee" });
  }
};

// Get all employees (with user + department info)
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('userId', 'name email profileImage role')
      .populate('department', 'dep_name')
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, employees });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employees server error" });
  }
};

// Get employee by user email (for employee dashboard)
const getEmployeeByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const employee = await Employee.findOne({ userId: user._id })
      .populate('userId', 'name email profileImage role')
      .populate('department', 'dep_name');

    if (!employee) return res.status(404).json({ success: false, error: "Employee record not found" });

    return res.status(200).json({ success: true, employee });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get employee server error" });
  }
};

// Edit employee
const editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, designation, department, salary, maritalStatus, phone, address } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ success: false, error: "Employee not found" });

    // Update employee fields
    employee.designation = designation || employee.designation;
    employee.department = department || employee.department;
    employee.salary = salary || employee.salary;
    employee.maritalStatus = maritalStatus || employee.maritalStatus;
    if (phone !== undefined) employee.phone = phone;
    if (address !== undefined) employee.address = address;
    employee.updatedAt = Date.now();
    await employee.save();

    // Update user name if provided
    if (name) {
      await User.findByIdAndUpdate(employee.userId, { name, updatedAt: Date.now() });
    }

    return res.status(200).json({ success: true, message: "Employee updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "edit employee server error" });
  }
};

// Update own profile (for employee dashboard)
const updateProfile = async (req, res) => {
  try {
    const { email, phone, address, maritalStatus } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    const employee = await Employee.findOne({ userId: user._id });
    if (!employee) return res.status(404).json({ success: false, error: "Employee not found" });

    if (phone !== undefined) employee.phone = phone;
    if (address !== undefined) employee.address = address;
    if (maritalStatus) employee.maritalStatus = maritalStatus;
    employee.updatedAt = Date.now();
    await employee.save();

    return res.status(200).json({ success: true, message: "Profile updated" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "update profile error" });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) return res.status(404).json({ success: false, error: "Employee not found" });
    // Optionally delete user too
    await User.findByIdAndDelete(employee.userId);
    return res.status(200).json({ success: true, message: "Employee deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "delete employee server error" });
  }
};

export { addEmployee, getEmployees, getEmployeeByEmail, editEmployee, updateProfile, deleteEmployee, upload };
