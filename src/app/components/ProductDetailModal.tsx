'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { Product, ProductOption } from '../lib/api';
import { X, Plus, Minus, ShoppingBag, Check } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { t, i18n } = useTranslation();
  const { addToCart } = useCart();
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [added, setAdded] = useState(false);

  // Set default option
  React.useEffect(() => {
    if (product && product.options && product.options.length > 0) {
      setSelectedOption(product.options[0]);
    } else {
      setSelectedOption(null);
    }
    setQuantity(1);
    setNote('');
    setAdded(false);
  }, [product]);

  if (!product) return null;

  const basePrice = product.price;
  const optionExtra = selectedOption ? selectedOption.price : 0;
  const itemPrice = basePrice + optionExtra;
  const totalPrice = itemPrice * quantity;
  const currency = t('common.currency', 'TL');

  const handleAdd = () => {
    addToCart({
      productId: product._id,
      name: i18n.language === 'ar' && product.nameAr ? product.nameAr : product.name,
      nameAr: product.nameAr,
      price: itemPrice,
      quantity,
      image: product.thumbnail || product.images?.[0] || '/assets/1.jpg',
      selectedOption: selectedOption ? (i18n.language === 'ar' && selectedOption.nameAr ? selectedOption.nameAr : selectedOption.name) : undefined,
      note: note.trim() || undefined,
      itemType: 'product',
    });

    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-xl w-full overflow-hidden relative animate-scale-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10 p-2 text-gray-500 hover:text-gray-800 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-pink-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media Header */}
        <div className="h-64 bg-gradient-to-br from-pink-100/70 via-purple-50/50 to-pink-50 flex items-center justify-center p-6 relative overflow-hidden">
          <div className="w-44 h-44 rounded-3xl bg-white shadow-xl flex items-center justify-center overflow-hidden border border-pink-100 p-2 transform hover:scale-105 transition-transform">
            {product.thumbnail ? (
              <img src={product.thumbnail} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <span className="text-6xl">🍫</span>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex gap-2">
            {product.isFeatured && (
              <span className="px-3 py-1 rounded-full bg-pink-500 text-white text-xs font-bold shadow-md">
                {t('menu.featured', 'Featured')}
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md">
                {t('menu.bestSeller', '★ Best Seller')}
              </span>
            )}
          </div>
        </div>

        {/* Details & Options */}
        <div className="p-6 space-y-5">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-2xl font-bold text-gray-900">
                {i18n.language === 'ar' && product.nameAr ? product.nameAr : product.name}
              </h3>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {product.price} <span className="text-xs font-semibold text-gray-500">{currency}</span>
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {i18n.language === 'ar' && product.descriptionAr ? product.descriptionAr : product.description}
            </p>
          </div>

          {/* Flavor Options */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('customBox.flavorProgress', 'Flavor Option')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.options.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => setSelectedOption(opt)}
                    className={`p-3 rounded-xl border text-left rtl:text-right text-xs font-medium transition-all flex justify-between items-center cursor-pointer ${
                      selectedOption?.name === opt.name
                        ? 'border-pink-500 bg-pink-50/80 text-pink-900 shadow-xs ring-1 ring-pink-400'
                        : 'border-pink-100 text-gray-700 hover:bg-pink-50/40 bg-white'
                    }`}
                  >
                    <span>{i18n.language === 'ar' && opt.nameAr ? opt.nameAr : opt.name}</span>
                    {opt.price > 0 && <span className="text-pink-600 font-bold">+{opt.price} {currency}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              {t('common.pieces', 'Quantity')}
            </span>
            <div className="flex items-center space-x-3 rtl:space-x-reverse bg-pink-50 rounded-2xl px-3 py-1.5 border border-pink-100">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-gray-700 hover:bg-pink-100 transition-colors shadow-xs cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-bold text-gray-900 w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 rounded-xl bg-white flex items-center justify-center text-gray-700 hover:bg-pink-100 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="pt-4 border-t border-pink-100 flex items-center justify-between gap-4">
            <div>
              <span className="text-xs text-gray-500">{t('common.subtotal', 'Subtotal')}</span>
              <div className="text-lg font-bold text-gray-900">{totalPrice} {currency}</div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={added}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 text-white" />
                  <span>{t('common.added', 'Added to Basket!')}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>{t('common.addToCart', 'Add to Basket')} ({totalPrice} {currency})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
