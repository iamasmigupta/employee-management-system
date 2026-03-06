import React from 'react';
import { useAuth } from '../context/authContext';
import AdminSidebar from '../components/Dashboard/AdminSidebar';
import Navbar from '../components/Dashboard/Navbar';
// import AdminSummary from '../components/Dashboard/AdminSummary'; // <-- Import your AdminSummary
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-6 dark:text-gray-100">
          <h1 className="text-3xl font-bold mb-4">
            Welcome, {user?.name || 'Admin'}!
          </h1>
          <p className="mb-8 dark:text-gray-400">This is your Admin Dashboard.</p>

          {/* Dashboard Summary Cards */}
          {/* <AdminSummary /> */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
