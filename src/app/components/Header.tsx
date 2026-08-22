'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Gift, Sparkles, PartyPopper, Menu, X, Box } from 'lucide-react';

interface HeaderProps {
  currentLang: string;
  changeLanguage: (lng: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentLang, changeLanguage }) => {
  const { t } = useTranslation();
  const { totalCount, setIsCartOpen, setIsCustomBoxOpen, setIsGiftOpen, setIsEventOpen } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-xl z-40 border-b border-pink-100/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex justify-between items-center">
          {/* Brand Logo */}
          <a href="#home" className="flex items-center space-x-2.5 rtl:space-x-reverse group">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl">🍫</span>
            </div>
            <div className="text-2xl font-black bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent">
              Swispy
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7 rtl:space-x-reverse">
            <a href="#home" className="text-gray-700 hover:text-pink-600 text-sm font-semibold transition-colors">
              {t('nav.home', 'Home')}
            </a>
            <a href="#products" className="text-gray-700 hover:text-pink-600 text-sm font-semibold transition-colors">
              {t('nav.menu', 'Menu')}
            </a>
            <a href="#boxes" className="text-gray-700 hover:text-pink-600 text-sm font-semibold transition-colors">
              {t('nav.boxes', 'Boxes')}
            </a>

            {/* Special Action Triggers */}
            <button
              onClick={() => setIsCustomBoxOpen(true)}
              className="text-gray-700 hover:text-pink-600 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Box className="w-4 h-4 text-pink-500" />
              <span>{t('nav.customBox', 'Custom Box')}</span>
            </button>

            <button
              onClick={() => setIsGiftOpen(true)}
              className="text-gray-700 hover:text-pink-600 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Gift className="w-4 h-4 text-rose-500" />
              <span>{t('nav.sendGift', 'Send a Gift')}</span>
            </button>

            <button
              onClick={() => setIsEventOpen(true)}
              className="text-gray-700 hover:text-purple-600 text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <PartyPopper className="w-4 h-4 text-purple-500" />
              <span>{t('nav.events', 'Events & Catering')}</span>
            </button>

            <a href="#story" className="text-gray-700 hover:text-pink-600 text-sm font-semibold transition-colors">
              {t('nav.ourStory', 'Our Story')}
            </a>
          </nav>

          {/* Right Action Icons (Cart + Language + Mobile menu) */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-pink-200 bg-pink-50/50 text-xs font-bold text-gray-700 hover:bg-pink-100/70 transition-all cursor-pointer"
              >
                <span>{currentLang === 'ar' ? '🇸🇦 العربية' : currentLang === 'tr' ? '🇹🇷 Türkçe' : '🇺🇸 English'}</span>
                <span className="text-[10px] text-pink-500">▼</span>
              </button>

              {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                  <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 bg-white border border-pink-100 rounded-2xl shadow-xl overflow-hidden z-50 min-w-[130px] p-1 animate-scale-up">
                    <button
                      onClick={() => {
                        changeLanguage('en');
                        setIsLangMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left rtl:text-right text-xs font-semibold text-gray-700 hover:bg-pink-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <span>🇺🇸</span> <span>English</span>
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('ar');
                        setIsLangMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left rtl:text-right text-xs font-semibold text-gray-700 hover:bg-pink-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <span>🇸🇦</span> <span>العربية</span>
                    </button>
                    <button
                      onClick={() => {
                        changeLanguage('tr');
                        setIsLangMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left rtl:text-right text-xs font-semibold text-gray-700 hover:bg-pink-50 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <span>🇹🇷</span> <span>Türkçe</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              aria-label="View Basket"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 rtl:-right-auto rtl:-left-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center shadow-md animate-scale-up">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-pink-600 rounded-xl hover:bg-pink-50 transition-colors cursor-pointer"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMenuOpen && (
          <div className="lg:hidden pt-4 pb-2 border-t border-pink-100 mt-3 space-y-2 animate-fade-in">
            <a
              href="#home"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50"
            >
              {t('nav.home', 'Home')}
            </a>
            <a
              href="#products"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50"
            >
              {t('nav.menu', 'Menu')}
            </a>
            <a
              href="#boxes"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50"
            >
              {t('nav.boxes', 'Curated Boxes')}
            </a>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsCustomBoxOpen(true);
              }}
              className="w-full text-left rtl:text-right px-3 py-2 rounded-xl text-sm font-semibold text-pink-600 hover:bg-pink-50 flex items-center gap-2"
            >
              <Box className="w-4 h-4" /> {t('nav.customBox', 'Custom Box Builder')}
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsGiftOpen(true);
              }}
              className="w-full text-left rtl:text-right px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-pink-50 flex items-center gap-2"
            >
              <Gift className="w-4 h-4" /> {t('nav.sendGift', 'Send a Gift')}
            </button>
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsEventOpen(true);
              }}
              className="w-full text-left rtl:text-right px-3 py-2 rounded-xl text-sm font-semibold text-purple-600 hover:bg-purple-50 flex items-center gap-2"
            >
              <PartyPopper className="w-4 h-4" /> {t('nav.events', 'Events & Catering')}
            </button>
            <a
              href="#story"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50"
            >
              {t('nav.ourStory', 'Our Story')}
            </a>
            <a
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-50"
            >
              {t('nav.contact', 'Contact Us')}
            </a>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;