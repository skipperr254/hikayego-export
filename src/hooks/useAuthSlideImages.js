import { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

export const useAuthSlideImages = () => {
  const [slideImages, setSlideImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthSlideImages();
  }, []);

  const fetchAuthSlideImages = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('auth_slide_images')
        .select('*')
        .eq('page_type', 'auth')
        .eq('is_active', true)
        .order('slide_order', { ascending: true });

      if (error) {
        console.error('Error fetching auth slide images:', error);
        setSlideImages([]);
        return;
      }

      if (data && data.length > 0) {
        const formattedSlides = data.map(item => ({
          id: item.id,
          url: item.image_url,
          title: item.title,
          subtitle: item.subtitle,
          gradient: item.gradient_colors,
          order: item.slide_order
        }));
        setSlideImages(formattedSlides);
      } else {
        setSlideImages([]);
      }
    } catch (error) {
      console.error('Error fetching auth slide images:', error);
      setSlideImages([]);
    } finally {
      setLoading(false);
    }
  };

  return { slideImages, loading, refetch: fetchAuthSlideImages };
};