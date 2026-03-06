import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/clerk-react';
import axios from 'axios';
import API_URL from '../utils/api';

const userContext = createContext();

const AuthContext = ({ children }) => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useClerkAuth();
  const [mongoRole, setMongoRole] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  // After Clerk login, fetch role from MongoDB (read-only, doesn't create users)
  useEffect(() => {
    const fetchRole = async () => {
      if (isSignedIn && clerkUser && !syncDone) {
        setSyncing(true);
        try {
          const email = clerkUser.primaryEmailAddress?.emailAddress;
          const res = await axios.get(`${API_URL}/api/auth/role?email=${email}`);
          if (res.data.success && res.data.role) {
            setMongoRole(res.data.role);
          }
        } catch (err) {
          console.log('Role fetch skipped:', err.message);
        }
        setSyncing(false);
        setSyncDone(true);
      }
    };
    fetchRole();
  }, [isSignedIn, clerkUser]);

  // Reset sync state on logout
  useEffect(() => {
    if (!isSignedIn) {
      setMongoRole(null);
      setSyncDone(false);
    }
  }, [isSignedIn]);

  const user = isSignedIn && clerkUser ? {
    _id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.firstName || 'User',
    email: clerkUser.primaryEmailAddress?.emailAddress,
    role: mongoRole || clerkUser.publicMetadata?.role || 'admin',
    profileImage: clerkUser.imageUrl,
  } : null;

  // Show loading while Clerk is loading OR while we're syncing with MongoDB
  const loading = !isLoaded || (isSignedIn && !syncDone);

  const login = (userData) => {
    // Clerk handles login via useSignIn() in Login.jsx
  };

  const logout = () => {
    setMongoRole(null);
    setSyncDone(false);
    signOut();
  };

  return (
    <userContext.Provider value={{ user, login, logout, loading, getToken }}>
      {children}
    </userContext.Provider>
  );
};

export const useAuth = () => useContext(userContext);
export default AuthContext;
