import React from 'react';
import { useTheme } from '@/contexts/ThemeProvider';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = ({ className, isCollapsed }) => {
  const { theme } = useTheme();

  const effectiveTheme = theme === 'system' 
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') 
    : theme;

  const fullLogoUrl = effectiveTheme === 'dark'
    ? 'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/18389804af2b9a3394756872e960a4f1.png'
    : 'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/b9b0d76db814a3973481f4476e7ff199.png';
  
  const collapsedLogoUrl = 'https://storage.googleapis.com/hostinger-horizons-assets-prod/47ed419b-a823-468d-9e6e-80c8442792f0/b9b0d76db814a3973481f4476e7ff199.png'
    ? 'https://raw.githubusercontent.com/mustafabayrak/web-assets/main/go.png'
    : 'https://raw.githubusercontent.com/mustafabayrak/web-assets/main/go.png';

  const logoUrl = isCollapsed ? collapsedLogoUrl : fullLogoUrl;

  return (
    <motion.img 
      src={logoUrl}
      alt="HikayeGO Logo"
      className={cn("h-auto transition-all duration-300", className)}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    />
  );
};

export const LogoWithText = () => {
    return(
        <Link to="/" className="inline-flex items-center space-x-2 group">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Logo className="h-8 w-auto" />
            </motion.div>
        </Link>
    )
}

export default Logo;