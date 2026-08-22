'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api, { Box } from '../lib/api';
import { ShoppingBag, Sparkles, Sliders, Loader2 } from 'lucide-react';

const BoxesSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { addToCart, setIsCustomBoxOpen } = useCart();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBoxes()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setBoxes(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getBoxImg = (box: Box) => {
    if (box.image) return box.image;
    switch (box.name) {
      case 'FLIRT':
        return '/assets/flirt.jpeg';
      case 'SECRET':
        return '/assets/secret.jpeg';
      case 'SIGNATURE':
      default:
        return '/assets/signature.jpeg';
    }
  };

  const getBoxColor = (name: string) => {
    switch (name) {
      case 'FLIRT':
        return 'from-pink-400/20 via-rose-300/30 to-purple-400/20';
      case 'SECRET':
        return 'from-purple-400/20 via-pink-400/30 to-rose-400/20';
      case 'SIGNATURE':
      default:
        return 'from-amber-400/20 via-pink-400/30 to-purple-500/20';
    }
  };

  const getLocalizedBoxName = (box: Box) => {
    if (i18n.language === 'ar' && box.nameAr) return box.nameAr;
    if (i18n.language === 'tr' && box.nameTr) return box.nameTr;
    return `${box.name} Box`;
  };

  const getLocalizedBoxDesc = (box: Box) => {
    if (i18n.language === 'ar' && box.descriptionAr) return box.descriptionAr;
    if (i18n.language === 'tr' && box.descriptionTr) return box.descriptionTr;
    return box.description || `Artisanal assortment of ${box.size} exquisite handcrafted chocolates.`;
  };

  const handleAddBox = (box: Box) => {
    addToCart({
      boxId: box._id,
      name: `${getLocalizedBoxName(box)} (${box.size} ${t('common.pieces', 'Pieces')})`,
      nameAr: box.nameAr,
      price: box.price,
      quantity: 1,
      image: getBoxImg(box),
      itemType: 'box',
    });
  };

  const currency = t('common.currency', 'TL');

  return (
    <section id="boxes" className="py-24 px-6 bg-gradient-to-b from-white via-pink-50/30 to-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 w-96 h-96 rounded-full bg-pink-200/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 rounded-full bg-purple-200/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> {t('boxes.tag', 'Curated Luxury Boxes')}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('boxes.title', 'Indulge in Signature Collections')}
            </span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            {t('boxes.desc', 'Choose from our masterfully curated gift boxes or create a personalized assortment of pure bliss.')}
          </p>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
          </div>
        ) : (
          /* Boxes Grid */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {boxes.map((box) => (
              <div
                key={box._id}
                className="group relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-pink-100/80 shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
              >
                {/* Glow badge */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${getBoxColor(box.name)} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                <div>
                  {/* Image */}
                  <div className="relative h-60 rounded-2xl overflow-hidden mb-6 bg-pink-50 flex items-center justify-center p-4 border border-pink-100/50">
                    <img
                      src={getBoxImg(box)}
                      alt={getLocalizedBoxName(box)}
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/1.jpg';
                      }}
                    />
                    <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-pink-100 text-xs font-extrabold text-pink-600">
                      {box.size} {t('common.pieces', 'Pieces')}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-2xl font-bold text-gray-900 group-hover:text-pink-600 transition-colors">
                        {getLocalizedBoxName(box)}
                      </h3>
                      <span className="text-2xl font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        {box.price} <span className="text-xs font-semibold text-gray-500">{currency}</span>
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed min-h-[48px]">
                      {getLocalizedBoxDesc(box)}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-4 border-t border-pink-100/60">
                  <button
                    type="button"
                    onClick={() => handleAddBox(box)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-sm shadow-md shadow-pink-500/20 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{t('boxes.orderPreSelected', 'Order Pre-Selected')} ({box.price} {currency})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCustomBoxOpen(true)}
                    className="w-full py-3 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold text-xs border border-pink-200/60 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>{t('boxes.customizeFlavors', 'Customize Flavors')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BoxesSection;
