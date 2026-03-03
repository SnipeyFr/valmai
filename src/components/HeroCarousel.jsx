import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    type: 'text',
    title: 'Fortaleciendo vínculos entre cultura y sociedad',
    subtitle: 'Desarrollamos proyectos y estrategias culturales que generan valor para la sociedad y las instituciones',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1920&q=80'
  },
  {
    type: 'visual',
    title: 'Servicios',
    subtitle: 'Personalizamos nuestros servicios para cada organización y proyecto, garantizando que complementen y aumenten las fortalezas y capacidades existentes',
    image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1920&q=80',
    link: 'Servicios',
    buttonText: 'Conocer más'
  },
  {
    type: 'visual',
    title: 'Nosotros',
    subtitle: 'Generamos conocimiento y soluciones a través de la cultura',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/0d97df0e3_Screenshot2026-01-21at75918PM.png',
    link: 'Nosotros',
    buttonText: 'Descubrir'
  },
  {
    type: 'visual',
    title: 'Mas+',
    subtitle: 'Herramientas y contenido para el sector cultural',
    image: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/e9db8a1e0_camila-credidio-P8pWGVGdHPo-unsplash.jpg',
    link: 'Mas',
    buttonText: 'Explorar'
  }
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[current];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-[85vh] min-h-[600px] overflow-hidden bg-gray-900">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="w-full max-w-7xl mx-auto px-8 lg:px-16">
              <div className="max-w-2xl">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight"
                >
                  {slide.title}
                </motion.h1>
                
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="h-1 bg-[#EF2828] mt-6 mb-6"
                />

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-lg md:text-xl text-white/90 font-light leading-relaxed max-w-xl"
                >
                  {slide.subtitle}
                </motion.p>

                {slide.link && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <Link
                      to={createPageUrl(slide.link)}
                      className="inline-block mt-8 px-8 py-3 bg-[#EF2828] text-white text-sm font-medium tracking-wide uppercase hover:bg-[#d42222] transition-colors duration-300"
                    >
                      {slide.buttonText}
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-8 h-8" strokeWidth={1} />
      </button>
      <button
        onClick={next}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white transition-colors z-10"
        aria-label="Siguiente"
      >
        <ChevronRight className="w-8 h-8" strokeWidth={1} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              current === index ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}