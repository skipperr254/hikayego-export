import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DailyReportCard from './DailyReportCard';
import { cn } from '@/lib/utils';
import { Crown } from 'lucide-react';
import SearchAndFilters from './SearchAndFilters';

const DashboardHeader = ({ user, profile, isMobile, readStoryDetails, onSearchChange, onFilterChange, filters }) => {
  const { canAccessPremiumFeatures } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Explorer';
  const avatarUrl = profile?.avatar_url || user?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.id || 'default'}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const WelcomeCardMobile = () => (
    <motion.div variants={itemVariants} className="flex items-center space-x-4">
      <div className="relative">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        {canAccessPremiumFeatures && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.5 }}
            className="absolute -bottom-1 -right-1 z-10 p-1 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-md"
          >
            <Crown className="h-3 w-3 text-white" />
          </motion.div>
        )}
      </div>
      <div>
        <p className="text-muted-foreground text-sm">{getGreeting()},</p>
        <h1 className="text-xl font-bold text-foreground">{displayName}</h1>
      </div>
    </motion.div>
  );

  const WelcomeCardDesktop = () => (
    <motion.div
      variants={itemVariants}
      className="p-8 rounded-2xl bg-gradient-to-br from-primary/90 to-purple-600/95 text-white shadow-xl shadow-primary/20 relative overflow-hidden flex flex-col justify-center h-full"
    >
      <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
        <AvatarDisplay />
        <div className="mt-4">
            <p className="font-semibold text-lg text-white/80">{getGreeting()}</p>
            <h1 className="text-4xl font-bold tracking-tight">{displayName}!</h1>
        </div>
        <p className="mt-4 max-w-md text-lg text-white/90">
          Bugün yeni bir maceraya hazır mısın? Kütüphanene dal ve yeni bir hikaye ile İngilizceni geliştir.
        </p>
      </div>
    </motion.div>
  );

  const AvatarDisplay = () => (
    <motion.div 
      className="relative group"
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 10 }}
    >
      <Avatar className={cn(
        "h-28 w-28 border-4 border-white/50 transition-all duration-300",
        canAccessPremiumFeatures && "border-amber-300/70 shadow-lg shadow-amber-400/20 group-hover:shadow-amber-400/40"
      )}>
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-4xl bg-primary-foreground text-primary">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      {canAccessPremiumFeatures && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.5 }}
          className="absolute -bottom-2 -right-2 z-10 p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg"
        >
          <Crown className="h-6 w-6 text-white" />
        </motion.div>
      )}
    </motion.div>
  );

  if (isMobile) {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        <WelcomeCardMobile />
        <motion.div variants={itemVariants}>
          <DailyReportCard readStoryDetails={readStoryDetails} isMobile={isMobile} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SearchAndFilters onSearchChange={onSearchChange} onFilterChange={onFilterChange} filters={filters} />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 rounded-2xl bg-card/50 border border-border/50 shadow-sm backdrop-blur-lg space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2">
            <WelcomeCardDesktop />
        </div>
        <motion.div variants={itemVariants} className="flex">
          <DailyReportCard readStoryDetails={readStoryDetails} isMobile={isMobile} />
        </motion.div>
      </div>
      <motion.div variants={itemVariants}>
        <SearchAndFilters onSearchChange={onSearchChange} onFilterChange={onFilterChange} filters={filters} />
      </motion.div>
    </motion.div>
  );
};

export default DashboardHeader;