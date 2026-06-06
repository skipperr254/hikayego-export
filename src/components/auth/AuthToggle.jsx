import React from 'react';
import { motion } from 'framer-motion';

const AuthToggle = ({ isLogin, onToggle }) => {
  return (
    <div className="relative bg-muted/30 rounded-full p-1">
      <motion.div
        className="absolute inset-y-1 bg-white dark:bg-gray-800 rounded-full shadow-lg"
        initial={false}
        animate={{
          x: isLogin ? 0 : '100%',
          width: '50%'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      />
      <div className="relative flex">
        <button
          type="button"
          onClick={() => onToggle(true)}
          className={`flex-1 py-3 px-6 text-sm font-semibold rounded-full transition-colors duration-200 ${
            isLogin 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => onToggle(false)}
          className={`flex-1 py-3 px-6 text-sm font-semibold rounded-full transition-colors duration-200 ${
            !isLogin 
              ? 'text-primary' 
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Kayıt Ol
        </button>
      </div>
    </div>
  );
};

export default AuthToggle;