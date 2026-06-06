import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Instagram, Facebook, School, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';
import NewsletterSignup from '@/components/NewsletterSignup';
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import FooterDownloadSection from '@/components/FooterDownloadSection';

const Footer = React.memo(() => {
  const { isMobile, isTablet } = useDeviceDetection();
  const isMobileOrTablet = isMobile || isTablet;

  const platformLinks = [
    { name: 'Keşfet', path: '/dashboard' },
    { name: 'Aktiviteler', path: '/activities' },
    { name: 'Kütüphanem', path: '/library' },
    { name: 'Quiz', path: '/quiz/setup' },
  ];

  const companyLinks = [
    { name: 'Hakkımızda', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Kariyer', path: '/career' },
    { name: 'İletişim', path: '/contact' },
  ];

  const resourcesLinks = [
    { name: 'Yardım Merkezi', path: '/help-center' },
    { name: 'Topluluk', path: '/community' },
  ];

  const legalLinks = [
    { name: 'Kullanım Koşulları', path: '/terms-of-service' },
    { name: 'Gizlilik Politikası', path: '/privacy-policy' },
    { name: 'Çerez Politikası', path: '/cookie-policy' },
  ];

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/hikayego', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com/hikayego', label: 'Instagram' },
    { icon: Linkedin, href: 'https://linkedin.com/company/hikayego', label: 'LinkedIn' },
    { icon: Facebook, href: '#', label: 'Facebook' },
  ];

  const allowedMobileLinks = ['Hakkımızda', 'Blog', 'İletişim'];
  const filteredCompanyLinks = isMobileOrTablet 
    ? companyLinks.filter(link => allowedMobileLinks.includes(link.name))
    : companyLinks;

  return (
    <footer className="bg-background text-foreground border-t border-border/50">
      <div className="container mx-auto px-6 py-12">
        
        <NewsletterSignup />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 flex flex-col">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4 group w-fit">
              <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
                <Logo className="w-40" />
              </motion.div>
            </Link>
            
            <p className="text-muted-foreground mt-4 max-w-sm leading-relaxed">
              Hikayelerle İngilizce öğrenin. Her seviyeye uygun sürükleyici hikayelerle dil becerilerinizi geliştirin. Dinleyerek, okuyarak ve pratik yaparak İngilizceyi doğal yollarla keşfedin. Öğrenme yolculuğunuzda daima yanınızdayız.
            </p>
            
            <div className="flex mt-8 space-x-5">
              {socialLinks.map((social, index) => (
                <motion.a 
                  key={index} 
                  href={social.href} 
                  target={social.href === '#' ? '_self' : '_blank'}
                  rel="noopener noreferrer" 
                  aria-label={social.label} 
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.2, rotate: -10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => social.href === '#' && e.preventDefault()}
                >
                  <social.icon className="h-6 w-6" />
                </motion.a>
              ))}
            </div>

            <motion.a
              href="mailto:contact@hikayego.com"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground font-medium rounded-xl transition-all duration-300 shadow-sm hover:shadow-md w-fit"
            >
              <Mail className="h-4 w-4" />
              <span>Destek ile iletişime geç</span>
            </motion.a>
          </div>
          
          <div className="lg:col-span-8 flex flex-col justify-between h-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {!isMobileOrTablet && (
                <div>
                  <h3 className="font-semibold tracking-wider uppercase">Platform</h3>
                  <ul className="mt-4 space-y-3">
                    {platformLinks.map((link) => (
                      <li key={link.name}>
                        <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors">
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h3 className="font-semibold tracking-wider uppercase">Şirket</h3>
                <ul className="mt-4 space-y-3">
                  {filteredCompanyLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              {!isMobileOrTablet && (
                <>
                  <div>
                    <h3 className="font-semibold tracking-wider uppercase">Kaynaklar</h3>
                    <ul className="mt-4 space-y-3">
                      {resourcesLinks.map((link) => (
                        <li key={link.name}>
                          <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors">
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold tracking-wider uppercase">Yasal</h3>
                    <ul className="mt-4 space-y-3">
                      {legalLinks.map((link) => (
                        <li key={link.name}>
                          <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors">
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
            
            {!isMobileOrTablet && (
              <div className="mt-12 flex justify-end">
                <FooterDownloadSection />
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border/50 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} HikayeGO. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-2.5 text-center md:text-right group">
              <School className="h-5 w-5 text-primary/80 group-hover:text-primary transition-colors" />
              <div className="font-medium text-foreground/80">
                  <span className="group-hover:text-foreground transition-colors">Bir <span className="font-semibold text-foreground">Bayrak Dil Okulları</span> projesidir.</span>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;