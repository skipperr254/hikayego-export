import React from 'react';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const RememberMeCheckbox = ({ checked, onCheckedChange, disabled }) => {
  return (
    <motion.div 
      className="flex items-center space-x-2 p-2 rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 border border-blue-200/30 dark:border-blue-800/30"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative">
        <Checkbox 
          id="remember-me" 
          checked={checked} 
          onCheckedChange={onCheckedChange}
          disabled={disabled}
          className="border-2 border-primary/50 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-primary data-[state=checked]:to-purple-600"
        />
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full flex items-center justify-center"
          >
            <div className="w-1 h-1 bg-white rounded-full" />
          </motion.div>
        )}
      </div>
      <Label 
        htmlFor="remember-me" 
        className="text-xs font-medium cursor-pointer text-foreground"
      >
        Beni güvenli şekilde hatırla
      </Label>
    </motion.div>
  );
};

export default RememberMeCheckbox;