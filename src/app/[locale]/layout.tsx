'use client';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const params = useParams();
  const locale = params.locale as string;
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set the language for i18next if it's different from current
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
    
    // Set the html lang attribute
    document.documentElement.lang = locale;
    
    // Set direction for RTL languages
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    // Optionally store locale preference in cookie
    document.cookie = `locale=${locale}; path=/; max-age=31536000`; // 1 year
  }, [locale, i18n]);

  return children;
}