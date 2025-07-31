import React, { useState } from 'react';

interface ProductCardProps {
  title: string;
  description: string;
  icon: string; // Now expects image URL/path
  iconAlt: string; // Alt text for accessibility
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, icon, iconAlt, color, isActive, onClick }) => {
  return (
    <div 
      className={`group relative cursor-pointer transition-all duration-500 transform ${isActive ? 'scale-105 z-10' : 'hover:scale-102'}`}
      onClick={onClick}
    >
      {/* Background Card */}
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-3xl transform ${isActive ? 'rotate-0' : 'group-hover:rotate-1'} transition-all duration-500`}></div>
      
      {/* Main Card */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/50 h-full min-h-[400px] flex flex-col">
        {/* Icon */}
        <div className="text-center mb-6">
          <div className={`mb-4 transform transition-all duration-500 ${isActive ? 'scale-110 animate-bounce' : 'group-hover:scale-105'} flex justify-center`}>
            <img 
              src={icon}
              alt={iconAlt}
              className="w-24 h-24 md:w-32 md:h-32 object-contain"
              onError={(e) => {
                console.log('Image failed to load:', icon);
                // Show a placeholder or fallback
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', icon);
              }}
            />
          </div>
          <div className={`w-16 h-1 mx-auto rounded-full bg-gradient-to-r ${color.replace('from-', 'from-').replace('to-', 'to-')} transition-all duration-500 ${isActive ? 'w-24' : ''}`}></div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 group-hover:text-pink-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg mb-6">
            {description}
          </p>
        </div>

        {/* Coming Soon Badge */}
        <div className="text-center">
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
            isActive 
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
              : 'bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600 group-hover:from-pink-200 group-hover:to-purple-200'
          }`}>
            <span className="mr-2">✨</span>
            Coming Soon
            <span className="ml-2">✨</span>
          </div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
};

const ProductsSection: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState<number | null>(null);

  const products = [
    {
      title: 'Flirt Box',
      description: '4 mini cheesecakes in soft flavors - romantic & sweet packaging.',
      icon: 'http://localhost:3000/assets/chs.png', // Use full absolute URL
      iconAlt: 'Flirt Box Icon',
      color: 'from-pink-300 to-rose-400'
    },
    {
      title: 'Sweet Box', 
      description: '4 mini cheesecakes in soft flavors - romantic & sweet packaging.',
      icon: 'http://localhost:3000/assets/header.png', // Use full absolute URL
      iconAlt: 'Sweet Box Icon',
      color: 'from-purple-300 to-pink-400'
    },
  ];

  // Debug: Log the paths being used
  console.log('Image paths:', products.map(p => p.icon));

  return (
    <section id="products" className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#f7cde2' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-white rounded-full"></div>
        <div className="absolute top-60 right-32 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute bottom-40 left-40 w-32 h-32 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-56 h-56 bg-white rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block px-6 py-3 bg-white/80 backdrop-blur-md rounded-full text-pink-600 font-semibold text-sm mb-6 border border-white/50">
            🧁 Our Collection
          </div>
          
          <h2 className="text-5xl md:text-6xl xl:text-7xl font-black mb-6">
            <span className="block bg-gradient-to-r from-purple-600 to-pink-700 bg-clip-text text-transparent">
              Sweet Products
            </span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Discover our delicious collection of handcrafted desserts
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {products.map((product, index) => (
            <ProductCard
              key={index}
              title={product.title}
              description={product.description}
              icon={product.icon}
              iconAlt={product.iconAlt}
              color={product.color}
              isActive={activeProduct === index}
              onClick={() => setActiveProduct(activeProduct === index ? null : index)}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Be the First to Try!
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Join our waitlist and be notified when our products are available
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="group bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                onClick={() => window.open('https://wa.me/your-number', '_blank')}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl group-hover:animate-bounce">💬</span>
                  <span>Pre-Order Now</span>
                </div>
              </button>
              
              <button 
                className="bg-white text-gray-700 px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-pink-200 hover:border-pink-300 transition-all duration-300 hover:bg-pink-50"
                onClick={() => window.open('https://instagram.com/swispy.desserts', '_blank')}
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-2xl">📸</span>
                  <span>Follow Instagram</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;