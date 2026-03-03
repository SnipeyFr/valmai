import React from 'react';
import { motion } from 'framer-motion';
import TeamCard from '@/components/TeamCard';

const team = [
  {
    name: 'Isidora Lira Brown',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/7b06cb744_Screenshot2026-01-27at23852AM.png',
    bio: 'Licenciada en Historia y Educación, y Máster en Historia y Gestión del Patrimonio, Isidora combina una sólida formación académica con más de una década de experiencia en docencia, edición de contenidos y proyectos culturales. Ha trabajado en instituciones escolares, universidades y editoriales, destacando por su capacidad de iniciativa, liderazgo y compromiso. Con más de diez años de experiencia en docencia, edición de textos narrativos y escolares y en proyectos culturales, su trabajo acerca la historia y la cultura a distintas audiencias. Becada por el MINEDUC y el programa Emerging Leaders of the Americas (ELAP) del gobierno de Canadá el año 2011.'
  },
  {
    name: 'Loreto Estévez Matheu',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/dac679cd6_Screenshot2026-01-27at23803AM.png',
    bio: 'Licenciada en Historia y Máster en Historia y Gestión del Patrimonio Cultural, Loreto ha desarrollado su trayectoria en los ámbitos de la gestión cultural, la investigación histórica y la creación de contenidos. Se ha desempeñado como curadora de exposiciones, investigadora y autora de textos para publicaciones, catálogos y medios especializados. Ha liderado equipos editoriales, desarrollado capacitaciones y gestionado proyectos culturales vinculados al patrimonio y las artes visuales. También ha colaborado como crítica de arte y columnista. Titulada con distinción máxima, combina formación académica con experiencia en públicos y formatos diversos.'
  }
];

export default function Equipo() {
  return (
    <div className="min-h-screen select-none">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/055cd4911_jud-mackrill-wWK72o_zUkI-unsplash.jpg)' 
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
              Equipo
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

      {/* Team Grid */}
      <section className="py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <TeamCard
                  name={member.name}
                  image={member.image}
                  bio={member.bio}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}