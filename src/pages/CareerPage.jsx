import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Briefcase, Loader2, Send } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Seo from '@/components/Seo';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';

const CareerPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    email: user?.email || '',
    position: '',
    resumeUrl: '',
    coverLetter: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const emailBody = `
      <h2>Yeni Kariyer Başvurusu</h2>
      <p><strong>İsim:</strong> ${formData.name}</p>
      <p><strong>E-posta:</strong> ${formData.email}</p>
      <p><strong>İlgilenilen Pozisyon:</strong> ${formData.position}</p>
      <p><strong>CV/LinkedIn:</strong> <a href="${formData.resumeUrl}">${formData.resumeUrl}</a></p>
      <hr>
      <h3>Ön Yazı:</h3>
      <p>${formData.coverLetter.replace(/\n/g, '<br>')}</p>
    `;

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          subject: `Kariyer Başvurusu: ${formData.position}`,
          body: emailBody,
          from_name: formData.name,
          from_email: formData.email,
        }
      });

      if (error) throw error;
      
      toast({
        title: "Başvurunuz Alındı!",
        description: "İnceleyip en kısa sürede size geri dönüş yapacağız. İlginiz için teşekkürler!",
      });
      e.target.reset();
      setFormData({
        name: user?.profile?.name || '',
        email: user?.email || '',
        position: '',
        resumeUrl: '',
        coverLetter: '',
      });
    } catch (error) {
      console.error('Career submission error:', error);
      toast({
        title: "Hata!",
        description: "Başvurunuz gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Kariyer"
        description="HikayeGO ekibine katılın. Açık pozisyonları inceleyin ve dil öğreniminin geleceğini şekillendirmemize yardımcı olun."
        url="/career"
      />
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-background">
        <Navbar />
        <main className="flex-grow">
          <div className="relative bg-gradient-to-b from-primary/10 to-transparent pt-24 pb-20">
            <div className="container mx-auto px-6 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-6">
                  <Briefcase className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Geleceği Birlikte Şekillendirelim
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                  Dil öğrenimini yeniden tanımlama misyonumuza ortak olacak tutkulu ve yenilikçi yetenekler arıyoruz.
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="container mx-auto px-6 pb-24 -mt-10"
          >
            <Card className="max-w-4xl mx-auto shadow-xl border-t-4 border-primary">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Genel Başvuru</CardTitle>
                <CardDescription className="text-md">Size uygun bir pozisyon bulamadıysanız, yeteneklerinizi ve hedeflerinizi bizimle paylaşın.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8 p-2 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold">Adınız Soyadınız</Label>
                      <Input id="name" value={formData.name} onChange={handleChange} required disabled={loading} className="h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">E-posta Adresiniz</Label>
                      <Input id="email" type="email" value={formData.email} onChange={handleChange} required disabled={loading} className="h-12 text-base" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="font-semibold">İlgilendiğiniz Alan/Pozisyon</Label>
                    <Input id="position" value={formData.position} onChange={handleChange} placeholder="Örn: Frontend Geliştirici, İçerik Üretici, Pazarlama Uzmanı" required disabled={loading} className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resumeUrl" className="font-semibold">CV (LinkedIn veya Portfolyo URL)</Label>
                    <Input id="resumeUrl" type="url" value={formData.resumeUrl} onChange={handleChange} placeholder="https://www.linkedin.com/in/kullaniciadi/" required disabled={loading} className="h-12 text-base" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter" className="font-semibold">Neden Biz?</Label>
                    <Textarea id="coverLetter" value={formData.coverLetter} onChange={handleChange} rows={6} placeholder="Bize kendinizden, tutkularınızdan ve neden HikayeGO ekibinin bir parçası olmak istediğinizden bahsedin." required disabled={loading} className="text-base" />
                  </div>
                  <Button type="submit" className="w-full text-lg py-6 font-bold" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Başvuruyu Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CareerPage;