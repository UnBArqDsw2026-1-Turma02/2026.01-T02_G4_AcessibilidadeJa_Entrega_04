/*!
 * widget.js
 * Orquestra a construção do widget (via WidgetBuilder), conecta os
 * elementos do DOM aos comandos (Command pattern) e expõe a função
 * apply() que reaplica o estado via cadeia de decoradores.
 *
 * Exporta initWidget(), que monta tudo e retorna a API pública
 * (a mesma exposta em window.AcessibilidadeJa).
 */
import { WidgetBuilder } from './patterns/builder.js';
import { WidgetElementFactory } from './dom/elementFactory.js';
import { WIDGET_CSS } from './dom/styles.js';
import { defaultState, loadState, saveState } from './state/state.js';
import { createDomFacade } from './dom/domFacade.js';
import { applyTranslator, clearTranslateCookies } from './services/translator.js';
import { buildAccessibilityEffectChain, describeDecoratorChain } from './patterns/effects.js';
import {
  ToggleAccessibilityCommand,
  ZoomCommand,
  SetLanguageCommand,
  SetReadingModeCommand,
  ResetCommand,
  KeyboardNavCommand,
  CommandInvoker,
} from './patterns/commands.js';

export function initWidget() {
  /* =========================================================
   * CONSTRUÇÃO DO WIDGET (Builder em ação)
   * ======================================================= */
  var root = new WidgetBuilder()
    .mountStyles(WIDGET_CSS)
    .mountRoot()
    .buildReadingExit()
    .buildFab()
    .buildOverlay()
    .buildPanel()
    .getRoot();

  /* =========================================================
   * REFERÊNCIAS DE ELEMENTOS
   * ======================================================= */
  var fab          = root.querySelector('#ajwFab');
  var panel        = root.querySelector('#ajwPanel');
  var overlay      = root.querySelector('#ajwOverlay');
  var closeBtn     = root.querySelector('#ajwClose');
  var resetBtn     = root.querySelector('#ajwReset');
  var zoomValEl    = root.querySelector('#ajwZoomVal');
  var zoomMinusBtn = root.querySelector('#ajwZoomMinus');
  var zoomPlusBtn  = root.querySelector('#ajwZoomPlus');
  var langSel      = root.querySelector('#ajwLang');
  var readingExit  = root.querySelector('#ajwReadingExit');
  var readingExitBtn = root.querySelector('#ajwReadingExitBtn');

  /* =========================================================
   * ESTADO INICIAL
   * ======================================================= */
  var state = loadState();
  // Marca idioma já aplicado para evitar re-trigger no apply() inicial
  state._appliedLang = state.lang;

  /* =========================================================
   * COMMAND INVOKER — Gerenciador de Comandos
   * ======================================================= */
  var invoker = new CommandInvoker();
  var lastDecoratorChain = [];

  var domFacade = createDomFacade();

  /* =========================================================
   * PAINEL — abrir / fechar
   * ======================================================= */
  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    closeBtn.focus();
    // Trap focus and enable panel keyboard navigation
    try { domFacade.trapFocus(panel); } catch (e) {}
    try { domFacade.enablePanelKeyboard(panel); } catch (e) {}
  }

  function closePanel() {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    fab.focus();
    // Release focus trap and disable panel keyboard navigation
    try { domFacade.releaseFocus(); } catch (e) {}
    try { domFacade.disablePanelKeyboard(panel); } catch (e) {}
  }

  fab.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  overlay.addEventListener('click', closePanel);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closePanel();
  });

  /* =========================================================
   * TOGGLES
   * ======================================================= */
  root.querySelectorAll('[data-toggle]').forEach(function (btn) {
    var key = btn.getAttribute('data-toggle');

    // Restaura estado salvo
    if (state.toggles[key]) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
    }

    btn.addEventListener('click', function () {
      var command = key === 'keyboard-nav'
        ? new KeyboardNavCommand(state, domFacade)
        : new ToggleAccessibilityCommand(key, state, root);
      invoker.execute(command);

      // Contrastes são mutuamente exclusivos
      if (state.toggles[key] && (key === 'contrast-light' || key === 'contrast-dark')) {
        var other = key === 'contrast-light' ? 'contrast-dark' : 'contrast-light';
        var otherBtn = root.querySelector('[data-toggle="' + other + '"]');
        if (otherBtn && state.toggles[other]) {
          var toggleOtherCmd = new ToggleAccessibilityCommand(other, state, root);
          invoker.execute(toggleOtherCmd);
        }
      }

      apply();
    });
  });

  /* =========================================================
   * ZOOM
   * ======================================================= */
  zoomMinusBtn.addEventListener('click', function () {
    var cmd = new ZoomCommand(state.zoom - 10, state, zoomValEl);
    invoker.execute(cmd);
    apply();
  });
  zoomPlusBtn.addEventListener('click', function () {
    var cmd = new ZoomCommand(state.zoom + 10, state, zoomValEl);
    invoker.execute(cmd);
    apply();
  });

  function setZoom(v) {
    state.zoom = Math.max(80, Math.min(180, v));
    apply();
  }

  /* =========================================================
   * IDIOMA
   * ======================================================= */
  langSel.value = state.lang || '';
  langSel.addEventListener('change', function () {
    var cmd = new SetLanguageCommand(langSel.value, state);
    invoker.execute(cmd);
    apply();
  });

  /* =========================================================
   * MODO LEITURA — controle unificado
   * ======================================================= */
  function setReadingMode(on) {
    state.toggles['reading-mode'] = !!on;
    var btn = root.querySelector('[data-toggle="reading-mode"]');
    if (btn) {
      btn.classList.toggle('active', !!on);
      btn.setAttribute('aria-pressed', String(!!on));
      var label = btn.querySelector('span');
      if (label) label.textContent = on ? 'Sair do modo leitura' : 'Modo leitura';
    }
    if (readingExit) readingExit.classList.toggle('visible', !!on);
    apply();
  }

  readingExitBtn.addEventListener('click', function () {
    var cmd = new SetReadingModeCommand(false, state, root, readingExit);
    invoker.execute(cmd);
    apply();
  });

  /* =========================================================
   * GUIA DE LEITURA
   * Cria/remove o elemento e o listener de mousemove de forma
   * segura, sem vazamento mesmo se o root for removido.
   * ======================================================= */
  var guideEl = null;
  var _guideMoveHandler = null;

  function ensureGuide(on) {
    if (on && !guideEl) {
      guideEl = WidgetElementFactory.createGuide();
      document.body.appendChild(guideEl);
      _guideMoveHandler = function (e) {
        if (guideEl) guideEl.style.top = (e.clientY - 30) + 'px';
      };
      document.addEventListener('mousemove', _guideMoveHandler);
      _guideMoveHandler({ clientY: window.innerHeight / 2 });
    } else if (!on && guideEl) {
      if (_guideMoveHandler) {
        document.removeEventListener('mousemove', _guideMoveHandler);
        _guideMoveHandler = null;
      }
      guideEl.remove();
      guideEl = null;
    }
  }

  /* =========================================================
   * APPLY — aplica todo o estado ao documento
   * ======================================================= */
  function apply() {
    var context = {
      html: document.documentElement,
      state: state,
      zoomValEl: zoomValEl,
      readingExit: readingExit,
      ensureGuide: ensureGuide,
      applyTranslator: applyTranslator,
      saveState: saveState,
    };
    var decoratedEffect = buildAccessibilityEffectChain(context);
    decoratedEffect.apply(context);
    // Sincroniza comportamentos extras relacionados à navegação por teclado
    try { domFacade.syncKeyboardNav(!!context.state.toggles['keyboard-nav']); } catch (e) { }
    lastDecoratorChain = describeDecoratorChain(decoratedEffect);
  }

  /* =========================================================
   * RESET
   * ======================================================= */
  resetBtn.addEventListener('click', function () {
    var cmd = new ResetCommand(state);
    invoker.execute(cmd);
    saveState(state);
    clearTranslateCookies();
    location.reload();
  });

  /* =========================================================
   * LIMPEZA AO REMOVER O ROOT DO DOM
   * Previne memory leak do guia de leitura.
   * ======================================================= */
  if (typeof MutationObserver !== 'undefined') {
    var _cleanupObserver = new MutationObserver(function () {
      if (!document.body.contains(root)) {
        ensureGuide(false);
        _cleanupObserver.disconnect();
      }
    });
    _cleanupObserver.observe(document.body, { childList: true });
  }

  /* =========================================================
   * APLICAÇÃO INICIAL
   * Restaura estado persistido sem re-disparar o tradutor.
   * ======================================================= */
  if (langSel) langSel.value = state.lang || '';
  apply();

  /* =========================================================
   * API PÚBLICA
   * ======================================================= */
  return {
    open:  openPanel,
    close: closePanel,
    reset: function () {
      state = defaultState();
      saveState(state);
      clearTranslateCookies();
      location.reload();
    },
    setReadingMode: setReadingMode,
    getState: function () { return Object.assign({}, state); },
    /* Command Pattern API — Undo/Redo */
    undo: function () {
      if (invoker.undo()) {
        apply();
        saveState(state);
        return true;
      }
      return false;
    },
    redo: function () {
      if (invoker.redo()) {
        apply();
        saveState(state);
        return true;
      }
      return false;
    },
    canUndo: function () { return invoker.canUndo(); },
    canRedo: function () { return invoker.canRedo(); },
    getCommandHistory: function () { return invoker.getHistory(); },
    getHistorySize: function () { return invoker.getHistorySize(); },
    getDecoratorChain: function () { return lastDecoratorChain.slice(); },
  };
}
