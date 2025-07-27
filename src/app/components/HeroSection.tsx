import React from 'react';
import { useTranslation } from 'react-i18next';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="home" className="min-h-screen pt-20 pb-16 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-pink-200/40 to-purple-200/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-pink-600 font-medium text-sm border border-pink-200/50">
                ✨ {t('home.comingSoon')} 
              </div>
              
              <h1 className="text-5xl md:text-7xl xl:text-8xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent">
                  Swispy
                </span>
               
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                {t('home.tagline')}
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed max-w-2xl">
                {t('home.introText')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  className="group relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold overflow-hidden transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                  onClick={() => window.open('https://wa.me/your-number', '_blank')}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-3">
                    <span className="text-2xl">💬</span>
                    <span>{t('home.orderWhatsapp')}</span>
                  </div>
                </button>
                
                
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">3</div>
                <div className="text-sm text-gray-600 font-medium">{t('home.UniqueBoxes')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">∞</div>
                <div className="text-sm text-gray-600 font-medium">{t('home.SweetMoments')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">💕</div>
                <div className="text-sm text-gray-600 font-medium">{t('home.withlove')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Card Stack */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main Card */}
              <div className="relative w-80 h-96 md:w-96 md:h-[480px] bg-gradient-to-br from-pink-200 to-purple-300 rounded-3xl shadow-2xl transform rotate-6 hover:rotate-3 transition-all duration-500">
                <div className="absolute inset-4 bg-white/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center p-8 border border-white/50">
                  <div className="text-8xl mb-6 animate-bounce">🧁</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{t('home.comingSoon')}</h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed">
                    {t('home.description')}
                  </p>
                  <div className="mt-6 flex space-x-2">
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-3 h-3 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>
              </div>

              {/* Background Cards */}
              <div className="absolute top-4 left-4 w-80 h-96 md:w-96 md:h-[480px] bg-gradient-to-br from-purple-200 to-pink-300 rounded-3xl shadow-xl transform rotate-12 -z-10"></div>
              <div className="absolute top-8 left-8 w-80 h-96 md:w-96 md:h-[480px] bg-gradient-to-br from-pink-300 to-purple-200 rounded-3xl shadow-lg transform rotate-18 -z-20"></div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-2xl shadow-lg transform rotate-45 animate-float">
                <div className="w-full h-full flex items-center justify-center text-2xl transform -rotate-45">⭐</div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-green-200 to-teal-300 rounded-full shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <div className="w-full h-full flex items-center justify-center text-2xl">💝</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-pink-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-pink-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(45deg); }
          50% { transform: translateY(-20px) rotate(45deg); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;