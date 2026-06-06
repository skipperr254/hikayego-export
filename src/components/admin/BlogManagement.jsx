import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Edit, Trash2, Upload, X, Star } from 'lucide-react';
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
import TiptapEditor from './TiptapEditor';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';

const MAX_HOT_TOPICS = 3;

const BlogManagement = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);
  const [hotTopicsCount, setHotTopicsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState(null);
  const [form, setForm] = useState({
    title: '',
    content: '',
    excerpt: '',
    image_url: '',
    author_name: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
    keywords: '',
    is_hot_topic: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    if (error) {
      toast({ title: "Hata", description: "Blog yazıları getirilemedi.", variant: "destructive" });
    } else {
      setPosts(data);
      setHotTopicsCount(data.filter(p => p.is_hot_topic).length);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleContentChange = (newContent) => {
    setForm(prev => ({ ...prev, content: newContent }));
  };

  const resetForm = () => {
    setEditingPost(null);
    setForm({
      title: '',
      content: '',
      excerpt: '',
      image_url: '',
      author_name: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
      keywords: '',
      is_hot_topic: false,
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: "Hata", description: "Lütfen geçerli bir resim dosyası seçin.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Hata", description: "Resim dosyası 5MB'dan küçük olmalıdır.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('blog_images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('blog_images').getPublicUrl(fileName);
      setForm(prev => ({ ...prev, image_url: publicUrl }));
      toast({ title: "Başarılı", description: "Resim yüklendi." });
    } catch (error) {
      toast({ title: "Hata", description: `Resim yüklenemedi: ${error.message}`, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!form.image_url) return;
    const fileName = form.image_url.split('/').pop();
    try {
      await supabase.storage.from('blog_images').remove([fileName]);
    } catch (error) {
      console.error("Resim silinirken hata:", error);
    }
    setForm(prev => ({ ...prev, image_url: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
        toast({ title: "Hata", description: "Başlık ve içerik alanları zorunludur.", variant: "destructive" });
        return;
    }
    setIsSubmitting(true);
    
    const postData = { ...form };
    if (!editingPost) {
      postData.published_at = new Date().toISOString();
    }

    let result;
    if (editingPost) {
      result = await supabase.from('blog_posts').update(postData).eq('id', editingPost.id).select().single();
    } else {
      result = await supabase.from('blog_posts').insert(postData).select().single();
    }

    if (result.error) {
      toast({ title: "Hata", description: `Yazı kaydedilemedi: ${result.error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: `Yazı ${editingPost ? 'güncellendi' : 'oluşturuldu'}.` });
      resetForm();
      fetchPosts();
    }
    setIsSubmitting(false);
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setForm({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      image_url: post.image_url || '',
      author_name: post.author_name || '',
      status: post.status || 'draft',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      keywords: post.keywords || '',
      is_hot_topic: post.is_hot_topic || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) {
      toast({ title: "Hata", description: "Yazı silinemedi.", variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Yazı silindi." });
      fetchPosts();
    }
  };

  const handleHotTopicChange = (checked) => {
    if (checked && hotTopicsCount >= MAX_HOT_TOPICS && !editingPost?.is_hot_topic) {
      toast({
        title: "Limit Aşıldı",
        description: `En fazla ${MAX_HOT_TOPICS} adet "Hot Topic" seçebilirsiniz.`,
        variant: "destructive",
      });
      return;
    }
    setForm(prev => ({ ...prev, is_hot_topic: checked }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingPost ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı Oluştur'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="title">Başlık</Label>
                <Input id="title" name="title" value={form.title} onChange={handleInputChange} required />
              </div>
              <div className="space-y-1">
                <Label htmlFor="author_name">Yazar Adı</Label>
                <Input id="author_name" name="author_name" value={form.author_name} onChange={handleInputChange} />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label>Görsel</Label>
              {form.image_url ? (
                <div className="relative group">
                  <img src={form.image_url} alt="Blog görseli" className="w-full h-48 object-cover rounded-md border" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleRemoveImage}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Görsel yüklemek için tıklayın veya sürükleyip bırakın</p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 5MB)</p>
                  <Input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
                </div>
              )}
              {isUploading && <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...</div>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="excerpt">Özet (Arama motorları için)</Label>
              <Input id="excerpt" name="excerpt" value={form.excerpt} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="content">İçerik</Label>
              <TiptapEditor content={form.content} onChange={handleContentChange} />
            </div>
            <h3 className="text-lg font-semibold pt-4 border-t">SEO & Yayın Ayarları</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="status">Durum</Label>
                  <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayınlandı</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="is_hot_topic" className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>Hot Topic Olarak Ayarla</span>
                </Label>
                <Switch
                  id="is_hot_topic"
                  checked={form.is_hot_topic}
                  onCheckedChange={handleHotTopicChange}
                />
                <p className="text-xs text-muted-foreground">
                  {hotTopicsCount}/{MAX_HOT_TOPICS} seçili. En fazla {MAX_HOT_TOPICS} adet seçilebilir.
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="meta_title">Meta Başlık</Label>
              <Input id="meta_title" name="meta_title" value={form.meta_title} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="meta_description">Meta Açıklama</Label>
              <Input id="meta_description" name="meta_description" value={form.meta_description} onChange={handleInputChange} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="keywords">Anahtar Kelimeler (virgülle ayırın)</Label>
              <Input id="keywords" name="keywords" value={form.keywords} onChange={handleInputChange} />
            </div>
            <div className="flex justify-end gap-2">
              {editingPost && <Button type="button" variant="outline" onClick={resetForm}>İptal</Button>}
              <Button type="submit" disabled={isSubmitting || isUploading}>
                {(isSubmitting || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingPost ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mevcut Blog Yazıları</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
              {posts.map(post => (
                <motion.div 
                  key={post.id} 
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border p-4 rounded-lg flex justify-between items-center"
                >
                  <div className="flex items-center gap-4">
                    {post.image_url && <img src={post.image_url} alt={post.title} className="w-16 h-16 object-cover rounded-md" />}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{post.title}</h4>
                        {post.is_hot_topic && <Star className="h-4 w-4 text-amber-500 fill-amber-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{post.author_name} - {new Date(post.published_at).toLocaleDateString()}</p>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {post.status === 'published' ? 'Yayınlandı' : 'Taslak'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}><Edit className="h-4 w-4 mr-2"/>Düzenle</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-2"/>Sil</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{post.title}" başlıklı yazıyı kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(post.id)} className="bg-destructive hover:bg-destructive/90">Sil</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;