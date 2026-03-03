import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@/api/supabaseClient';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ReactMarkdown from 'react-markdown';

export default function ArticleDetail() {
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id');

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: async () => {
      const articles = await Article.filter({ id: articleId });
      return articles[0];
    },
    enabled: !!articleId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Artículo no encontrado</p>
          <Link
            to={createPageUrl('Mas')}
            className="text-[#EF2828] hover:underline"
          >
            Volver a artículos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero with Cover Image */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${article.cover_image || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1920&q=80'})` 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        
        <div className="relative h-full flex items-end">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 w-full pb-16">
            <Link
              to={createPageUrl('Mas')}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Volver</span>
            </Link>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-tight tracking-tight mb-6"
            >
              {article.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-6 text-white/90 text-sm"
            >
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {article.author}
              </div>
              {article.published_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(article.published_date), 'd MMMM yyyy', { locale: es })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="prose prose-lg prose-gray max-w-none
              prose-headings:font-medium prose-headings:text-gray-900 prose-headings:tracking-tight
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-[#EF2828] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-medium
              prose-img:rounded-lg prose-img:shadow-lg
              prose-blockquote:border-l-[#EF2828] prose-blockquote:text-gray-700 prose-blockquote:font-light"
          >
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </motion.article>
        </div>
      </section>
    </div>
  );
}