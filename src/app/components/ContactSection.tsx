import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ContactSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const contactCards = [
    {
      icon: '💬',
      title: t('contact.whatsapp'),
      description: t('contact.orderDirect'),
      link: 'https://wa.me/your-number',
      color: 'from-green-400 to-emerald-500',
      hoverColor: 'from-green-500 to-emerald-600'
    },
    {
      icon: '📸',
      title: t('contact.instagram'),
      description: '@swispy.desserts',
      link: 'https://instagram.com/swispy.desserts',
      color: 'from-pink-400 to-purple-500',
      hoverColor: 'from-pink-500 to-purple-600'
    },
    {
      icon: '🌐',
      title: t('contact.website'),
      description: t('home.comingSoon'),
      link: '#',
      color: 'from-blue-400 to-indigo-500',
      hoverColor: 'from-blue-500 to-indigo-600'
    }
  ];

  return (
    <>
      {/* Share Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="space-y-8">
            <div className="inline-block px-6 py-3 bg-white/80 backdrop-blur-md rounded-full text-pink-600 font-semibold text-sm border border-white/50">
              🎉 {t('share.shareLove')}
            </div>
            
            <h2 className="text-4xl md:text-5xl xl:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-700 bg-clip-text text-transparent">
                {t('share.title')}
              </span>
            </h2>
            
            <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {t('share.description')}
              </p>
              
              <div className="space-y-6">
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
                    #SwispyMoment
                  </div>
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg">
                    #MySwispy
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg">
                  {t('share.feature')}
                </p>
              </div>

              {/* Visual Mockup */}
              <div className="mt-12 grid md:grid-cols-3 gap-6">
                <div className="group">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <div className="text-4xl mb-4 text-center">📷</div>
                    <div className="text-sm font-semibold text-gray-700 text-center">{t('share.snapMoment')}</div>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <div className="text-4xl mb-4 text-center">📱</div>
                    <div className="text-sm font-semibold text-gray-700 text-center">{t('share.shareHashtag')}</div>
                  </div>
                </div>
                <div className="group">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-6 group-hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
                    <div className="text-4xl mb-4 text-center">🎁</div>
                    <div className="text-sm font-semibold text-gray-700 text-center">{t('share.winPrizes')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-50 to-pink-50/30"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-pink-600 font-semibold text-sm mb-6 border border-pink-200/50">
              📲 {t('contact.title')}
            </div>
            
            <h2 className="text-5xl md:text-6xl xl:text-7xl font-black mb-6">
              <span className="block text-gray-800">{t('contact.letsConnect')}</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t('contact.connectDesc')}
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactCards.map((card, index) => (
              <div
                key={index}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => card.link !== '#' && window.open(card.link, '_blank')}
              >
                {/* Background Card */}
                <div className={`absolute inset-0 bg-gradient-to-br ${hoveredCard === index ? card.hoverColor : card.color} rounded-3xl transform transition-all duration-500 ${hoveredCard === index ? 'scale-105 rotate-2' : 'group-hover:scale-102 group-hover:rotate-1'}`}></div>
                
                {/* Main Card */}
                <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 h-full min-h-[280px] flex flex-col">
                  <div className="text-center flex-1">
                    <div className={`text-7xl mb-6 transform transition-all duration-500 ${hoveredCard === index ? 'scale-110 animate-bounce' : 'group-hover:scale-105'}`}>
                      {card.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  
                  {card.link !== '#' && (
                    <div className="text-center mt-6">
                      <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                        hoveredCard === index
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 group-hover:from-pink-200 group-hover:to-purple-200'
                      }`}>
                        <span className="mr-2">✨</span>
                        {t('contact.connectNow')}
                        <span className="ml-2">✨</span>
                      </div>
                    </div>
                  )}
                  
                  {card.link === '#' && (
                    <div className="text-center mt-6">
                      <div className="inline-flex items-center px-6 py-3 bg-gray-100 rounded-full text-sm font-semibold text-gray-500">
                        <span className="mr-2">⏳</span>
                        {t('home.comingSoon')}
                        <span className="ml-2">⏳</span>
                      </div>
                    </div>
                  )}

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Thank You Message */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-3xl p-8 md:p-12 shadow-xl border border-pink-100/50 max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                {t('contact.thankYou')}
              </h3>
              
              <div className="flex justify-center space-x-4 text-4xl mb-6">
                <span className="animate-bounce">🧁</span>
                <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>💕</span>
                <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎁</span>
                <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>✨</span>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {t('contact.familyDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;