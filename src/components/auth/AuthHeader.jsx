import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

const AuthHeader = ({ isLogin }) => {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center mb-8">
        <Link to="/" className="inline-flex items-center space-x-2 group">
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Logo className="w-40" />
          </motion.div>
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-3"
      >
        <motion.h1 
          key={isLogin ? 'login-title' : 'register-title'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-foreground"
        >
          {isLogin ? 'Tekrar Hoş Geldiniz!' : 'Hesabınızı Oluşturun'}
        </motion.h1>
        <motion.p 
          key={isLogin ? 'login-subtitle' : 'register-subtitle'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-sm md:text-base text-muted-foreground"
        >
          {isLogin 
            ? 'Maceraya devam etmek için giriş yapın.'
            : 'Hızlıca kaydolun ve öğrenmeye başlayın.'
          }
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AuthHeader;