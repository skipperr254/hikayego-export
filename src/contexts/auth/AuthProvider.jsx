import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';
import { AuthContext } from './AuthContext';
import { loadUserProfile } from './AuthHelpers';
import { handleAuthStateChange } from './authHandlers';
import { loginUser, registerUser, signInWithGoogleUser, updateUserProfile } from './authActions';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const authListenerRef = useRef(null);
  const initializingRef = useRef(false);
  const lastSessionRef = useRef(null);
  const mountedRef = useRef(true);

  const loadProfile = useCallback(async (authUser, preserveUser = null) => {
    if (!mountedRef.current) return;

    try {
      await loadUserProfile(authUser, setUser, preserveUser);
      
      // Check if premium has expired and update the database if needed
      await checkAndRevokeExpiredPremium(authUser.id);
    } catch (error) {
      console.error('❌ Profile loading failed:', error);
    }
  }, []);
  
  const checkAndRevokeExpiredPremium = async (userId) => {
    try {
      // Fetch user's premium expiry date
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('premium_expires_at, subscription')
        .eq('id', userId)
        .maybeSingle();
      
      if (error || !profile) return;
      
      // If premium_expires_at is set and has passed
      if (profile.premium_expires_at && profile.subscription) {
        const expiryDate = new Date(profile.premium_expires_at);
        const now = new Date();
        
        if (expiryDate <= now) {
          console.log('🕐 Premium access expired, revoking access...');
          
          // Revoke premium access
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              subscription: false,
              subscription_status: 'inactive',
              cancellation_date: now.toISOString(),
              updated_at: now.toISOString()
            })
            .eq('id', userId);
          
          if (!updateError) {
            console.log('✅ Premium access revoked successfully');
            // Refresh the profile to reflect changes
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
              await loadUserProfile(session.user, setUser);
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error checking premium expiry:', error);
    }
  };

  const refreshUserProfile = useCallback(async () => {
    if (!user) return;
    console.log('🔄 Refreshing user profile...');
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await loadProfile(session.user);
      console.log('✅ User profile refreshed.');
    }
  }, [user, loadProfile]);

  const reauthenticate = useCallback(async (password) => {
    if (!user?.email) {
      return { error: new Error("Kullanıcı e-postası bulunamadı.") };
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

    return { error: reauthError };
  }, [user]);

  const logout = useCallback(async () => {
    try {
      console.log('🔄 Logging out...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Logout error:', error);
        throw error;
      }
      
      // Clear user state if component is still mounted
      if (mountedRef.current) {
        setUser(null);
        setAuthError(null);
        lastSessionRef.current = null;
        console.log('✅ User state cleared');
      }
      
    } catch (error) {
      console.error('❌ Logout failed:', error);
      
      // Still clear state even if there's an error
      if (mountedRef.current) {
        setUser(null);
        setAuthError(null);
        lastSessionRef.current = null;
      }
      
      throw error;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    const initialize = async () => {
      if (initializingRef.current) return;
      initializingRef.current = true;

      try {
        console.log('🔄 Initializing auth...');
        
        const { data: { session }, error } = await supabase.auth.getSession();

        if (!mountedRef.current) return;

        if (error) {
          console.error('❌ Session error:', error);
          setUser(null);
          setAuthError(error.message);
        } else if (session?.user) {
          console.log('✅ Session found, loading profile...');
          lastSessionRef.current = session.user.id;
          await loadProfile(session.user);
        } else {
          console.log('ℹ️ No active session');
          setUser(null);
          lastSessionRef.current = null;
        }

        if (!authListenerRef.current) {
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => handleAuthStateChange(
              event, session, mountedRef, lastSessionRef,
              { setIsNewUser, loadProfile, setUser, setAuthError, user }
            )
          );
          authListenerRef.current = subscription;
        }

      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        if (mountedRef.current) {
          setUser(null);
          setAuthError(error.message);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
          setInitialized(true);
          initializingRef.current = false;
        }
      }
    };

    initialize();

    return () => {
      mountedRef.current = false;
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
    };
  }, [loadProfile, user]);

  const login = useCallback((email, password) => loginUser(email, password, setAuthError), []);
  const register = useCallback((name, email, password) => registerUser(name, email, password, setAuthError), []);
  const signInWithGoogle = useCallback(() => signInWithGoogleUser(setAuthError), []);
  const updateUser = useCallback((newUserData) => updateUserProfile(newUserData, user, setUser, setAuthError), [user]);

  const subscriptionStatus = useMemo(() => {
    if (!user) return 'none';
    return user.subscription_status || 'none';
  }, [user]);

  const canAccessPremiumFeatures = useMemo(() => {
    if (!user) return false;
    
    // Check if premium has expired (for testing/admin-granted premium)
    if (user.premium_expires_at) {
      const expiryDate = new Date(user.premium_expires_at);
      const now = new Date();
      if (expiryDate <= now) {
        // Premium has expired
        return false;
      }
    }
    
    // Check subscription status
    const status = user.subscription_status;
    if (status === 'active' || status === 'trial') {
      return true;
    }
    if (status === 'cancelled' && user.next_payment_date) {
      return new Date(user.next_payment_date) > new Date();
    }
    
    // If user has subscription flag set (legacy or admin-granted)
    if (user.subscription) {
      // If there's an expiry date, we already checked it above
      // If no expiry date, grant access (permanent premium)
      return true;
    }
    
    return false;
  }, [user]);

  const contextValue = React.useMemo(() => ({
    user,
    profile: user,
    login,
    register,
    logout,
    updateUser,
    loading,
    authError,
    initialized,
    reauthenticate,
    canAccessPremiumFeatures,
    subscriptionStatus,
    refreshUserProfile,
    signInWithGoogle,
    isNewUser,
    setIsNewUser,
  }), [user, login, register, logout, updateUser, loading, authError, initialized, reauthenticate, canAccessPremiumFeatures, subscriptionStatus, refreshUserProfile, signInWithGoogle, isNewUser]);

  if (loading && !initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};