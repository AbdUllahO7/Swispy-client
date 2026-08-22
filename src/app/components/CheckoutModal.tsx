'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api, { DeliveryArea, PromoValidation, OrderPayload } from '../lib/api';
import { X, CheckCircle2, Truck, Store, Tag, CreditCard, Banknote, Loader2 } from 'lucide-react';
import { OrderConfirmationData } from './OrderConfirmationModal';

interface CheckoutModalProps {
  onSuccess: (orderData: OrderConfirmationData) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { cart, subtotal, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');
  
  // Delivery Area state
  const [deliveryAreas, setDeliveryAreas] = useState<DeliveryArea[]>([]);
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');

  // Date & Time
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('Immediate / ASAP');

  // Promo Code
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoValidation | null>(null);
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  // Payment
  const [paymentMethod] = useState<'online' | 'cash_on_delivery'>('cash_on_delivery');

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currency = t('common.currency', 'TL');

  // Fetch Delivery Areas on mount
  useEffect(() => {
    if (isCheckoutOpen) {
      api.getDeliveryAreas()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setDeliveryAreas(res.data);
            setSelectedAreaId(res.data[0]._id);
          }
        })
        .catch((err) => console.error('Failed to load delivery areas:', err));
    }
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const currentArea = deliveryAreas.find((a) => a._id === selectedAreaId);
  const deliveryFee = orderType === 'delivery' ? (currentArea ? currentArea.deliveryFee : 20) : 0;
  const discountAmount = appliedPromo ? appliedPromo.discount : 0;
  const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

  // Validate Promo Code
  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setIsValidatingPromo(true);
    setPromoError('');
    try {
      const res = await api.validatePromoCode(promoCodeInput.trim(), subtotal);
      setAppliedPromo(res);
      setPromoError('');
    } catch (err: unknown) {
      setAppliedPromo(null);
      setPromoError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || !phone.trim()) {
      setErrorMsg(i18n.language === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف' : 'Please enter your Name and Phone Number');
      return;
    }

    if (orderType === 'delivery' && !street.trim()) {
      setErrorMsg(i18n.language === 'ar' ? 'يرجى إدخال عنوان التوصيل' : 'Please enter your Delivery Street/Address');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: OrderPayload = {
        customerInfo: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
        },
        items: cart.map((item) => ({
          product: item.productId,
          box: item.boxId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedOption: item.selectedOption,
          note:
            item.note ||
            (item.customBoxDetails?.items && item.customBoxDetails.items.length > 0
              ? item.customBoxDetails.items.map((c) => `${c.quantity}x ${c.name}`).join(' • ')
              : undefined),
          customBoxDetails: item.customBoxDetails,
        })),
        subtotal,
        deliveryFee,
        discount: discountAmount,
        promoCode: appliedPromo ? appliedPromo.code : undefined,
        orderType,
        deliveryArea: orderType === 'delivery' ? selectedAreaId : undefined,
        deliveryAddress:
          orderType === 'delivery'
            ? {
                area: currentArea?.name,
                street: street.trim(),
                building: building.trim(),
              }
            : undefined,
        deliveryDate: deliveryDate || undefined,
        deliveryTime: deliveryTime || undefined,
        paymentMethod,
      };

      const res = await api.createOrder(payload);

      if (res.success) {
        const confirmedItems = cart.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          selectedOption: i.selectedOption,
          note:
            i.note ||
            (i.customBoxDetails?.items && i.customBoxDetails.items.length > 0
              ? i.customBoxDetails.items.map((c) => `${c.quantity}x ${c.name}`).join(' • ')
              : undefined),
          customBoxDetails: i.customBoxDetails,
        }));

        clearCart();
        setIsCheckoutOpen(false);
        onSuccess({
          orderNumber: res.data.orderNumber,
          total: res.data.total,
          subtotal: res.data.subtotal || subtotal,
          deliveryFee: res.data.deliveryFee || deliveryFee,
          discount: res.data.discount || discountAmount,
          promoCode: appliedPromo?.code,
          customerName: name,
          phone,
          email: email.trim() || undefined,
          address:
            orderType === 'delivery'
              ? `${street.trim()}${building.trim() ? ` (Bldg ${building.trim()})` : ''}, ${currentArea?.name || ''}`
              : i18n.language === 'ar'
              ? 'استلام من الفرع'
              : 'Store Pickup',
          isDelivery: orderType === 'delivery',
          deliveryTime,
          deliveryDate,
          paymentMethod,
          items: confirmedItems,
        });
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-up">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b border-pink-100 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('checkout.title', 'Secure Checkout')}</h2>
            <p className="text-xs text-gray-500">{t('checkout.subtitle', 'Complete your order with Swispy luxury sweets')}</p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handlePlaceOrder} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Customer Contact */}
          <div className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100/80 space-y-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">1</span>
              {t('checkout.step1', '1. Contact Information')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('checkout.fullName', 'Full Name *')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Layla / Selin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('checkout.phone', 'Phone Number *')}</label>
                <input
                  type="tel"
                  required
                  placeholder="+90 5XX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('checkout.email', 'Email Address (Optional)')}</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Delivery or Pickup */}
          <div className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100/80 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">2</span>
              {t('checkout.step2', '2. Delivery Option')}
            </h3>

            {/* Toggle Delivery / Pickup */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  orderType === 'delivery'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-md'
                    : 'bg-white text-gray-700 border-pink-200 hover:bg-pink-50/50'
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>{t('checkout.homeDelivery', 'Home Delivery')}</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  orderType === 'pickup'
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-transparent shadow-md'
                    : 'bg-white text-gray-700 border-pink-200 hover:bg-pink-50/50'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{t('checkout.storePickup', 'Store Pickup')}</span>
              </button>
            </div>

            {/* Delivery Fields */}
            {orderType === 'delivery' ? (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{t('checkout.selectZone', 'Select Delivery Zone *')}</label>
                  <select
                    value={selectedAreaId}
                    onChange={(e) => setSelectedAreaId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                  >
                    {deliveryAreas.map((area) => (
                      <option key={area._id} value={area._id}>
                        {i18n.language === 'ar' && area.nameAr ? area.nameAr : area.name} ({area.deliveryFee} {currency} • ETA: {area.estimatedTime})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('checkout.street', 'Street Address *')}</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Street / District"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{t('checkout.building', 'Building / Villa')}</label>
                    <input
                      type="text"
                      placeholder="Apt # 4"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-purple-50/70 rounded-xl text-xs text-purple-900 border border-purple-100 flex items-center gap-2">
                <Store className="w-5 h-5 text-purple-600 flex-shrink-0" />
                <span>{t('checkout.pickupNotice', 'Pickup available from our Flagship Boutique. Ready in ~30 mins.')}</span>
              </div>
            )}

            {/* Time / Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('checkout.preferredDate', 'Preferred Date')}</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('checkout.preferredTime', 'Preferred Time / Slot')}</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
                >
                  <option value="Immediate / ASAP">Immediate / ASAP</option>
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Afternoon (2:00 PM - 6:00 PM)">Afternoon (2:00 PM - 6:00 PM)</option>
                  <option value="Evening (7:00 PM - 11:00 PM)">Evening (7:00 PM - 11:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Promo Code */}
          <div className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100/80 space-y-3">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <Tag className="w-4 h-4 text-pink-500" />
              {t('checkout.step3Promo', 'Promo Code / Discount')}
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try SWISPY20"
                value={promoCodeInput}
                onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-pink-200 bg-white text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isValidatingPromo || !promoCodeInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
              >
                {isValidatingPromo ? t('checkout.checking', 'Checking...') : t('checkout.apply', 'Apply')}
              </button>
            </div>
            {appliedPromo && (
              <div className="p-2.5 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>{t('checkout.applied', { code: appliedPromo.code, discount: appliedPromo.discount, defaultValue: `Code ${appliedPromo.code} applied! Saved ${appliedPromo.discount} ${currency}` })}</span>
              </div>
            )}
            {promoError && (
              <p className="text-xs text-red-500">{promoError}</p>
            )}
          </div>

          {/* Step 4: Payment Method (Cash on Delivery Active) */}
          <div className="bg-pink-50/40 p-5 rounded-2xl border border-pink-100/80 space-y-4">
            <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-xs flex items-center justify-center">3</span>
              {t('checkout.step4Payment', '3. Payment Method')}
            </h3>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/5 border-2 border-pink-500 flex items-center justify-between shadow-xs">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow-sm">
                    <Banknote className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      <span>{t('checkout.cashOnDelivery', 'Cash on Delivery (COD)')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-extrabold">Active</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{t('checkout.codDesc', 'Pay in cash or POS card upon delivery / pickup')}</div>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center text-xs">
                  ✓
                </div>
              </div>

              {/* Online Card - Disabled / Coming Soon */}
              <div className="p-3.5 rounded-2xl bg-gray-50/80 border border-gray-200/80 flex items-center justify-between opacity-70">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-9 h-9 rounded-xl bg-gray-200 text-gray-500 flex items-center justify-center">
                    <CreditCard className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600 text-xs flex items-center gap-2">
                      <span>{t('checkout.cardComingSoon', 'Credit Card / Mada / Apple Pay')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">{t('checkout.comingSoonTag', 'Coming Soon')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Summary Breakdown & Place Order */}
          <div className="p-5 bg-gradient-to-br from-pink-100/60 to-purple-100/40 rounded-2xl border border-pink-200 space-y-2.5">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{t('checkout.itemsSubtotal', 'Items Subtotal')}</span>
              <span>{subtotal} {currency}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>{t('checkout.deliveryFee', 'Delivery Fee')}</span>
              <span>{deliveryFee} {currency}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-xs font-semibold text-pink-600">
                <span>{t('checkout.promoDiscount', 'Promo Discount')} ({appliedPromo?.code})</span>
                <span>-{discountAmount} {currency}</span>
              </div>
            )}
            <div className="border-t border-pink-200/80 pt-2 flex justify-between items-center text-base font-bold text-gray-900">
              <span>{t('checkout.totalAmount', 'Total Amount')}</span>
              <span className="text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                {finalTotal} {currency}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-base shadow-xl shadow-pink-500/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('checkout.processing', 'Processing Order...')}</span>
              </>
            ) : (
              <span>{t('checkout.confirmOrder', { total: finalTotal, defaultValue: `Confirm & Place Order (${finalTotal} ${currency})` })}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
