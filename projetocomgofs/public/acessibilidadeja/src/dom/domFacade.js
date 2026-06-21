/*!
 * domFacade.js
 * DOM FACADE — ManipuladorDOM (Facade pattern)
 * Encapsula operações de seleção/foco e a criação do skip-link.
 */
import { WidgetElementFactory } from './elementFactory.js';

export function createDomFacade() {
  var _skipEl = null;
  var _shortcutHandler = null;
  var _focusTrapHandler = null;
  var _panelKeyHandler = null;
  var _lastFocusedBeforeTrap = null;

  function findMainContent() {
    return document.querySelector('main, [role="main"], article, [id*="main"], [class*="main"]');
  }

  function getFocusableElements() {
    return Array.prototype.slice.call(document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [role="button"], [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) {
      if (!el || !el.getClientRects || el.getClientRects().length === 0) return false;
      if (el.id === 'ajwSkipLink') return false;
      if (el.closest && el.closest('.ajw-root')) return false;
      return true;
    });
  }

  function focusNextFocusable() {
    var focusables = getFocusableElements();
    if (focusables.length === 0) return false;

    var active = document.activeElement;
    var currentIndex = focusables.indexOf(active);
    var nextIndex = currentIndex >= 0 ? (currentIndex + 1) % focusables.length : 0;
    var target = focusables[nextIndex] || focusables[0];

    try {
      target.focus({ preventScroll: true });
    } catch (e) {
      try { target.focus(); } catch (err) {}
    }
    return true;
  }

  function createSkipLink() {
    if (_skipEl) return _skipEl;
    _skipEl = WidgetElementFactory.createSkipLink();
    _skipEl.addEventListener('click', function (e) {
      e.preventDefault();
      focusNextFocusable();
    });
    return _skipEl;
  }

  function addSkipToDOM() {
    var el = createSkipLink();
    if (!document.body.contains(el)) {
      document.body.insertBefore(el, document.body.firstChild);
    }
  }

  function removeSkipFromDOM() {
    if (_skipEl && document.body.contains(_skipEl)) {
      _skipEl.remove();
    }
    _skipEl = null;
  }

  function _globalShortcut(e) {
    if (e.altKey && (e.key === 'K' || e.key === 'k')) {
      focusNextFocusable();
    }
  }

  return {
    syncKeyboardNav: function (enabled) {
      if (enabled) {
        addSkipToDOM();
        if (!_shortcutHandler) {
          _shortcutHandler = _globalShortcut;
          document.addEventListener('keydown', _shortcutHandler);
        }
        document.documentElement.classList.add('ajw-keyboard-nav');
      } else {
        removeSkipFromDOM();
        if (_shortcutHandler) {
          document.removeEventListener('keydown', _shortcutHandler);
          _shortcutHandler = null;
        }
        document.documentElement.classList.remove('ajw-keyboard-nav');
      }
    },
    focusMainContent: focusNextFocusable,
    findMainContent: findMainContent,
    trapFocus: function (panelEl) {
      if (!panelEl) return;
      _lastFocusedBeforeTrap = document.activeElement;

      function focusableSelector() {
        return 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [role="button"]';
      }

      var focusables = Array.prototype.slice.call(panelEl.querySelectorAll(focusableSelector()));
      if (focusables.length === 0) {
        panelEl.setAttribute('tabindex', '-1');
        panelEl.focus();
      } else {
        focusables[0].focus();
      }

      _focusTrapHandler = function (e) {
        if (e.key === 'Tab') {
          var currentFocusables = Array.prototype.slice.call(panelEl.querySelectorAll(focusableSelector()));
          if (currentFocusables.length === 0) return;
          var idx = currentFocusables.indexOf(document.activeElement);
          if (e.shiftKey) {
            if (idx === 0) {
              e.preventDefault();
              currentFocusables[currentFocusables.length - 1].focus();
            }
          } else if (idx === currentFocusables.length - 1) {
            e.preventDefault();
            currentFocusables[0].focus();
          }
        }
      };

      document.addEventListener('keydown', _focusTrapHandler);
    },
    releaseFocus: function () {
      if (_focusTrapHandler) {
        document.removeEventListener('keydown', _focusTrapHandler);
        _focusTrapHandler = null;
      }
      try {
        if (_lastFocusedBeforeTrap && typeof _lastFocusedBeforeTrap.focus === 'function') {
          _lastFocusedBeforeTrap.focus();
        }
      } catch (e) {}
      _lastFocusedBeforeTrap = null;
    },
    enablePanelKeyboard: function (panelEl) {
      if (!panelEl) return;
      var buttons = Array.prototype.slice.call(panelEl.querySelectorAll('[data-toggle]'));
      if (!buttons || buttons.length === 0) return;

      buttons.forEach(function (b, i) {
        b.setAttribute('data-roving-index', String(i));
        b.setAttribute('tabindex', i === 0 ? '0' : '-1');
      });

      _panelKeyHandler = function (e) {
        var active = document.activeElement;
        var idx = parseInt(active && active.getAttribute ? active.getAttribute('data-roving-index') : -1, 10);
        if (isNaN(idx)) idx = -1;

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
          e.preventDefault();
          var next = (idx + 1) % buttons.length;
          buttons.forEach(function (b, i) { b.setAttribute('tabindex', i === next ? '0' : '-1'); });
          buttons[next].focus();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var prev = (idx - 1 + buttons.length) % buttons.length;
          buttons.forEach(function (b, i) { b.setAttribute('tabindex', i === prev ? '0' : '-1'); });
          buttons[prev].focus();
        } else if (e.key === 'Enter' || e.key === ' ') {
          if (active && active.getAttribute && active.getAttribute('data-toggle')) {
            e.preventDefault();
            active.click();
          }
        }
      };

      panelEl.addEventListener('keydown', _panelKeyHandler);
    },
    disablePanelKeyboard: function (panelEl) {
      if (!panelEl) return;
      if (_panelKeyHandler) {
        panelEl.removeEventListener('keydown', _panelKeyHandler);
        _panelKeyHandler = null;
      }
      var buttons = Array.prototype.slice.call(panelEl.querySelectorAll('[data-toggle]'));
      buttons.forEach(function (b) {
        b.removeAttribute('data-roving-index');
        b.removeAttribute('tabindex');
      });
    },
  };
}
