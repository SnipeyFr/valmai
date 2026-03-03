import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Mail, Linkedin, Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Nosotros', page: 'Nosotros' },
  { label: 'Servicios', page: 'Servicios' },
  { label: 'Equipo', page: 'Equipo' },
  { label: 'Mas+', page: 'Mas' }
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFCFA' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFCFA]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-[90px]">
            {/* Logo */}
            <Link to={createPageUrl('Home')} className="flex-shrink-0 transition-opacity hover:opacity-80">
              <img 
                src="/logo.png" 
                alt="Valmai - Gestión Cultural" 
                className="h-[115px] w-auto max-w-[420px] object-cover"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-10">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  className={`text-sm tracking-wide transition-colors duration-200 ${
                    currentPageName === item.page 
                      ? 'text-[#EF2828]' 
                      : 'text-gray-700 hover:text-[#EF2828]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-[#FFFCFA]">
            <nav className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-6 py-3 text-sm tracking-wide ${
                    currentPageName === item.page 
                      ? 'text-[#EF2828]' 
                      : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[90px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#FFFCFA] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Logo & Tagline */}
            <div>
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696eb02c77924d3a78532a3c/960418fd5_OriginalLogo.png" 
                alt="Valmai - Gestión Cultural" 
                className="h-28 w-auto max-w-[400px] object-cover mb-6"
              />
              <p className="text-sm text-gray-500 leading-relaxed">
                Consultoría y gestión cultural
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mt-3 italic">
                Te invitamos a integrar la cultura como motor de cambio social.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-medium text-[#B73838] mb-6">
                Hablemos
              </h4>
              <div className="flex flex-col gap-3">
                <a 
                  href="mailto:contacto@valmai.cl" 
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#EF2828] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  contacto@valmai.cl
                </a>
                <a 
                  href="https://wa.me/56993094169" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#EF2828] transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  +56 9 9309 4169
                </a>
                <a 
                  href="https://www.linkedin.com/company/valmai-consultora-cultural/?viewAsMember=true" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-gray-600 hover:text-[#EF2828] transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </div>
            </div>


          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Valmai. Todos los derechos reservados.
            </p>
            <Link 
              to={createPageUrl('StaffAdmin')} 
              className="text-xs text-gray-400 hover:text-[#EF2828] transition-colors"
            >
              Acceso Staff
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}