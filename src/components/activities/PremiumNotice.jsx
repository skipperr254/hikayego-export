import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PremiumNotice = React.memo(() => {
  const navigate = useNavigate();
  const { canAccessPremiumFeatures } = useAuth();

  if (canAccessPremiumFeatures) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mt-4 p-4 border-t"
    >
      <div className="flex items-center mb-2">
        <Crown className="h-5 w-5 text-amber-500 mr-2" />
        <h4 className="font-semibold text-amber-700 dark:text-amber-300">
          Premium Özellikler
        </h4>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Kelimelerinizi listelere ayırmak ve daha fazlası için Premium'a geçin!
      </p>
      <Button 
        onClick={() => navigate('/subscription')} 
        size="sm"
        className="w-full bg-amber-500 hover:bg-amber-600 text-white"
      >
        <Crown className="mr-2 h-4 w-4" />
        Hemen Yükselt
      </Button>
    </motion.div>
  );
});

export default PremiumNotice;