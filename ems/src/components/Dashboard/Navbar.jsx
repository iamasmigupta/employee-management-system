import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/authContext';
import { useTheme } from '../../context/themeContext';
import { useLocation } from 'react-router-dom';
import { FaBell, FaSignOutAlt, FaCheckDouble, FaCircle, FaSun, FaMoon } from 'react-icons/fa';
import axios from 'axios';
import API_URL from '../../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const isEmployee = location.pathname.startsWith('/employee-dashboard');
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });

  const unreadCount = notifications.filter(n => !n.read).length;

  const fetchNotifications = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`${API_URL}/api/notification?email=${user.email}`);
      if (res.data.success) setNotifications(res.data.notifications);
    } catch (err) { /* silent */ }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    try {
      await axios.put(`${API_URL}/api/notification/mark-all-read`, { email: user.email });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { /* silent */ }
  };

  const markOneRead = async (id) => {
    try {
      await axios.put(`${API_URL}/api/notification/${id}/read`, { email: user.email });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) { /* silent */ }
  };

  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const typeColors = {
    leave: 'bg-purple-100 text-purple-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    employee: 'bg-blue-100 text-blue-600',
    attendance: 'bg-orange-100 text-orange-600',
    info: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-3 flex justify-between items-center shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {greeting}, <span className={isEmployee ? 'text-blue-600' : 'text-teal-600'}>{user?.name || 'User'}</span> 👋
        </h2>
        <p className="text-xs text-gray-400">{dateStr}</p>
      </div>
      <div className="flex items-center space-x-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <FaSun className="text-lg text-yellow-400" /> : <FaMoon className="text-lg" />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <FaBell className="text-lg" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 dark:bg-gray-700">
                <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-200">Notifications</h4>
                {unreadCount > 0 && (
                  <button onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-medium">
                    <FaCheckDouble className="text-[10px]" /> Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    <FaBell className="text-2xl mx-auto mb-2 text-gray-300" />
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n._id}
                      onClick={() => !n.read && markOneRead(n._id)}
                      className={`px-4 py-3 border-b border-gray-50 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-start gap-3 ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}
                    >
                      <div className={`mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${typeColors[n.type] || typeColors.info}`}>
                        {n.type}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'}`}>{n.title}</p>
                        <p className="text-xs text-gray-400 truncate">{n.message}</p>
                        <p className="text-[10px] text-gray-300 mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.read && <FaCircle className="text-[6px] text-blue-500 mt-2 flex-shrink-0" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-gray-600"></div>
        <button onClick={logout}
          className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition font-medium">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
