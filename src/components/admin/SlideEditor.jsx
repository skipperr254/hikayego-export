import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { FileImage as ImageIcon, Save, Loader2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SlideItem from './SlideItem';

const SlideEditor = () => {
  const { toast } = useToast();
  const [slides, setSlides] = useState([]);
  const [deletedSlideIds, setDeletedSlideIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    setFetching(true);
    setDeletedSlideIds([]);
    try {
      const { data, error } = await supabase
        .from('auth_slide_images')
        .select('*')
        .eq('page_type', 'auth')
        .order('slide_order');

      if (error) throw error;

      const formattedData = data.map(item => ({
        id: item.id,
        slide_order: item.slide_order,
        image_url: item.image_url,
        title: item.title || '',
        subtitle: item.subtitle || '',
        gradient_colors: item.gradient_colors || 'from-blue-600/90 via-purple-600/80 to-pink-600/70',
        is_active: item.is_active !== false
      }));

      setSlides(formattedData);
    } catch (error) {
      console.error('Error fetching slides:', error);
      toast({
        title: "Hata",
        description: "Slide'lar yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setFetching(false);
    }
  };

  const handleSlideChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const removeSlide = (index) => {
    const slideToRemove = slides[index];
    if (typeof slideToRemove.id === 'number') {
      setDeletedSlideIds(prev => [...prev, slideToRemove.id]);
    }
    setSlides(prev => prev.filter((_, i) => i !== index));
  };

  const saveSlides = async () => {
    setLoading(true);
    try {
      if (deletedSlideIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('auth_slide_images')
          .delete()
          .in('id', deletedSlideIds);
        if (deleteError) throw deleteError;
      }

      const updatePromises = slides.map((slide, index) => {
        if (!slide.image_url || !slide.title || !slide.subtitle) {
          throw new Error(`${index + 1}. slide için tüm alanları doldurun.`);
        }

        const slideData = {
          slide_order: index + 1,
          image_url: slide.image_url,
          title: slide.title,
          subtitle: slide.subtitle,
          gradient_colors: slide.gradient_colors,
          is_active: slide.is_active,
          updated_at: new Date().toISOString()
        };

        return supabase
          .from('auth_slide_images')
          .update(slideData)
          .eq('id', slide.id);
      });

      const results = await Promise.all(updatePromises);
      const firstError = results.find(res => res.error);
      if (firstError) {
        throw firstError.error;
      }

      toast({
        title: "Başarılı",
        description: "Slide'lar başarıyla güncellendi.",
      });
      
      await fetchSlides();

    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Hata",
        description: error.message || "Kaydetme sırasında bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <ImageIcon className="mr-2 h-5 w-5" />
            Giriş/Kayıt Sayfası Slide Yönetimi
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={fetchSlides}
              size="sm"
              variant="outline"
              disabled={fetching}
            >
              {fetching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fetching ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Slide'lar yükleniyor...</span>
          </div>
        ) : (
          <AnimatePresence>
            {slides.map((slide, index) => (
              <SlideItem
                key={slide.id}
                slide={slide}
                index={index}
                onChange={handleSlideChange}
                onRemove={removeSlide}
              />
            ))}
          </AnimatePresence>
        )}

        {slides.length === 0 && !fetching && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Mevcut slide bulunamadı.</h3>
            <p className="text-muted-foreground mb-4">
              Sistemde düzenlenecek slide bulunmuyor. Lütfen sayfayı yenileyin.
            </p>
          </div>
        )}

        <Button 
          onClick={saveSlides}
          disabled={loading || fetching || (slides.length === 0 && deletedSlideIds.length === 0)}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Tüm Değişiklikleri Kaydet ({slides.length} slide)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SlideEditor;