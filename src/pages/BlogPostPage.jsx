import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/customSupabaseClient';
import { Loader2, Calendar, ArrowLeft } from 'lucide-react';
import Seo from '@/components/Seo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import RelatedBlogPosts from '@/components/blog/RelatedBlogPosts';
import ShareButtons from '@/components/ShareButtons';
import { Separator } from '@/components/ui/separator';

const BlogPostPage = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const defaultImage = 'https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/f557009055158d9ee5d06d3a4010e832.png';

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error) {
        console.error('Error fetching blog post:', error);
        setPost(null);
      } else {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow container mx-auto py-16 px-6 text-center">
          <h1 className="text-4xl font-bold">Yazı Bulunamadı</h1>
          <p className="text-muted-foreground mt-4">Aradığınız blog yazısı mevcut değil veya kaldırılmış olabilir.</p>
          <Button asChild className="mt-8">
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" /> Tüm Yazılara Dön
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://hikayego.com/blog/${post.slug}`
    },
    "headline": post.meta_title || post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.image_url || defaultImage,  
    "author": {
      "@type": "Person",
      "name": post.author_name || "HikayeGO Ekibi"
    },  
    "publisher": {
      "@type": "Organization",
      "name": "HikayeGO",
      "logo": {
        "@type": "ImageObject",
        "url": "https://horizons-cdn.hostinger.com/47ed419b-a823-468d-9e6e-80c8442792f0/0b9a5181abbc4acf8a1bb151b23ddd54.png"
      }
    },
    "datePublished": new Date(post.published_at).toISOString(),
    "dateModified": new Date(post.updated_at).toISOString(),
    "keywords": post.keywords
  };

  return (
    <>
      <Seo
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        image={post.image_url || defaultImage}
        url={`/blog/${post.slug}`}
        type="article"
        keywords={post.keywords}
        schema={schema}
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <main className="flex-grow py-12 md:py-20">
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <header className="container mx-auto px-6 text-center max-w-4xl">
              <div className="mb-4">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/blog" className="text-primary hover:text-primary/80">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Blog'a Geri Dön
                  </Link>
                </Button>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{post.title}</h1>
              <div className="flex justify-center items-center gap-6 text-muted-foreground text-sm mt-6">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.author_name}`} alt={post.author_name} />
                      <AvatarFallback>{post.author_name ? post.author_name.substring(0,2) : 'HG'}</AvatarFallback>
                    </Avatar>
                    <span>{post.author_name || 'HikayeGO'}</span>
                  </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={new Date(post.published_at).toISOString()}>
                    {new Date(post.published_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </time>
                </div>
              </div>
            </header>

            <motion.div 
              className="my-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img 
                src={post.image_url || defaultImage}
                alt={post.title}
                className="w-full max-h-[500px] object-cover"
              />
            </motion.div>
            
            <div className="container mx-auto px-6 max-w-2xl">
              <div 
                className="prose dark:prose-invert max-w-none text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }} 
              />
            </div>
             <div className="container mx-auto px-6 max-w-2xl mt-12">
              <Separator />
              <div className="py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="font-semibold text-muted-foreground">Bu yazıyı faydalı buldun mu? Paylaş!</span>
                  <ShareButtons 
                    url={`https://hikayego.com/blog/${post.slug}`}
                    title={post.title}
                    text={post.excerpt}
                  />
              </div>
              <Separator />
            </div>

          </motion.article>

          <div className="mt-16 md:mt-24">
            <RelatedBlogPosts currentPostId={post.id} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPostPage;