import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeProvider';

const WordleSettings = ({ hardMode, setHardMode, onscreenOnly, setOnscreenOnly, onNewGame, isGlobal }) => {
  const { theme, setTheme } = useTheme();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-secondary h-8 w-8 sm:h-10 sm:w-10 shrink-0">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[85vw] sm:w-[350px] md:w-[400px] z-[150]">
        <SheetHeader className="mb-4 sm:mb-6 mt-4 sm:mt-0">
          <SheetTitle className="text-xl sm:text-2xl font-black text-left">Ayarlar</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 sm:space-y-6">
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <Label className="text-sm sm:text-base font-bold">Zor Mod</Label>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">İpuçları devre dışı bırakılır.</p>
            </div>
            <Switch checked={hardMode} onCheckedChange={(checked) => {
              setHardMode(checked);
              localStorage.setItem('wordle_hard_mode', checked);
            }} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <Label className="text-sm sm:text-base font-bold">Sadece Ekran Klavyesi</Label>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">Fiziksel klavyeden girişleri engeller.</p>
            </div>
            <Switch checked={onscreenOnly} onCheckedChange={(checked) => {
              setOnscreenOnly(checked);
              localStorage.setItem('wordle_onscreen_only', checked);
            }} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <Label className="text-sm sm:text-base font-bold">Koyu Tema</Label>
              <p className="text-[10px] sm:text-xs text-muted-foreground leading-snug">Görünümü değiştirin.</p>
            </div>
            <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
          </div>

          {!isGlobal && (
            <div className="pt-4 sm:pt-6 border-t border-border mt-4 sm:mt-6">
               <Button variant="outline" className="w-full font-bold h-10 sm:h-12 rounded-xl text-sm sm:text-base" onClick={onNewGame}>
                 Yeni Oyuna Başla
               </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default WordleSettings;