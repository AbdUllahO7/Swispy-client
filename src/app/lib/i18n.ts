import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    debug: false,
    resources: {
      en: {
        translation: {
          hello: 'Hello'
        }
      },
      ar: {
        translation: {
          hello: 'مرحبا'
        }
      },
      tr: {
        translation: {
          hello: 'Merhaba'
        }
      }
    }
  });

export default i18n;