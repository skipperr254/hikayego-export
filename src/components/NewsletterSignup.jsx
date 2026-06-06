import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail, Send, Loader2, ArrowRight } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: 'Geçersiz E-posta',
        description: 'Lütfen geçerli bir e-posta adresi girin.',
        variant: 'destructive',
      });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: 'Zaten Abonesiniz!',
            description: 'Bu e-posta adresi zaten bültenimize kayıtlı.',
            variant: 'default',
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: 'Aramıza Hoş Geldin! 🎉',
          description: 'Bültenimize başarıyla kaydoldun. Gelişmelerden haberdar olacaksın!',
        });
        setEmail('');
      }
    } catch (err) {
      toast({
        title: 'Bir Hata Oluştu',
        description: 'Bültene kaydolurken bir sorun yaşandı. Lütfen daha sonra tekrar dene.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12 mb-12 border-b border-border/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-2 gap-8 items-center"
        >
          <div>
            <h3 className="text-2xl font-bold tracking-tight">
              Gelişmelerden İlk Sen Haberdar Ol!
            </h3>
            <p className="mt-2 text-muted-foreground">
              Yeni eklenen hikayeler, özellikler ve özel teklifler için bültenimize kaydol.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-3 w-full">
            <div className="relative flex-grow w-full">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="pl-10 h-12 text-base bg-secondary border-border focus:bg-background focus:ring-2 focus:ring-primary focus-visible:ring-primary transition-all"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 w-auto shrink-0 group"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <span className="hidden sm:inline">Abone Ol</span>
                  <ArrowRight className="h-5 w-5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </motion.div>
    </div>
  );
};

export default NewsletterSignup;