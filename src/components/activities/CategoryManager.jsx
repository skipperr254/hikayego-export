import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Trash2, Crown, Lock } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const categoryColors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
  'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-orange-500',
  'bg-teal-500', 'bg-cyan-500'
];

const CategoryManager = React.memo(({ user, categories, setCategories, selectedCategory, setSelectedCategory, isMobile = false }) => {
  const { canAccessPremiumFeatures } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({ name: '', color: categoryColors[0] });
  const [isCreating, setIsCreating] = useState(false);
  const [showPremiumAlert, setShowPremiumAlert] = useState(false);
  const { toast } = useToast();
  const isMobileDevice = useMediaQuery('(max-width: 1023px)');

  const handleCategoryCreationError = useCallback((error) => {
    let title = "Hata Oluştu";
    let description = "Liste oluşturulurken beklenmedik bir hata oluştu.";

    if (error.message?.includes('word_categories_user_id_name_key')) {
      title = "Aynı İsimde Liste Mevcut";
      description = "Bu isimde zaten bir listeniz var. Lütfen farklı bir isim deneyin.";
    } else if (error.message?.includes('premium_word_category_limit_exceeded')) {
      title = "Liste Limiti Aşıldı";
      description = "Premium üyelik için en fazla 20 kelime listesi oluşturabilirsiniz.";
    }
    
    toast({
      title: title,
      description: description,
      variant: "destructive",
    });
  }, [toast]);

  const handleCreateCategoryClick = useCallback(() => {
    if (!canAccessPremiumFeatures) {
      if (isMobileDevice) {
        toast({
          title: "Premium Özellik",
          description: "Bu özelliğe erişmek için premium olmalısınız. Lütfen masaüstünden devam edin. Gerekirse bizimle iletişime geçin contact@hikayego.com",
          variant: "destructive"
        });
      } else {
        setShowPremiumAlert(true);
      }
      return;
    }
    setShowCreateForm(true);
  }, [canAccessPremiumFeatures, isMobileDevice, toast]);

  const createCategory = useCallback(async () => {
    if (!canAccessPremiumFeatures) {
      if (isMobileDevice) {
        toast({
          title: "Premium Özellik",
          description: "Bu özelliğe erişmek için premium olmalısınız. Lütfen masaüstünden devam edin. Gerekirse bizimle iletişime geçin contact@hikayego.com",
          variant: "destructive"
        });
      } else {
        setShowPremiumAlert(true);
      }
      return;
    }
    
    if (!newCategoryData.name.trim()) {
      toast({ title: "Liste adı gerekli", description: "Lütfen liste için bir ad girin.", variant: "destructive" });
      return;
    }
    
    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from('word_categories')
        .insert({ 
          user_id: user.id, 
          name: newCategoryData.name.trim(), 
          color: newCategoryData.color 
        })
        .select()
        .single();
        
      if (error) throw error;
      
      setCategories(prev => [...prev, data]);
      setNewCategoryData({ name: '', color: categoryColors[0] });
      setShowCreateForm(false);
      toast({ title: "Liste oluşturuldu! ✨", description: `"${newCategoryData.name}" listesi eklendi.` });
    } catch (error) {
      console.error('Create category error:', error);
      handleCategoryCreationError(error);
    } finally {
      setIsCreating(false);
    }
  }, [newCategoryData, user, setCategories, toast, canAccessPremiumFeatures, isMobileDevice, handleCategoryCreationError]);

  const deleteCategory = useCallback(async (categoryId, categoryName) => {
    try {
      await supabase
        .from('user_saved_words')
        .update({ category_id: null })
        .eq('category_id', categoryId)
        .eq('user_id', user.id);
        
      const { error } = await supabase
        .from('word_categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      if (selectedCategory === categoryId) setSelectedCategory('all');
      toast({ title: "Liste silindi", description: `"${categoryName}" listesi silindi.` });
    } catch (error) {
      console.error('Delete category error:', error);
      toast({ title: "Hata", description: "Liste silinirken bir hata oluştu.", variant: "destructive" });
    }
  }, [user, selectedCategory, setCategories, setSelectedCategory, toast]);

  const CreateButton = useCallback(() => (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-full">
            <Button onClick={handleCreateCategoryClick} variant={isMobile ? "default" : "outline"} className="w-full mt-2">
              {canAccessPremiumFeatures ? <Plus className="mr-2 h-4 w-4" /> : <Lock className="mr-2 h-4 w-4" />}
              Yeni Liste Oluştur
            </Button>
          </div>
        </TooltipTrigger>
        {!canAccessPremiumFeatures && (
          <TooltipContent side="top">
            <p>Yeni liste oluşturmak için Premium üye olmalısınız</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  ), [canAccessPremiumFeatures, handleCreateCategoryClick, isMobile]);

  const content = (
    <div className={cn(isMobile && "p-2")}>
      {isMobile && !showCreateForm && (
        <div className="py-2">
          <CreateButton />
        </div>
      )}
      
      {!canAccessPremiumFeatures && (
        <div className="p-3 mb-4 border rounded-lg bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300 text-sm">
          <div className="flex items-start">
            <Crown className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-amber-500" />
            <div>
              <span className="font-bold">Premium Özellik:</span> Sınırsız kelime listesi oluşturmak, indirmek ve içeri aktarmak için üyeliğinizi yükseltin.
            </div>
          </div>
        </div>
      )}
      
      {showCreateForm && canAccessPremiumFeatures && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: 'auto' }} 
          exit={{ opacity: 0, height: 0 }} 
          transition={{ duration: 0.2 }} 
          className="my-4"
        >
          <div className="p-4 border rounded-lg bg-background/50">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">Yeni Liste Oluştur</h4>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <Input 
                value={newCategoryData.name} 
                onChange={(e) => setNewCategoryData(prev => ({ ...prev, name: e.target.value.slice(0, 30) }))} 
                placeholder="Liste adı (örn: Fiiller)" 
                maxLength={30}
                onKeyPress={(e) => e.key === 'Enter' && !isCreating && createCategory()} 
              />
              <div className="flex gap-2 flex-wrap">
                {categoryColors.map((color) => (
                  <button 
                    key={color} 
                    type="button" 
                    onClick={() => setNewCategoryData(prev => ({ ...prev, color }))} 
                    className={`w-6 h-6 rounded-full ${color} border-2 transition-all ${newCategoryData.color === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'}`} 
                  />
                ))}
              </div>
              <Button 
                onClick={createCategory} 
                disabled={isCreating || !newCategoryData.name.trim()} 
                className="w-full"
              >
                {isCreating ? 'Oluşturuluyor...' : 'Oluştur'}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-2">
        <Button
          variant={selectedCategory === 'all' ? 'secondary' : 'ghost'}
          className="w-full justify-start text-base py-5 transition-colors"
          onClick={() => setSelectedCategory('all')}
        >
          Tüm Kayıtlı Kelimeler
        </Button>
        {categories.map(category => (
          <div key={category.id} className="flex items-center group">
            <Button
              variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
              className="w-full justify-start flex-1 text-base py-5 transition-colors"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${category.color || 'bg-gray-500'}`} />
                <span className="truncate">{category.name}</span>
              </div>
            </Button>
            {canAccessPremiumFeatures && selectedCategory === category.id && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-70 hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Listeyi silmek istediğinizden emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>"{category.name}" listesi silinecek ve bu listedeki kelimeler 'Kategorisiz' olarak işaretlenecek. Bu işlem geri alınamaz.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteCategory(category.id, category.name)} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        ))}
        {!isMobile && !showCreateForm && <CreateButton />}
      </div>

      <Dialog open={showPremiumAlert} onOpenChange={setShowPremiumAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-500" />
              Premium Özellik
            </DialogTitle>
            <DialogDescription className="space-y-4 pt-4">
              <p className="text-base text-foreground">
                Uygulama içinden plan/hesap işlemleri desteklenmiyor. Lütfen masaüstünden devam edin. Gerekirse bizimle iletişime geçin: <span className="font-medium text-primary">contact@hikayego.com</span>
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowPremiumAlert(false)}>Anladım</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (isMobile) {
    return content;
  }

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">Kelime Listeleri</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
});

CategoryManager.displayName = 'CategoryManager';

export default CategoryManager;