(function () {
  var SUPPORTED_LANGS = ['fr', 'en', 'de', 'it', 'ru', 'zh-Hans', 'nl', 'cs'];
  var DEFAULT_LANG = 'en';
  var STORAGE_KEY = 'psc_lang';
  var messages = {};
  var currentLang = DEFAULT_LANG;

  function get(obj, path) {
    return path.split('.').reduce(function (acc, part) {
      return acc && acc[part];
    }, obj);
  }

  function safeLocalStorageGet(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function safeLocalStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }

  function detectInitialLang() {
  var stored = safeLocalStorageGet(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.indexOf(stored) !== -1) return stored;

  var browserLang = (navigator.language || '').toLowerCase();

  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('ru')) return 'ru';
  if (browserLang.startsWith('nl')) return 'nl';
  if (browserLang.startsWith('cs')) return 'cs';
  if (browserLang.startsWith('zh')) return 'zh-Hans';
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('pt')) return 'pt';

  return 'fr';
}


  function t(key, fallback) {
    var value = get(messages, key);
    return value != null ? value : (fallback || key);
  }

  function translateElement(el) {
    var key = el.dataset.i18n;
    if (!key) return;
    el.textContent = t(key, el.textContent);
  }

  function translateAttr(el, dataAttr, realAttr) {
    var key = el.dataset[dataAttr];
    if (!key) return;
    el.setAttribute(realAttr, t(key, el.getAttribute(realAttr) || ''));
  }

  function translatePage() {
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(translateElement);

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      translateAttr(el, 'i18nTitle', 'title');
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      translateAttr(el, 'i18nAriaLabel', 'aria-label');
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      translateAttr(el, 'i18nPlaceholder', 'placeholder');
    });

    var titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      titleEl.textContent = t(titleEl.dataset.i18n, titleEl.textContent);
    }

    var htmlTitle = t('meta.appTitle', document.title);
    document.title = htmlTitle;
  }

  async function loadLanguage(lang) {
    currentLang = SUPPORTED_LANGS.indexOf(lang) !== -1 ? lang : DEFAULT_LANG;

    var response = await fetch('./locales/' + currentLang + '.json');
    messages = await response.json();

    safeLocalStorageSet(STORAGE_KEY, currentLang);
    translatePage();

    if (typeof window.onLanguageChanged === 'function') {
      window.onLanguageChanged(currentLang);
    }

    var switcher = document.getElementById('langSwitcher');
    if (switcher) switcher.value = currentLang;
  }

  function initLangSwitcher() {
    var switcher = document.getElementById('langSwitcher');
    if (!switcher) return;

    switcher.addEventListener('change', function (e) {
      loadLanguage(e.target.value);
    });
  }

  window.i18n = {
    t: t,
    getLang: function () {
      return currentLang;
    },
    setLang: loadLanguage
  };

  document.addEventListener('DOMContentLoaded', function () {
    initLangSwitcher();
    loadLanguage(detectInitialLang());
  });
})();
