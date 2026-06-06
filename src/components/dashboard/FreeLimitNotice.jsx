import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const FreeLimitNotice = React.memo(({ filteredStories, onUpgrade }) => {
  const { canAccessPremiumFeatures } = useAuth();
  if (canAccessPremiumFeatures || filteredStories.length <= 3) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="mt-8 text-center"
    >
      <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
        <CardContent className="p-6">
          <Crown className="h-8 w-8 mx-auto mb-4 text-primary" />
          <h3 className="text-lg font-semibold mb-2">Daha Fazla Hikaye İçin Premium'a Geç!</h3>
          <p className="text-muted-foreground mb-4">
            {filteredStories.length - 3} hikaye daha var. Tümüne erişmek için Premium üye ol.
          </p>
          <Button onClick={onUpgrade} className="btn-glow">
            <Crown className="mr-2 h-4 w-4" /> Premium'a Geç
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
});

export default FreeLimitNotice;