import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const StorySection: React.FC = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  const storySteps = [
    {
      icon: '💡',
      title: t('story.theIdea'),
      description: t('story.ideaDesc')
    },
    {
      icon: '🎯',
      title: t('story.theVision'), 
      description: t('story.visionDesc')
    },
    {
      icon: '🔬',
      title: t('story.theProcess'),
      description: t('story.processDesc')
    },
    {
      icon: '💝',
      title: t('story.thePromise'),
      description: t('story.promiseDesc')
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % storySteps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="story" className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#dbabc7' }}>
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-200/30 to-pink-200/30"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Story Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-6 py-3 bg-white/80 backdrop-blur-md rounded-full text-purple-600 font-semibold text-sm border border-white/50">
                💖 {t('story.title')}
              </div>
              
              <h2 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight">
                <span className="block bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                  {t('story.sweetJourney')}
                </span>
              </h2>
            </div>

            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {t('story.text')}
              </p>
              
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-sm font-medium text-gray-700">
                  {t('story.qualityFirst')}
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-gray-700">
                  {t('story.madeWithLove')}
                </span>
                <span className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-sm font-medium text-gray-700">
                  {t('story.everyDetail')}
                </span>
              </div>
            </div>

            {/* Interactive Story Timeline */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-6">{t('story.journeySteps')}</h3>
              <div className="grid grid-cols-2 gap-4">
                {storySteps.map((step, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-500 ${
                      currentStep === index
                        ? 'bg-white/90 backdrop-blur-md shadow-xl scale-105'
                        : 'bg-white/60 backdrop-blur-sm hover:bg-white/80'
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <div className="text-sm font-bold text-gray-800">{step.title}</div>
                    <div className="text-xs text-gray-600 mt-1">{step.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Visual Story */}
          <div className="relative">
            {/* Main Visual Container */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Central Circle */}
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-full shadow-2xl border border-white/50"></div>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <div className="text-6xl mb-4 animate-bounce">
                    {storySteps[currentStep].icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {storySteps[currentStep].title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {storySteps[currentStep].description}
                  </p>
                </div>

                {/* Orbiting Elements */}
                <div className="absolute inset-0">
                  {storySteps.map((step, index) => (
                    <div
                      key={index}
                      className={`absolute w-16 h-16 bg-gradient-to-br from-pink-200 to-purple-300 rounded-2xl shadow-lg flex items-center justify-center text-2xl transition-all duration-1000 ${
                        currentStep === index ? 'scale-125 shadow-xl' : 'scale-100'
                      }`}
                      style={{
                        transform: `rotate(${index * 90}deg) translateY(-200px) rotate(-${index * 90}deg)`,
                        transformOrigin: '50% 200px'
                      }}
                    >
                      {step.icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Decoration Elements */}
              <div className="absolute -top-8 -left-8 w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-300 rounded-3xl shadow-lg flex items-center justify-center text-3xl animate-float">
                ⭐
              </div>
              <div className="absolute -top-4 -right-12 w-16 h-16 bg-gradient-to-br from-green-200 to-teal-300 rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-float" style={{ animationDelay: '1s' }}>
                🌟
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full shadow-lg flex items-center justify-center text-3xl animate-float" style={{ animationDelay: '2s' }}>
                💎
              </div>
              <div className="absolute -bottom-4 -left-12 w-18 h-18 bg-gradient-to-br from-purple-200 to-indigo-300 rounded-2xl shadow-lg flex items-center justify-center text-2xl animate-float" style={{ animationDelay: '1.5s' }}>
                🎨
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {storySteps.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentStep === index
                      ? 'bg-white shadow-lg scale-125'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => setCurrentStep(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="text-center mt-20">
          <div className="inline-block bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/50">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              {t('story.joinStory')}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl">
              {t('story.journeyDesc')}
            </p>
            <button 
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              onClick={() => window.open('https://instagram.com/swispy.desserts', '_blank')}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📸</span>
                <span>{t('story.followJourney')}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default StorySection;