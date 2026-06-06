import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import MobileBottomNav from '@/components/MobileBottomNav';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import ProfileCard from '@/components/layout/ProfileCard';
import { cn } from '@/lib/utils';
import useLocalStorage from '@/hooks/useLocalStorage';

const AppLayout = () => {
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const isSmallDesktop = useMediaQuery('(min-width: 1024px) and (max-width: 1180px)');
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useLocalStorage('sidebarCollapsed', false);
  const [isProfileCollapsed, setIsProfileCollapsed] = useLocalStorage('profileCollapsed', isSmallDesktop);
  
  useEffect(() => {
    if (isSmallDesktop) {
      setIsProfileCollapsed(true);
    }
  }, [isSmallDesktop, setIsProfileCollapsed]);

  const noProfileCardRoutes = [
    '/admin', '/settings', '/activities', '/lessons', 
    '/library', '/community', 
    '/subscription', '/quiz', '/quiz/setup',
  ];
  const showProfileCard = !isMobile && !noProfileCardRoutes.some(path => location.pathname.startsWith(path));
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="flex min-h-screen bg-secondary/40" />; 
  }

  if (isMobile) {
    return (
      <div className="flex flex-col min-h-screen bg-secondary/40">
        <main className="flex-1 pb-24">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <Outlet />
          </div>
        </main>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary/40">
      <Sidebar isCollapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "ml-20" : "ml-64",
          showProfileCard && !isProfileCollapsed && "s-desktop:mr-[340px]",
          showProfileCard && isProfileCollapsed && "s-desktop:mr-20"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {showProfileCard && <ProfileCard isCollapsed={isProfileCollapsed} setCollapsed={setIsProfileCollapsed} />}
    </div>
  );
};

export default AppLayout;