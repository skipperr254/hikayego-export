import React from 'react';
import { Helmet } from 'react-helmet-async';

const SecurityHeaders = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return null;

  const supabaseHostname = new URL(supabaseUrl).hostname;

  return (
    <Helmet>
      <meta httpEquiv="Content-Security-Policy" content={`
        default-src 'self';
        script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net/npm/tsparticles@1.26.0/dist/tsparticles.min.js https://cdn.iyzipay.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' data: https://api.dicebear.com https://lh3.googleusercontent.com *.googleusercontent.com *.supabase.co ${supabaseHostname} https://www.google.com https://www.google.com.tr https://*.cloudinary.com https://storage.googleapis.com https://horizons-cdn.hostinger.com;
        font-src 'self' https://fonts.gstatic.com;
        connect-src 'self' wss://${supabaseHostname} https://${supabaseHostname} https://*.supabase.co https://*.resend.com https://api.wordnik.com https://api.elevenlabs.io;
        media-src 'self' data: https://storage.googleapis.com https://${supabaseHostname};
        frame-src 'self' https://www.youtube.com;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
      `} />
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer-policy" content="strict-origin-when-cross-origin" />
      <meta name="permissions-policy" content="microphone=(), camera=()" />
    </Helmet>
  );
};

export default SecurityHeaders;