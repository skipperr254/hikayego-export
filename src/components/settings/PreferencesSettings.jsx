import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeProvider';
import { Palette, Volume2, Type, Globe, Zap, Shield, Smile, Moon, Sun } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useQueryClient } from '@tanstack/react-query';
import { storyKeys } from '@/lib/queryKeys';
import AutoSaveIndicator from './AutoSaveIndicator';
import SettingsSkeleton from './SettingsSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

const PreferencesSettings = () => {
  const { user, profile, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const saveTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const lastFailedState = useRef(null);

  const [preferences, setPreferences] = useState({
    language: 'tr',
    fontSize: [16],
    readingSpeed: [1],
    autoPlay: true,
    soundEffects: true,
    animations: true,
    compactMode: false,
    showTranslations: true,
    highlightWords: true,
    preventAccidentalClicks: false
  });
  const [isKidAccount, setIsKidAccount] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    if (profile) {
      if (isMounted) {
        if (profile.preferences) {
          setPreferences(prev => ({
            ...prev,
            ...profile.preferences,
            fontSize: Array.isArray(profile.preferences.fontSize) ? profile.preferences.fontSize : [16],
            readingSpeed: Array.isArray(profile.preferences.readingSpeed) ? profile.preferences.readingSpeed : [1],
          }));
        }
        setIsKidAccount(profile.is_kid_account || false);
        setIsLoading(false);
      }
    } else if (user) {
      // Wait a moment in case profile is still fetching
      const timer = setTimeout(() => {
        if (isMounted) setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
    
    return () => { isMounted = false; };
  }, [profile, user]);

  const handleSavePreferences = useCallback(async (prefsToSave, kidAccountToSave) => {
    if (!user?.id) return;
    setSaveStatus('saving');

    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          preferences: prefsToSave,
          is_kid_account: kidAccountToSave,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      const previousKidAccountStatus = profile?.is_kid_account;
      updateUser({ preferences: prefsToSave, is_kid_account: kidAccountToSave });

      if (previousKidAccountStatus !== kidAccountToSave) {
        await queryClient.invalidateQueries({ queryKey: storyKeys.dashboard(user.id) });
      }

      setSaveStatus('success');
      lastFailedState.current = null;

      hideTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving preferences:', error);
      setSaveStatus('error');
      lastFailedState.current = { prefs: prefsToSave, kidAccount: kidAccountToSave };
      hideTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    }
  }, [user, profile, updateUser, queryClient]);

  const triggerAutoSave = (newPrefs, newKidAccount) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      handleSavePreferences(newPrefs, newKidAccount);
    }, 500);
  };

  const handlePreferenceChange = (key, value) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    triggerAutoSave(newPrefs, isKidAccount);
  };

  const handleKidAccountChange = (checked) => {
    setIsKidAccount(checked);
    triggerAutoSave(preferences, checked);
  };

  const handleThemeToggle = (checked) => {
    setTheme(checked ? 'dark' : 'light');
  };

  const handleRetry = () => {
    if (lastFailedState.current) {
      handleSavePreferences(lastFailedState.current.prefs, lastFailedState.current.kidAccount);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const isDarkMode = theme === 'dark';

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-md border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Palette className="mr-3 h-6 w-6 text-primary" />
            Görünüm ve Tercihler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Theme Toggle Section */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className={`flex items-center justify-between p-5 border-2 rounded-2xl transition-all duration-300 ${isDarkMode ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-card border-border/50 hover:border-border'}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-amber-500/20 text-amber-500'} transition-colors duration-300 flex items-center justify-center`}>
                  <AnimatePresence mode="wait" initial={false}>
                    {isDarkMode ? (
                      <motion.div 
                        key="moon" 
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }} 
                        animate={{ rotate: 0, opacity: 1, scale: 1 }} 
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }} 
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="h-6 w-6" />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="sun" 
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }} 
                        animate={{ rotate: 0, opacity: 1, scale: 1 }} 
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }} 
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-6 w-6" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="theme-toggle" className="text-lg font-bold cursor-pointer transition-colors duration-300 block">
                    Karanlık Mod
                  </Label>
                  <p className="text-sm text-muted-foreground font-medium">Göz yormayan koyu tema</p>
                </div>
              </div>
              <Switch
                id="theme-toggle"
                checked={isDarkMode}
                onCheckedChange={handleThemeToggle}
                className="data-[state=checked]:bg-indigo-500 shrink-0 scale-110 mr-2"
              />
            </motion.div>

            {/* Kid Mode Section */}
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className={`p-5 border-2 rounded-2xl transition-all duration-300 flex items-center justify-between ${isKidAccount ? 'bg-amber-500/10 border-amber-500/30 dark:bg-amber-500/5 dark:border-amber-500/20' : 'bg-card border-border/50 hover:border-border'}`}
            >
               <div className="flex items-start space-x-4">
                 <div className={`p-2.5 rounded-xl ${isKidAccount ? 'bg-amber-500/20 text-amber-500' : 'bg-secondary text-muted-foreground'} transition-colors duration-300 flex items-center justify-center`}>
                   <Smile className="h-6 w-6" />
                 </div>
                 <div className="space-y-1 pr-2">
                   <Label htmlFor="isKidAccount" className={`text-lg font-bold cursor-pointer transition-colors duration-300 block ${isKidAccount ? 'text-amber-600 dark:text-amber-500' : ''}`}>
                     Çocuk Görünümü
                   </Label>
                   <p className="text-sm text-muted-foreground font-medium">Sadece çocuklar için uygun içerikler</p>
                 </div>
               </div>
               <Switch
                 id="isKidAccount"
                 checked={isKidAccount}
                 onCheckedChange={handleKidAccountChange}
                 disabled={saveStatus === 'saving'}
                 className="data-[state=checked]:bg-amber-500 shrink-0 scale-110 mr-2"
               />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* General Preferences */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center text-base font-semibold">
                  <Globe className="mr-2 h-5 w-5 text-primary/70" />
                  Uygulama Dili
                </Label>
                <Select 
                  value={preferences.language} 
                  onValueChange={(value) => handlePreferenceChange('language', value)}
                  disabled={saveStatus === 'saving'}
                >
                  <SelectTrigger className="h-12 rounded-xl bg-secondary/30">
                    <SelectValue placeholder="Dil seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">🇹🇷 Türkçe</SelectItem>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center justify-between text-base font-semibold">
                  <span className="flex items-center"><Type className="mr-2 h-5 w-5 text-primary/70" /> Yazı Boyutu</span>
                  <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md">{preferences.fontSize[0]}px</span>
                </Label>
                <Slider
                  value={preferences.fontSize}
                  onValueChange={(value) => handlePreferenceChange('fontSize', value)}
                  max={24}
                  min={12}
                  step={1}
                  className="w-full"
                  disabled={saveStatus === 'saving'}
                />
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>A (Küçük)</span>
                  <span className="text-base">A (Büyük)</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center justify-between text-base font-semibold">
                  <span className="flex items-center"><Zap className="mr-2 h-5 w-5 text-primary/70" /> Okuma Hızı</span>
                  <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md">{preferences.readingSpeed[0]}x</span>
                </Label>
                <Slider
                  value={preferences.readingSpeed}
                  onValueChange={(value) => handlePreferenceChange('readingSpeed', value)}
                  max={2}
                  min={0.5}
                  step={0.1}
                  className="w-full"
                  disabled={saveStatus === 'saving'}
                />
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Yavaş</span>
                  <span>Hızlı</span>
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center text-base border-b pb-2">
                  <Volume2 className="mr-2 h-5 w-5 text-primary/70" />
                  Ses & Medya
                </h4>
                
                <div className="flex items-center justify-between group">
                  <div>
                    <Label htmlFor="autoPlay" className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">Otomatik Ses Çalma</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelimelere tıkladığında otomatik telaffuz</p>
                  </div>
                  <Switch id="autoPlay" checked={preferences.autoPlay} onCheckedChange={(c) => handlePreferenceChange('autoPlay', c)} disabled={saveStatus === 'saving'} />
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <Label htmlFor="soundEffects" className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">Ses Efektleri</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Başarı ve etkileşim sesleri</p>
                  </div>
                  <Switch id="soundEffects" checked={preferences.soundEffects} onCheckedChange={(c) => handlePreferenceChange('soundEffects', c)} disabled={saveStatus === 'saving'} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center text-base border-b pb-2">
                  Arayüz & Okuma
                </h4>
                
                <div className="flex items-center justify-between group">
                  <div>
                    <Label htmlFor="animations" className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">Animasyonlar</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Görsel geçişler ve etkileşimler</p>
                  </div>
                  <Switch id="animations" checked={preferences.animations} onCheckedChange={(c) => handlePreferenceChange('animations', c)} disabled={saveStatus === 'saving'} />
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <Label htmlFor="compactMode" className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">Kompakt Mod</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Daha az boşluk, daha çok içerik</p>
                  </div>
                  <Switch id="compactMode" checked={preferences.compactMode} onCheckedChange={(c) => handlePreferenceChange('compactMode', c)} disabled={saveStatus === 'saving'} />
                </div>
                
                <div className="flex items-center justify-between group">
                  <div>
                    <Label htmlFor="preventAccidentalClicks" className="text-sm font-semibold flex items-center cursor-pointer group-hover:text-primary transition-colors">
                      <Shield className="mr-1.5 h-4 w-4 text-blue-500" />
                      Dokunma Koruması
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Mobilde yanlışlıkla menüleri engelle</p>
                  </div>
                  <Switch id="preventAccidentalClicks" checked={preferences.preventAccidentalClicks} onCheckedChange={(c) => handlePreferenceChange('preventAccidentalClicks', c)} disabled={saveStatus === 'saving'} />
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <Label htmlFor="showTranslations" className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">Çevirileri Göster</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Kelime çevirilerini otomatik göster</p>
                  </div>
                  <Switch id="showTranslations" checked={preferences.showTranslations} onCheckedChange={(c) => handlePreferenceChange('showTranslations', c)} disabled={saveStatus === 'saving'} />
                </div>

                <div className="flex items-center justify-between group">
                  <div>
                    <Label htmlFor="highlightWords" className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">Kelime Vurgulama</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Tıklanan kelimeleri vurgula</p>
                  </div>
                  <Switch id="highlightWords" checked={preferences.highlightWords} onCheckedChange={(c) => handlePreferenceChange('highlightWords', c)} disabled={saveStatus === 'saving'} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AutoSaveIndicator status={saveStatus} onRetry={handleRetry} />
    </>
  );
};

export default PreferencesSettings;