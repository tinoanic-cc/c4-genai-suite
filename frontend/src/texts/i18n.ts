import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { de } from 'src/texts/languages/de';
import { en } from 'src/texts/languages/en';

const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
};

void i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'de',
});

export const i18next = i18n;
