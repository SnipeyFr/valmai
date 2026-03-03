import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import { Article } from '@/api/supabaseClient';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Mas() {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const allArticles = await Article.filter({ published: true });
      return allArticles.sort((a, b) => 
        new Date(b.published_date) - new Date(a.published_date)
      );
    }
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1600&q=80)' 
          }}
        >
          <div className="absolute inset-0 bg-[#8B3A3A]/75" />
        </div>
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-white tracking-tight"
            >
              Mas+
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="h-1 bg-[#EF2828] mt-6"
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <p className="text-gray-600 text-lg leading-relaxed font-light max-w-3xl">
              Herramientas, reflexiones y contenido especializado para el sector cultural. 
              Descubre artículos, recursos y perspectivas de nuestro equipo.
            </p>
          </motion.div>

          {/* Articles Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                Próximamente publicaremos nuevos artículos.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={createPageUrl('ArticleDetail') + `?id=${article.id}`}
                    className="group block"
                  >
                    {/* Image */}
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 mb-4 rounded-lg">
                      <img
                        src={article.cover_image || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2 group-hover:text-[#EF2828] transition-colors">
                        {article.title}
                      </h3>
                      
                      {article.excerpt && (
                        <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{article.author}</span>
                        {article.published_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(article.published_date), 'd MMM yyyy', { locale: es })}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-2 text-[#EF2828] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Leer más
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}