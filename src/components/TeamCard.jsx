import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TeamCard({ name, image, bio }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative overflow-hidden cursor-pointer group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Image Container */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100 relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
          draggable="false"
          onContextMenu={(e) => e.preventDefault()}
        />
        {/* Capa de protección invisible */}
        <div className="absolute inset-0 bg-transparent pointer-events-auto" />
        
        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-[#8B3A3A]/92 flex items-center justify-center p-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-white text-sm leading-relaxed font-light space-y-3"
              >
                {bio.split('. ').map((sentence, index) => (
                  sentence.trim() && (
                    <p key={index}>
                      {sentence}{sentence.endsWith('.') ? '' : '.'}
                    </p>
                  )
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Name */}
      <div className="pt-6 pb-4">
        <h3 className="text-lg font-medium text-gray-900 tracking-wide">
          {name}
        </h3>
      </div>
    </div>
  );
}