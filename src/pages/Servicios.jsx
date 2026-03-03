import React from 'react';
import { motion } from 'framer-motion';
import ServicesCircularDiagram from '@/components/ServicesCircularDiagram';


export default function Servicios() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'url(https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/4d59e7ca5_liam-charmer-UzQCWiN3HHc-unsplash.jpg)', 
            backgroundPosition: 'center',
            backgroundSize: '35%',
            backgroundRepeat: 'no-repeat',
            backgroundColor: '#e5e5e5'
          }}
        >
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle, transparent 15%, #e5e5e5 60%)'
          }} />
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
              Servicios
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

      {/* Content */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mb-20"
          >
            <p className="text-xl text-gray-600 leading-relaxed font-light">
              Consultoría estratégica y gestión de proyectos culturales para instituciones que buscan fortalecer su vínculo con la cultura, el patrimonio y las artes.
            </p>
          </motion.div>

          {/* Circular Diagram */}
          <div className="py-16">
            <ServicesCircularDiagram />
          </div>

          {/* Services Description */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto"
          >
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4 uppercase tracking-wide">PLANIFICACIÓN CULTURAL</h3>
              <p className="text-gray-600 leading-relaxed">
                Diseñamos estrategias culturales integrales que alinean objetivos institucionales con las necesidades de la comunidad.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4 uppercase tracking-wide">CURATORÍA CORPORATIVA</h3>
              <p className="text-gray-600 leading-relaxed">
                Desarrollamos propuestas curatoriales que conectan el arte y la cultura con el propósito de tu organización.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4 uppercase tracking-wide">INVESTIGACIÓN</h3>
              <p className="text-gray-600 leading-relaxed">
                Generamos conocimiento aplicado sobre patrimonio, audiencias y tendencias del sector cultural.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4 uppercase tracking-wide">GESTIÓN EFICIENTE</h3>
              <p className="text-gray-600 leading-relaxed">
                Optimizamos procesos y recursos para maximizar el impacto de tus iniciativas culturales.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}