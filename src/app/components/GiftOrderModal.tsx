'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api, { Box, SpecialOrderPayload } from '../lib/api';
import { X, Gift, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface GiftOrderModalProps {
  onSuccess?: (orderNumber: string) => void;
}

const GiftOrderModal: React.FC<GiftOrderModalProps> = () => {
  const { t, i18n } = useTranslation();
  const { isGiftOpen, setIsGiftOpen } = useCart();

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [selectedBoxId, setSelectedBoxId] = useState('');
  
  // Gift details
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [senderName, setSenderName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [cardDesign, setCardDesign] = useState('Romantic Pink & Gold');
  const [includeGiftPackaging, setIncludeGiftPackaging] = useState(true);

  // Address
  const [street, setStreet] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('Evening (7:00 PM - 10:00 PM)');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNumber, setSuccessNumber] = useState('');

  const currency = t('common.currency', 'TL');

  useEffect(() => {
    if (isGiftOpen) {
      api.getBoxes()
        .then((res) => {
          if (res.data && res.data.length > 0) {
            setBoxes(res.data);
            setSelectedBoxId(res.data[0]._id);
          }
        })
        .catch(console.error);
    }
  }, [isGiftOpen]);

  if (!isGiftOpen) return null;

  const chosenBox = boxes.find((b) => b._id === selectedBoxId) || boxes[0];
  const boxPrice = chosenBox ? chosenBox.price : 85;
  const packagingFee = includeGiftPackaging ? 15 : 0;
  const totalGiftPrice = boxPrice + packagingFee;

  const handleSubmitGift = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientPhone.trim() || !senderName.trim()) {
      setErrorMsg('Please enter recipient and sender information');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload: SpecialOrderPayload = {
        type: 'gift',
        customerInfo: {
          name: senderName.trim(),
          phone: recipientPhone.trim(),
        },
        giftDetails: {
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          giftMessage: giftMessage.trim(),
          senderName: senderName.trim(),
          includeCard: true,
          cardDesign,
          includeGiftPackaging,
        },
        items: [
          {
            name: `${chosenBox?.name || 'Luxury'} Chocolate Gift Box (${chosenBox?.size || 12} pcs)`,
            price: boxPrice,
            quantity: 1,
            selectedOption: includeGiftPackaging ? 'Luxury Satin Ribbon Wrap' : 'Standard Wrap',
          },
        ],
        deliveryAddress: {
          area: 'Standard Zone',
          street: street.trim(),
        },
        deliveryTime: deliveryTime || undefined,
        orderType: 'delivery',
        subtotal: totalGiftPrice,
        total: totalGiftPrice,
      };

      const res = await api.createSpecialOrder(payload);
      if (res.success) {
        setSuccessNumber(res.data.orderNumber);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit gift order');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsGiftOpen(false);
    setSuccessNumber('');
    setRecipientName('');
    setRecipientPhone('');
    setGiftMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-up">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b border-pink-100 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('gift.title', 'Send a Gift 🎁')}</h2>
              <p className="text-xs text-pink-600 font-medium">{t('gift.subtitle', 'Surprise someone special with handcrafted Swispy luxury')}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-pink-50 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {successNumber ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{t('gift.successTitle', 'Gift Order Received!')}</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              {t('gift.successDesc', { number: successNumber, defaultValue: `Your gift order ${successNumber} is being prepared with custom ribbon and handwritten card.` })}
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm shadow-md cursor-pointer"
            >
              {t('common.done', 'Done')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitGift} className="p-6 space-y-6">
            {errorMsg && (
              <div className="p-3.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            {/* Select Box */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                {t('gift.selectBox', '1. Select Luxury Gift Box')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {boxes.map((box) => (
                  <button
                    key={box._id}
                    type="button"
                    onClick={() => setSelectedBoxId(box._id)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedBoxId === box._id
                        ? 'border-pink-500 bg-pink-50/70 shadow-md ring-2 ring-pink-300'
                        : 'border-pink-100 hover:border-pink-200 bg-white'
                    }`}
                  >
                    <div className="text-xl mb-1">{box.name === 'FLIRT' ? '💝' : box.name === 'SECRET' ? '🎁' : '👑'}</div>
                    <div className="font-bold text-xs sm:text-sm text-gray-800">
                      {i18n.language === 'ar' && box.nameAr ? box.nameAr : i18n.language === 'tr' && box.nameTr ? box.nameTr : box.name}
                    </div>
                    <div className="text-xs text-pink-600 font-semibold">{box.price} {currency}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient & Sender */}
            <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('gift.recipientSender', '2. Recipient & Sender Details')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('gift.recipientName', 'Recipient Name *')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Layla / Selin"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('gift.recipientPhone', 'Recipient Phone *')}</label>
                  <input
                    type="tel"
                    required
                    placeholder="+90 5XX XXX XXXX"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">{t('gift.senderName', 'Your Name (Sender) *')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kerem / Ahmed"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                </div>
              </div>
            </div>

            {/* Gift Message & Card Design */}
            <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-100 space-y-3">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                {t('gift.giftNote', '3. Gift Note & Custom Card')}
              </label>
              <div>
                <textarea
                  rows={3}
                  placeholder={t('gift.notePlaceholder', "Write your special message here... 'Wishing you the sweetest birthday!'")}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-pink-200 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">{t('gift.cardStyle', 'Greeting Card Style')}</label>
                  <select
                    value={cardDesign}
                    onChange={(e) => setCardDesign(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="Romantic Pink & Gold">Romantic Pink & Gold</option>
                    <option value="Classic Elegance Black & Gold">Classic Elegance Black & Gold</option>
                    <option value="Birthday Celebration">Birthday Celebration</option>
                    <option value="Thank You & Gratitude">Thank You & Gratitude</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 rtl:space-x-reverse pt-4 sm:pt-6">
                  <input
                    type="checkbox"
                    id="packaging"
                    checked={includeGiftPackaging}
                    onChange={(e) => setIncludeGiftPackaging(e.target.checked)}
                    className="rounded text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="packaging" className="text-xs text-gray-700 cursor-pointer font-medium">
                    {t('gift.packagingAddon', `Luxury Ribbon & Gift Bag (+15 ${currency})`)}
                  </label>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('gift.deliveryLocation', 'Delivery Street / Location')}</label>
                <input
                  type="text"
                  placeholder="Street / District"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('gift.deliveryTime', 'Delivery Time')}</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pink-200 text-xs bg-white"
                >
                  <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                  <option value="Afternoon (2:00 PM - 6:00 PM)">Afternoon (2:00 PM - 6:00 PM)</option>
                  <option value="Evening (7:00 PM - 10:00 PM)">Evening (7:00 PM - 10:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Total & Submit */}
            <div className="pt-4 border-t border-pink-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-500">{t('gift.giftTotal', 'Gift Package Total')}</span>
                <div className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {totalGiftPrice} {currency}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-pink-500/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{t('gift.sendGiftNow', 'Send Gift Now')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GiftOrderModal;
