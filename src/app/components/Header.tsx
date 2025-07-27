import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  currentLang: string;
  changeLanguage: (lng: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentLang, changeLanguage }) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-xl z-50 border-b border-pink-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🧁</span>
            </div>
            <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 bg-clip-text text-transparent">
              Swispy
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#home" className="relative group text-gray-700 hover:text-pink-500 transition-all duration-300 font-medium py-2">
              {t('nav.home')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#products" className="relative group text-gray-700 hover:text-pink-500 transition-all duration-300 font-medium py-2">
              {t('nav.products')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#story" className="relative group text-gray-700 hover:text-pink-500 transition-all duration-300 font-medium py-2">
              {t('nav.ourStory')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="relative group text-gray-700 hover:text-pink-500 transition-all duration-300 font-medium py-2">
              {t('nav.contact')}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Language Selector & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select 
                value={currentLang} 
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none text-black bg-white/80 backdrop-blur-md border border-pink-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all duration-300 hover:bg-white/90"
              >
                <option value="en">🇺🇸 EN</option>
                <option value="ar">🇸🇦 AR</option>
                <option value="tr">🇹🇷 TR</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <span className="text-pink-400">▼</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-pink-50 hover:bg-pink-100 transition-colors duration-300"
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`block h-0.5 w-6 bg-pink-500 transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-pink-500 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-pink-500 transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-pink-100 pt-4">
            <div className="flex flex-col space-y-3">
              <a href="#home" className="text-gray-700 hover:text-pink-500 transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                {t('nav.home')}
              </a>
              <a href="#products" className="text-gray-700 hover:text-pink-500 transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                {t('nav.products')}
              </a>
              <a href="#story" className="text-gray-700 hover:text-pink-500 transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                {t('nav.ourStory')}
              </a>
              <a href="#contact" className="text-gray-700 hover:text-pink-500 transition-colors font-medium py-2" onClick={() => setIsMenuOpen(false)}>
                {t('nav.contact')}
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;