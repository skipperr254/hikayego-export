import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MailCheck, ArrowLeft } from 'lucide-react';

const RegistrationSuccess = ({ email, onBackToLogin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="text-center p-4 sm:p-6"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="relative mb-6"
        >
          <div className="absolute -inset-1 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full blur-lg opacity-75 animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <MailCheck className="w-10 h-10 text-green-500 dark:text-green-400" />
          </div>
        </motion.div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Kayıt Başarılı!</h2>
        
        <p className="text-muted-foreground max-w-sm mb-4">
          Hesabınızı doğrulamak için <strong className="text-primary font-semibold">{email}</strong> adresine bir e-posta gönderdik.
        </p>
        
        <p className="text-sm text-muted-foreground/80 max-w-sm mb-8">
          Lütfen gelen kutunuzu ve spam klasörünü kontrol ederek doğrulama bağlantısına tıklayın.
        </p>
        
        <Button onClick={onBackToLogin} variant="outline" className="w-full group">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Giriş Ekranına Dön
        </Button>
      </div>
    </motion.div>
  );
};

export default RegistrationSuccess;