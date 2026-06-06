import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Compass, Flame, GraduationCap, User, Library } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const NavItem = ({ to, icon: Icon, label, isActive, onClick, isProfile = false, avatarUrl, avatarFallback }) => {
  return (
    <div
      onClick={() => onClick(to)}
      className={cn(
        "relative flex-1 flex flex-col items-center justify-center h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg cursor-pointer",
        "tap-highlight-transparent"
      )}
      role="button"
      tabIndex={0}
      aria-current={isActive ? 'page' : undefined}
    >
      <motion.div
        className="relative flex flex-col items-center justify-center gap-1 w-full h-full p-1"
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      >
        {isProfile ? (
          <Avatar className={cn(
            "h-7 w-7 transition-all duration-200 ease-in-out",
            isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "group-hover:ring-1 group-hover:ring-muted-foreground"
          )}>
            <AvatarImage src={avatarUrl} alt={label} />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        ) : (
          <Icon className={cn(
            "h-6 w-6 transition-all duration-200 ease-in-out",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )} strokeWidth={isActive ? 2.5 : 2} />
        )}
        <span className={cn(
          "text-[11px] font-medium transition-all duration-200 ease-in-out",
          isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )}>
          {label}
        </span>
      </motion.div>
    </div>
  );
};


const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  const [isExitConfirmOpen, setIsExitConfirmOpen] = React.useState(false);
  const [nextPath, setNextPath] = React.useState(null);

  const handleNavigation = (path) => {
    if (location.pathname === path) return;
    
    if (location.pathname.startsWith('/quiz')) {
      setNextPath(path);
      setIsExitConfirmOpen(true);
    } else {
      navigate(path, { state: { from: 'navigation' } });
    }
  };

  const proceedWithNavigation = () => {
    if (nextPath) {
      navigate(nextPath, { state: { from: 'navigation' } });
    }
    setIsExitConfirmOpen(false);
    setNextPath(null);
  };

  const cancelNavigation = () => {
    setIsExitConfirmOpen(false);
    setNextPath(null);
  };

  const shouldShowOnboarding = React.useMemo(() => {
    if (authLoading || !profile) return false;
    const hasCompletedOnboarding = profile.preferences?.onboardingComplete === true;
    const hasKidAccountSet = profile.is_kid_account !== null && profile.is_kid_account !== undefined;
    return !hasCompletedOnboarding || !hasKidAccountSet;
  }, [profile, authLoading]);

  const noNavRoutes = ['/story', '/quiz', '/quiz/setup', '/subscription/iyzico-checkout'];
  const shouldHideNav = noNavRoutes.some(path => location.pathname.startsWith(path)) || shouldShowOnboarding;

  const displayName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Kullanıcı';
  const avatarUrl = profile?.avatar_url || user?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.id}`;

  const navItems = [
    { to: '/dashboard', icon: Compass, label: 'Keşfet' },
    { to: '/lessons', icon: GraduationCap, label: 'Dersler' },
    { to: '/activities', icon: Flame, label: 'Aktivite' },
    { to: '/library', icon: Library, label: 'Kitaplık' },
    { 
      to: '/settings', 
      icon: User, 
      label: 'Profil',
      isProfile: true,
      avatarUrl: avatarUrl,
      avatarFallback: displayName.charAt(0)
    },
  ];

  return (
    <>
      <AnimatePresence>
        {!shouldHideNav && (
          <motion.nav
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 40 }}
            className="fixed bottom-0 left-0 right-0 h-[calc(4.5rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] z-50 border-t bg-background/95 backdrop-blur-lg lg:hidden"
          >
            <div className="flex items-start justify-around h-full w-full max-w-md mx-auto px-2 pt-2">
              {navItems.map((item) => (
                <NavItem 
                  key={item.to} 
                  {...item} 
                  isActive={location.pathname.startsWith(item.to)}
                  onClick={handleNavigation} 
                />
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <AlertDialog open={isExitConfirmOpen} onOpenChange={setIsExitConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quiz'den ayrılmak istediğine emin misin?</AlertDialogTitle>
            <AlertDialogDescription>
              Mevcut ilerlemen kaydedilmeyecek. Yine de devam etmek istiyor musun?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigation}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithNavigation} className="bg-destructive hover:bg-destructive/90">Ayrıl</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MobileBottomNav;