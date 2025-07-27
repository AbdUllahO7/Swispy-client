import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 text-white py-16 px-6 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">🧁</span>
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Swispy
              </div>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-md">
              {t('footer.description')}
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="https://wa.me/your-number" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-2xl hover:bg-green-600 transition-colors duration-300 hover:scale-110 transform"
              >
                💬
              </a>
              <a 
                href="https://instagram.com/swispy.desserts" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-2xl hover:bg-pink-600 transition-colors duration-300 hover:scale-110 transform"
              >
                📸
              </a>
              <div className="w-12 h-12 bg-gray-600 rounded-xl flex items-center justify-center text-2xl cursor-not-allowed opacity-50">
                🌐
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('footer.quickLinks')}</h3>
            <div className="space-y-3">
              <a href="#home" className="block text-gray-300 hover:text-pink-400 transition-colors duration-300">{t('nav.home')}</a>
              <a href="#products" className="block text-gray-300 hover:text-pink-400 transition-colors duration-300">{t('nav.products')}</a>
              <a href="#story" className="block text-gray-300 hover:text-pink-400 transition-colors duration-300">{t('nav.ourStory')}</a>
              <a href="#contact" className="block text-gray-300 hover:text-pink-400 transition-colors duration-300">{t('nav.contact')}</a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">{t('footer.comingSoon')}</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <span className="text-xl">📍</span>
                <span>{t('footer.multipleLocations')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">📞</span>
                <span>{t('footer.viaWhatsapp')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xl">✉️</span>
                <span>{t('footer.dmInstagram')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/50 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © 2025 Swispy. {t('footer.copyright')}
            </div>
            
            <div className="flex items-center space-x-6 text-4xl">
              <span className="animate-bounce">🧁</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💕</span>
              <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎁</span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>✨</span>
            </div>
            
            <div className="flex space-x-4 text-sm text-gray-400">
              <a href="#" className="hover:text-pink-400 transition-colors duration-300">{t('footer.privacyPolicy')}</a>
              <span>•</span>
              <a href="#" className="hover:text-pink-400 transition-colors duration-300">{t('footer.termsOfService')}</a>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-14 h-14 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center text-white text-2xl hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-110"
          >
            ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;