// i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importer dine translationsfiler her
import translationEN from './en.json';
import translationUR from './ur.json';

i18n
  .use(initReactI18next) // Initialiser react-i18next
  .init({
    lng: 'en', // Standard sprog
    fallbackLng: 'en', // Fallback sprog, hvis oversættelsen ikke findes
    resources: {
      en: {
        translation: translationEN, // Oversættelser for engelsk
      },
      ur: {
        translation: translationUR, // Oversættelser for urdu
      },
    },
    interpolation: {
      escapeValue: false, // Undgå at undslippe specialtegn
    },
  });

export default i18n;
