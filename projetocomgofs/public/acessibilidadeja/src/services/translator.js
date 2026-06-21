/*!
 * translator.js
 * TRADUTOR (Google Translate)
 * Usa cookie strategy. Protegido contra loop de reload:
 * só recarrega se o script já existe E o idioma mudou.
 */
import { WidgetElementFactory } from '../dom/elementFactory.js';

export function applyTranslator(lang) {
  if (!lang) {
    var target = document.getElementById('google_translate_element');
    if (target) target.remove();
    clearTranslateCookies();
    return;
  }

  setTranslateCookie(lang);

  var scriptAlreadyLoaded = !!document.getElementById('google_translate_script');

  if (!scriptAlreadyLoaded) {
    document.body.appendChild(WidgetElementFactory.createTranslateTarget());
    window.googleTranslateElementInit = function () {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'auto', autoDisplay: false },
          'google_translate_element'
        );
      }
    };
    document.head.appendChild(
      WidgetElementFactory.createScript(
        'google_translate_script',
        'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
      )
    );
  } else {
    // Script já carregado: recarrega página somente uma vez para aplicar o cookie
    // CORRIGIDO: usa flag de sessão para evitar loop
    if (!sessionStorage.getItem('ajw_translate_reloaded')) {
      sessionStorage.setItem('ajw_translate_reloaded', '1');
      location.reload();
    }
  }
}

export function setTranslateCookie(lang) {
  var val = '/auto/' + lang;
  var host = location.hostname.replace(/^www\./, '');
  document.cookie = 'googtrans=' + val + '; path=/';
  document.cookie = 'googtrans=' + val + '; path=/; domain=.' + host;
}

export function clearTranslateCookies() {
  var exp = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  var host = location.hostname.replace(/^www\./, '');
  document.cookie = 'googtrans=; ' + exp + '; path=/';
  document.cookie = 'googtrans=; ' + exp + '; path=/; domain=.' + host;
  sessionStorage.removeItem('ajw_translate_reloaded');
}
