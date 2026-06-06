import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Upload, X, Trash2, Eye, Loader2, FileImage, Image } from 'lucide-react';

const gradientOptions = [
  { value: 'from-blue-600/90 via-purple-600/80 to-pink-600/70', label: 'Mavi-Mor-Pembe', preview: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600' },
  { value: 'from-green-600/90 via-teal-600/80 to-blue-600/70', label: 'Yeşil-Teal-Mavi', preview: 'bg-gradient-to-r from-green-600 via-teal-600 to-blue-600' },
  { value: 'from-orange-600/90 via-red-600/80 to-pink-600/70', label: 'Turuncu-Kırmızı-Pembe', preview: 'bg-gradient-to-r from-orange-600 via-red-600 to-pink-600' },
  { value: 'from-purple-600/90 via-pink-600/80 to-red-600/70', label: 'Mor-Pembe-Kırmızı', preview: 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600' },
  { value: 'from-emerald-600/90 via-cyan-600/80 to-blue-600/70', label: 'Zümrüt-Cyan-Mavi', preview: 'bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600' },
  { value: 'from-amber-600/90 via-orange-600/80 to-red-600/70', label: 'Amber-Turuncu-Kırmızı', preview: 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600' }
];

const SlideItem = ({ slide, index, onChange, onRemove }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    onChange(index, field, value);
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ 
        title: "Hata", 
        description: "Lütfen geçerli bir resim dosyası seçin (JPG, PNG, WebP).", 
        variant: "destructive" 
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ 
        title: "Hata", 
        description: "Resim dosyası 5MB'dan küçük olmalıdır.", 
        variant: "destructive" 
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `auth-slide-${index}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('story_images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('story_images')
        .getPublicUrl(fileName);

      handleInputChange('image_url', publicUrl);
      toast({ 
        title: "Başarılı", 
        description: "Resim başarıyla yüklendi ve slide'a eklendi." 
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({ 
        title: "Hata", 
        description: "Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 border rounded-lg space-y-6 bg-card shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{index + 1}</span>
          </div>
          <h4 className="font-semibold text-lg">Slide {index + 1}</h4>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor={`active-switch-${index}`} className="text-sm font-medium">Aktif</Label>
            <Switch
              id={`active-switch-${index}`}
              checked={slide.is_active}
              onCheckedChange={(checked) => onChange(index, 'is_active', checked)}
            />
          </div>
          <Button
            onClick={() => onRemove(index)}
            size="sm"
            variant="destructive"
            className="hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium flex items-center mb-2">
              <Image className="h-4 w-4 mr-2" />
              Slide Resmi
            </Label>
            {slide.image_url ? (
              <div className="relative group">
                <img 
                  src={slide.image_url} 
                  alt={`Slide ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg border shadow-sm"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => document.getElementById(`file-input-${index}`).click()}
                  >
                    <FileImage className="h-4 w-4 mr-2" />
                    Değiştir
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleInputChange('image_url', '')}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Kaldır
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                {uploading ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-3"/>
                    <p className="text-sm text-muted-foreground">Resim yükleniyor...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-3">
                      Slide için resim yükleyin
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById(`file-input-${index}`).click()}
                      className="hover:bg-primary hover:text-primary-foreground"
                    >
                      <FileImage className="h-4 w-4 mr-2" />
                      Dosya Seç
                    </Button>
                  </>
                )}
              </div>
            )}
            <input
              id={`file-input-${index}`}
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
              className="hidden"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Gradient Rengi</Label>
            <Select
              value={slide.gradient_colors}
              onValueChange={(value) => handleInputChange('gradient_colors', value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {gradientOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full ${option.preview} border`}></div>
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Başlık</Label>
            <Input
              value={slide.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Slide başlığını girin"
              className="mt-2"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Alt Başlık / Açıklama</Label>
            <Textarea
              value={slide.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Slide açıklamasını girin"
              className="mt-2"
              rows={5}
            />
          </div>
        </div>
      </div>

      {slide.image_url && slide.title && slide.subtitle && (
        <div className="mt-6">
          <Label className="flex items-center mb-3 text-sm font-medium">
            <Eye className="h-4 w-4 mr-2" />
            Canlı Önizleme
          </Label>
          <div className="relative h-40 rounded-lg overflow-hidden border shadow-sm">
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient_colors} z-10`}></div>
            <img
              src={slide.image_url}
              alt="Önizleme"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
              <div className="text-center text-white">
                <h5 className="font-bold text-xl mb-2 drop-shadow-lg">{slide.title}</h5>
                <p className="text-sm text-white/90 drop-shadow-md leading-relaxed">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SlideItem;