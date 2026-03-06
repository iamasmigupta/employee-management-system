import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaUser, FaEnvelope, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/authContext';
import { useUser } from '@clerk/clerk-react';
import { useLocation } from 'react-router-dom';

const Settings = () => {
  const { user: authUser, logout } = useAuth();
  const { user: clerkUser } = useUser();
  const location = useLocation();
  const isEmployee = location.pathname.startsWith('/employee-dashboard');

  // Theme colors
  const accent = isEmployee ? 'blue' : 'teal';
  const gradientFrom = isEmployee ? 'from-blue-500' : 'from-teal-500';
  const gradientTo = isEmployee ? 'to-indigo-600' : 'to-emerald-600';
  const ringColor = isEmployee ? 'focus:ring-blue-500' : 'focus:ring-teal-500';
  const iconColor = isEmployee ? 'text-blue-600' : 'text-teal-600';
  const btnGradient = isEmployee
    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/25'
    : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 shadow-teal-500/25';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword.length < 8) {
      setMessage({ text: 'Password must be at least 8 characters long.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match.', type: 'error' });
      return;
    }

    setIsLoading(true);
    try {
      await clerkUser.updatePassword({
        currentPassword,
        newPassword,
      });
      setMessage({ text: 'Password changed successfully! ✅', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const errorMsg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Failed to change password.';
      setMessage({ text: errorMsg, type: 'error' });
    }
    setIsLoading(false);
  };

  const inputClass = `w-full px-4 py-2 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 ${ringColor}`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Account Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaUser className={iconColor} /> Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-800">{authUser?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-400 text-sm" />
                <p className="font-medium text-gray-800">{authUser?.email || 'N/A'}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${authUser?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                {authUser?.role?.charAt(0).toUpperCase() + authUser?.role?.slice(1) || 'N/A'}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Account Status</p>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Active</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaLock className={iconColor} /> Change Password
          </h3>

          {message.text && (
            <div className={`mb-4 p-3 rounded-xl text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
              }`}>{message.text}</div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? 'text' : 'password'} value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                  className={inputClass} required />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showCurrent ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 characters"
                  className={inputClass} required minLength={8} />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showNew ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    <div className={`h-1 flex-1 rounded ${newPassword.length >= 4 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${newPassword.length >= 8 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${newPassword.length >= 12 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {newPassword.length < 8 ? 'Weak' : newPassword.length < 12 ? 'Medium' : 'Strong'}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                  className={`${inputClass} ${confirmPassword && confirmPassword !== newPassword ? 'border-red-400' : ''}`} required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
            <button type="submit" disabled={isLoading}
              className={`w-full ${btnGradient} text-white font-semibold py-2.5 rounded-xl transition shadow-lg disabled:opacity-50`}>
              {isLoading ? 'Changing Password...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaShieldAlt className={iconColor} /> Security
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium text-gray-700">Authentication</p>
                <p className="text-sm text-gray-400">Managed by Clerk</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Clerk Auth</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <p className="font-medium text-gray-700">Sign Out</p>
                <p className="text-sm text-gray-400">Sign out of your account</p>
              </div>
              <button onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
