import React from 'react';
import { useAuth } from '../context/authContext';
import EmployeeSidebar from '../components/EmployeeDashboard/EmployeeSidebar';
import Navbar from '../components/Dashboard/Navbar';
import { Outlet } from 'react-router-dom';

const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-6 dark:text-gray-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
