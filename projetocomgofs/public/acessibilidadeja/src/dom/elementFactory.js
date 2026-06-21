/*!
 * elementFactory.js
 * FACTORY — WidgetElementFactory
 * Centraliza a criação de elementos DOM.
 * Cada método é responsável por um único tipo de elemento.
 */
import { IconFactory } from './icons.js';

export var WidgetElementFactory = {
  /** Cria e injeta a tag <style> com o CSS do widget */
  createStyle: function (content) {
    var el = document.createElement('style');
    el.id = 'ajw-styles';
    el.textContent = content;
    return el;
  },

  /** Cria o elemento raiz que envolve todo o widget */
  createRoot: function () {
    var el = document.createElement('div');
    el.className = 'ajw-root';
    el.setAttribute('role', 'region');
    el.setAttribute('aria-label', 'Widget de Acessibilidade');
    return el;
  },

  /** Cria um botão de toggle (item do menu) */
  createToggleButton: function (option) {
    var btn = document.createElement('button');
    btn.className = 'ajw-item';
    btn.setAttribute('data-toggle', option.key);
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = IconFactory.create(option.icon) + '<span>' + option.label + '</span>';
    return btn;
  },

  /** Cria um título de seção do painel */
  createSectionTitle: function (text) {
    var el = document.createElement('div');
    el.className = 'ajw-section-title';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = text;
    return el;
  },

  /** Cria o controle stepper para zoom de texto */
  createZoomControl: function () {
    var row = document.createElement('div');
    row.className = 'ajw-row';
    row.innerHTML = [
      '<label id="ajwZoomLabel">Tamanho do texto</label>',
      '<div class="ajw-stepper" role="group" aria-labelledby="ajwZoomLabel">',
      '  <button id="ajwZoomMinus" aria-label="Diminuir texto">−</button>',
      '  <span id="ajwZoomVal" aria-live="polite" aria-atomic="true">100%</span>',
      '  <button id="ajwZoomPlus" aria-label="Aumentar texto">+</button>',
      '</div>',
    ].join('');
    return row;
  },

  /** Cria o seletor de idioma para tradução */
  createLanguageSelector: function () {
    var wrap = document.createElement('div');
    wrap.className = 'ajw-row';
    wrap.style.cssText = 'flex-direction:column;align-items:stretch;gap:8px';
    wrap.innerHTML = [
      '<label style="display:flex;gap:8px;align-items:center">' + IconFactory.create('translate') + ' Traduzir página</label>',
      '<select class="ajw-select" id="ajwLang" aria-label="Selecionar idioma de tradução">',
      '  <option value="">Idioma original</option>',
      '  <option value="en">English</option>',
      '  <option value="es">Español</option>',
      '  <option value="fr">Français</option>',
      '  <option value="de">Deutsch</option>',
      '  <option value="it">Italiano</option>',
      '  <option value="ja">日本語</option>',
      '  <option value="zh-CN">中文</option>',
      '</select>',
    ].join('');
    return wrap;
  },

  /** Cria a barra de saída do modo leitura */
  createReadingExitBar: function () {
    var bar = document.createElement('div');
    bar.className = 'ajw-reading-exit';
    bar.id = 'ajwReadingExit';
    bar.setAttribute('role', 'status');
    bar.setAttribute('aria-live', 'polite');
    bar.innerHTML = '<span>Modo leitura ativo</span>' +
      '<button type="button" class="ajw-reading-exit-btn" id="ajwReadingExitBtn">Sair do modo leitura</button>';
    return bar;
  },

  /** Cria o botão flutuante (FAB) de abertura */
  createFab: function () {
    var btn = document.createElement('button');
    btn.className = 'ajw-fab';
    btn.id = 'ajwFab';
    btn.setAttribute('aria-label', 'Abrir menu de acessibilidade');
    btn.setAttribute('title', 'Acessibilidade');
    btn.innerHTML = IconFactory.create('access');
    return btn;
  },

  /** Cria o overlay escuro atrás do painel */
  createOverlay: function () {
    var el = document.createElement('div');
    el.className = 'ajw-overlay';
    el.id = 'ajwOverlay';
    el.setAttribute('aria-hidden', 'true');
    return el;
  },

  /** Cria o elemento de guia de leitura (faixa seguindo o mouse) */
  createGuide: function () {
    var el = document.createElement('div');
    el.className = 'ajw-reading-guide';
    el.setAttribute('aria-hidden', 'true');
    return el;
  },

  /** Cria o elemento alvo oculto para o Google Translate */
  createTranslateTarget: function () {
    var el = document.createElement('div');
    el.id = 'google_translate_element';
    el.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    el.setAttribute('aria-hidden', 'true');
    return el;
  },

  /** Cria o link "Pular para o conteúdo" (skip link) */
  createSkipLink: function () {
    var a = document.createElement('a');
    a.id = 'ajwSkipLink';
    a.className = 'ajw-skip-link';
    a.href = '#';
    a.textContent = 'Navegação por teclado';
    a.setAttribute('aria-label', 'Pular para o próximo conteúdo clicável');
    return a;
  },

  /** Cria um script externo */
  createScript: function (id, src) {
    var el = document.createElement('script');
    el.id = id;
    el.src = src;
    return el;
  },
};
