import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import { Cookie, Settings, Edit, Mail, CheckCircle, BarChart2, UserCog } from 'lucide-react';

const Section = ({ icon, title, children }) => {
  const Icon = icon;
  return (
    <motion.div 
      className="mb-10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center mb-4">
        <div className="p-3 bg-primary/10 rounded-full mr-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-0 pt-0 border-none">{title}</h2>
      </div>
      <div className="pl-16 prose dark:prose-invert max-w-none">
        {children}
      </div>
    </motion.div>
  );
};

const CookiePolicyPage = () => {
  return (
    <>
      <Seo
        title="Çerez Politikası"
        description="HikayeGO çerez politikası. Web sitemizde çerezleri nasıl kullandığımızı ve tercihlerinizi nasıl yönetebileceğinizi öğrenin."
        url="/cookie-policy"
      />
      <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow container mx-auto py-16 sm:py-24 px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Çerez Politikası
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Son Güncelleme: 22 Ağustos 2025
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800/50 p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <Section icon={Cookie} title="1. Giriş">
              <p>HikayeGO olarak, web sitemizi ("Hizmet") ziyaret ettiğinizde deneyiminizi geliştirmek, hizmetlerimizi iyileştirmek ve güvenliği sağlamak amacıyla çerezler ve benzeri teknolojiler kullanıyoruz. Bu Çerez Politikası, hangi çerezleri, neden kullandığımızı ve bu çerezleri nasıl kontrol edebileceğinizi açıklamaktadır.</p>
            </Section>

            <Section icon={Cookie} title="2. Çerez Nedir?">
              <p>Çerezler, bir web sitesini ziyaret ettiğinizde bilgisayarınıza veya mobil cihazınıza indirilen küçük metin dosyalarıdır. Bu dosyalar, web sitesinin sizi ve tercihlerinizi (örneğin, oturum açma bilgileri, dil veya tema seçimi) hatırlamasına yardımcı olur, böylece siteyi her ziyaret ettiğinizde aynı bilgileri tekrar girmeniz gerekmez.</p>
            </Section>

            <Section icon={Settings} title="3. Kullandığımız Çerez Türleri">
              <p>Platformumuzda aşağıdaki çerez türlerini kullanmaktayız:</p>
              <ul>
                <li>
                  <strong><CheckCircle className="inline-block h-4 w-4 mr-2 text-green-500" />Kesinlikle Gerekli Çerezler:</strong> Bu çerezler, web sitemizin temel işlevlerinin çalışması için zorunludur. Örneğin, kullanıcı oturumlarını yönetmek, güvenliği sağlamak ve çerez onay durumunuzu hatırlamak için kullanılırlar. Bu çerezler olmadan hizmetlerimizi güvenli ve düzgün bir şekilde sunamayız.
                </li>
                <li>
                  <strong><BarChart2 className="inline-block h-4 w-4 mr-2 text-blue-500" />Performans ve Analitik Çerezler:</strong> Bu çerezler, ziyaretçilerin sitemizi nasıl kullandığı hakkında anonim bilgiler toplar. Hangi sayfaların en popüler olduğunu, kullanıcıların sitede ne kadar zaman geçirdiğini ve hangi hatalarla karşılaştıklarını anlamamıza yardımcı olur. Bu verileri, sitemizin performansını ve kullanıcı deneyimini sürekli olarak iyileştirmek için kullanırız.
                </li>
                <li>
                  <strong><UserCog className="inline-block h-4 w-4 mr-2 text-purple-500" />İşlevsellik Çerezleri:</strong> Bu çerezler, sitemizi daha kişisel bir deneyim haline getirmek için kullanılır. Örneğin, seçtiğiniz tema (karanlık/aydınlık mod) veya dil tercihi gibi ayarlarınızı hatırlamamızı sağlarlar.
                </li>
              </ul>
              <p className="mt-4"><strong>Hedefleme ve Reklam Çerezleri:</strong> Şu anda platformumuzda üçüncü taraf reklam çerezleri kullanmıyoruz. Gelecekte bu politikayı değiştirirsek, bu bölümü güncelleyerek sizi bilgilendireceğiz.</p>
            </Section>

            <Section icon={Settings} title="4. Çerezleri Nasıl Yönetebilirsiniz?">
              <p>Çerez tercihlerinizi yönetme hakkına sahipsiniz. Çoğu web tarayıcısı, çerezleri kabul edecek şekilde ayarlanmıştır, ancak genellikle tarayıcınızın ayarlarını değiştirerek çerezleri reddedebilir veya bir çerez gönderildiğinde sizi uyaracak şekilde yapılandırabilirsiniz.</p>
              <p>Lütfen unutmayın ki, kesinlikle gerekli çerezleri devre dışı bırakırsanız, web sitemizin bazı bölümleri (örneğin, oturum açma) beklendiği gibi çalışmayabilir.</p>
              <p>Sitemizi ilk ziyaretinizde size sunulan çerez onay banner'ı aracılığıyla da tercihlerinizi belirtebilirsiniz. Onayınızı verdikten sonra, bu tercihiniz bir çerez aracılığıyla saklanır ve banner bir sonraki ziyaretinizde tekrar gösterilmez.</p>
            </Section>

            <Section icon={Edit} title="5. Politikadaki Değişiklikler">
              <p>Bu Çerez Politikasını zaman zaman güncelleyebiliriz. Değişiklikler, bu sayfada yayınlandığı anda yürürlüğe girer. Politikayı düzenli olarak gözden geçirmenizi öneririz.</p>
            </Section>

            <Section icon={Mail} title="6. İletişim">
              <p>Çerez politikamız hakkında daha fazla bilgi almak isterseniz, lütfen bizimle <a href="mailto:contact@hikayego.com">contact@hikayego.com</a> e-posta adresi üzerinden iletişime geçin.</p>
            </Section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CookiePolicyPage;