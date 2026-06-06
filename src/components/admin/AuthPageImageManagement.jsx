import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, X, Loader2, Image as ImageIcon, Save } from 'lucide-react';

const AuthPageImageManagement = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState({
    login: { image_url: '', title: '', subtitle: '' },
    register: { image_url: '', title: '', subtitle: '' }
  });

  useEffect(() => {
    fetchAuthImages();
  }, []);

  const fetchAuthImages = async () => {
    try {
      const { data, error } = await supabase
        .from('auth_page_images')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const imageData = {
        login: { image_url: '', title: '', subtitle: '' },
        register: { image_url: '', title: '', subtitle: '' }
      };

      data.forEach(item => {
        imageData[item.page_type] = {
          id: item.id,
          image_url: item.image_url,
          title: item.title || '',
          subtitle: item.subtitle || ''
        };
      });

      setImages(imageData);
    } catch (error) {
      console.error('Error fetching auth images:', error);
      toast({
        title: "Hata",
        description: "Resimler yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleImageUpload = async (pageType, file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Hata",
        description: "Lütfen geçerli bir resim dosyası seçin.",
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
      const fileName = `auth-${pageType}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('story_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('story_images')
        .getPublicUrl(fileName);

      setImages(prev => ({
        ...prev,
        [pageType]: {
          ...prev[pageType],
          image_url: publicUrl
        }
      }));

      toast({
        title: "Başarılı",
        description: "Resim başarıyla yüklendi.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Hata",
        description: "Resim yüklenirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (pageType) => {
    setLoading(true);
    try {
      const imageData = images[pageType];
      
      const { error } = await supabase
        .from('auth_page_images')
        .upsert({
          page_type: pageType,
          image_url: imageData.image_url,
          title: imageData.title,
          subtitle: imageData.subtitle,
          is_active: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'page_type'
        });

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `${pageType === 'login' ? 'Giriş' : 'Kayıt'} sayfası güncellendi.`,
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

  const handleInputChange = (pageType, field, value) => {
    setImages(prev => ({
      ...prev,
      [pageType]: {
        ...prev[pageType],
        [field]: value
      }
    }));
  };

  const renderImageEditor = (pageType, title) => {
    const imageData = images[pageType];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ImageIcon className="mr-2 h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Resim</Label>
            {imageData.image_url ? (
              <div className="relative mt-2">
                <img 
                  src={imageData.image_url} 
                  alt={`${pageType} sayfası resmi`}
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleInputChange(pageType, 'image_url', '')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center mt-2">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  Resim yüklemek için tıklayın
                </p>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(pageType, e.target.files?.[0])}
                  disabled={uploading}
                  className="cursor-pointer"
                />
              </div>
            )}
            {uploading && (
              <div className="flex items-center justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Yükleniyor...</span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor={`${pageType}-title`}>Başlık</Label>
            <Input
              id={`${pageType}-title`}
              value={imageData.title}
              onChange={(e) => handleInputChange(pageType, 'title', e.target.value)}
              placeholder="Sayfa başlığı"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor={`${pageType}-subtitle`}>Alt Başlık</Label>
            <Textarea
              id={`${pageType}-subtitle`}
              value={imageData.subtitle}
              onChange={(e) => handleInputChange(pageType, 'subtitle', e.target.value)}
              placeholder="Sayfa alt başlığı"
              className="mt-1"
              rows={3}
            />
          </div>

          <Button 
            onClick={() => handleSave(pageType)}
            disabled={loading || !imageData.image_url}
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
                Kaydet
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Giriş/Kayıt Sayfası Görselleri</h2>
        <p className="text-muted-foreground">
          Giriş ve kayıt sayfalarındaki görselleri ve metinleri yönetin.
        </p>
      </div>

      <Tabs defaultValue="login" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Giriş Sayfası</TabsTrigger>
          <TabsTrigger value="register">Kayıt Sayfası</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          {renderImageEditor('login', 'Giriş Sayfası Görseli')}
        </TabsContent>

        <TabsContent value="register">
          {renderImageEditor('register', 'Kayıt Sayfası Görseli')}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPageImageManagement;