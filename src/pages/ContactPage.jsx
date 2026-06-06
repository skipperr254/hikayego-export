import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Send, Loader2, Building, MessageSquare, Users } from 'lucide-react';
import Seo from '@/components/Seo';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ContactPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: user?.profile?.name || '',
    email: user?.email || '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubjectChange = (value) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: 'Eksik Alanlar',
        description: 'Lütfen tüm alanları doldurun.',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          from_name: formData.name,
          from_email: formData.email,
          subject: `İletişim Formu: ${formData.subject}`,
          body: `
            <p><strong>Gönderen:</strong> ${formData.name}</p>
            <p><strong>E-posta:</strong> ${formData.email}</p>
            <hr>
            <p>${formData.message.replace(/\n/g, '<br>')}</p>
          `,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Mesajınız Gönderildi! 🚀',
        description: 'En kısa sürede size geri dönüş yapacağız.',
      });
      setFormData({ name: user?.profile?.name || '', email: user?.email || '', subject: '', message: '' });
    } catch (error) {
      toast({
        title: 'Hata',
        description: `Mesaj gönderilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin veya bize contact@hikayego.com adresinden ulaşın.`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Genel Sorular',
      value: 'contact@hikayego.com',
      href: 'mailto:contact@hikayego.com',
    },
    {
      icon: Building,
      title: 'İşbirlikleri',
      value: 'Lütfen iletişim formunu doldurun.',
      href: '#contact-form',
    },
    {
      icon: Users,
      title: 'Topluluk',
      value: 'Topluluk forumumuza katılın',
      href: '/community',
    },
  ];

  return (
    <>
      <Seo
        title="İletişim"
        description="Bizimle iletişime geçin. Soru, öneri veya işbirliği talepleriniz için buradayız."
      />
      <div className="bg-slate-50 dark:bg-background text-foreground min-h-screen flex flex-col">
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
                  <MessageSquare className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Bizimle İletişime Geçin
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                  Soru, öneri veya herhangi bir konuda bize ulaşmaktan çekinmeyin. Ekibimiz size yardımcı olmaktan mutluluk duyar.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="container mx-auto px-4 pb-24 -mt-10">
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                {contactInfo.map((item, index) => (
                  <a 
                    key={index} 
                    href={item.href} 
                    onClick={(e) => { if(item.href === '#contact-form') { e.preventDefault(); document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' }); } }}
                    className="flex items-start space-x-5 p-6 bg-card rounded-xl shadow-sm hover:shadow-lg hover:bg-card/90 transition-all border border-transparent hover:border-primary/20"
                  >
                    <div className="flex-shrink-0 bg-primary/10 text-primary p-4 rounded-lg">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-md text-muted-foreground transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-3"
                id="contact-form"
              >
                <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-card rounded-xl shadow-xl border-t-4 border-primary">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="font-semibold">Adınız Soyadınız</Label>
                      <Input id="name" placeholder="Adınız Soyadınız" value={formData.name} onChange={handleChange} required className="h-12 text-base" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-semibold">E-posta Adresiniz</Label>
                      <Input id="email" type="email" placeholder="ornek@eposta.com" value={formData.email} onChange={handleChange} required className="h-12 text-base" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="font-semibold">Konu</Label>
                    <Select onValueChange={handleSubjectChange} value={formData.subject}>
                      <SelectTrigger className="h-12 text-base">
                        <SelectValue placeholder="Mesajınızın konusunu seçin..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Teknik Destek">Teknik Destek</SelectItem>
                        <SelectItem value="Öneri ve Geri Bildirim">Öneri ve Geri Bildirim</SelectItem>
                        <SelectItem value="Abonelik ve Ödemeler">Abonelik ve Ödemeler</SelectItem>
                        <SelectItem value="İşbirliği Talebi">İşbirliği Talebi</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="font-semibold">Mesajınız</Label>
                    <Textarea id="message" placeholder="Bize ne söylemek istersiniz?" rows={6} value={formData.message} onChange={handleChange} required className="text-base" />
                  </div>
                  <Button type="submit" className="w-full text-lg py-6 font-bold" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" /> Mesajı Gönder
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ContactPage;