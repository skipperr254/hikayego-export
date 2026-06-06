import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

const GoBot = ({ canAccessPremiumFeatures }) => {
  const [isWaving, setIsWaving] = useState(false);

  useEffect(() => {
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1500);
    }, 5000);

    return () => clearInterval(waveInterval);
  }, []);

  const botVariants = {
    initial: { y: 5, scale: 1 },
    hover: {
      y: -5,
      scale: 1.05,
      transition: { type: 'spring', stiffness: 300, damping: 10, repeat: Infinity, repeatType: 'mirror' }
    }
  };

  const armVariants = {
    rest: { rotate: 0 },
    wave: {
      rotate: [-10, 45, -10, 45, -10],
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      className="relative w-28 h-28 cursor-pointer"
      variants={botVariants}
      initial="initial"
      whileHover="hover"
      onTap={() => {
        setIsWaving(true);
        setTimeout(() => setIsWaving(false), 1500);
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-lg opacity-50"></div>
      
      <div className="absolute w-24 h-24 top-2 left-2 bg-secondary rounded-full shadow-inner"></div>

      <div className="absolute w-20 h-20 top-4 left-4 bg-background rounded-full flex items-center justify-center">
        <div className="w-12 h-6 bg-primary/20 rounded-md flex items-center justify-center">
          <div className="w-3 h-3 bg-primary rounded-full mr-2 animate-pulse"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>

      <motion.div
        className="absolute w-6 h-10 bg-primary rounded-t-full rounded-b-md top-1/2 -left-1 origin-bottom-right"
        style={{ transform: 'translateY(-50%)' }}
        variants={armVariants}
        animate={isWaving ? "wave" : "rest"}
      ></motion.div>

      <div className="absolute w-6 h-10 bg-primary rounded-t-full rounded-b-md top-1/2 -right-1 origin-bottom-left" style={{ transform: 'translateY(-50%)' }}></div>

      {canAccessPremiumFeatures && (
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
          className="absolute -top-2 -right-2 z-10 bg-background p-1.5 rounded-full shadow-md"
        >
          <Crown className="h-5 w-5 text-amber-400" fill="currentColor" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoBot;