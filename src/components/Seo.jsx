import React from 'react';
import { Helmet } from 'react-helmet-async';

const Seo = ({ title, description, image, url, type = 'website', keywords, children, schema }) => {
  const siteName = 'HikayeGO';
  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} | İngilizce Öğrenmenin En Keyifli Yolu`;
  const defaultDescription = 'Hikayelerle İngilizce öğrenin. Her seviyeye uygun sürükleyici hikayeler, akıllı kelime asistanı ve etkileşimli etkinliklerle dil becerilerinizi geliştirin.';
  const finalDescription = description || defaultDescription;
  const defaultImage = 'https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/0b9a5181abbc4acf8a1bb151b23ddd54.png';
  const finalImage = image || defaultImage;
  const canonicalUrl = `https://hikayego.com${url || (typeof window !== 'undefined' ? window.location.pathname : '')}`;
  const defaultKeywords = 'HikayeGO, İngilizce öğren, hikayelerle İngilizce, kelime uygulaması, A1 A2 B1 B2 C1 dil seviyeleri, dil eğitimi, interaktif İngilizce';
  const finalKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;

  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": type === 'article' ? 'Article' : 'WebPage',
    "url": canonicalUrl,
    "name": fullTitle,
    "description": finalDescription,
    "publisher": {
      "@type": "Organization",
      "name": "HikayeGO",
      "logo": {
        "@type": "ImageObject",
        "url": "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/0b9a5181abbc4acf8a1bb151b23ddd54.png"
      }
    },
    "image": {
      "@type": "ImageObject",
      "url": finalImage
    }
  };

  const finalSchema = schema ? { ...defaultSchema, ...schema } : defaultSchema;

  return (
    <Helmet>
      <html lang="tr" />
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="tr_TR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />
      
      <script type="application/ld+json">{JSON.stringify(finalSchema)}</script>

      {children}
    </Helmet>
  );
};

export default Seo;