import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PartyPopper, Info, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import useLocalStorage from '@/hooks/useLocalStorage';

const WelcomeModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const displayName = user?.name || user?.email?.split('@')[0] || 'Gezgin';

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const InfoRow = ({ icon: Icon, title, children }) => (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 mt-1">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 max-w-md w-[95vw] sm:w-full rounded-2xl overflow-hidden border-none shadow-2xl bg-background text-foreground">
        <div className="relative p-8 pt-20 text-center">
          <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="absolute top-0 left-1/2 -translate-x-1/2"
                style={{ y: '-40%' }}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
              >
                <div className="p-4 bg-primary rounded-full shadow-lg shadow-primary/30">
                  <PartyPopper className="h-10 w-10 text-primary-foreground" />
                </div>
              </motion.div>

              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-2 mt-0"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                Aramıza Hoş Geldin, {displayName}!
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                HikayeGO ile İngilizce öğrenme maceran başlıyor.
              </motion.p>

              <motion.div
                className="bg-secondary/50 dark:bg-secondary/30 p-4 rounded-xl text-left space-y-4 mb-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <InfoRow icon={Info} title="Beta Sürümündeyiz!">
                  Uygulamamız sürekli gelişiyor. Geri bildirimlerin bizim için çok değerli.
                </InfoRow>
                <InfoRow icon={Mail} title="Yardıma mı ihtiyacın var?">
                  Herhangi bir sorun veya öneri için bize <a href="mailto:contact@hikayego.com" className="text-primary font-medium hover:underline">contact@hikayego.com</a> adresinden ulaşabilirsin.
                </InfoRow>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <Button onClick={handleClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
                  Maceraya Başla!
                </Button>
              </motion.div>
            </>
          )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;