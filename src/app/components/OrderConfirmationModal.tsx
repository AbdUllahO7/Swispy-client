'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, MessageSquare, Sparkles, X, ShoppingBag, MapPin, CreditCard } from 'lucide-react';
import api from '../lib/api';

export interface OrderConfirmationData {
  orderNumber: string;
  total: number;
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
  promoCode?: string;
  customerName: string;
  phone: string;
  email?: string;
  address?: string;
  isDelivery: boolean;
  deliveryTime?: string;
  deliveryDate?: string;
  paymentMethod?: string;
  items?: {
    name: string;
    quantity: number;
    price: number;
    selectedOption?: string;
    note?: string;
    customBoxDetails?: {
      size?: number;
      items?: { name: string; quantity: number }[];
      message?: string;
    };
  }[];
}

interface OrderConfirmationModalProps {
  orderData: OrderConfirmationData | null;
  onClose: () => void;
}

const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({ orderData, onClose }) => {
  const { t, i18n } = useTranslation();
  const [whatsappNum, setWhatsappNum] = useState('905551025285');

  useEffect(() => {
    api
      .getSettings()
      .then((res) => {
        if (res.data?.whatsappNumber) {
          setWhatsappNum(res.data.whatsappNumber.replace(/[^0-9]/g, ''));
        }
      })
      .catch(() => {});
  }, []);

  // Build formatted WhatsApp message with complete custom box chocolates breakdown
  const buildWhatsAppMessage = (data: OrderConfirmationData) => {
    const isAr = i18n.language === 'ar';
    const isTr = i18n.language === 'tr';

    const itemsText = (data.items || [])
      .map((it) => {
        let itemStr = `• *${it.name}* × ${it.quantity} = ${it.price * it.quantity} TL`;
        if (it.customBoxDetails?.items && it.customBoxDetails.items.length > 0) {
          const chocList = it.customBoxDetails.items
            .map((c) => `   ▫️ ${c.quantity}x ${c.name}`)
            .join('\n');
          itemStr += `\n   🎁 *${isAr ? 'محتويات البوكس المخصص' : isTr ? 'Özel Kutu İçeriği' : 'Custom Box Selection'}*:\n${chocList}`;
          if (it.customBoxDetails.message) {
            itemStr += `\n   💌 *${isAr ? 'رسالة الإهداء' : isTr ? 'Hediye Kartı' : 'Gift Card'}*: "${it.customBoxDetails.message}"`;
          }
        } else if (it.note) {
          itemStr += `\n   📝 *${isAr ? 'المحتويات' : isTr ? 'Detay' : 'Details'}*: ${it.note}`;
        } else if (it.selectedOption) {
          itemStr += `\n   ▫️ ${it.selectedOption}`;
        }
        return itemStr;
      })
      .join('\n\n');

    let msg = `🍫 *SWISPY - ${isAr ? 'طلب جديد من الموقع الإلكتروني' : isTr ? 'Web Sitesinden Yeni Sipariş' : 'New Website Order'}*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🔖 *${isAr ? 'رقم الطلب' : isTr ? 'Sipariş No' : 'Order #'}*: ${data.orderNumber}\n`;
    msg += `👤 *${isAr ? 'العميل' : isTr ? 'Müşteri' : 'Customer'}*: ${data.customerName}\n`;
    msg += `📞 *${isAr ? 'رقم الجوال' : isTr ? 'Telefon' : 'Phone'}*: ${data.phone}\n`;
    if (data.email) msg += `✉️ *${isAr ? 'البريد' : isTr ? 'E-posta' : 'Email'}*: ${data.email}\n`;

    msg += `\n📍 *${isAr ? 'طريقة الاستلام' : isTr ? 'Teslimat Türü' : 'Fulfillment'}*: ${
      data.isDelivery
        ? isAr
          ? '🚗 توصيل للمنزل'
          : isTr
          ? '🚗 Adrese Teslimat'
          : '🚗 Home Delivery'
        : isAr
        ? '🏪 استلام من الفرع'
        : isTr
        ? '🏪 Mağazadan Teslim'
        : '🏪 Store Pickup'
    }\n`;

    if (data.isDelivery && data.address) {
      msg += `🏠 *${isAr ? 'العنوان' : isTr ? 'Adres' : 'Address'}*: ${data.address}\n`;
    }

    if (data.deliveryTime || data.deliveryDate) {
      msg += `🕒 *${isAr ? 'الموعد المفضل' : isTr ? 'Zaman' : 'Preferred Time'}*: ${data.deliveryTime || 'ASAP'} ${
        data.deliveryDate ? `(${data.deliveryDate})` : ''
      }\n`;
    }

    if (itemsText) {
      msg += `\n🛍️ *${isAr ? 'المنتجات المطلوبة' : isTr ? 'Sipariş Edilen Ürünler' : 'Order Items'}*:\n${itemsText}\n`;
    }

    msg += `\n💰 *${isAr ? 'ملخص الحساب' : isTr ? 'Özet' : 'Financial Summary'}*:\n`;
    if (data.subtotal) msg += `• ${isAr ? 'المجموع الفرعي' : isTr ? 'Ara Toplam' : 'Subtotal'}: ${data.subtotal} TL\n`;
    if (data.discount && data.discount > 0) {
      msg += `• ${isAr ? 'الخصم' : isTr ? 'İndirim' : 'Discount'} (${data.promoCode || 'PROMO'}): -${data.discount} TL\n`;
    }
    if (data.deliveryFee && data.deliveryFee > 0) {
      msg += `• ${isAr ? 'رسوم التوصيل' : isTr ? 'Teslimat Ücreti' : 'Delivery'}: ${data.deliveryFee} TL\n`;
    }
    msg += `⭐ *${isAr ? 'المجموع الإجمالي' : isTr ? 'Toplam Tutar' : 'Grand Total'}*: *${data.total} TL*\n`;

    msg += `💵 *${isAr ? 'طريقة الدفع' : isTr ? 'Ödeme Yöntemi' : 'Payment'}*: ${
      data.paymentMethod === 'online'
        ? isAr
          ? 'بطاقة دفع إلكترونية'
          : isTr
          ? 'Online Kart'
          : 'Online Card'
        : isAr
        ? 'الدفع عند الاستلام (COD)'
        : isTr
        ? 'Kapıda Ödeme (COD)'
        : 'Cash on Delivery (COD)'
    }\n`;

    msg += `━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🌐 *Note: This order was placed automatically via the Swispy Website (تم إرسال هذا الطلب تلقائياً من الموقع الإلكتروني)*`;

    return encodeURIComponent(msg);
  };

  // Auto-open WhatsApp on mount
  useEffect(() => {
    if (orderData) {
      const url = `https://wa.me/${whatsappNum}?text=${buildWhatsAppMessage(orderData)}`;
      try {
        window.open(url, '_blank');
      } catch {
        // Popups might be blocked by browser, user can click button
      }
    }
  }, [orderData, whatsappNum]);

  if (!orderData) return null;

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${buildWhatsAppMessage(orderData)}`;
  const currency = t('common.currency', 'TL');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-lg w-full p-8 text-center relative animate-scale-up overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-pink-300/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-300/30 blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-pink-50 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center mx-auto mb-5 text-white shadow-xl shadow-pink-500/30 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> {t('confirmation.tag', 'Order Placed & Sent')}
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          {t('confirmation.thankYou', { name: orderData.customerName, defaultValue: `Thank You, ${orderData.customerName}!` })}
        </h2>
        <p className="text-gray-600 text-xs sm:text-sm mb-5 max-w-sm mx-auto">
          {t(
            'confirmation.desc',
            'Your order has been recorded and an automated notification with full details is prepared for WhatsApp.'
          )}
        </p>

        {/* Receipt Box */}
        <div className="bg-gradient-to-br from-pink-50/80 to-purple-50/60 rounded-2xl p-4 sm:p-5 border border-pink-100 mb-6 text-left rtl:text-right space-y-2.5 text-xs sm:text-sm">
          <div className="flex justify-between items-center border-b border-pink-100 pb-2">
            <span className="text-gray-500 font-medium">{t('confirmation.orderNumber', 'Order Number')}</span>
            <span className="font-bold text-pink-600 font-mono text-sm tracking-wider">{orderData.orderNumber}</span>
          </div>

          <div className="flex justify-between items-center border-b border-pink-100 pb-2">
            <span className="text-gray-500 font-medium">{t('confirmation.type', 'Fulfillment')}</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              {orderData.isDelivery ? (
                <>
                  <MapPin className="w-3.5 h-3.5 text-pink-500" />
                  {t('checkout.homeDelivery', 'Home Delivery')}
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-purple-500" />
                  {t('checkout.storePickup', 'Store Pickup')}
                </>
              )}
            </span>
          </div>

          {orderData.address && (
            <div className="flex justify-between items-start border-b border-pink-100 pb-2">
              <span className="text-gray-500 font-medium">{t('confirmation.destination', 'Address')}</span>
              <span className="font-medium text-gray-700 text-right rtl:text-left max-w-[220px]">
                {orderData.address}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center border-b border-pink-100 pb-2">
            <span className="text-gray-500 font-medium">{t('checkout.paymentMethod', 'Payment')}</span>
            <span className="font-semibold text-gray-800 flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
              {orderData.paymentMethod === 'online' ? 'Online Card' : 'Cash on Delivery (COD)'}
            </span>
          </div>

          <div className="flex justify-between items-center pt-1">
            <span className="text-gray-600 font-semibold">{t('confirmation.totalPaid', 'Total Amount')}</span>
            <span className="text-lg font-extrabold text-pink-600">
              {orderData.total} {currency}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>📲 {t('confirmation.whatsappBtn', 'Send / Confirm on WhatsApp')}</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
          >
            {t('confirmation.backHome', 'Back to Swispy Boutique')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;
