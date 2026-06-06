import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { LifeBuoy, BookOpen, Crown, HelpCircle, Send } from 'lucide-react';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const generalFaqs = [
  {
    question: "HikayeGO nedir ve nasıl çalışır?",
    answer: "HikayeGO, İngilizce öğrenmeyi keyifli hale getiren bir platformdur. Seviyenize uygun hikayeler okuyarak, bilmediğiniz kelimelere tıklayarak anında çevirisini ve telaffuzunu öğrenirsiniz. Öğrendiğiniz kelimeleri kaydedip aktivitelerle pekiştirerek dil becerilerinizi geliştirirsiniz."
  },
  {
    question: "Hesap bilgilerimi (e-posta, şifre) nasıl değiştirebilirim?",
    answer: "Profil bilgilerinizi, şifrenizi ve avatarınızı 'Ayarlar' sayfasından kolayca güncelleyebilirsiniz. Ayarlar sayfasına, sağ üstteki profil menünüzden 'Ayarlar' bağlantısına tıklayarak ulaşabilirsiniz."
  },
  {
    question: "'Aktiviteler' bölümü ne işe yarar?",
    answer: "'Aktiviteler' bölümü, hikayelerden öğrendiğiniz kelimeleri pekiştirmenize yardımcı olur. Kaydettiğiniz kelimelerle oluşturulan kişiselleştirilmiş quizler ve kelime oyunları ile pratik yapabilirsiniz."
  },
  {
    question: "Gelişimimi nasıl takip edebilirim?",
    answer: "Okuma geçmişiniz, kaydettiğiniz kelimeler ve quiz sonuçlarınız profiliniz altında takip edilir. 'Aktiviteler' sayfasından kelime dağarcığınızın ne kadar genişlediğini görebilir ve pratik yapabilirsiniz."
  },
  {
    question: "Kelime asistanı nasıl çalışır?",
    answer: "Hikaye okurken anlamını bilmediğiniz bir kelimeye tıkladığınızda, kelime asistanı anında kelimenin Türkçe çevirisini, telaffuzunu ve örnek cümle içindeki kullanımını gösterir. 'Kaydet' butonuna basarak bu kelimeyi kişisel kelime listenize ekleyebilirsiniz."
  },
  {
    question: "Yeni hikayeler ne sıklıkla ekleniyor?",
    answer: "Platformumuza düzenli olarak yeni hikayeler ve içerikler eklemeye özen gösteriyoruz. Her seviyeden kullanıcı için sürekli olarak yeni maceralar sunmayı hedefliyoruz."
  }
];

const premiumFaqs = [
  {
    question: "HikayeGO Premium aboneliği ne gibi avantajlar sunuyor?",
    answer: "Premium abonelik; tüm seviyelerdeki hikayelere sınırsız erişim, gelişmiş sesli okuma, sınırsız kelime kaydetme, kişiselleştirilmiş kelime listeleri, favorilere ekleme ve tamamen reklamsız bir deneyim gibi birçok ayrıcalık sunar."
  },
  {
    question: "Premium özellikler öğrenme sürecimi nasıl hızlandırır?",
    answer: "Sınırsız içerik erişimi ve kelime kaydetme sayesinde daha fazla pratik yapabilirsiniz. Sesli okuma özelliği telaffuzunuzu geliştirirken, yapay zeka asistanı size özel tavsiyeler sunar. Reklamsız arayüz ise dikkatiniz dağılmadan tamamen öğrenmeye odaklanmanızı sağlar."
  },
  {
    question: "Aboneliğimi nasıl başlatabilirim?",
    answer: "Abonelik sayfamızdan 'Premium'a Geç' butonuna tıklayarak ve güvenli ödeme adımlarını takip ederek aboneliğinizi kolayca başlatabilirsiniz. Ödemeniz onaylandığı anda tüm premium özellikler hesabınızda aktif olacaktır."
  },
  {
    question: "Ödeme yöntemleri güvenli mi?",
    answer: "Evet, kesinlikle. Ödemeleriniz, uluslararası PCI DSS standartlarına sahip Iyzico altyapısı kullanılarak güvenli bir şekilde işlenir. Kart bilgileriniz hiçbir zaman sunucularımızda saklanmaz."
  },
  {
    question: "Aboneliğimi istediğim zaman iptal edebilir miyim?",
    answer: "Evet, aboneliğinizi 'Ayarlar' sayfasındaki 'Abonelik' bölümünden taahhütsüz bir şekilde istediğiniz zaman iptal edebilirsiniz. İptal işlemi, mevcut fatura döneminizin sonunda geçerli olur ve o zamana kadar premium özelliklerden yararlanmaya devam edersiniz."
  },
  {
    question: "Aboneliğimi iptal edersem kaydettiğim kelimelere ne olur?",
    answer: "Aboneliğiniz sona erdiğinde, premium özellikler (sınırsız kelime listesi gibi) kısıtlanır. Ancak temel özellikler dahilinde kaydettiğiniz kelimelere ve verilerinize erişmeye devam edersiniz."
  }
];

const FaqSection = ({ title, icon: Icon, faqs, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="w-full"
  >
    <div className="flex items-center mb-6">
      <Icon className="h-8 w-8 text-primary mr-4" />
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
    </div>
    <Accordion type="single" collapsible className="w-full bg-card p-6 rounded-2xl shadow-sm border">
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
          <AccordionTrigger className="text-lg text-left font-semibold hover:no-underline text-card-foreground">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </motion.div>
);

const HelpCenterPage = () => {
  return (
    <>
      <Seo
        title="Yardım Merkezi"
        description="HikayeGO hakkında sıkça sorulan sorular ve cevapları. Hesap yönetimi, abonelik, premium özellikler ve platform kullanımı hakkında bilgi alın."
        url="/help-center"
        keywords="yardım merkezi, sıkça sorulan sorular, SSS, hikayego yardım, hesap yönetimi, abonelik iptali, premium üyelik"
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
                  <LifeBuoy className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Size Nasıl Yardımcı Olabiliriz?
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
                  Aklınıza takılan soruların cevaplarını burada bulabilirsiniz. Aradığınızı bulamazsanız, bizimle iletişime geçmekten çekinmeyin.
                </p>
              </motion.div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <FaqSection title="Genel Sorular" icon={HelpCircle} faqs={generalFaqs} delay={0.2} />
              <FaqSection title="Premium & Abonelik" icon={Crown} faqs={premiumFaqs} delay={0.4} />
            </div>
          </div>

          <div className="container mx-auto px-6 pb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-card border border-border/50 rounded-2xl p-8 md:p-12 text-center"
            >
              <h3 className="text-2xl md:text-3xl font-bold">Aradığınızı Bulamadınız mı?</h3>
              <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
                Sorun değil! Destek ekibimiz size yardımcı olmak için burada. Bize bir mesaj gönderin, en kısa sürede size geri dönelim.
              </p>
              <Link to="/contact">
                <Button size="lg" className="mt-6 font-bold">
                  <Send className="mr-2 h-5 w-5" />
                  Bize Ulaşın
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HelpCenterPage;