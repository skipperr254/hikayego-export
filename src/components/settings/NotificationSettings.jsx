import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Mail, Trophy, BookOpen, Clock, Megaphone } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import AutoSaveIndicator from './AutoSaveIndicator';
import SettingsSkeleton from './SettingsSkeleton';

const NotificationSettings = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const saveTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const lastFailedSettings = useRef(null);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyProgress: true,
    newStories: true,
    achievements: true,
    reminders: false,
    marketing: false
  });

  useEffect(() => {
    let isMounted = true;
    const loadNotificationSettings = async () => {
      if (!user?.id) return;
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('notification_settings')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;

        if (isMounted && data?.notification_settings) {
          setNotifications(prev => ({ ...prev, ...data.notification_settings }));
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadNotificationSettings();
    return () => { isMounted = false; };
  }, [user]);

  const handleSaveNotifications = useCallback(async (settingsToSave) => {
    if (!user?.id) return;
    setSaveStatus('saving');
    
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: settingsToSave,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      updateUser({ notification_settings: settingsToSave });
      setSaveStatus('success');
      lastFailedSettings.current = null;

      hideTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setSaveStatus('error');
      lastFailedSettings.current = settingsToSave;
      hideTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 5000);
    }
  }, [user, updateUser]);

  const handleNotificationChange = (key, value) => {
    const newSettings = { ...notifications, [key]: value };
    setNotifications(newSettings);
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      handleSaveNotifications(newSettings);
    }, 500);
  };

  const handleRetry = () => {
    if (lastFailedSettings.current) {
      handleSaveNotifications(lastFailedSettings.current);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const notificationOptions = [
    { key: 'emailNotifications', title: 'E-posta Bildirimleri', description: 'Önemli güncellemeler ve bildirimler için e-posta al', icon: Mail },
    { key: 'pushNotifications', title: 'Anlık Bildirimler', description: 'Tarayıcı bildirimleri ve anlık uyarılar (Yakında!)', icon: Bell, disabled: true },
    { key: 'weeklyProgress', title: 'Haftalık İlerleme Raporu', description: 'Haftalık öğrenme istatistiklerin ve başarıların', icon: Trophy },
    { key: 'newStories', title: 'Yeni Hikaye Bildirimleri', description: 'Yeni hikayeler eklendiğinde bildirim al', icon: BookOpen },
    { key: 'achievements', title: 'Başarı Bildirimleri', description: 'Yeni rozetler ve başarılar kazandığında bildirim al', icon: Trophy },
    { key: 'reminders', title: 'Öğrenme Hatırlatıcıları', description: 'Düzenli öğrenme için günlük hatırlatıcılar', icon: Clock },
    { key: 'marketing', title: 'Pazarlama E-postaları', description: 'Özel teklifler ve kampanya bildirimleri', icon: Megaphone }
  ];

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <>
      <Card className="transition-all duration-300 hover:shadow-md border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Bell className="mr-3 h-6 w-6 text-primary" />
            Bildirim Ayarları
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {notificationOptions.map((option) => {
              const Icon = option.icon;
              const isChecked = notifications[option.key];
              
              return (
                <div 
                  key={option.key} 
                  className={`flex items-center justify-between p-4 border rounded-xl transition-all duration-300 ${isChecked ? 'bg-primary/5 border-primary/20' : 'bg-card border-border/50 hover:border-border'} ${option.disabled ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${isChecked ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'} transition-colors duration-300`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 mt-0.5">
                      <Label 
                        htmlFor={option.key} 
                        className={`text-base font-semibold ${option.disabled ? 'cursor-not-allowed' : 'cursor-pointer'} transition-colors duration-300`}
                      >
                        {option.title}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  </div>
                  <Switch
                    id={option.key}
                    checked={isChecked}
                    onCheckedChange={(checked) => handleNotificationChange(option.key, checked)}
                    disabled={option.disabled || saveStatus === 'saving'}
                    className="data-[state=checked]:bg-primary shrink-0"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      <AutoSaveIndicator status={saveStatus} onRetry={handleRetry} />
    </>
  );
};

export default NotificationSettings;