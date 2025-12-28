import React from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t, i18n } = useTranslation();

  // Map language to image
  const getBackgroundImage = () => {
    switch (i18n.language) {
      case 'ar':
        return '/assets/3.jpg';
      case 'en':
        return '/assets/1.jpg';
      case 'tr':
        return '/assets/2.jpg';
      default:
        return '/assets/3.jpg';
    }
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = '905551025285';
    const message = encodeURIComponent(t('home.whatsappMessage') || 'Hello! I would like to place an order.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100"
    >
      {/* Desktop View */}
      <div className="hidden md:block relative min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100">
        <img
          src={getBackgroundImage()}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-100"></div>

        <div className="absolute bottom-10 left-0 right-0 z-10  px-6" >
          <div className="w-full max-w-md mx-auto">
            <button
              onClick={handleWhatsAppOrder}
              className="group relative w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-5 rounded-2xl text-lg font-bold overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <svg className="w-7 h-7 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div className="text-left">
                  <div className="text-base font-medium opacity-90">{t('home.orderWhatsapp')}</div>
                  <div className="text-sm opacity-75">+90 555 102 52 85</div>
                </div>
              </div>
            </button>
       
          </div>
        </div>
      </div>

      {/* Mobile View - Completely Redesigned */}
      <div className="md:hidden relative flex flex-col pt-16 pb-0">
        {/* Hero Image Section - Full width, natural height */}
        <div className="relative w-full bg-gradient-to-br from-pink-50 to-purple-50">
          <img
            src={getBackgroundImage()}
            alt="Hero background"
            className="w-full h-auto object-contain"
          />
          {/* Subtle Gradient Overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-pink-50/40 pointer-events-none"></div>
        </div>

        {/* CTA Section - Overlapping bottom of image */}
        <div className="relative bg-gradient-to-br from-white via-pink-50/95 to-purple-50/95 backdrop-blur-sm px-5 py-6 space-y-4 shadow-2xl rounded-t-3xl -mt-2 z-20 border-t-2 border-pink-100/50">
          {/* Coming Soon Badge - Top */}
          <div className="text-center -mt-11 mb-3">
            <span className="inline-block px-5 py-2.5 bg-white shadow-xl rounded-full text-pink-600 font-bold text-xs border-2 border-pink-200">
              ✨ {t('home.comingSoon')}
            </span>
          </div>

          {/* WhatsApp Order Button */}
          <button
            onClick={handleWhatsAppOrder}
            className="group relative w-full bg-gradient-to-r from-pink-500 via-pink-600 to-purple-600 text-white px-6 py-4 rounded-2xl font-bold overflow-hidden transition-all duration-300 transform active:scale-95 shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-active:opacity-100 transition-opacity duration-200"></div>
            <div className="relative flex items-center justify-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{t('home.orderWhatsapp')}</span>
                <span className="text-xs opacity-90">+90 555 102 52 85</span>
              </div>
            </div>
          </button>

          
        </div>
      </div>
    </section>
  );
};

export default HeroSection;