import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

const WordleHowToPlay = ({ customTrigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {customTrigger || (
          <Button variant="outline" className="rounded-xl h-12 w-full font-bold bg-secondary/50 border-border/50 hover:bg-secondary">
            <Info className="w-5 h-5 mr-2 text-primary" />
            Nasıl Oynanır?
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-[2rem] z-[150]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center mb-4">Nasıl Oynanır?</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 text-sm sm:text-base text-muted-foreground">
          <p>
            Gizli kelimeyi 6 denemede bulmaya çalışın. Her tahmin geçerli bir İngilizce kelime olmalıdır.
            Tahmininizi göndermek için <strong className="text-foreground">ENTER</strong> tuşuna basın.
          </p>
          
          <div className="space-y-4">
            <p className="font-bold text-foreground mb-2 border-b pb-1">Renklerin Anlamı:</p>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="w-10 h-10 flex items-center justify-center font-black text-white bg-green-600 rounded-lg shrink-0">W</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">E</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">A</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">R</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">Y</div>
              </div>
              <p><strong>W</strong> harfi kelimenin içinde ve <strong className="text-green-600">doğru yerde</strong>.</p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">P</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-gray-900 bg-yellow-500 rounded-lg shrink-0">I</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">L</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">L</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">S</div>
              </div>
              <p><strong>I</strong> harfi kelimenin içinde ama <strong className="text-yellow-600">yanlış yerde</strong>.</p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">V</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">A</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">G</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-white bg-gray-500 rounded-lg shrink-0">U</div>
                <div className="w-10 h-10 flex items-center justify-center font-black text-foreground bg-secondary rounded-lg shrink-0">E</div>
              </div>
              <p><strong>U</strong> harfi kelimenin <strong className="text-gray-500">hiçbir yerinde yok</strong>.</p>
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-xl">
            <p className="text-primary font-medium text-xs sm:text-sm">
              <strong className="block mb-1">İpuçları:</strong>
              Oyun başına en fazla 2 ipucu kullanabilirsiniz. İpuçları kelimenin anlamı, çevirisi veya harf konumları hakkında bilgi verir.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WordleHowToPlay;