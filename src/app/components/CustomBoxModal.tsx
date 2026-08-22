'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api, { Box, Product } from '../lib/api';
import { X, Plus, Minus, Sparkles, Box as BoxIcon } from 'lucide-react';

const CustomBoxModal: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isCustomBoxOpen, setIsCustomBoxOpen, addToCart } = useCart();
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBox, setSelectedBox] = useState<Box | null>(null);
  const [selectedCounts, setSelectedCounts] = useState<Record<string, number>>({});
  const [customMessage, setCustomMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const currency = t('common.currency', 'TL');

  useEffect(() => {
    if (isCustomBoxOpen) {
      setLoading(true);
      Promise.all([api.getBoxes(), api.getProducts()])
        .then(([boxRes, prodRes]) => {
          if (boxRes.data) {
            setBoxes(boxRes.data);
            setSelectedBox(boxRes.data[0]);
          }
          if (prodRes.data) {
            setProducts(prodRes.data.filter((p) => p.canBeInBox !== false && p.isAvailable));
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isCustomBoxOpen]);

  if (!isCustomBoxOpen) return null;

  const targetSize = selectedBox ? selectedBox.size : 6;
  const currentTotal = Object.values(selectedCounts).reduce((a, b) => a + b, 0);
  const remaining = targetSize - currentTotal;

  const handleIncrement = (productId: string) => {
    if (currentTotal >= targetSize) return;
    setSelectedCounts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const handleDecrement = (productId: string) => {
    if (!selectedCounts[productId] || selectedCounts[productId] <= 0) return;
    setSelectedCounts((prev) => ({
      ...prev,
      [productId]: prev[productId] - 1,
    }));
  };

  const handleAddToCart = () => {
    if (!selectedBox || currentTotal < targetSize) return;

    const chosenItems = products
      .filter((p) => selectedCounts[p._id] > 0)
      .map((p) => ({
        name: i18n.language === 'ar' && p.nameAr ? p.nameAr : p.name,
        quantity: selectedCounts[p._id],
      }));

    addToCart({
      boxId: selectedBox._id,
      name: `${selectedBox.name} (${selectedBox.size} ${t('common.pieces', 'pcs')})`,
      price: selectedBox.price,
      quantity: 1,
      image: selectedBox.name === 'FLIRT' ? '/assets/flirt.jpeg' : selectedBox.name === 'SECRET' ? '/assets/secret.jpeg' : '/assets/signature.jpeg',
      itemType: 'custom_box',
      customBoxDetails: {
        size: selectedBox.size,
        items: chosenItems,
        message: customMessage || undefined,
      },
    });

    setIsCustomBoxOpen(false);
    setSelectedCounts({});
    setCustomMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-up">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b border-pink-100 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <BoxIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('customBox.title', 'Custom Box Builder')}</h2>
              <p className="text-xs text-gray-500">{t('customBox.subtitle', 'Pick your favorite flavors and curate your dream box')}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCustomBoxOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {loading ? (
          <div className="p-16 text-center text-gray-400">{t('common.loading', 'Loading...')}</div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Step 1: Select Box Size */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                {t('customBox.chooseSize', '1. Choose Box Size')}
              </label>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {boxes.map((box) => (
                  <button
                    key={box._id}
                    type="button"
                    onClick={() => {
                      setSelectedBox(box);
                      setSelectedCounts({});
                    }}
                    className={`p-4 rounded-2xl border text-center transition-all relative overflow-hidden cursor-pointer ${
                      selectedBox?._id === box._id
                        ? 'border-pink-500 bg-pink-50/70 shadow-md ring-2 ring-pink-400/40'
                        : 'border-pink-100 hover:border-pink-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {box.name === 'FLIRT' ? '💝' : box.name === 'SECRET' ? '🎁' : '👑'}
                    </div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base">
                      {i18n.language === 'ar' && box.nameAr ? box.nameAr : i18n.language === 'tr' && box.nameTr ? box.nameTr : box.name}
                    </div>
                    <div className="text-xs font-semibold text-pink-600">{box.size} {t('common.pieces', 'Pieces')}</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">{box.price} {currency}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selection Progress Bar */}
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-700">
                  {t('customBox.flavorProgress', 'Flavor Selection')}: <span className="text-pink-600">{currentTotal} / {targetSize}</span> {t('common.pieces', 'pieces')}
                </span>
                <span className="text-xs font-semibold text-gray-600">
                  {remaining > 0 ? `${remaining} ${t('customBox.remaining', 'remaining')}` : t('customBox.full', '✨ Box Full! Ready to add')}
                </span>
              </div>
              <div className="w-full bg-pink-200/50 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-purple-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (currentTotal / targetSize) * 100)}%` }}
                />
              </div>
            </div>

            {/* Step 2: Choose Flavors */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                {t('customBox.selectFlavors', '2. Select Your Chocolate Flavors')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1">
                {products.map((prod) => {
                  const count = selectedCounts[prod._id] || 0;
                  const localizedProdName = i18n.language === 'ar' && prod.nameAr ? prod.nameAr : i18n.language === 'tr' && prod.nameTr ? prod.nameTr : prod.name;
                  return (
                    <div
                      key={prod._id}
                      className="flex items-center justify-between p-3 rounded-2xl border border-pink-100 bg-white hover:border-pink-200 shadow-xs transition-all"
                    >
                      <div className="flex items-center space-x-3 rtl:space-x-reverse min-w-0 pr-2 rtl:pr-0 rtl:pl-2">
                        <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {prod.thumbnail ? (
                            <img src={prod.thumbnail} alt={localizedProdName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xl">🍫</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                            {i18n.language === 'ar' && prod.nameAr ? prod.nameAr : prod.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 truncate">
                            {i18n.language === 'ar' && prod.descriptionAr ? prod.descriptionAr : prod.description}
                          </p>
                        </div>
                      </div>

                      {/* Counter */}
                      <div className="flex items-center space-x-2 rtl:space-x-reverse bg-pink-50 rounded-full px-2 py-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDecrement(prod._id)}
                          disabled={count === 0}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-pink-100 disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-900 w-4 text-center">{count}</span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(prod._id)}
                          disabled={currentTotal >= targetSize}
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-pink-100 disabled:opacity-40 transition-colors shadow-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom Box Message */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {t('customBox.giftNote', '3. Box Gift Note / Dedication (Optional)')}
              </label>
              <input
                type="text"
                placeholder={t('customBox.notePlaceholder', 'e.g. Happy Anniversary my love!')}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">{t('customBox.boxTotal', 'Box Total')}</span>
                <div className="text-xl font-bold text-gray-900">{selectedBox?.price} {currency}</div>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={currentTotal < targetSize}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {currentTotal < targetSize
                    ? t('customBox.pickMore', { count: targetSize - currentTotal, defaultValue: `Pick ${targetSize - currentTotal} more` })
                    : t('customBox.addBtn', 'Add Custom Box to Cart')}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomBoxModal;
