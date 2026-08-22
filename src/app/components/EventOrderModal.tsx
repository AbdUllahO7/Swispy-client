'use client';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import api, { SpecialOrderPayload } from '../lib/api';
import { X, Sparkles, PartyPopper, CheckCircle2, Loader2 } from 'lucide-react';

const EventOrderModal: React.FC = () => {
  const { t } = useTranslation();
  const { isEventOpen, setIsEventOpen } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Wedding / Engagement');
  const [eventDate, setEventDate] = useState('');
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('100');
  const [quantity, setQuantity] = useState('250');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [eventOrderNumber, setEventOrderNumber] = useState('');

  if (!isEventOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !location.trim()) {
      setErrorMsg('Please fill in your name, contact phone, and event location');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const payload: SpecialOrderPayload = {
        type: 'event',
        customerInfo: {
          name: name.trim(),
          phone: phone.trim(),
        },
        eventDetails: {
          eventType,
          eventDate: eventDate || undefined,
          location: location.trim(),
          guestCount: Number(guestCount) || 100,
          quantity: Number(quantity) || 200,
          notes: notes.trim(),
        },
        deliveryAddress: {
          area: location.trim(),
        },
        deliveryDate: eventDate || undefined,
      };

      const res = await api.createSpecialOrder(payload);
      if (res.success) {
        setEventOrderNumber(res.data.orderNumber);
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to submit catering request');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsEventOpen(false);
    setEventOrderNumber('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-scale-up">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md p-6 border-b border-pink-100 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white shadow-md">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{t('events.title', 'Events & Catering ✨')}</h2>
              <p className="text-xs text-purple-600 font-medium">{t('events.subtitle', 'Bespoke chocolate displays, wedding favors, and corporate hospitality')}</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-pink-50 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {eventOrderNumber ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{t('events.successTitle', 'Catering Inquiry Received!')}</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              {t('events.successDesc', { number: eventOrderNumber, defaultValue: `Inquiry Reference ${eventOrderNumber}. Our hospitality team will review your requirements and send a customized quote within 24 hours.` })}
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-sm shadow-md cursor-pointer"
            >
              {t('common.done', 'Done')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
                {errorMsg}
              </div>
            )}

            {/* Event Occasion */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                {t('events.occasionType', 'Occasion / Event Type *')}
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="Wedding / Engagement">Wedding / Engagement</option>
                <option value="Corporate Hospitality & Gala">Corporate Hospitality & Gala</option>
                <option value="Birthday & Private Celebration">Birthday & Private Celebration</option>
                <option value="University / Graduation Party">University / Graduation Party</option>
                <option value="Baby Shower / Welcome Baby">Baby Shower / Welcome Baby</option>
                <option value="VIP Custom Box Favors">VIP Custom Box Favors</option>
              </select>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('events.contactName', 'Contact Name *')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammed / Ahmet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('events.contactPhone', 'Contact Phone *')}</label>
                <input
                  type="tel"
                  required
                  placeholder="+90 5XX XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            {/* Event Date, Guests & Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('events.eventDate', 'Event Date')}</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('events.estimatedGuests', 'Estimated Guests')}</label>
                <input
                  type="number"
                  placeholder="150"
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">{t('events.estimatedPieces', 'Estimated Pieces / Boxes')}</label>
                <input
                  type="number"
                  placeholder="300"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-200 text-sm"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('events.location', 'Venue / City / Location *')}</label>
              <input
                type="text"
                required
                placeholder="e.g. Istanbul / Riyadh Venue"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Special Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">{t('events.specialNotes', 'Special Preferences / Custom Branding')}</label>
              <textarea
                rows={3}
                placeholder={t('events.notesPlaceholder', 'Describe your desired display setup, color palette, custom logo chocolates, or packaging theme...')}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-purple-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-bold text-sm shadow-xl shadow-purple-500/25 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{t('events.submitRequest', 'Submit Catering & Event Request')}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EventOrderModal;
