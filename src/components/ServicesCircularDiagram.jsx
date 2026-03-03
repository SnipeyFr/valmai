import React from 'react';
import { motion } from 'framer-motion';

export default function ServicesCircularDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-5xl mx-auto overflow-hidden"
    >
      <div className="relative w-full aspect-[4/3] flex items-center justify-center">
        <img
          src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/cff276c88_estrategiademarketing.png"
          alt="Diagrama de servicios - Gestión cultural estratégica"
          className="w-[120%] h-auto object-contain scale-110"
        />
      </div>
    </motion.div>
  );
}