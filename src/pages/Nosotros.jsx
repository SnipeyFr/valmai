import React from 'react';
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Quiénes Somos',
    content: 'Somos un estudio de consultoría y gestión cultural enfocado en diseñar e implementar iniciativas que vinculen cultura, educación y desarrollo social, asegurando coherencia, calidad, impacto y sostenibilidad.'
  },
  {
    title: 'Qué hacemos',
    content: 'Integramos la cultura como motor de desarrollo, propósito y legado para las instituciones que quieran dejar huella.'
  },
  {
    title: 'Cómo lo hacemos',
    content: 'Basamos nuestro modelo en una profunda comprensión del contexto, con visión a largo plazo. Personalizamos nuestros servicios para cada cliente y proyecto, garantizando que complementen y aumenten las fortalezas y capacidades existentes.'
  }
];

export default function Nosotros() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/8dd7b5e5c_ar-museums-galleries.png)' 
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
              Nosotros
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

      {/* Content Sections */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="space-y-24 lg:space-y-32">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
              >
                <div className="lg:col-span-4">
                  <h2 className="text-2xl md:text-3xl font-medium text-[#B73838] tracking-tight">
                    {section.title}
                  </h2>
                  <div className="w-12 h-0.5 bg-[#B73838] mt-4" />
                </div>
                <div className="lg:col-span-8">
                  {section.content.split('\n\n').map((paragraph, pIndex) => (
                    <p 
                      key={pIndex} 
                      className="text-gray-600 text-lg leading-relaxed font-light mb-6 last:mb-0"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}