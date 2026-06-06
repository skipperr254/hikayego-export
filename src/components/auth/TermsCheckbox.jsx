import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { FileText, Shield } from 'lucide-react';

const TermsCheckbox = ({ checked, onCheckedChange, disabled }) => {
  return (
    <motion.div 
      className="p-3 rounded-lg bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start space-x-3">
        <Checkbox 
          id="accept-terms" 
          checked={checked} 
          onCheckedChange={onCheckedChange}
          className="mt-0.5 border-2 border-primary/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-blue-600"
          disabled={disabled}
        />
        <Label 
          htmlFor="accept-terms" 
          className="text-xs leading-relaxed cursor-pointer text-muted-foreground"
        >
          <Link 
            to="/terms-of-service" 
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Kullanım Şartları
          </Link>
          {' '}ve{' '}
          <Link 
            to="/privacy-policy" 
            className="text-primary hover:text-primary/80 font-semibold transition-colors"
          >
            Gizlilik Politikası
          </Link>
          'nı okudum ve kabul ediyorum.
        </Label>
      </div>
    </motion.div>
  );
};

export default TermsCheckbox;