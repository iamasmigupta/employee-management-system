import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

// Admin Components
import AdminSummary from "./components/Dashboard/AdminSummary";
import DepartmentList from "./components/Departments/DepartmentList";
import AddDepartment from "./components/Departments/AddDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import Edit from "./components/employee/Edit";
import View from "./components/employee/View";
import AddSalary from "./components/salary/AddSalary";
import ManageLeaves from './components/Leaves/ManageLeaves';
import ManageAttendance from './components/Attendance/ManageAttendance';
import Settings from "./components/Settings/setting";

// Employee Components
import EmployeeSummary from "./components/EmployeeDashboard/EmployeeSummary";
import MyProfile from "./components/EmployeeDashboard/MyProfile";
import MyAttendance from "./components/EmployeeDashboard/MyAttendance";
import ApplyLeave from "./components/EmployeeDashboard/ApplyLeave";
import ViewSalary from "./components/EmployeeDashboard/ViewSalary";
import EditProfile from "./components/EmployeeDashboard/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin-dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="department" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="employee" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="edit-employee/:id" element={<Edit />} />
          <Route path="view-employee/:id" element={<View />} />
          <Route path="salary" element={<AddSalary />} />
          <Route path="leave" element={<ManageLeaves />} />
          <Route path="attendance" element={<ManageAttendance />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Employee Dashboard */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />} />
          <Route path="profile" element={<MyProfile />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="leaves" element={<ApplyLeave />} />
          <Route path="salary" element={<ViewSalary />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
