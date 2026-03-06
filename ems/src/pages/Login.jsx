import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import { useSignIn, useSignUp, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import axios from 'axios';
import API_URL from '../utils/api';

// ========== LOGO (outside Login to prevent remount) ==========
const Logo = () => (
  <div className="flex items-center justify-center space-x-3 mb-6">
    <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/30">
      <img src="/infinity.png" alt="Logo" className="h-7 w-7 object-cover" />
    </div>
    <div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">WorkSphere</h1>
      <p className="text-[10px] text-gray-400 uppercase tracking-[3px]">Management System</p>
    </div>
  </div>
);

// ========== FORM WRAPPER (outside Login to prevent remount) ==========
const FormWrapper = ({ children, title, subtitle, error, successMsg }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
    <div className="w-full max-w-md">
      <Logo />
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{title}</h2>
        <p className="text-sm text-gray-500 mb-6">{subtitle}</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm">
            {successMsg}
          </div>
        )}

        {children}
      </div>
      <p className="text-center text-xs text-gray-400 mt-6">© 2026 WorkSphere. Made with ❤️ by Asmi Gupta</p>
    </div>
  </div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setActive } = useClerk();
  const { getToken } = useClerkAuth();

  const { signIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp, isLoaded: signUpLoaded } = useSignUp();

  const [mode, setMode] = useState('login');
  const [verificationCode, setVerificationCode] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // ========== HELPERS ==========
  const syncAndRedirect = async (sessionId) => {
    try {
      await setActive({ session: sessionId });
      const res = await axios.post(`${API_URL}/api/auth/sync`, {
        name: name || 'User',
        email,
        role,
      });
      const userRole = res.data?.user?.role || role || 'admin';
      navigate(userRole === 'employee' ? '/employee-dashboard' : '/admin-dashboard');
    } catch (err) {
      console.error('Sync error:', err);
      navigate(role === 'employee' ? '/employee-dashboard' : '/admin-dashboard');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
    setVerificationCode('');
  };

  // ========== GOOGLE SIGN IN ==========
  const handleGoogleSignIn = async () => {
    if (!signInLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/admin-dashboard',
      });
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Google sign-in failed. Make sure Google is enabled in your Clerk dashboard.');
    }
  };

  // ========== LOGIN ==========
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (!signInLoaded) return;

    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await syncAndRedirect(result.createdSessionId);
      }
    } catch (err) {
      if (err.errors?.[0]?.code === 'form_identifier_not_found') {
        setError('Account not found. Please create an account first.');
      } else if (err.errors?.[0]?.code === 'form_password_incorrect') {
        setError('Incorrect password. Please try again.');
      } else {
        setError(err.errors?.[0]?.longMessage || 'Login failed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ========== SIGN UP ==========
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (!signUpLoaded) return;

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: name,
      });

      if (result.status === 'missing_requirements' || result.status === 'needs_email_verification') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setSuccessMsg('A verification code has been sent to your email!');
        setMode('verify-signup');
      } else if (result.status === 'complete') {
        await syncAndRedirect(result.createdSessionId);
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Sign up failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== VERIFY SIGN-UP ==========
  const handleVerifySignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });
      if (result.status === 'complete') {
        setSuccessMsg('Account verified! Redirecting...');
        await syncAndRedirect(result.createdSessionId);
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== FORGOT PASSWORD ==========
  const handleSendResetCode = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await signIn.create({ identifier: forgotEmail });
      const firstFactor = signIn.supportedFirstFactors.find(f => f.strategy === 'reset_password_email_code');
      if (firstFactor) {
        await signIn.prepareFirstFactor({ strategy: 'reset_password_email_code', emailAddressId: firstFactor.emailAddressId });
        setSuccessMsg('Reset code sent to your email!');
        setMode('reset-code');
      } else {
        setError('Password reset not supported for this account.');
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Could not send reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyResetCode = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({ strategy: 'reset_password_email_code', code: verificationCode });
      if (result.status === 'needs_new_password') {
        setSuccessMsg('Code verified! Set your new password.');
        setMode('reset-password');
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Invalid code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const result = await signIn.resetPassword({ password: newPassword });
      if (result.status === 'complete') {
        await syncAndRedirect(result.createdSessionId);
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || 'Could not set password.');
    } finally {
      setIsLoading(false);
    }
  };

  // ========== SHARED STYLES ==========
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition";
  const btnClass = "w-full py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-700 shadow-lg shadow-teal-500/25 transition disabled:opacity-50";
  const linkClass = "text-teal-600 hover:text-teal-700 font-medium transition";

  // ========== SIGN UP ==========
  if (mode === 'signup') {
    return (
      <FormWrapper title="Create Account" subtitle="Start managing your team today" error={error} successMsg={successMsg}>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input type="text" placeholder="John Doe" value={name}
              onChange={(e) => setName(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input type="email" placeholder="you@company.com" value={email}
              onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={password}
                onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-10`} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className={inputClass}>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
            </select>
          </div>
          <button type="submit" disabled={isLoading} className={btnClass}>
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-400 uppercase">or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <button onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition group">
          <FcGoogle className="text-xl mr-2 group-hover:scale-110 transition-transform" />
          <span className="text-sm text-gray-600 font-medium">Continue with Google</span>
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <button onClick={() => switchMode('login')} className={linkClass}>Sign In</button>
        </p>
      </FormWrapper>
    );
  }

  // ========== VERIFY SIGN-UP ==========
  if (mode === 'verify-signup') {
    return (
      <FormWrapper title="Verify Email" subtitle="We've sent a 6-digit code to your email" error={error} successMsg={successMsg}>
        <form onSubmit={handleVerifySignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Verification Code</label>
            <input type="text" placeholder="Enter 6-digit code" value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)} className={`${inputClass} text-center tracking-[0.5em] text-lg font-mono`} required />
          </div>
          <button type="submit" disabled={isLoading} className={btnClass}>
            {isLoading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          <button onClick={() => switchMode('login')} className={linkClass}>← Back to Sign In</button>
        </p>
      </FormWrapper>
    );
  }

  // ========== FORGOT PASSWORD ==========
  if (mode === 'forgot') {
    return (
      <FormWrapper title="Forgot Password" subtitle="Enter your email and we'll send you a reset code" error={error} successMsg={successMsg}>
        <form onSubmit={handleSendResetCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
            <input type="email" placeholder="you@company.com" value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)} className={inputClass} required />
          </div>
          <button type="submit" disabled={isLoading} className={btnClass}>
            {isLoading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          <button onClick={() => switchMode('login')} className={linkClass}>← Back to Sign In</button>
        </p>
      </FormWrapper>
    );
  }

  // ========== RESET CODE ==========
  if (mode === 'reset-code') {
    return (
      <FormWrapper title="Enter Reset Code" subtitle="Check your email for the code" error={error} successMsg={successMsg}>
        <form onSubmit={handleVerifyResetCode} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Reset Code</label>
            <input type="text" placeholder="Enter code" value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)} className={`${inputClass} text-center tracking-[0.5em] text-lg font-mono`} required />
          </div>
          <button type="submit" disabled={isLoading} className={btnClass}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          <button onClick={() => switchMode('login')} className={linkClass}>← Back to Sign In</button>
        </p>
      </FormWrapper>
    );
  }

  // ========== NEW PASSWORD ==========
  if (mode === 'reset-password') {
    return (
      <FormWrapper title="Set New Password" subtitle="Choose a strong new password" error={error} successMsg={successMsg}>
        <form onSubmit={handleSetNewPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} className={`${inputClass} pr-10`} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className={btnClass}>
            {isLoading ? 'Setting password...' : 'Set Password & Login'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-5">
          <button onClick={() => switchMode('login')} className={linkClass}>← Back to Sign In</button>
        </p>
      </FormWrapper>
    );
  }

  // ========== MAIN LOGIN ==========
  return (
    <FormWrapper title="Welcome back" subtitle="Sign in to access your dashboard" error={error} successMsg={successMsg}>
      {/* Google */}
      <button onClick={handleGoogleSignIn}
        className="flex items-center justify-center w-full py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition mb-4 group">
        <FcGoogle className="text-xl mr-2 group-hover:scale-110 transition-transform" />
        <span className="text-sm text-gray-600 font-medium">Continue with Google</span>
      </button>

      <div className="flex items-center mb-4">
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-xs text-gray-400 uppercase">or sign in with email</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>

      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
          <input type="email" placeholder="you@company.com" value={email}
            onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-10`} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-teal-500 border-gray-300 rounded mr-2 focus:ring-teal-500" />
            Remember me
          </label>
          <button type="button" onClick={() => switchMode('forgot')}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium">
            Forgot password?
          </button>
        </div>

        <button type="submit" disabled={isLoading} className={btnClass}>
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-5">
        Don't have an account?{' '}
        <button onClick={() => switchMode('signup')} className={linkClass}>Create Account</button>
      </p>
    </FormWrapper>
  );
};

export default Login;
