import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Users, Sparkles, Heart, BrainCircuit, ArrowRight } from 'lucide-react';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const AboutPage = () => {
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const features = [{
    icon: BookOpen,
    title: 'Sürükleyici Hikayeler',
    description: 'Her seviyeye uygun, özenle hazırlanmış hikayelerle İngilizceyi doğal akışında öğrenin.'
  }, {
    icon: BrainCircuit,
    title: 'Akıllı Kelime Asistanı',
    description: 'Anlamını bilmediğiniz kelimelere anında ulaşın, kaydedin ve interaktif alıştırmalarla pekiştirin.'
  }, {
    icon: Sparkles,
    title: 'Etkileşimli Aktiviteler',
    description: 'Öğrendiklerinizi test eden, sıkılmadan pratik yapmanızı sağlayan eğlenceli quizler ve aktiviteler.'
  }];

  const values = [{
    icon: Heart,
    title: 'Öğrenme Aşkı',
    description: 'Öğrenmenin bir tutku olduğuna inanıyor ve bu tutkuyu her kullanıcımıza aşılamayı hedefliyoruz.'
  }, {
    icon: Sparkles,
    title: 'Yenilikçilik',
    description: 'Teknolojinin sınırlarını zorlayarak dil öğrenimini sürekli daha etkili ve keyifli hale getiriyoruz.'
  }, {
    icon: Users,
    title: 'Topluluk',
    description: 'Birlikte öğrenen, birbirine destek olan ve büyüyen küresel bir topluluk inşa ediyoruz.'
  }];

  return (
    <>
      <Seo
        title="Hakkımızda"
        description="HikayeGO'nun misyonu, vizyonu ve hikayesi. İngilizce öğrenimini nasıl daha keyifli, etkili ve sürükleyici bir maceraya dönüştürdüğümüzü keşfedin."
        url="/about"
        keywords="HikayeGO hakkında, misyon, vizyon, İngilizce öğrenme platformu, dil eğitimi hikayesi"
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow">
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent dark:from-primary/10"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="container mx-auto px-6 py-24 text-center relative z-10"
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter font-serif">
                Biz <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 text-transparent bg-clip-text animated-gradient-text">HikayeGO</span>'yuz
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground">
                Dil öğrenimini bir görev olmaktan çıkarıp, her gün dört gözle bekleyeceğiniz keyifli bir maceraya dönüştürmek için buradayız.
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="container mx-auto px-6 py-20"
          >
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              <motion.div variants={itemVariants}>
                <LazyImage
                  alt="HikayeGO ekibi beyin fırtınası yaparken"
                  className="rounded-2xl shadow-2xl aspect-video object-cover w-full h-full"
                  src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/28315ba913efbcfe63bc9b82513478ac.jpg"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Hikayemiz</h2>
                <p className="text-muted-foreground text-lg">HikayeGO, dil öğrenmenin sıkıcı ve monoton olabileceği algısını kırma hayaliyle doğdu. HikayeGO takımı aynı zamanda birer İngilizce öğretmenleri olarak, öğrencilerimizin kendi dil öğrenme maceralarında hikayelerin ne kadar güçlü bir araç olduğunu fark ettik. Bu farkındalık, teknolojiyi ve pedagojiyi birleştirerek, herkesin kendi hızında ve ilgi alanlarına göre öğrenebileceği bir platform yaratma tutkusuna dönüştü.</p>
                <p className="text-muted-foreground text-lg">Bugün, binlerce kelime ve yüzlerce hikayeyle, dil öğrenimini bir keşif yolculuğu haline getiriyoruz.</p>
              </motion.div>
            </div>
          </motion.div>

          <div className="bg-secondary/50 dark:bg-secondary/20">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="container mx-auto px-6 py-20"
            >
              <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
                <motion.div variants={itemVariants} className="space-y-8 order-2 md:order-1">
                  <div>
                    <h3 className="text-3xl font-bold flex items-center gap-3">
                      <Target className="h-8 w-8 text-primary" />
                      Misyonumuz
                    </h3>
                    <p className="mt-4 text-muted-foreground text-lg">
                      En etkili öğrenme yöntemlerini teknolojiyle birleştirerek, herkes için <strong className="text-foreground font-semibold">erişilebilir, eğlenceli ve sürükleyici</strong> bir İngilizce öğrenme deneyimi sunmak. Hikayelerin gücüne inanıyor ve her hikayenin yeni bir dünyaya açılan bir kapı olduğunu biliyoruz.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold flex items-center gap-3">
                      <Sparkles className="h-8 w-8 text-primary" />
                      Vizyonumuz
                    </h3>
                    <p className="mt-4 text-muted-foreground text-lg">
                      Dünya çapında milyonlarca insanın İngilizce öğrenme hedeflerine ulaşmalarını sağlayan, en sevilen ve en <strong className="text-foreground font-semibold">yenilikçi</strong> dil öğrenme platformu olmak.
                    </p>
                  </div>
                </motion.div>
                <motion.div variants={itemVariants} className="order-1 md:order-2">
                  <LazyImage
                    alt="Hedef tahtası ve başarıyı simgeleyen oklar"
                    className="rounded-2xl shadow-2xl aspect-square object-cover w-full h-full"
                    src="https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/0592f816d007e41e1ab0126646781eff.png"
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="container mx-auto px-6 py-20"
          >
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Neler Sunuyoruz?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                HikayeGO, dil öğrenimini çok yönlü bir deneyim haline getiren özelliklerle donatılmıştır.
              </p>
            </div>
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-card p-8 rounded-2xl border shadow-lg hover:shadow-primary/10 transition-shadow duration-300 flex flex-col items-start"
                >
                  <div className="bg-primary/10 p-3 rounded-lg mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="bg-secondary/50 dark:bg-secondary/20">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="container mx-auto px-6 py-20"
            >
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Değerlerimiz</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Yaptığımız her işin temelinde bu üç değer yatıyor. Onlar bizim pusulamız.
                </p>
              </div>
              <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <motion.div key={index} variants={itemVariants} className="text-center p-8">
                    <div className="inline-block bg-primary/10 p-4 rounded-full mb-4">
                      <value.icon className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="mt-2 text-muted-foreground">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1 }}
            className="container mx-auto px-6 py-20"
          >
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 md:p-12 rounded-2xl text-center text-white shadow-2xl">
              <h2 className="text-3xl md:text-4xl font-bold">Maceraya Katılın!</h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg opacity-90">
                Bir sorunuz mu var veya bir sorunla mı karşılaştınız? Ekibimiz size yardımcı olmak için burada. Bizimle iletişime geçmekten çekinmeyin.
              </p>
              <Button asChild size="lg" variant="secondary" className="mt-8 font-bold text-lg">
                <Link to="/contact">
                  Bize Ulaşın <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;