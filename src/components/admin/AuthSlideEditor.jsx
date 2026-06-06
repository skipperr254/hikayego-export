import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { FileImage as ImageIcon, Save, Plus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthSlideItem from './AuthSlideItem';

const AuthSlideEditor = ({ pageType, title }) => {
  const { toast } = useToast();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, [pageType]);

  const fetchSlides = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('auth_slide_images')
        .select('*')
        .eq('page_type', pageType)
        .eq('is_active', true)
        .order('slide_order');

      if (error) throw error;

      const formattedData = data.map(item => ({
        id: item.id,
        slide_order: item.slide_order,
        image_url: item.image_url,
        title: item.title || '',
        subtitle: item.subtitle || '',
        gradient_colors: item.gradient_colors || 'from-blue-600/90 via-purple-600/80 to-pink-600/70'
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

  const handleSlideChange = (index, updatedSlide) => {
    const newSlides = [...slides];
    newSlides[index] = updatedSlide;
    setSlides(newSlides);
  };

  const addNewSlide = () => {
    const newSlideOrder = slides.length > 0 ? Math.max(...slides.map(s => s.slide_order)) + 1 : 1;
    setSlides(prev => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        slide_order: newSlideOrder,
        image_url: '',
        title: '',
        subtitle: '',
        gradient_colors: 'from-blue-600/90 via-purple-600/80 to-pink-600/70'
      }
    ]);
  };

  const removeSlide = (id) => {
    setSlides(prev => prev.filter(slide => slide.id !== id));
  };
  
  const saveSlides = async () => {
    setLoading(true);
    try {
      for (const [index, slide] of slides.entries()) {
        if (!slide.image_url || !slide.title || !slide.subtitle) {
          toast({
            title: "Hata",
            description: `${index + 1}. slide için tüm alanları doldurun.`,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        const slideData = {
          page_type: pageType,
          slide_order: index + 1,
          image_url: slide.image_url,
          title: slide.title,
          subtitle: slide.subtitle,
          gradient_colors: slide.gradient_colors,
          is_active: true,
          updated_at: new Date().toISOString()
        };
        
        const upsertResult = await supabase
            .from('auth_slide_images')
            .upsert({ ...slideData, id: typeof slide.id === 'string' && slide.id.startsWith('new-') ? undefined : slide.id }, { onConflict: 'id' });
        
        if (upsertResult.error) throw upsertResult.error;
      }
      
      const slidesToDelete = await supabase
        .from('auth_slide_images')
        .select('id')
        .eq('page_type', pageType)
        .not('id', 'in', `(${slides.map(s => s.id).filter(id => typeof id === 'number').join(',')})`);

      if (slidesToDelete.data && slidesToDelete.data.length > 0) {
        await supabase
          .from('auth_slide_images')
          .delete()
          .in('id', slidesToDelete.data.map(d => d.id));
      }

      await fetchSlides();
      toast({
        title: "Başarılı",
        description: `${title} slide'ları güncellendi.`,
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Hata",
        description: "Kaydetme sırasında bir hata oluştu.",
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
            {title} Slide'ları
          </div>
          <Button
            onClick={addNewSlide}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            disabled={slides.length >= 5}
          >
            <Plus className="h-4 w-4 mr-1" />
            Yeni Slide
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fetching ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <AnimatePresence>
            {slides.map((slide, index) => (
              <AuthSlideItem
                key={slide.id}
                slide={slide}
                index={index}
                pageType={pageType}
                onChange={handleSlideChange}
                onRemove={removeSlide}
              />
            ))}
          </AnimatePresence>
        )}
        
        <Button 
          onClick={saveSlides}
          disabled={loading || fetching || slides.length === 0}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Tüm Slide'ları Kaydet
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AuthSlideEditor;