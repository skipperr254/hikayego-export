import React from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Flame,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Library,
  Shield,
  MoreHorizontal,
  Info,
  Newspaper,
  Mail,
  ChevronDown,
  PanelLeftClose,
  PanelRightClose,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeProvider';

const NavItem = ({ to, icon: Icon, children, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={to}
              className={cn(
                'flex items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent',
                isActive && 'bg-primary/10 text-primary'
              )}
            >
              <Icon className="h-5 w-5" />
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            <p>{children}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <NavLink
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-4 py-2.5 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent',
        isActive && 'bg-primary/10 text-primary font-semibold'
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="truncate">{children}</span>
    </NavLink>
  );
};

const CollapsibleMenu = ({ label, icon: Icon, children, isCollapsed }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  if (isCollapsed) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn(
              'flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-accent'
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" className="ml-2">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
          <Icon className="h-5 w-5" />
          <span className="flex-grow text-left truncate">{label}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="top" align="start">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ThemeSwitcher = ({ isCollapsed }) => {
  const { theme, setTheme } = useTheme();
  
  if (isCollapsed) {
    return (
      <div className="flex justify-center items-center py-2">
        <Switch
          checked={theme === 'dark'}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          aria-label="Toggle theme"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg p-2 bg-secondary">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sun className={cn('h-5 w-5', theme === 'light' && 'text-primary')} />
        <span className="flex-1 text-center">Tema</span>
      </div>
      <Switch
        checked={theme === 'dark'}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label="Toggle theme"
      />
    </div>
  );
};

const Sidebar = ({ isCollapsed, setCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLogoutAlertOpen, setIsLogoutAlertOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
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
  };

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Keşfet', section: 'Genel Bakış' },
    { to: '/activities', icon: Flame, label: 'Aktiviteler', section: 'Genel Bakış' },
    { to: '/lessons', icon: ClipboardList, label: 'Dersler', section: 'Genel Bakış' },
    { to: '/library', icon: Library, label: 'Kitaplığım', section: 'Kitaplığım' },
    { to: '/community', icon: Users, label: 'Topluluk', section: 'Sosyal' },
  ];

  const groupedNavItems = navItems.reduce((acc, item) => {
    (acc[item.section] = acc[item.section] || []).push(item);
    return acc;
  }, {});

  return (
    <>
      <aside className={cn(
        "fixed left-0 top-0 z-40 hidden h-full flex-col border-r bg-background lg:flex transition-all duration-300 ease-in-out",
        isCollapsed ? 'w-20' : 'w-64'
      )}>
        <div className={cn("flex h-20 items-center border-b px-4", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <Link to="/">
              <Logo className="h-10" isCollapsed={isCollapsed} />
            </Link>
          )}
           <Button variant="ghost" size="icon" onClick={() => setCollapsed(!isCollapsed)}>
            {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <nav className="flex-1 space-y-1 p-2">
            {Object.entries(groupedNavItems).map(([section, items]) => (
              <div key={section}>
                {!isCollapsed && (
                  <p className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground/60">{section}</p>
                )}
                {items.map(item => (
                  <NavItem key={item.to} to={item.to} icon={item.icon} isCollapsed={isCollapsed}>
                    {item.label}
                  </NavItem>
                ))}
              </div>
            ))}
          </nav>
          <div className="mt-auto p-2 space-y-1">
             <CollapsibleMenu label="Diğer" icon={MoreHorizontal} isCollapsed={isCollapsed}>
                <DropdownMenuItem onClick={() => navigate('/about')}>
                  <Info className="mr-2 h-4 w-4" />
                  <span>Hakkımızda</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/blog')}>
                  <Newspaper className="mr-2 h-4 w-4" />
                  <span>Blog</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/contact')}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>İletişim</span>
                </DropdownMenuItem>
              </CollapsibleMenu>
            
            {(user?.role === 'admin' || user?.role === 'content_creator') && (
              <NavItem to="/admin" icon={Shield} isCollapsed={isCollapsed}>Yönetim Paneli</NavItem>
            )}
            <NavItem to="/settings" icon={Settings} isCollapsed={isCollapsed}>Ayarlar</NavItem>
            
            <ThemeSwitcher isCollapsed={isCollapsed} />

            {isCollapsed ? (
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                     <button
                      onClick={() => setIsLogoutAlertOpen(true)}
                      className="flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-destructive transition-colors duration-200 hover:bg-destructive/10"
                    >
                      <LogOut className="h-5 w-5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" align="center">
                    <p>Çıkış Yap</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
               <button
                onClick={() => setIsLogoutAlertOpen(true)}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-destructive transition-colors duration-200 hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Çıkış Yap</span>
              </button>
            )}
          </div>
        </div>
      </aside>
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

export default Sidebar;