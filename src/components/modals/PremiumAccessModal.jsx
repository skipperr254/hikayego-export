import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown } from 'lucide-react';

const PremiumAccessModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl z-[200]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Crown className="w-6 h-6 text-amber-500" />
            Premium Özellik
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80 pt-4 leading-relaxed">
            Uygulama içinden plan/hesap işlemleri desteklenmiyor. Lütfen masaüstünden devam edin. Gerekirse bizimle iletişime geçin: <span className="font-semibold text-primary">contact@hikayego.com</span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6">
          <Button onClick={() => onClose(false)} className="w-full sm:w-auto rounded-xl font-bold h-12">
            Anladım
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumAccessModal;