'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Sparkles } from 'lucide-react';

const CartDrawer: React.FC = () => {
  const { t } = useTranslation();
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, subtotal, totalCount, setIsCheckoutOpen } = useCart();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const currency = t('common.currency', 'TL');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-fade-in cursor-pointer"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 rtl:right-auto rtl:left-0 max-w-full flex pl-10 rtl:pl-0 rtl:pr-10">
        <div className="w-screen max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl border-l rtl:border-l-0 rtl:border-r border-pink-100 flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="p-6 border-b border-pink-100/80 flex items-center justify-between bg-gradient-to-r from-pink-50/50 to-purple-50/30">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{t('cart.title', 'Your Basket')}</h2>
                <p className="text-xs text-pink-600 font-medium">
                  {totalCount} {totalCount === 1 ? t('cart.item', 'item') : t('cart.items', 'items')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-pink-100/50 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500">
                <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-pink-400 mb-4 shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{t('cart.emptyTitle', 'Your basket is empty')}</h3>
                <p className="text-sm text-gray-500 max-w-xs mb-6">
                  {t('cart.emptyDesc', 'Explore our luxury chocolates and curated boxes to fill your basket!')}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {t('cart.startShopping', 'Start Shopping')}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-4 border border-pink-100 shadow-sm hover:shadow-md transition-shadow flex gap-3 relative overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-pink-50 flex-shrink-0 flex items-center justify-center overflow-hidden border border-pink-100/50">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{item.itemType === 'box' ? '🎁' : '🍫'}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-gray-800 text-sm truncate pr-2 rtl:pr-0 rtl:pl-2">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.selectedOption && (
                      <p className="text-xs text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md inline-block mt-1">
                        {item.selectedOption}
                      </p>
                    )}

                    {item.customBoxDetails && (
                      <div className="mt-1 text-[11px] text-gray-500 bg-purple-50/70 p-2 rounded-lg border border-purple-100">
                        <span className="font-semibold text-purple-700">
                          {t('customBox.title', 'Custom Box')} ({item.customBoxDetails.size} {t('common.pieces', 'pcs')}):
                        </span>
                        <ul className="mt-0.5 space-y-0.5">
                          {item.customBoxDetails.items.map((i, idx) => (
                            <li key={idx} className="truncate">
                              • {i.quantity}x {i.name}
                            </li>
                          ))}
                        </ul>
                        {item.customBoxDetails.message && (
                          <p className="mt-1 italic text-gray-600 truncate">
                            &ldquo;{item.customBoxDetails.message}&rdquo;
                          </p>
                        )}
                      </div>
                    )}

                    {item.note && (
                      <p className="text-[11px] text-gray-500 italic mt-1">Note: {item.note}</p>
                    )}

                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-gray-900 text-sm">
                        {item.price * item.quantity} <span className="text-xs font-normal text-gray-500">{currency}</span>
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2 rtl:space-x-reverse bg-pink-50/80 rounded-full px-2 py-1 border border-pink-100">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-pink-100 transition-colors shadow-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-pink-100 transition-colors shadow-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-pink-100 bg-white/90 backdrop-blur-md space-y-4">
              <div className="flex justify-between items-center text-gray-600 text-sm">
                <span>{t('cart.subtotal', 'Subtotal')}</span>
                <span className="font-bold text-gray-900 text-base">{subtotal} {currency}</span>
              </div>

              <div className="p-3 bg-pink-50/70 rounded-xl flex items-center gap-2 text-xs text-pink-700 border border-pink-100">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-pink-500" />
                <span>{t('cart.freeDelivery', 'Free delivery available on qualifying orders above 300 TL!')}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white font-bold text-base shadow-lg shadow-pink-500/25 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer"
              >
                <span>{t('cart.checkout', 'Checkout')}</span>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
