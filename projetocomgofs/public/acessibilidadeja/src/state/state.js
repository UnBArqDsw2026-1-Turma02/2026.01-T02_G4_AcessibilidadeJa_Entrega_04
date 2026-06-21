/*!
 * state.js
 * ESTADO — persistência via localStorage
 */
import { STORAGE_KEY } from '../config/config.js';

export function defaultState() {
  return { toggles: {}, zoom: 100, lang: '' };
}

export function loadState() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      var state = defaultState();
      // Mescla apenas as chaves conhecidas (evita poluição de estado)
      if (parsed.toggles && typeof parsed.toggles === 'object') state.toggles = parsed.toggles;
      if (typeof parsed.zoom === 'number') state.zoom = parsed.zoom;
      if (typeof parsed.lang === 'string') state.lang = parsed.lang;

      // Garante que contraste mutuamente exclusivo não fique duplo
      if (state.toggles['contrast-light'] && state.toggles['contrast-dark']) {
        state.toggles['contrast-dark'] = false;
      }
      return state;
    }
  } catch (e) { /* silencia erros de parsing ou acesso negado */ }
  return defaultState();
}

export function saveState(state) {
  try {
    // _appliedLang é controle interno, não precisa ser persistido
    var toSave = { toggles: state.toggles, zoom: state.zoom, lang: state.lang };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (e) { /* silencia quota ou modo privado */ }
}
