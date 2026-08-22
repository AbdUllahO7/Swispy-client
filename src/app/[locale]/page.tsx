// src/app/[locale]/page.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CartProvider } from '../context/CartContext';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import BoxesSection from '../components/BoxesSection';
import ProductsSection from '../components/ProductsSection';
import StorySection from '../components/StorySection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import CheckoutModal from '../components/CheckoutModal';
import OrderConfirmationModal, { OrderConfirmationData } from '../components/OrderConfirmationModal';
import CustomBoxModal from '../components/CustomBoxModal';
import GiftOrderModal from '../components/GiftOrderModal';
import EventOrderModal from '../components/EventOrderModal';

const SwispyWebsiteContent = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState('en');
  const [confirmationData, setConfirmationData] = useState<OrderConfirmationData | null>(null);

  useEffect(() => {
    const lang = i18n.language || 'en';
    setCurrentLang(lang);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    }
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    }
  };

  const isRTL = currentLang === 'ar';

  return (
    <div className={`min-h-screen bg-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <Header currentLang={currentLang} changeLanguage={changeLanguage} />
      <main>
        <HeroSection />
        <BoxesSection />
        <ProductsSection />
        <StorySection />
        <ContactSection />
      </main>
      <Footer />

      {/* Global Interactive Drawers & Modals */}
      <CartDrawer />
      <CheckoutModal onSuccess={(data) => setConfirmationData(data)} />
      <OrderConfirmationModal
        orderData={confirmationData}
        onClose={() => setConfirmationData(null)}
      />
      <CustomBoxModal />
      <GiftOrderModal onSuccess={(orderNum) => {}} />
      <EventOrderModal />

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
          background: #fdf2f8;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #f472b6, #db2777);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #db2777, #be185d);
        }
      `}</style>
    </div>
  );
};

const SwispyWebsite = () => {
  return (
    <CartProvider>
      <SwispyWebsiteContent />
    </CartProvider>
  );
};

export default SwispyWebsite;