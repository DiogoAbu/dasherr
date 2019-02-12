import i18n from 'i18n-js';
import { memoize } from 'lodash';
import { I18nManager } from 'react-native';
import { findBestAvailableLanguage } from 'react-native-localize';

import { TranslationGetters } from '../types';

export const translationGetters: TranslationGetters = {
  en: () => require('./en.json'),
  'pt-BR': () => require('./pt-BR.json'),
};

export const availableLanguages: string[] = Object.keys(translationGetters);

export const localize = memoize(
  (key, config?) => i18n.t(key, config),
  (key, config?) => (config ? key + JSON.stringify(config) : key),
);

export const setupLocale = (forceLanguageTag: string, forceIsRTL: boolean) => {
  // fallback if no available language fits
  const fallback = { languageTag: 'en', isRTL: false };

  const { languageTag, isRTL } = forceLanguageTag
    ? { languageTag: forceLanguageTag, isRTL: forceIsRTL }
    : findBestAvailableLanguage(Object.keys(translationGetters)) || fallback;

  // clear translation cache
  localize.cache.clear!();
  // update layout direction
  I18nManager.forceRTL(isRTL);

  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.fallbacks = true;
  i18n.defaultLocale = fallback.languageTag;
  i18n.locale = languageTag;

  i18n.missingBehaviour = 'guess';
  i18n.missingTranslationPrefix = 'NL: ';
};
