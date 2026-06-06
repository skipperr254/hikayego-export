import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, BookOpen } from 'lucide-react';
import Seo from '@/components/Seo';

const CommunityPage = () => {
  const { user } = useAuth();

  return (
    <>
      <Seo
        title="Topluluk"
        description="HikayeGO topluluğuna katılın. Diğer öğrencilerle tanışın, pratik yapın ve birlikte öğrenin."
        url="/community"
      />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto py-16 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Users className="h-16 w-16 mx-auto text-primary mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold">
              HikayeGO <span className="gradient-text">Topluluğuna</span> Hoş Geldin
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Burası, dil öğrenenlerin bir araya geldiği, deneyimlerini paylaştığı ve birbirlerine ilham verdiği yer. Birlikte öğrenmek her zaman daha keyifli!
            </p>
          </motion.div>

          <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <div className="p-8 rounded-lg bg-secondary">
                <MessageSquare className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Forumlar</h3>
                <p className="text-muted-foreground mb-4">
                  Okuduğunuz hikayeler hakkında tartışın, sorular sorun ve İngilizce pratik yapın.
                </p>
                <Button variant="outline" disabled>Çok Yakında</Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="p-8 rounded-lg bg-secondary">
                <BookOpen className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Kitap Kulübü</h3>
                <p className="text-muted-foreground mb-4">
                  Her ay seçilen bir hikayeyi birlikte okuyup, canlı etkinliklerde tartışıyoruz.
                </p>
                <Button variant="outline" disabled>Çok Yakında</Button>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <div className="p-8 rounded-lg bg-secondary">
                <Users className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-2xl font-bold mb-2">Gruplar</h3>
                <p className="text-muted-foreground mb-4">
                  Kendi seviyenizdeki veya ilgi alanlarınızdaki diğer öğrencilerle küçük gruplar oluşturun.
                </p>
                <Button variant="outline" disabled>Çok Yakında</Button>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.8 }}
            className="text-center mt-16"
          >
            <h2 className="text-3xl font-bold">Topluluk yakında burada olacak!</h2>
            <p className="text-muted-foreground mt-2">Bu özellikleri geliştirmek için heyecanla çalışıyoruz.</p>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default CommunityPage;