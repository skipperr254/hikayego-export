import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings, Library, Flame, Crown, Rocket, ChevronDown, Youtube, Shield, LayoutDashboard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Logo from '@/components/Logo';

const Navbar = React.memo(() => {
  const {
    user,
    logout,
    canAccessPremiumFeatures,
    subscriptionStatus,
    profile
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    toast
  } = useToast();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);
  const [nextPath, setNextPath] = useState(null);
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const handleGuardedNavigation = (path, e) => {
    if (e) e.preventDefault();
    if (isMenuOpen) setIsMenuOpen(false);
    if (location.pathname.startsWith('/quiz')) {
      setNextPath(path);
      setIsExitConfirmOpen(true);
    } else {
      navigate(path);
    }
  };

  const proceedWithNavigation = () => {
    if (nextPath) {
      navigate(nextPath);
    }
    setIsExitConfirmOpen(false);
    setNextPath(null);
  };

  const cancelNavigation = () => {
    setIsExitConfirmOpen(false);
    setNextPath(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      toast({
        title: "Başarıyla çıkış yapıldı",
        description: "Görüşmek üzere! 👋"
      });
    } catch (error) {
      toast({
        title: "Çıkış yapılamadı",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const navLinkClass = ({
    isActive
  }) => cn('group flex items-center gap-x-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 hover:bg-accent hover:shadow-inner', isActive ? 'bg-accent text-accent-foreground shadow-inner' : 'text-muted-foreground');

  const iconVariants = {
    rest: {
      y: 0,
      rotate: 0
    },
    hover: {
      y: -2,
      rotate: -5,
      scale: 1.1
    }
  };

  const avatarUrl = profile?.avatar_url || user?.avatar_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.email}`;
  const displayName = profile?.name || user?.name || 'Kullanıcı';
  const displayEmail = user?.email;
  const fallbackName = displayName || displayEmail;

  const renderGuestButtons = () => {
    if (isMobile) {
      return <Link to="/login" onClick={e => handleGuardedNavigation('/login', e)}>
          <Button size="sm" className="rounded-full font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white shadow-lg shadow-primary/30 flex items-center px-4">
            <span>Giriş Yap</span>
          </Button>
        </Link>;
    }
    return <>
        <Link to="/login" onClick={e => handleGuardedNavigation('/login', e)}>
          <Button variant="ghost" size="sm" className="rounded-full">
            Giriş Yap
          </Button>
        </Link>
        <Link to="/login" onClick={e => handleGuardedNavigation('/login', e)}>
          <Button asChild size="sm" className="rounded-full font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50">
            <motion.div whileHover="hover" className="flex items-center cursor-pointer px-3">
              <motion.div variants={{
              hover: {
                rotate: -25,
                x: -3,
                y: -3,
                scale: 1.1
              }
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}>
                <Rocket className="mr-2 h-4 w-4" />
              </motion.div>
              <span>Ücretsiz Başla</span>
            </motion.div>
          </Button>
        </Link>
      </>;
  };

  return <>
      <motion.nav initial={{
      y: -100
    }} animate={{
      y: 0
    }} transition={{
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: 0.2
    }} className="sticky top-0 z-40 w-full border-b bg-background/80 shadow-sm backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" onClick={e => handleGuardedNavigation('/', e)} className="flex items-center space-x-1 group">
            <Logo className="w-36 md:w-40" />
          </Link>

          {user && !isMobile && <div className="hidden md:flex items-center gap-1 rounded-full bg-secondary/50 p-1 shadow-inner">
              <NavLink to="/dashboard" onClick={e => handleGuardedNavigation('/dashboard', e)} className={navLinkClass}>
                <motion.div variants={iconVariants} initial="rest" whileHover="hover">
                  <LayoutDashboard className="h-5 w-5 text-primary" />
                </motion.div>
                <span>Keşfet</span>
              </NavLink>
              <NavLink to="/activities" onClick={e => handleGuardedNavigation('/activities', e)} className={navLinkClass}>
                <motion.div variants={iconVariants} initial="rest" whileHover="hover">
                  <Flame className="h-5 w-5 text-primary" />
                </motion.div>
                <span>Aktiviteler</span>
              </NavLink>
              {canAccessPremiumFeatures && <NavLink to="/library" onClick={e => handleGuardedNavigation('/library', e)} className={navLinkClass}>
                    <motion.div variants={iconVariants} initial="rest" whileHover="hover">
                        <Library className="h-5 w-5 text-primary" />
                    </motion.div>
                    <span>Kitaplığım</span>
                </NavLink>}
              <NavLink to="/lessons" onClick={e => handleGuardedNavigation('/lessons', e)} className={navLinkClass}>
                <motion.div variants={iconVariants} initial="rest" whileHover="hover">
                  <Youtube className="h-5 w-5 text-primary" />
                </motion.div>
                <span>Dersler</span>
              </NavLink>
            </div>}

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            
            {user ? <div className="flex items-center gap-2">
                {!canAccessPremiumFeatures && !isMobile && <Tooltip>
                    <TooltipTrigger asChild>
                      <Button asChild size="icon" variant="ghost" className="rounded-full group">
                        <Link to="/subscription">
                          <Crown className="h-5 w-5 text-amber-400 transition-all duration-300 group-hover:text-amber-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Premium'a geç</p>
                    </TooltipContent>
                  </Tooltip>}
                <div className="hidden md:block">
                   <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                    <DropdownMenuTrigger asChild>
                      <motion.button whileTap={{
                    scale: 0.95
                  }} className="flex items-center gap-1 rounded-full p-1 pr-2 transition-colors duration-300 hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background">
                        <div className="relative">
                          <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-primary/50 transition-colors">
                            <AvatarImage src={avatarUrl} alt={displayName} />
                            <AvatarFallback className="font-bold bg-gradient-to-br from-primary to-purple-600 text-white">
                              {fallbackName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {canAccessPremiumFeatures && <motion.div initial={{
                        scale: 0
                      }} animate={{
                        scale: 1
                      }} transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 15,
                        delay: 0.5
                      }} className="absolute -bottom-1 -right-1 z-10 bg-background p-0.5 rounded-full">
                              <Crown className="h-3 w-3 text-amber-400" fill="currentColor" />
                            </motion.div>}
                        </div>
                        <motion.div animate={{
                      rotate: isMenuOpen ? 180 : 0
                    }}>
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal p-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={avatarUrl} alt={displayName} />
                            <AvatarFallback>
                              {fallbackName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col space-y-1 overflow-hidden">
                            <p className="text-sm font-medium leading-none truncate">{displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground truncate">
                              {displayEmail}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-1">
                        {canAccessPremiumFeatures && <div className="px-2 py-1.5">
                            <Badge variant="premium" className="w-full justify-center text-xs capitalize">
                              <Crown className="mr-2 h-3 w-3" /> 
                              {subscriptionStatus === 'trial' ? 'Deneme Üye' : 'Premium Üye'}
                            </Badge>
                          </div>}
                        {user.role === 'admin' && <div className="px-2 py-1.5">
                            <Badge variant="destructive" className="w-full justify-center text-xs">
                              Yönetici
                            </Badge>
                          </div>}
                         {user.role === 'content_creator' && <div className="px-2 py-1.5">
                            <Badge variant="secondary" className="w-full justify-center text-xs">
                              İçerik Yöneticisi
                            </Badge>
                          </div>}
                      </div>
                      {(canAccessPremiumFeatures || user.role === 'admin' || user.role === 'content_creator') && <DropdownMenuSeparator />}
                      <div className="p-1">
                        <DropdownMenuItem onSelect={() => handleGuardedNavigation('/settings')} className={cn(location.pathname.startsWith('/settings') && 'bg-accent font-semibold')}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Ayarlar</span>
                        </DropdownMenuItem>
                        {(user.role === 'admin' || user.role === 'content_creator') && <DropdownMenuItem onSelect={() => handleGuardedNavigation('/admin')} className={cn(location.pathname.startsWith('/admin') && 'bg-accent font-semibold')}>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Yönetim Paneli</span>
                          </DropdownMenuItem>}
                      </div>
                      <DropdownMenuSeparator />
                      <div className="p-1">
                        <DropdownMenuItem onSelect={e => {
                      e.preventDefault();
                      setIsLogoutAlertOpen(true);
                    }} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Çıkış Yap</span>
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div> : <div className="flex items-center gap-2">
                {renderGuestButtons()}
              </div>}
          </div>
        </div>
      </motion.nav>

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

      <AlertDialog open={isExitConfirmOpen} onOpenChange={setIsExitConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quiz'den ayrılmak istediğinize emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Mevcut ilerlemeniz kaydedilmeyecek. Yine de devam etmek istiyor musunuz?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigation}>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={proceedWithNavigation} className="bg-destructive hover:bg-destructive/90">Ayrıl</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>;
});

export default Navbar;