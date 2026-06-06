import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PremiumBanner = React.memo(() => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-card to-secondary/30 shadow-2xl shadow-primary/10">
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5" />
          <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-3">
              <Crown className="h-4 w-4" />
              <span>Premium'a Yükselt</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Tüm Hikayelerin Kilidini Açın!</h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              Sınırsız okuma, sesli dinleme ve kelime asistanı gibi özel özelliklere anında erişmek için Premium'a geçin.
            </p>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-400" /> Sınırsız Hikaye Erişimi</span>
                <span className="flex items-center gap-2"><Zap className="h-4 w-4 text-blue-400" /> Özel Premium Özellikler</span>
            </div>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <Button
              size="lg"
              className="btn-glow text-lg font-bold shadow-lg transform hover:scale-105 transition-transform"
              onClick={() => navigate('/subscription')}
            >
              Hemen Başla
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
});

export default PremiumBanner;