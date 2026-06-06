import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, BookA, Download, Trash2, Edit2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const WordleWordListManager = ({ onSuccess }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 639px)");
  
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [categoryId, setCategoryId] = useState('none');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('word_categories')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const cleanWord = word.trim().toLowerCase();
    const cleanTranslation = translation.trim();

    if (cleanWord.length < 5 || cleanWord.length > 7) {
      toast({ title: "Geçersiz Uzunluk", description: "Wordle kelimesi 5, 6 veya 7 harfli olmalıdır.", variant: "destructive" });
      return;
    }

    if (!/^[a-z]+$/.test(cleanWord)) {
      toast({ title: "Geçersiz Karakterler", description: "Sadece İngilizce harfler kullanabilirsiniz.", variant: "destructive" });
      return;
    }
    
    if (!cleanTranslation) {
      toast({ title: "Eksik Bilgi", description: "Lütfen Türkçe anlamını girin.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('user_saved_words')
        .select('id')
        .eq('user_id', user.id)
        .ilike('word', cleanWord)
        .maybeSingle();

      if (existing) {
        toast({ title: "Zaten Mevcut", description: "Bu kelime listenizde zaten var.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const insertData = {
        user_id: user.id,
        word: cleanWord,
        translation: cleanTranslation,
        category_id: categoryId === 'none' ? null : parseInt(categoryId),
        correct_count: 0,
        incorrect_count: 0,
        is_starred: false,
        is_learned: false
      };

      const { error } = await supabase.from('user_saved_words').insert(insertData);

      if (error) throw error;

      toast({ title: "Başarılı!", description: `"${cleanWord.toUpperCase()}" kelimeniz eklendi.`, });
      setWord('');
      setTranslation('');
      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Error adding word:", error);
      toast({ title: "Hata", description: "Kelime eklenirken bir sorun oluştu.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!user) return;
    setDownloading(true);
    
    try {
      const { data, error } = await supabase
        .from('user_saved_words')
        .select('word, translation')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      if (!data || data.length === 0) {
        toast({ title: "Liste Boş", description: "İndirilecek kayıtlı kelimeniz bulunamadı.", variant: "destructive" });
        return;
      }

      const csvRows = ["İngilizce,Türkçe"];
      data.forEach(item => {
        const safeWord = `"${item.word.replace(/"/g, '""')}"`;
        const safeTranslation = `"${item.translation.replace(/"/g, '""')}"`;
        csvRows.push(`${safeWord},${safeTranslation}`);
      });
      
      const csvContent = "\uFEFF" + csvRows.join("\n");
      const fileName = `wordlego_kelimelerim_${new Date().toISOString().split('T')[0]}.csv`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      if (isMobile && navigator.canShare) {
        const file = new File([blob], fileName, { type: 'text/csv' });
        if (navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    files: [file],
                    title: 'Kelime Listem',
                    text: 'Wordlego Kelime Listem'
                });
                toast({ title: "Başarılı!", description: "Dosya paylaşım menüsü açıldı." });
                setDownloading(false);
                return;
            } catch (err) {
                console.log("Share API error or user cancelled:", err);
            }
        }
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      toast({ title: "Başarılı!", description: "Kelime listeniz cihazınıza indirildi." });
    } catch (error) {
      console.error("Download error:", error);
      toast({ title: "İndirme Hatası", description: "Dosya indirilirken bir sorun oluştu.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  const handleNotImplemented = () => {
    toast({
      title: "Bilgi",
      description: "🚧 Bu özellik henüz uygulanmadı—ama endişelenme! Bir sonraki komutunda isteyebilirsin! 🚀",
      variant: "default"
    });
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      await supabase.from('user_saved_words').update({ category_id: null }).eq('category_id', categoryToDelete.id);
      const { error } = await supabase.from('word_categories').delete().eq('id', categoryToDelete.id);
      if (error) throw error;
      
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      toast({ title: "Başarılı", description: "Kategori başarıyla silindi." });
    } catch (err) {
      toast({ title: "Hata", description: "Kategori silinirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="w-full max-h-[85vh] overflow-y-auto bg-card rounded-2xl p-4 sm:p-6 shadow-sm custom-scrollbar flex flex-col">
      <div className="flex items-center justify-between mb-6 border-b border-border/50 pb-4 shrink-0 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
<div className="p-2 sm:p-2.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <BookA className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-lg font-bold truncate">Kendi Kelimeni Ekle</h3>
            <p className="text-[9px] sm:text-xs text-muted-foreground truncate">Wordlego havuzuna kelimeler ekleyin</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload} 
          disabled={downloading}
          className="hidden sm:flex h-9 sm:h-10 rounded-xl px-2 sm:px-3 border-primary/20 text-primary hover:bg-primary/10 transition-colors shrink-0"
          title="Kelimelerimi İndir"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin sm:mr-1.5" /> : <Download className="w-4 h-4 sm:mr-1.5" />}
          <span className="hidden sm:inline text-xs font-bold">Listemi İndir</span>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 shrink-0">
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-semibold">İngilizce Kelime (5-7 harf)</Label>
          <Input
            type="text"
            placeholder="Örn: apple, planet..."
            value={word}
            maxLength={25}
            onChange={(e) => setWord(e.target.value.slice(0, 25))}
            className="h-10 sm:h-12 rounded-xl bg-secondary/50 text-sm sm:text-base px-4 border-transparent focus:bg-background focus:border-primary transition-all text-foreground"
            disabled={loading}
          />
        </div>
        
        <div className="space-y-1.5 sm:space-y-2">
          <Label className="text-xs sm:text-sm font-semibold">Türkçe Anlamı</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Örn: elma, gezegen..."
              value={translation}
              maxLength={35}
              onChange={(e) => setTranslation(e.target.value.slice(0, 35))}
              className="h-10 sm:h-12 rounded-xl bg-secondary/50 text-sm sm:text-base pl-4 pr-12 border-transparent focus:bg-background focus:border-primary transition-all text-foreground"
              disabled={loading}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium">
              {translation.length}/35
            </span>
          </div>
        </div>

        {categories.length > 0 && (
          <div className="space-y-1.5 sm:space-y-2 min-w-0">
            <Label className="text-xs sm:text-sm font-semibold">Kategori</Label>
            <Select value={categoryId} onValueChange={setCategoryId} disabled={loading}>
              <SelectTrigger className="h-10 sm:h-12 rounded-xl bg-secondary/50 border-transparent focus:bg-background focus:border-primary w-full truncate">
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent className="z-[150] w-[--radix-select-trigger-width]">
                <SelectItem value="none" className="truncate">Kategorisiz</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id.toString()} className="truncate">{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 mt-4 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-md transition-all flex items-center justify-center gap-2"
          disabled={loading || !word.trim() || !translation.trim()}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Kelimeyi Ekle
        </Button>
      </form>

      {categories.length > 0 && (
        <div className="mt-6 space-y-3 pt-4 border-t border-border/50 flex-1 overflow-hidden flex flex-col min-h-0">
          <h4 className="text-xs sm:text-sm font-bold text-muted-foreground shrink-0 uppercase tracking-wider">Mevcut Listeler</h4>
          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1 flex-1">
            {/* All Words Section for Mobile Download */}
            {isMobile && (
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/50 gap-2 transition-colors">
                 <span className="text-xs font-medium truncate flex-1 min-w-0 font-bold">
                    Tüm Kelimeler
                 </span>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary transition-colors text-primary" 
                    onClick={handleDownload}
                    disabled={downloading}
                  >
                    {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                  </Button>
              </div>
            )}
            
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/50 gap-2 sm:gap-3 transition-colors hover:bg-secondary/50">
                <span className="text-xs sm:text-sm font-medium truncate flex-1 min-w-0 break-words overflow-hidden text-ellipsis" title={cat.name}>
                  {cat.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="hidden sm:flex h-7 w-7 sm:h-8 sm:w-8 rounded-md hover:bg-primary/10 hover:text-primary transition-colors" onClick={handleNotImplemented}>
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-md hover:bg-destructive/10 hover:text-destructive transition-colors text-destructive sm:text-foreground" onClick={() => setCategoryToDelete(cat)}>
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AlertDialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <AlertDialogContent className="w-[90vw] max-w-md mx-auto p-6 rounded-[2rem] z-[100]">
          <div className="mx-auto w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg sm:text-xl font-bold text-center">Listeyi Sil?</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm sm:text-base break-words overflow-hidden text-ellipsis">
              <span className="font-bold text-foreground">"{categoryToDelete?.name}"</span> listesi silinecek. İçindeki kelimeler 'Kategorisiz' durumuna geçecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="sm:justify-center gap-3 mt-4">
            <AlertDialogCancel className="w-full sm:w-auto h-11 rounded-xl font-medium">İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="w-full sm:w-auto h-11 rounded-xl font-bold bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Listeyi Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WordleWordListManager;