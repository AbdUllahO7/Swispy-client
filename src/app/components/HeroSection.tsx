'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Box, Gift, Sparkles } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { setIsCustomBoxOpen, setIsGiftOpen } = useCart();

  const getBackgroundImage = () => {
    switch (i18n.language) {
      case 'ar':
        return '/assets/3.jpg';
      case 'tr':
        return '/assets/2.jpg';
      case 'en':
      default:
        return '/assets/1.jpg';
    }
  };

  return (
    <section id="home" className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-pink-50/80 via-purple-50/40 to-white overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-pink-300/20 blur-3xl pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 rounded-full bg-purple-300/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left rtl:lg:text-right">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> {t('home.tagline', 'Handcrafted Swiss & Belgian Luxury')}
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                {t('home.mainTitle', 'A Symphony of Pure Chocolate Bliss')}
              </span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('home.introText', 'Experience the pinnacle of confectionery art. From single-origin ganaches to curated velvet gift boxes, every piece tells a story of passion and elegance.')}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start rtl:lg:justify-start gap-3.5 pt-2">
              <a
                href="#products"
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-xl shadow-pink-500/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t('home.exploreMenu', 'Explore Menu')}</span>
              </a>

              <button
                type="button"
                onClick={() => setIsCustomBoxOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-white hover:bg-pink-50/80 text-gray-800 font-bold text-sm border border-pink-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Box className="w-4 h-4 text-pink-600" />
                <span>{t('home.buildBox', 'Build Custom Box')}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGiftOpen(true)}
                className="px-6 py-3.5 rounded-2xl bg-pink-100/80 hover:bg-pink-200/80 text-pink-700 font-bold text-sm border border-pink-200/60 shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 text-rose-500" />
                <span>{t('home.sendGift', 'Send a Gift')}</span>
              </button>
            </div>

            {/* Social Trust Metrics */}
            <div className="pt-6 border-t border-pink-100/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left rtl:lg:text-right">
              <div>
                <div className="text-2xl font-black text-gray-900">{t('home.stat1Value', '100%')}</div>
                <div className="text-xs text-gray-500 font-medium">{t('home.stat1Label', 'Artisanal Swiss Cacao')}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{t('home.stat2Value', '< 45m')}</div>
                <div className="text-xs text-gray-500 font-medium">{t('home.stat2Label', 'Express Delivery')}</div>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{t('home.stat3Value', '4.9 ★')}</div>
                <div className="text-xs text-gray-500 font-medium">{t('home.stat3Label', 'Customer Rating')}</div>
              </div>
            </div>
          </div>

          {/* Right Floating Card / Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-gradient-to-br from-pink-200/40 via-purple-100/40 to-pink-100/60 p-4 border border-white shadow-2xl backdrop-blur-md flex items-center justify-center group">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white/80 flex items-center justify-center p-6 relative">
                <img
                  src={getBackgroundImage()}
                  alt="Swispy Artisanal Collection"
                  className="w-full h-full object-contain transform group-hover:scale-105 group-hover:rotate-1 transition-all duration-700"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-pink-100 flex items-center gap-2.5 animate-bounce">
                  <span className="text-xl">👑</span>
                  <div>
                    <div className="text-xs font-bold text-gray-900">SIGNATURE 20</div>
                    <div className="text-[10px] text-pink-600 font-semibold">{t('boxes.tag', 'Most Popular Gift')}</div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-pink-100 flex items-center gap-2">
                  <span className="text-lg">🍫</span>
                  <div className="text-xs font-bold text-gray-900">{t('home.tagline', 'Freshly Poured')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;