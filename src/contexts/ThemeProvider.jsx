import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const ThemeProviderContext = createContext({
  theme: 'light',
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme',
  ...props
}) {
  const { user, updateUser, profile, loading: authLoading } = useAuth();
  const [theme, setThemeState] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme
  );
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);
  
  useEffect(() => {
    if (authLoading || !user || !profile?.preferences?.theme) return;
    
    const dbTheme = profile.preferences.theme;
    if (dbTheme !== theme) {
        setThemeState(dbTheme);
    }
  }, [user, profile?.preferences?.theme, authLoading]);
  
  
  const setTheme = useCallback(async (newTheme) => {
    if (!['light', 'dark'].includes(newTheme)) return;
  
    setThemeState(newTheme);
    
    if (user?.id) {
      try {
        const currentPreferences = profile?.preferences || {};
        if (currentPreferences.theme === newTheme) return;

        const updatedPreferences = { ...currentPreferences, theme: newTheme };
        
        // Optimistically update the local state first
        updateUser({ preferences: updatedPreferences });
        
        const { error } = await supabase
          .from('profiles')
          .update({ preferences: updatedPreferences })
          .eq('id', user.id);
  
        if (error) {
           // Revert on error
           updateUser({ preferences: currentPreferences });
           throw error;
        }
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  }, [user, profile, updateUser]);

  const value = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};