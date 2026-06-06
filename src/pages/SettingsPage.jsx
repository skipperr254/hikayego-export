import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Seo from '@/components/Seo';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import ProfileSettings from '@/components/settings/ProfileSettings';
import PasswordSettings from '@/components/settings/PasswordSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import PreferencesSettings from '@/components/settings/PreferencesSettings';
import { Routes, Route, Navigate, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { User, Shield, Bell, Palette, Crown, LogOut, Settings as SettingsIcon, LifeBuoy, FileText, Send, Lock, Mail } from 'lucide-react';
import SubscriptionManagement from '@/components/settings/SubscriptionManagement';

const settingsRoutes = [
  { path: '/', element: <ProfileSettings />, icon: User, label: 'Profil' },
  { path: 'security', element: <PasswordSettings />, icon: Shield, label: 'Güvenlik' },
  { path: 'notifications', element: <NotificationSettings />, icon: Bell, label: 'Bildirimler' },
  { path: 'appearance', element: <PreferencesSettings />, icon: Palette, label: 'Görünüm' },
  { path: 'subscription', element: <SubscriptionManagement />, icon: Crown, label: 'Abonelik', desktopOnly: true },
];

const mobileSettingsRoutes = [
    { path: 'security', element: <PasswordSettings />, icon: Shield, label: 'Güvenlik' },
    { path: 'notifications', element: <NotificationSettings />, icon: Bell, label: 'Bildirimler' },
    { path: 'appearance', element: <PreferencesSettings />, icon: Palette, label: 'Görünüm' },
];

const QuickLinkButton = React.memo(({ to, icon: Icon, children }) => {
    const navigate = useNavigate();
    const handleClick = useCallback(() => {
      navigate(to);
    }, [navigate, to]);
    
    return (
        <Button variant="outline" className="w-full justify-start h-14 text-base" onClick={handleClick}>
            <Icon className="mr-3 h-5 w-5 text-primary" />
            {children}
        </Button>
    );
});

QuickLinkButton.displayName = 'QuickLinkButton';

const SettingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const { logout } = useAuth();
  const { toast } = useToast();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: 'Başarıyla çıkış yapıldı',
        description: 'Görüşmek üzere! 👋',
      });
    } catch (error) {
      toast({
        title: 'Çıkış yapılamadı',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [logout, navigate, toast]);

  const handleSheetLinkClick = useCallback(() => {
    setIsSheetOpen(false);
  }, []);

  const MobileSettings = useCallback(() => (
    <div className="min-h-screen pb-24">
      <header className="flex items-center justify-between p-4 border-b bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <SettingsIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle>Ayarlar</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-2 mt-6">
              {mobileSettingsRoutes.map((item) => (
                <NavLink key={item.path} to={`/settings/${item.path}`} end>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full justify-start gap-3 text-base h-12"
                      onClick={handleSheetLinkClick}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Button>
                  )}
                </NavLink>
              ))}
              <div className="pt-4 mt-4 border-t">
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="text-xs text-muted-foreground leading-relaxed">
                    Uygulama içinden plan/hesap işlemleri desteklenmiyor. Lütfen masaüstünden devam edin. Gerekirse bizimle iletişime geçin:{' '}
                    <span className="font-medium inline-flex items-center gap-1 mt-1 text-primary">
                      <Mail className="h-3 w-3" />
                      contact@hikayego.com
                    </span>
                  </div>
                </div>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold">
            <NavLink to="/settings">Profil</NavLink>
        </h1>
        <Button variant="ghost" size="icon" onClick={() => setIsLogoutAlertOpen(true)}>
          <LogOut className="h-6 w-6 text-destructive" />
        </Button>
      </header>
      
      <main className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                      <>
                          <ProfileSettings />
                          <div className="mt-8 space-y-3">
                              <QuickLinkButton to="/help-center" icon={LifeBuoy}>Sıkça Sorulan Sorular</QuickLinkButton>
                              <QuickLinkButton to="/terms-of-service" icon={FileText}>Kullanım Koşulları</QuickLinkButton>
                              <QuickLinkButton to="/privacy-policy" icon={Lock}>Gizlilik Sözleşmesi</QuickLinkButton>
                              <QuickLinkButton to="/contact" icon={Send}>Bize Ulaşın</QuickLinkButton>
                          </div>
                      </>
                  } />
                  {mobileSettingsRoutes.map(({ path, element }) => (
                      <Route key={path} path={path} element={element} />
                  ))}
                  <Route path="subscription" element={<Navigate to="/settings" replace />} />
                  <Route path="*" element={<Navigate to="/settings" replace />} />
              </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  ), [isSheetOpen, location, handleSheetLinkClick]);

  const DesktopSettings = useCallback(() => (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        <SettingsSidebar />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Routes location={location} key={location.pathname}>
                {settingsRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
                <Route path="*" element={<Navigate to="/settings" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  ), [location]);

  const currentView = useMemo(() => {
    return isMobile ? <MobileSettings /> : <DesktopSettings />;
  }, [isMobile, MobileSettings, DesktopSettings]);

  return (
    <>
      <Seo
        title="Ayarlar"
        description="HikayeGO hesap ayarlarınızı yönetin. Profil, güvenlik, bildirimler ve abonelik ayarlarınızı buradan düzenleyebilirsiniz."
      />
      <div className="min-h-screen bg-background">
        {currentView}
      </div>
      <AlertDialog open={isLogoutAlertOpen} onOpenChange={setIsLogoutAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Çıkış yapmak istediğine emin misin?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem mevcut oturumunu sonlandıracak ve seni ana sayfaya yönlendirecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Çıkış Yap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SettingsPage;