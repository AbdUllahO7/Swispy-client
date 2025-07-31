// src/app/[locale]/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import StorySection from '../components/StorySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import ProductsSection from '../components/ProductsSection';

const SwispyWebsite = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
  };

  const isRTL = currentLang === 'ar';

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header currentLang={currentLang} changeLanguage={changeLanguage} />
      <HeroSection />
      <ProductsSection />
      <StorySection />
      <ContactSection />
      <Footer />
      
      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        /* RTL Support */
        .rtl {
          direction: rtl;
        }
        
        .ltr {
          direction: ltr;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f7cde2, #dbabc7);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #f0b7d1, #d19bb8);
        }
      `}</style>
    </div>
  );
};

export default SwispyWebsite;