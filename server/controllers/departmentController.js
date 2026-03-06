import Department from "../models/Department.js";

// Add department
const addDepartment = async (req, res) => {
  try {
    const { dep_name, description } = req.body;
    const newDep = new Department({ dep_name, description });
    await newDep.save();
    return res.status(200).json({ success: true, department: newDep });
  } catch (error) {
    return res.status(500).json({ success: false, error: "add department server error" });
  }
};

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, departments });
  } catch (error) {
    return res.status(500).json({ success: false, error: "get departments server error" });
  }
};

// Edit department
const editDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { dep_name, description } = req.body;
    const updated = await Department.findByIdAndUpdate(id, { dep_name, description, updatedAt: Date.now() }, { new: true });
    if (!updated) return res.status(404).json({ success: false, error: "Department not found" });
    return res.status(200).json({ success: true, department: updated });
  } catch (error) {
    return res.status(500).json({ success: false, error: "edit department server error" });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Department.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, error: "Department not found" });
    return res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: "delete department server error" });
  }
};

export { addDepartment, getDepartments, editDepartment, deleteDepartment };
