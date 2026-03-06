import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCogs,
  FaClipboardList,
  FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/authContext';

const AdminSidebar = () => {
  const { user, logout } = useAuth();

  const links = [
    { to: '/admin-dashboard', icon: <FaTachometerAlt />, label: 'Dashboard', end: true },
    { to: '/admin-dashboard/employee', icon: <FaUsers />, label: 'Employees' },
    { to: '/admin-dashboard/department', icon: <FaBuilding />, label: 'Departments' },
    { to: '/admin-dashboard/leave', icon: <FaCalendarAlt />, label: 'Leaves' },
    { to: '/admin-dashboard/salary', icon: <FaMoneyBillWave />, label: 'Salary' },
    { to: '/admin-dashboard/attendance', icon: <FaClipboardList />, label: 'Attendance' },
    { to: '/admin-dashboard/settings', icon: <FaCogs />, label: 'Settings' },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen fixed left-0 top-0 w-64 flex flex-col shadow-2xl">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <img src="/infinity.png" alt="Logo" className="h-6 w-6 object-cover" />
          </div>
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
              WorkSphere
            </h3>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="px-5 py-4 border-b border-gray-700/30">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center text-sm font-bold shadow-md">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || 'Admin'}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase tracking-wider text-gray-500 px-3 mb-2">Menu</p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-400 border border-teal-500/20 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-4">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
