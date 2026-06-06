import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AutoSaveIndicator = ({ status, onRetry }) => {
  return (
    <AnimatePresence>
      {status !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-background border shadow-xl rounded-full"
        >
          {status === 'saving' && (
            <>
              <Loader2 className="h-5 w-5 text-primary animate-spin" />
              <span className="text-sm font-medium">Kaydediliyor...</span>
            </>
          )}
          {status === 'success' && (
            <>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Kaydedildi</span>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm font-medium text-destructive">Kaydedilemedi</span>
              <Button variant="ghost" size="sm" onClick={onRetry} className="h-7 px-2 ml-1 text-xs">
                <RefreshCw className="h-3 w-3 mr-1" />
                Tekrar Dene
              </Button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoSaveIndicator;