import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Upload, X, Trash2, Eye, Loader2 } from 'lucide-react';

const gradientOptions = [
    { value: 'from-blue-600/90 via-purple-600/80 to-pink-600/70', label: 'Mavi-Mor-Pembe', preview: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600' },
    { value: 'from-green-600/90 via-teal-600/80 to-blue-600/70', label: 'Yeşil-Teal-Mavi', preview: 'bg-gradient-to-r from-green-600 via-teal-600 to-blue-600' },
    { value: 'from-orange-600/90 via-red-600/80 to-pink-600/70', label: 'Turuncu-Kırmızı-Pembe', preview: 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600' },
    { value: 'from-purple-600/90 via-pink-600/80 to-red-600/70', label: 'Mor-Pembe-Kırmızı', preview: 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600' },
    { value: 'from-emerald-600/90 via-cyan-600/80 to-blue-600/70', label: 'Zümrüt-Cyan-Mavi', preview: 'bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600' },
    { value: 'from-amber-600/90 via-orange-600/80 to-red-600/70', label: 'Amber-Turuncu-Kırmızı', preview: 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600' }
];

const AuthSlideItem = ({ slide, index, pageType, onChange, onRemove }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    onChange(index, { ...slide, [field]: value });
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Hata", description: "Lütfen geçerli bir resim dosyası seçin.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Hata", description: "Resim dosyası 5MB'dan küçük olmalıdır.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `auth-slide-${pageType}-${index}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('story_images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('story_images')
        .getPublicUrl(fileName);

      handleInputChange('image_url', publicUrl);
      toast({ title: "Başarılı", description: "Resim başarıyla yüklendi." });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ title: "Hata", description: "Resim yüklenirken bir hata oluştu.", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 border rounded-lg space-y-4 bg-muted/30"
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Slide {index + 1}</h4>
        <Button
          onClick={() => onRemove(slide.id)}
          size="sm"
          variant="destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Resim</Label>
          {slide.image_url ? (
            <div className="relative mt-2">
              <img 
                src={slide.image_url} 
                alt={`${pageType} slide ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleInputChange('image_url', '')}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center mt-2">
              {uploading ? (
                 <div className="flex flex-col items-center justify-center">
                   <Loader2 className="h-6 w-6 animate-spin text-primary mb-2"/>
                   <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                 </div>
              ) : (
                <>
                  <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Resim yüklemek için tıklayın
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="cursor-pointer"
                  />
                </>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <Label>Başlık</Label>
            <Input
              value={slide.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Slide başlığı"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Alt Başlık</Label>
            <Textarea
              value={slide.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Slide alt başlığı"
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label>Gradient Rengi</Label>
            <Select
              value={slide.gradient_colors}
              onValueChange={(value) => handleInputChange('gradient_colors', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gradientOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded ${option.preview}`}></div>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {slide.image_url && (
        <div className="mt-4">
          <Label className="flex items-center mb-2">
            <Eye className="h-4 w-4 mr-1" />
            Önizleme
          </Label>
          <div className="relative h-24 rounded-lg overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient_colors} z-10`}></div>
            <img
              src={slide.image_url}
              alt="Önizleme"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
              <div className="text-center text-white">
                <h5 className="font-bold text-sm mb-1">{slide.title}</h5>
                <p className="text-xs text-white/90">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AuthSlideItem;