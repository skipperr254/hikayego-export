import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  user: null,
  profile: null, // Ensure profile is part of the context structure
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: async () => {},
  loading: true,
  authError: null,
  initialized: false,
  reauthenticate: async () => {},
  canAccessPremiumFeatures: false,
  subscriptionStatus: 'none',
  refreshUserProfile: async () => {},
  signInWithGoogle: async () => {},
  isNewUser: false,
  setIsNewUser: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};