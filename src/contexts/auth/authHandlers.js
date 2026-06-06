export const handleAuthStateChange = async (event, session, mountedRef, lastSessionRef, stateUpdaters) => {
  if (!mountedRef.current) return;

  const { setIsNewUser, loadProfile, setUser, setAuthError, user } = stateUpdaters;
  
  console.log('🔄 Auth state change:', event, session?.user?.email);
  
  const currentUserId = session?.user?.id;
  const lastUserId = lastSessionRef.current;
  
  try {
    if (event === 'SIGNED_IN' && session?.user) {
      console.log('✅ User signed in');
      const createdAt = new Date(session.user.created_at).getTime();
      const lastSignInAt = new Date(session.user.last_sign_in_at).getTime();
      const timeDiff = Math.abs(lastSignInAt - createdAt);
      
      if (timeDiff < 2 * 60 * 1000) { // 2 minutes threshold
        setIsNewUser(true);
      }

      if (currentUserId !== lastUserId) {
        lastSessionRef.current = currentUserId;
        await loadProfile(session.user);
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('👋 User signed out');
      setUser(null);
      setAuthError(null);
      lastSessionRef.current = null;
      setIsNewUser(false);
    } else if (event === 'TOKEN_REFRESHED') {
      if (session?.user) {
        console.log('🔄 Token refreshed successfully, reloading profile to ensure state consistency.');
        await loadProfile(session.user, user);
      } else {
        console.log('❌ Token refresh failed, signing out.');
        setUser(null);
        setAuthError('Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.');
        lastSessionRef.current = null;
      }
    } else if (event === 'USER_UPDATED' || event === 'PASSWORD_RECOVERY') {
        console.log(`ℹ️ Event "${event}" received. No profile action will be taken to allow password reset flow to complete.`);
        // Do nothing to let password reset flow complete without interruption
    } else if (!session && lastUserId) {
      console.log('❌ Session lost, signing out.');
      setUser(null);
      lastSessionRef.current = null;
    }
  } catch (error) {
    console.error('❌ Auth state change error:', error);
    if (event === 'SIGNED_OUT' || !session) {
      setUser(null);
      lastSessionRef.current = null;
    }
  }
};