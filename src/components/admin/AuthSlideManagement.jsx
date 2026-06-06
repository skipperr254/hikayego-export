import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, PlusCircle, Trash2, Edit, Save, Image as ImageIcon, Palette, X, User, Briefcase, MessageSquare, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { testimonialAvatars } from '@/lib/testimonial-avatars';
import { cn } from '@/lib/utils';

const gradients = [
  'from-black/80 via-black/50 to-transparent',
  'from-blue-900/70 via-blue-900/30 to-transparent',
  'from-purple-900/70 via-purple-900/30 to-transparent',
  'from-emerald-900/70 via-emerald-900/30 to-transparent',
  'from-rose-900/70 via-rose-900/30 to-transparent',
  'from-amber-900/70 via-amber-900/30 to-transparent',
];

const AuthSlideManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [slideToDelete, setSlideToDelete] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('auth_slide_images')
      .select('*')
      .order('slide_order', { ascending: true });

    if (error) {
      toast({ title: 'Hata', description: 'Slaytlar yüklenemedi.', variant: 'destructive' });
    } else {
      setSlides(data || []);
    }
    setLoading(false);
  };

  const handleAddSlide = () => {
    if (slides.length >= 5) {
      toast({ title: 'Limit Aşıldı', description: 'En fazla 5 slayt ekleyebilirsiniz.', variant: 'destructive' });
      return;
    }
    const maxOrder = slides.reduce((max, slide) => (slide.slide_order > max ? slide.slide_order : max), 0);
    const newSlide = {
      id: `new-${Date.now()}`,
      title: '',
      subtitle: '',
      image_url: '',
      avatar_url: testimonialAvatars[0],
      user_title: '',
      gradient_colors: gradients[0],
      page_type: 'auth',
      slide_order: maxOrder + 1
    };
    setEditingSlide(newSlide);
  };

  const handleEditSlide = (slide) => {
    setEditingSlide({ ...slide });
  };

  const handleCancelEdit = () => {
    setEditingSlide(null);
  };

  const handleSaveSlide = async () => {
    if (!editingSlide.title || !editingSlide.subtitle || !editingSlide.image_url || !editingSlide.user_title || !editingSlide.avatar_url) {
      toast({ title: 'Eksik Bilgi', description: 'Lütfen tüm alanları doldurun.', variant: 'destructive' });
      return;
    }

    setIsActionLoading(true);
    const isNew = String(editingSlide.id).startsWith('new-');
    
    const slideData = {
      title: editingSlide.title,
      subtitle: editingSlide.subtitle,
      image_url: editingSlide.image_url,
      avatar_url: editingSlide.avatar_url,
      user_title: editingSlide.user_title,
      gradient_colors: editingSlide.gradient_colors,
      page_type: 'auth',
      slide_order: editingSlide.slide_order
    };
    
    let error;
    if (isNew) {
      ({ error } = await supabase.from('auth_slide_images').insert([slideData]));
    } else {
      ({ error } = await supabase.from('auth_slide_images').update(slideData).eq('id', editingSlide.id));
    }

    if (error) {
      toast({ title: 'Hata', description: 'Slayt kaydedilemedi: ' + error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Başarılı', description: `Slayt başarıyla ${isNew ? 'eklendi' : 'güncellendi'}.` });
      setEditingSlide(null);
      await fetchSlides();
    }
    setIsActionLoading(false);
  };
  
  const handleDeleteConfirm = async () => {
    if (!slideToDelete) return;

    setIsActionLoading(true);
    const { error } = await supabase.from('auth_slide_images').delete().eq('id', slideToDelete);

    if (error) {
      toast({ title: 'Hata', description: 'Slayt silinemedi: ' + error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Başarılı', description: 'Slayt silindi.' });
      await fetchSlides();
    }
    setIsActionLoading(false);
    setSlideToDelete(null);
  };

  const handleInputChange = (field, value) => {
    setEditingSlide(prev => ({ ...prev, [field]: value }));
  };
  
  const handleImageUpload = async (file, field) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({ title: "Hata", description: "Lütfen geçerli bir resim dosyası seçin.", variant: "destructive" });
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Hata", description: "Resim dosyası 5MB'dan küçük olmalıdır.", variant: "destructive" });
        return;
    }

    setIsActionLoading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `auth-slide-${field}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from('story_images')
            .upload(fileName, file, { cacheControl: '3600', upsert: false });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('story_images')
            .getPublicUrl(fileName);

        handleInputChange(field, publicUrl);
        toast({ title: "Başarılı", description: "Resim yüklendi. Değişiklikleri kaydetmeyi unutmayın." });
    } catch (error) {
        console.error('Upload error:', error);
        toast({ title: "Hata", description: "Resim yüklenirken bir hata oluştu.", variant: "destructive" });
    } finally {
        setIsActionLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }
  
  if (editingSlide) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 p-4 border rounded-lg bg-background">
        <h3 className="text-lg font-semibold">{String(editingSlide.id).startsWith('new-') ? 'Yeni Slayt Ekle' : 'Slaytı Düzenle'}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title"><User className="inline h-4 w-4 mr-1"/>Kullanıcı Adı</Label>
            <Input id="title" value={editingSlide.title} onChange={(e) => handleInputChange('title', e.target.value)} placeholder="Örn: Ayşe Yılmaz" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_title"><Briefcase className="inline h-4 w-4 mr-1"/>Kullanıcı Ünvanı</Label>
            <Input id="user_title" value={editingSlide.user_title} onChange={(e) => handleInputChange('user_title', e.target.value)} placeholder="Örn: Üniversite Öğrencisi" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="subtitle"><MessageSquare className="inline h-4 w-4 mr-1"/>Kullanıcı Yorumu / Görüşü</Label>
          <Textarea id="subtitle" value={editingSlide.subtitle} onChange={(e) => handleInputChange('subtitle', e.target.value)} placeholder="Kullanıcının ilham verici yorumunu buraya yazın..." />
        </div>
        
        <div className="space-y-2">
            <Label><ImageIcon className="inline h-4 w-4 mr-1"/>Arkaplan Resmi</Label>
            <p className="text-sm text-muted-foreground">Slayt için bir arkaplan resmi yükleyin (önerilen boyut: 1920x1080).</p>
            {editingSlide.image_url && <img src={editingSlide.image_url} alt="Slide preview" className="w-full h-32 object-cover rounded-md border" />}
            <Input id="image-upload" type="file" accept="image/*" onChange={(e) => handleImageUpload(e.target.files?.[0], 'image_url')} disabled={isActionLoading} />
        </div>
        
        <div className="space-y-2">
          <Label><User className="inline h-4 w-4 mr-1"/>Avatar Seçimi</Label>
          <p className="text-sm text-muted-foreground">Slaytta görünecek avatarı aşağıdaki listeden seçin.</p>
          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4 pt-2">
            {testimonialAvatars.map((avatarUrl, index) => (
              <motion.div
                key={`avatar-${index}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer group"
                onClick={() => handleInputChange('avatar_url', avatarUrl)}
              >
                <Avatar className={cn(
                  'h-16 w-16 border-4 transition-all duration-300 shadow-lg',
                  editingSlide.avatar_url === avatarUrl 
                    ? 'border-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background' 
                    : 'border-transparent group-hover:border-primary/50'
                )}>
                  <AvatarImage src={avatarUrl} alt={`Avatar ${index + 1}`} />
                </Avatar>
                {editingSlide.avatar_url === avatarUrl && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute -top-1 -right-1 bg-background rounded-full p-0.5 shadow-md"
                  >
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label><Palette className="inline h-4 w-4 mr-1"/> Gradyan</Label>
          <div className="flex flex-wrap gap-2">
            {gradients.map(grad => (
              <button key={grad} onClick={() => handleInputChange('gradient_colors', grad)} className={`h-10 w-10 rounded-md border-2 ${editingSlide.gradient_colors === grad ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-transparent'}`}>
                <div className={`h-full w-full rounded-sm bg-gradient-to-br ${grad}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancelEdit}>İptal</Button>
          <Button onClick={handleSaveSlide} disabled={isActionLoading}>
            {isActionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Save className="h-4 w-4 mr-2"/>}
            Kaydet
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {slides.length === 0 && !loading && (
          <div className="text-center py-8 border-2 border-dashed rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Henüz slayt yok</h3>
            <p className="mt-1 text-sm text-muted-foreground">Başlamak için yeni bir slayt ekleyin.</p>
          </div>
        )}
        
        <AnimatePresence>
          {slides.map(slide => (
            <motion.div
              key={slide.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4 flex items-center gap-4">
                  <img src={slide.image_url} alt={slide.title} className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                  <Avatar className="h-16 w-16 flex-shrink-0"><AvatarImage src={slide.avatar_url} /></Avatar>
                  <div className="flex-grow">
                    <h4 className="font-semibold">{slide.title}</h4>
                    <p className="text-sm text-muted-foreground">{slide.user_title}</p>
                    <p className="text-sm text-muted-foreground truncate mt-1">"{slide.subtitle}"</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditSlide(slide)}><Edit className="h-4 w-4 mr-2"/> Düzenle</Button>
                    <Button size="sm" variant="destructive" onClick={() => setSlideToDelete(slide.id)}><Trash2 className="h-4 w-4 mr-2"/> Sil</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button onClick={handleAddSlide} disabled={slides.length >= 5 || isActionLoading} className="w-full mt-4">
          <PlusCircle className="h-4 w-4 mr-2" />
          Yeni Slayt Ekle ({slides.length}/5)
        </Button>
      </div>

      <AlertDialog open={!!slideToDelete} onOpenChange={(isOpen) => !isOpen && setSlideToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Bu slayt kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90" disabled={isActionLoading}>
              {isActionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Evet, Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AuthSlideManagement;