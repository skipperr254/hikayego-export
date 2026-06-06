import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const WelcomeSection = React.memo(({ user, profile }) => {
  const { canAccessPremiumFeatures } = useAuth();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const displayName = profile?.name || user?.email?.split('@')[0] || 'Explorer';
  const avatarUrl = profile?.avatar_url || user?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.id || 'default'}`;

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  const AbstractShape = ({ style, animate, transition }) => (
    <motion.div
      className="absolute z-0"
      style={style}
      animate={animate}
      transition={transition}
    />
  );

  const WelcomeCardBackground = () => (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      <AbstractShape
        style={{ width: '150px', height: '150px', top: '-50px', left: '-50px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '50%' }}
        animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />
      <AbstractShape
        style={{ width: '200px', height: '200px', bottom: '-80px', right: '-80px', background: 'rgba(255, 255, 255, 0.05)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
        animate={{ rotate: [0, -25, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' }}
      />
       <AbstractShape
        style={{ width: '80px', height: '80px', top: '30%', right: '10%', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
        animate={{ y: [0, -20, 0], rotate: [0, 360, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );

  const AvatarDisplay = () => (
    <div className="relative group">
      <Avatar className={cn(
        "h-20 w-20 border-4 border-white/50 transition-all duration-300",
        canAccessPremiumFeatures && "border-amber-300/70 shadow-lg shadow-amber-400/20 group-hover:shadow-amber-400/40"
      )}>
        <AvatarImage src={avatarUrl} alt={displayName} />
        <AvatarFallback className="text-3xl bg-primary-foreground text-primary">{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      {canAccessPremiumFeatures && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.5 }}
          className="absolute -bottom-2 -right-2 z-10 p-1.5 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg"
        >
          <Crown className="h-4 w-4 text-white" />
        </motion.div>
      )}
    </div>
  );

  return (
    <motion.div
      variants={itemVariants}
      className="p-8 rounded-2xl bg-gradient-to-br from-primary/90 to-purple-600/95 text-white shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col justify-between"
    >
      <WelcomeCardBackground />
      <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
              <AvatarDisplay />
              <div>
                  <p className="font-semibold text-lg text-white/80">{getGreeting()}</p>
                  <h1 className="text-4xl font-bold tracking-tight">{displayName}!</h1>
              </div>
          </div>
          <p className="mt-4 max-w-lg text-lg text-white/90">
              Bugün yeni bir maceraya hazır mısın? Kütüphanene dal ve yeni bir hikaye ile İngilizceni geliştir.
          </p>
      </div>
      <div className="relative z-10 mt-6">
          <Button 
            onClick={() => document.getElementById('story-grid-start')?.scrollIntoView({ behavior: 'smooth' })}
            variant="secondary" 
            className="font-bold group bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm"
          >
              Hadi Başlayalım <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
      </div>
    </motion.div>
  );
});

export default WelcomeSection;