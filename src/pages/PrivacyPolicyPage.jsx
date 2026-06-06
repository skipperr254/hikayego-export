import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import { Shield, User, Database, Share2, Lock, Clock, UserCheck, Users, Edit, Mail } from 'lucide-react';

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

const PrivacyPolicyPage = () => {
  return (
    <>
      <Seo
        title="Gizlilik Politikası"
        description="HikayeGO gizlilik politikası. Verilerinizi nasıl topladığımız, kullandığımız ve koruduğumuz hakkında bilgi edinin."
        url="/privacy-policy"
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
              Gizlilik Politikası
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Son Güncelleme: 07 Eylül 2025
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800/50 p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <Section icon={User} title="1. Giriş">
              <p>
                HikayeGO ("biz", "bize", veya "bizim") olarak, gizliliğinize ve kişisel verilerinizin korunmasına büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi ve hizmetlerimizi ("Hizmet") kullandığınızda kişisel bilgilerinizi nasıl topladığımızı, kullandığımızı, paylaştığımızı ve koruduğumuzu ayrıntılı bir şekilde açıklamaktadır. Hizmetimizi kullanarak, bu politikada açıklanan uygulamaları kabul etmiş olursunuz.
              </p>
            </Section>

            <Section icon={Database} title="2. Topladığımız Bilgiler">
              <p>
                Hizmetlerimizi sunmak ve geliştirmek için çeşitli türde bilgiler topluyoruz:
              </p>
              <ul>
                <li><strong>Kayıt Bilgileri:</strong> Bir hesap oluşturduğunuzda, adınız, soyadınız ve e-posta adresiniz gibi bilgileri toplarız. Google gibi üçüncü taraf hizmetlerle kayıt olduğunuzda, bu hizmetlerden adınız ve e-posta adresiniz gibi temel profil bilgilerinizi alırız.</li>
                <li><strong>Profil Bilgileri:</strong> İsteğe bağlı olarak profilinize ekleyebileceğiniz avatar gibi ek bilgileri saklayabiliriz.</li>
                <li><strong>Kullanım ve İlerleme Verileri:</strong> Hangi hikayeleri okuduğunuz, hangi kelimeleri öğrendiğiniz, quiz sonuçlarınız, platformda ne kadar zaman geçirdiğiniz ve diğer etkileşimleriniz gibi öğrenme ilerlemenizle ilgili verileri toplarız.</li>
                <li><strong>Ödeme Bilgileri:</strong> Premium abonelik satın aldığınızda, ödeme işleminizi güvenli bir şekilde gerçekleştirmek için iyzico gibi üçüncü taraf ödeme işlemcileri kullanırız. Kredi kartı numaranız gibi hassas ödeme bilgilerinizi sunucularımızda saklamayız veya işlemeyiz. Yalnızca abonelik durumunuzu (aktif, iptal edilmiş vb.) ve işlem onayını saklarız.</li>
                <li><strong>Çerezler ve Benzer Teknolojiler:</strong> Sitemizdeki deneyiminizi iyileştirmek için çerezler kullanıyoruz. Daha fazla bilgi için lütfen <a href="/cookie-policy">Çerez Politikamızı</a> inceleyin.</li>
              </ul>
            </Section>

            <Section icon={Share2} title="3. Bilgilerinizi Nasıl Kullanıyoruz?">
              <p>
                Topladığımız bilgileri aşağıdaki meşru amaçlar doğrultusunda kullanırız:
              </p>
              <ul>
                  <li><strong>Hizmeti Sunmak ve Yönetmek:</strong> Hesabınızı oluşturmak, oturumunuzu açık tutmak ve platformun tüm özelliklerine erişmenizi sağlamak.</li>
                  <li><strong>Deneyimi Kişiselleştirmek:</strong> Öğrenme seviyenize ve ilgi alanlarınıza uygun hikayeler ve içerikler önermek.</li>
                  <li><strong>İletişim Kurmak:</strong> Size hizmetle ilgili önemli güncellemeler, güvenlik uyarıları, işlem bildirimleri ve destek taleplerinize yanıtlar göndermek. Pazarlama iletişimleri için ayrıca onayınızı alacağız.</li>
                  <li><strong>Hizmeti Geliştirmek:</strong> Kullanım verilerini anonimleştirerek ve analiz ederek platformun hangi özelliklerinin popüler olduğunu anlamak, hataları tespit etmek ve genel kullanıcı deneyimini iyileştirmek.</li>
                  <li><strong>Güvenliği Sağlamak:</strong> Dolandırıcılığı önlemek, hizmet şartlarımızı uygulamak ve platformun güvenliğini korumak.</li>
              </ul>
            </Section>

            <Section icon={Users} title="4. Bilgilerinizi Nasıl Paylaşıyoruz?">
              <p>
                Kişisel bilgilerinizi sizin onayınız olmadan üçüncü taraflara satmayız, kiralamayız veya ticaretini yapmayız. Bilgilerinizi yalnızca aşağıdaki durumlarda paylaşabiliriz:
              </p>
              <ul>
                <li><strong>Hizmet Sağlayıcılar:</strong> Web sitemizi barındıran, ödemeleri işleyen (örn. iyzico), e-posta gönderimi yapan (örn. Resend) ve veri analizi hizmetleri sunan güvenilir üçüncü taraf hizmet sağlayıcılarla, yalnızca hizmetlerini yerine getirebilmeleri için gerekli olan bilgileri, katı gizlilik yükümlülükleri altında paylaşırız.</li>
                <li><strong>Yasal Yükümlülükler:</strong> Yasal bir zorunluluk, mahkeme kararı veya resmi bir devlet talebi olması durumunda, yasaların gerektirdiği ölçüde bilgilerinizi yetkili makamlarla paylaşabiliriz.</li>
              </ul>
            </Section>

            <Section icon={Lock} title="5. Veri Güvenliği">
              <p>
                Kişisel bilgilerinizi yetkisiz erişime, değiştirilmeye, ifşa edilmeye veya imha edilmeye karşı korumak için endüstri standardı teknik ve idari güvenlik önlemleri alıyoruz. Bu önlemler arasında veri şifreleme (SSL/TLS), güvenli sunucu altyapısı, erişim kontrolleri ve düzenli güvenlik denetimleri bulunmaktadır. Ancak, internet üzerinden hiçbir aktarım yönteminin veya elektronik depolama yönteminin %100 güvenli olmadığını unutmamanız önemlidir.
              </p>
            </Section>

            <Section icon={Clock} title="6. Veri Saklama">
              <p>
                Kişisel bilgilerinizi, hesabınız aktif olduğu sürece veya size hizmet sunmak, yasal yükümlülüklerimizi yerine getirmek, anlaşmazlıkları çözmek ve sözleşmelerimizi uygulamak için gerekli olduğu sürece saklarız. Hesabınızı sildiğinizde, kişisel verileriniz makul bir süre içinde sistemlerimizden güvenli bir şekilde silinir veya anonim hale getirilir.
              </p>
            </Section>

            <Section icon={UserCheck} title="7. Haklarınız">
              <p>
                Veri koruma yasaları (KVKK dahil) kapsamında, kişisel bilgilerinizle ilgili çeşitli haklara sahipsiniz. Bu haklar arasında bilgilerinize erişme, onları düzeltme, silinmesini isteme veya işlenmesini kısıtlama talebinde bulunma hakkı bulunmaktadır. Bu haklarınızı kullanmak için lütfen hesap ayarlarınızı ziyaret edin veya doğrudan bizimle iletişime geçin.
              </p>
            </Section>

            <Section icon={Shield} title="8. Çocukların Gizliliği">
              <p>
                Hizmetimiz genel olarak 13 yaş ve üzeri kullanıcılara yöneliktir. Bununla birlikte, 13 yaşın altındaki kullanıcılar platformumuzu yalnızca bir ebeveynin veya yasal vasinin doğrulanabilir onayı ve denetimi altında kullanabilirler. Bilerek ebeveyn onayı olmaksızın 13 yaşın altındaki çocuklardan kişisel bilgi toplamıyoruz. Bir ebeveyn veya vasi iseniz ve çocuğunuzun bize onaysız olarak kişisel bilgi sağladığını fark ederseniz, lütfen bizimle iletişime geçin. Böyle bir durum tespit edildiğinde ilgili verileri derhal silmek için gerekli adımları atacağız.
              </p>
            </Section>

            <Section icon={Edit} title="9. Politikadaki Değişiklikler">
              <p>
                Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Önemli değişiklikler olması durumunda, size e-posta yoluyla veya hizmetimiz üzerinden belirgin bir bildirimle haber vereceğiz. Değişiklikler sonrası hizmeti kullanmaya devam etmeniz, güncellenmiş politikayı kabul ettiğiniz anlamına gelir.
              </p>
            </Section>

            <Section icon={Mail} title="10. Bize Ulaşın">
              <p>
                Bu Gizlilik Politikası ile ilgili herhangi bir sorunuz veya endişeniz varsa, lütfen bizimle <a href="mailto:contact@hikayego.com">contact@hikayego.com</a> adresinden iletişime geçin. Size yardımcı olmaktan memnuniyet duyarız.
              </p>
            </Section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicyPage;