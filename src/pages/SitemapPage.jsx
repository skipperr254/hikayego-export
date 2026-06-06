import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const SitemapPage = () => {
  const [xml, setXml] = useState('');

  useEffect(() => {
    const generateSitemap = async () => {
      const baseUrl = 'https://hikayego.com';
      const today = new Date().toISOString().split('T')[0];

      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/subscription', priority: '0.9', changefreq: 'monthly' },
        { url: '/blog', priority: '0.9', changefreq: 'weekly' },
        { url: '/login', priority: '0.5', changefreq: 'yearly' },
        { url: '/register', priority: '0.5', changefreq: 'yearly' },
        { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
        { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
        { url: '/cookie-policy', priority: '0.3', changefreq: 'yearly' },
        { url: '/help-center', priority: '0.6', changefreq: 'monthly' },
      ];

      const sitemapUrls = staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

      const { data: stories, error: storiesError } = await supabase
        .from('stories')
        .select('slug, updated_at')
        .order('updated_at', { ascending: false });

      if (storiesError) {
        console.error('Error fetching stories for sitemap:', storiesError);
      }

      const storyUrls = stories ? stories.map(story => `
  <url>
    <loc>${baseUrl}/story/${story.slug}</loc>
    <lastmod>${new Date(story.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('') : '';

      const { data: blogPosts, error: blogError } = await supabase
        .from('blog_posts')
        .select('slug, updated_at')
        .eq('status', 'published')
        .order('updated_at', { ascending: false });

      if (blogError) {
        console.error('Error fetching blog posts for sitemap:', blogError);
      }

      const blogUrls = blogPosts ? blogPosts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.updated_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('') : '';

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls}
${storyUrls}
${blogUrls}
</urlset>`;

      setXml(sitemapXml);
    };

    generateSitemap();
  }, []);

  useEffect(() => {
    if (xml) {
      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // This part is a bit of a hack for client-side rendering.
      // In a real SSR environment, we would set headers and stream the response.
      // Here, we just display the content. The routing setup should handle the .xml extension.
      const pre = document.createElement('pre');
      pre.style.wordWrap = 'break-word';
      pre.style.whiteSpace = 'pre-wrap';
      pre.textContent = xml;
      document.body.innerHTML = '';
      document.body.appendChild(pre);
      document.title = 'Sitemap';
    }
  }, [xml]);

  return null;
};

export default SitemapPage;