import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4"
        >
          <div className="container mx-auto">
            <div className="bg-background/80 dark:bg-slate-900/80 backdrop-blur-lg border border-border rounded-xl shadow-2xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start md:items-center gap-4">
                <Cookie className="h-8 w-8 text-primary flex-shrink-0 mt-1 md:mt-0" />
                <p className="text-sm text-muted-foreground">
                  Web sitemizdeki kullanıcı deneyiminizi geliştirmek için çerezleri kullanıyoruz. 
                  Sitemizi kullanarak,{' '}
                  <Link to="/cookie-policy" className="font-semibold text-primary hover:underline">
                    Çerez Politikamızı
                  </Link>
                  {' '}kabul etmiş olursunuz.
                </p>
              </div>
              <Button onClick={handleAccept} className="w-full md:w-auto flex-shrink-0">
                Anladım ve Kabul Ediyorum
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsentBanner;