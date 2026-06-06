import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import Seo from '@/components/Seo';
import { Shield, FileText, UserCheck, CreditCard, Copyright, AlertOctagon, Server, Power, Scale, Edit, Mail } from 'lucide-react';

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

const TermsOfServicePage = () => {
  return (
    <>
      <Seo
        title="Kullanım Koşulları"
        description="HikayeGO hizmetlerinin kullanım koşulları. Platformumuzu kullanarak kabul ettiğiniz şartlar ve sorumluluklar."
        url="/terms-of-service"
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
              Kullanım Koşulları
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
              Son Güncelleme: 07 Eylül 2025
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800/50 p-8 sm:p-12 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <Section icon={FileText} title="1. Şartların Kabulü">
              <p>
                HikayeGO'ya ("Hizmet", "Platform", "Site") hoş geldiniz. Bu web sitesine erişerek veya hizmetlerimizi kullanarak, bu Kullanım Koşullarını ("Şartlar") ve ayrılmaz bir parçası olan <a href="/privacy-policy">Gizlilik Politikamızı</a> ve <a href="/cookie-policy">Çerez Politikamızı</a> okuduğunuzu, anladığınızı ve yasal olarak bağlayıcı olduğunu kabul etmiş olursunuz. Bu şartları kabul etmiyorsanız, Hizmeti kullanmamalısınız.
              </p>
            </Section>

            <Section icon={Server} title="2. Hizmetin Tanımı">
              <p>
                HikayeGO, kullanıcılara İngilizce dil becerilerini geliştirmeleri için çeşitli seviyelerde hikayeler, kelime öğrenme araçları, etkileşimli testler ve diğer dil öğrenme kaynaklarını sunan bir çevrimiçi platformdur. Hizmet, sınırlı özelliklere sahip ücretsiz bir plan ("Ücretsiz Plan") ve tüm özelliklere erişim sağlayan ücretli abonelik planları ("Premium Plan") içerebilir. Hizmetlerin kapsamı ve özellikleri önceden bildirilmeksizin değiştirilebilir.
              </p>
            </Section>

            <Section icon={UserCheck} title="3. Kullanıcı Hesapları ve Sorumlulukları">
              <p>
                Hizmetin belirli özelliklerinden yararlanmak için bir hesap oluşturmanız gerekmektedir. Hesap oluştururken verdiğiniz bilgilerin doğru, güncel ve eksiksiz olduğunu taahhüt edersiniz. Hesap şifrenizin gizliliğini korumak ve hesabınız altında gerçekleşen tüm faaliyetlerden tamamen siz sorumlusunuz. Hesabınızın yetkisiz kullanıldığını fark ettiğinizde derhal bizi bilgilendirmelisiniz. HikayeGO, hesabınızın yetkisiz kullanımından doğacak hiçbir zarardan sorumlu tutulamaz. 13 yaşın altındaki kullanıcıların ebeveyn veya yasal vasisi onayı ile hesap oluşturması gerekmektedir.
              </p>
            </Section>

            <Section icon={CreditCard} title="4. Abonelikler, Ücretlendirme ve İptal">
              <ul>
                <li>
                  <strong>Premium Plan:</strong> Premium özelliklere erişim, belirtilen ücretler karşılığında aylık abonelikle sağlanır. Abonelik ücretleri ve özellikleri, abonelik sayfasında belirtilmiştir ve gelecekteki faturalandırma dönemleri için önceden haber verilerek güncellenebilir.
                </li>
                <li>
                  <strong>Otomatik Yenileme:</strong> <strong>Aboneliğiniz, siz iptal edene kadar mevcut abonelik döneminizin sonunda otomatik olarak yenilenir.</strong> Yenileme, o anki geçerli abonelik ücreti üzerinden yapılır ve kayıtlı ödeme yönteminizden tahsil edilir.
                </li>
                <li>
                  <strong>İptal ve İade Politikası:</strong> Aboneliğinizi istediğiniz zaman hesap ayarlarınızdaki 'Abonelik' bölümünden iptal edebilirsiniz. İptal işlemi mevcut fatura döneminin sonunda yürürlüğe girer ve bu tarihe kadar Premium özelliklerden yararlanmaya devam edebilirsiniz.
                </li>
                <li>
                  <strong>Cayma Hakkı ve İadeler:</strong> Dijital hizmet niteliği gereği ve hizmetin satın alma sonrasında derhal sunulmaya başlanması nedeniyle, kullanıcı cayma hakkını kullanamayacağını kabul eder. Ancak yürürlükteki tüketici mevzuatının zorunlu kıldığı durumlar saklıdır. Bu nedenle, yasaların gerektirdiği durumlar dışında işlenmiş ödemeler için kısmi veya tam geri ödeme yapılmaz. Abonelik iptali yalnızca gelecekteki yenileme ödemelerini durdurur.
                </li>
              </ul>
            </Section>

            <Section icon={Copyright} title="5. Fikri Mülkiyet Hakları">
              <p>
                Platformda yer alan hikayeler, metinler, grafikler, logolar, görseller, ses dosyaları, yazılımlar ve diğer tüm materyaller ("İçerik"), HikayeGO ve lisans verenlerinin münhasır mülkiyetindedir. Bu içerikler, telif hakkı, ticari marka ve diğer fikri mülkiyet yasalarıyla korunmaktadır. Hizmetimizde kullanılan bazı görseller, Freepik gibi platformlardan lisanslanarak kullanıma uygun şekilde temin edilmiştir. Size, yalnızca kişisel ve ticari olmayan kullanımınız için Hizmete erişim ve İçeriği kullanma konusunda sınırlı, münhasır olmayan, devredilemez ve iptal edilebilir bir lisans veriyoruz. Açık yazılı iznimiz olmadan İçeriği çoğaltmanız, dağıtmanız, değiştirmeniz, halka açık olarak sergilemeniz, türev çalışmalar oluşturmanız veya başka bir şekilde kötüye kullanmanız kesinlikle yasaktır.
              </p>
            </Section>

            <Section icon={AlertOctagon} title="6. Yasaklanmış Faaliyetler">
               <p>Hizmeti kullanırken aşağıdaki faaliyetlerde bulunmamayı kabul edersiniz:</p>
              <ul>
                <li>Yasalara aykırı, dolandırıcılık amaçlı, zararlı, tehdit edici, hakaret veya iftira niteliğinde ya da genel olarak uygunsuz herhangi bir faaliyette bulunmak.</li>
                <li>Hizmetin normal işleyişini engelleyebilecek veya altyapıya orantısız yük bindirebilecek girişimlerde bulunmak (örneğin, otomatik sorgular, spam veya sistem aşırı yüklemeleri).</li>
                <li>Hizmetin herhangi bir bileşenini izinsiz şekilde çözümlemeye, kopyalamaya, değiştirmeye veya güvenlik önlemlerini aşmaya çalışmak.</li>
                <li>Zararlı yazılım, kötü amaçlı kod veya hizmetin bütünlüğüne zarar verebilecek herhangi bir içerik yaymak.</li>
                <li>Başka bir kullanıcının hesabına veya verilerine izinsiz erişmeye çalışmak ya da kimliğini, bilgilerini veya herhangi bir kişi ya da kurumu taklit etmek.</li>
              </ul>
              <p>Bu kurallara aykırı davranılması durumunda, hesabınız önceden bildirim yapılmaksızın derhal feshedilebilir.</p>
            </Section>

            <Section icon={Shield} title="7. Sorumluluğun Reddi ve Sınırlandırılması">
              <p>
                Hizmet, "olduğu gibi" ve "mevcut olduğu şekilde" sunulmaktadır. Hizmetin kesintisiz, hatasız, güvenli veya tüm gereksinimlerinizi karşılayacağını garanti etmiyoruz. HikayeGO, yöneticileri, çalışanları ve iştirakleri, hizmetin kullanımından veya kullanılamamasından kaynaklanan (veri kaybı, kar kaybı veya iş kesintisi dahil) hiçbir dolaylı, arızi, özel, sonuç olarak ortaya çıkan veya cezai zarardan, bu tür zararların olasılığı konusunda bilgilendirilmiş olsak bile, sorumlu tutulamaz. Her durumda, bu şartlar kapsamındaki toplam sorumluluğumuz, talebin ortaya çıkmasından önceki altı (6) ay içinde bize ödediğiniz toplam tutarı aşamaz.
              </p>
            </Section>

            <Section icon={Power} title="8. Fesih">
              <p>
                Bu Şartları ihlal etmeniz durumunda, kendi takdirimize bağlı olarak, önceden bildirimde bulunmaksızın hesabınızı ve Hizmete erişiminizi derhal askıya alma veya feshetme hakkımızı saklı tutarız. Fesih durumunda, ödenmiş olan abonelik ücretleri iade edilmez.
              </p>
            </Section>

            <Section icon={Scale} title="9. Geçerli Hukuk ve Anlaşmazlıkların Çözümü">
              <p>
                Bu Şartlar, Türkiye Cumhuriyeti kanunlarına göre yönetilecek ve yorumlanacaktır. Bu Şartlardan kaynaklanan veya bunlarla ilgili herhangi bir anlaşmazlık durumunda, İstanbul (Çağlayan) Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
              </p>
            </Section>

            <Section icon={Edit} title="10. Şartlardaki Değişiklikler">
              <p>
                Bu Kullanım Koşullarını zaman zaman, kendi takdirimize bağlı olarak değiştirme hakkımızı saklı tutarız. Değişiklikler bu sayfada yayınlandıktan sonra yürürlüğe girer. Değişikliklerden sonra Hizmeti kullanmaya devam etmeniz, güncellenmiş Şartları kabul ettiğiniz anlamına gelir. Önemli değişiklikler hakkında sizi e-posta yoluyla veya site içi bir bildirimle bilgilendirmek için makul çabayı göstereceğiz.
              </p>
            </Section>

            <Section icon={Mail} title="11. İletişim">
              <p>
                Bu Kullanım Koşulları ile ilgili herhangi bir sorunuz varsa, lütfen bizimle <a href="mailto:contact@hikayego.com">contact@hikayego.com</a> adresinden iletişime geçin.
              </p>
            </Section>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TermsOfServicePage;