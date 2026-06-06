import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, AlertCircle } from 'lucide-react';

const MobileUnsupportedModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Mobil Cihazda Desteklenmiyor
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="space-y-4 pt-2">
          <div className="text-sm text-muted-foreground leading-relaxed flex flex-col gap-2">
            <span>Uygulama içinden plan/hesap işlemleri desteklenmiyor. Lütfen masaüstünden devam edin.</span>
            <span>Gerekirse bizimle iletişime geçin:</span>
            <span className="inline-flex items-center gap-2 text-primary font-medium">
              <Mail className="h-4 w-4" />
              contact@hikayego.com
            </span>
          </div>
        </DialogDescription>
        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="default">
            Anladım
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileUnsupportedModal;