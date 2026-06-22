/*!
 * AcessibilidadeJá - Widget de Acessibilidade v2.0
 * Standalone vanilla JS. Inclua em qualquer site:
 *   <script src="https://seudominio.com/widget/acessibilidadeja.js" defer></script>
 * Opcional, configure antes de carregar:
 *   <script>window.AcessibilidadeJaConfig = { position: 'bottom-right', lang: 'pt-BR' }</script>
 */
(function () {
  'use strict';

  /* =========================================================
   * SINGLETON
   * Garante que o widget seja inicializado apenas uma vez,
   * mesmo que o script seja carregado múltiplas vezes.
   * ======================================================= */
  var WidgetSingleton = {
    isReady: function () { return !!window.__AcessibilidadeJa__; },
    markReady: function () { window.__AcessibilidadeJa__ = true; },
  };

  if (WidgetSingleton.isReady()) return;
  WidgetSingleton.markReady();

  /* =========================================================
   * CONFIGURAÇÃO GLOBAL
   * ======================================================= */
  var CFG = Object.assign(
    { position: 'bottom-right', lang: 'pt-BR' },
    window.AcessibilidadeJaConfig || {}
  );

  var STORAGE_KEY = 'acessibilidadeja:state:v2';

  /* =========================================================
   * PROTOTYPE
   * Objeto base clonado para cada opção de toggle do menu.
   * OptionPrototype.clone(props) → novo objeto com defaults + overrides.
   * ======================================================= */
  var OptionPrototype = {
    type: 'toggle',
    section: '',
    key: '',
    icon: '',
    label: '',
    clone: function (props) {
      return Object.assign(Object.create(null), this, props || {});
    },
  };

  var TOGGLE_OPTIONS = [
    OptionPrototype.clone({ section: 'Visualização',  key: 'contrast-light',  icon: 'contrast_light', label: 'Contraste claro'      }),
    OptionPrototype.clone({ section: 'Visualização',  key: 'tutorial',        icon: 'tutorial',       label: 'Tutorial'             }),
    OptionPrototype.clone({ section: 'Visualização',  key: 'contrast-dark',   icon: 'contrast_dark',  label: 'Contraste escuro'     }),
    OptionPrototype.clone({ section: 'Visualização',  key: 'grayscale',       icon: 'grayscale',      label: 'Escala de cinza'      }),
    OptionPrototype.clone({ section: 'Visualização',  key: 'highlight-links', icon: 'links',          label: 'Destacar links'       }),
    OptionPrototype.clone({ section: 'Leitura',       key: 'reading-mode',    icon: 'reading',        label: 'Modo leitura'         }),
    OptionPrototype.clone({ section: 'Leitura',       key: 'reading-guide',   icon: 'guide',          label: 'Guia de leitura'      }),
    OptionPrototype.clone({ section: 'Leitura',       key: 'dyslexia',        icon: 'dyslexia',       label: 'Fonte para dislexia'  }),
    OptionPrototype.clone({ section: 'Navegação',     key: 'big-cursor',      icon: 'cursor',         label: 'Cursor grande'        }),
    OptionPrototype.clone({ section: 'Navegação',     key: 'pause-anim',      icon: 'pause',          label: 'Pausar animações'     }),
    OptionPrototype.clone({ section: 'Navegação',     key: 'keyboard-nav',    icon: 'access',         label: 'Navegação por teclado' }),
  ];

  /* =========================================================
   * FACTORY — IconFactory
   * Produz strings SVG a partir de um nome de ícone.
   * ======================================================= */
  var IconFactory = {
    _icons: {
      contrast_light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>',
      tutorial: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M4 6h16"/>' +
      '<path d="M4 12h10"/>' +
      '<path d="M4 18h14"/>' +
      '<circle cx="20" cy="6" r="1"/>' +
      '<circle cx="14" cy="12" r="1"/>' +
      '<circle cx="18" cy="18" r="1"/>' +
      '</svg>',
      contrast_dark:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>',
      zoom:           '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M8 11h6M11 8v6"/></svg>',
      reading:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4h7a3 3 0 013 3v13a2 2 0 00-2-2H2zM22 4h-7a3 3 0 00-3 3v13a2 2 0 012-2h8z"/></svg>',
      guide:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 7h18M3 17h18"/></svg>',
      dyslexia:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l16 16M20 4L4 20"/></svg>',
      translate:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 8h10M9 4v4M5 12s2 5 7 5 7-5 7-5M14 14l4 8 4-8M16 19h4"/></svg>',
      cursor:         '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l14 8-6 1 4 8-3 1-4-8-5 4z"/></svg>',
      links:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/></svg>',
      pause:          '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
      grayscale:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/></svg>',
      access:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="2.2"/><path d="M5 9l4.5 1.5h5L19 9M12 10.5V14M12 14l-3 7M12 14l3 7"/></svg>',
      close:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
    },
    create: function (name) {
      return this._icons[name] || '';
    },
  };

  /* =========================================================
   * COMMAND PATTERN — Padrão Comportamental GoF
   * Encapsula ações de acessibilidade como objetos Command
   * permitindo undo/redo, macros e auditoria.
   * ======================================================= */

  function Command() {}
  Command.prototype.execute = function () { throw new Error('execute() deve ser implementado'); };
  Command.prototype.undo = function () { throw new Error('undo() deve ser implementado'); };

  function ToggleAccessibilityCommand(key, state, root) {
    this.key = key;
    this.state = state;
    this.root = root;
    this.previousValue = state.toggles[key];
  }
  ToggleAccessibilityCommand.prototype = Object.create(Command.prototype);
  ToggleAccessibilityCommand.prototype.execute = function () {
    this.state.toggles[this.key] = !this.previousValue;
    this._updateUI();
  };
  ToggleAccessibilityCommand.prototype.undo = function () {
    this.state.toggles[this.key] = this.previousValue;
    this._updateUI();
  };
  ToggleAccessibilityCommand.prototype._updateUI = function () {
    var btn = this.root.querySelector('[data-toggle="' + this.key + '"]');
    if (btn) {
      btn.classList.toggle('active', this.state.toggles[this.key]);
      btn.setAttribute('aria-pressed', String(this.state.toggles[this.key]));
    }
  };

  function ZoomCommand(newZoom, state, zoomValEl) {
    this.newZoom = Math.max(80, Math.min(180, newZoom));
    this.state = state;
    this.zoomValEl = zoomValEl;
    this.previousZoom = state.zoom;
  }
  ZoomCommand.prototype = Object.create(Command.prototype);
  ZoomCommand.prototype.execute = function () {
    this.state.zoom = this.newZoom;
    this._updateDisplay();
  };
  ZoomCommand.prototype.undo = function () {
    this.state.zoom = this.previousZoom;
    this._updateDisplay();
  };
  ZoomCommand.prototype._updateDisplay = function () {
    if (this.zoomValEl) this.zoomValEl.textContent = this.state.zoom + '%';
  };

  function SetLanguageCommand(language, state) {
    this.language = language;
    this.state = state;
    this.previousLanguage = state.lang;
  }
  SetLanguageCommand.prototype = Object.create(Command.prototype);
  SetLanguageCommand.prototype.execute = function () {
    this.state.lang = this.language;
    this.state._appliedLang = null;
  };
  SetLanguageCommand.prototype.undo = function () {
    this.state.lang = this.previousLanguage;
    this.state._appliedLang = null;
  };

  function SetReadingModeCommand(enabled, state, root, readingExitEl) {
    this.enabled = enabled;
    this.state = state;
    this.root = root;
    this.readingExitEl = readingExitEl;
    this.wasEnabled = state.toggles['reading-mode'];
  }
  SetReadingModeCommand.prototype = Object.create(Command.prototype);
  SetReadingModeCommand.prototype.execute = function () {
    this.state.toggles['reading-mode'] = this.enabled;
    this._updateUI();
  };
  SetReadingModeCommand.prototype.undo = function () {
    this.state.toggles['reading-mode'] = this.wasEnabled;
    this._updateUI();
  };
  SetReadingModeCommand.prototype._updateUI = function () {
    var btn = this.root.querySelector('[data-toggle="reading-mode"]');
    if (btn) {
      btn.classList.toggle('active', this.state.toggles['reading-mode']);
      btn.setAttribute('aria-pressed', String(this.state.toggles['reading-mode']));
    }
  };

  function TutorialCommand(enabled, state, root) {
    this.enabled = enabled
    this.state = state
    this.root = root;
    this.wasEnabled = state.toggles['tutorial'];
}
  TutorialCommand.prototype = Object.create(Command.prototype)
  TutorialCommand.prototype.execute = function () {
    console.log("ola mundo3", state.toggles)
    this.state.toggles['tutorial'] = this.enabled
    this._updateUI()
  }
  TutorialCommand.prototype.undo = function () {
    console.log("undo", state.toggles)
    this.state.toggles['tutorial'] = this.wasEnabled;
    this._updateUI()

  };

  TutorialCommand.prototype._updateUI = function () {
    var btn = this.root.querySelector('[data-toggle="tutorial"]');
    if (btn) {
      btn.classList.toggle('active', this.state.toggles['tutorial']);
      btn.setAttribute('aria-pressed', String(this.state.toggles['tutorial']));
    }
  };


  function ResetCommand(state) {
    this.state = state;
    this.previousState = { toggles: Object.assign({}, state.toggles), zoom: state.zoom, lang: state.lang };
  }
  ResetCommand.prototype = Object.create(Command.prototype);
  ResetCommand.prototype.execute = function () {
    this.state.toggles = {};
    this.state.zoom = 100;
    this.state.lang = '';
    this.state._appliedLang = '';
  };
  ResetCommand.prototype.undo = function () {
    this.state.toggles = this.previousState.toggles;
    this.state.zoom = this.previousState.zoom;
    this.state.lang = this.previousState.lang;
  };

  /**
   * KeyboardNavCommand — habilita/desabilita navegação por teclado
   * (usa Command pattern para permitir undo/redo do toggle)
   */
  function KeyboardNavCommand(state, domFacade) {
    this.state = state;
    this.domFacade = domFacade;
    this.previousValue = !!state.toggles['keyboard-nav'];
  }
  KeyboardNavCommand.prototype = Object.create(Command.prototype);
  KeyboardNavCommand.prototype.execute = function () {
    this.state.toggles['keyboard-nav'] = !this.previousValue;
    if (this.domFacade && typeof this.domFacade.syncKeyboardNav === 'function') {
      this.domFacade.syncKeyboardNav(this.state.toggles['keyboard-nav']);
    }
  };
  KeyboardNavCommand.prototype.undo = function () {
    this.state.toggles['keyboard-nav'] = this.previousValue;
    if (this.domFacade && typeof this.domFacade.syncKeyboardNav === 'function') {
      this.domFacade.syncKeyboardNav(this.state.toggles['keyboard-nav']);
    }
  };

  function CommandInvoker() {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistory = 50;
  }
  CommandInvoker.prototype.execute = function (command) {
    command.execute();
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
    if (this.history.length > this.maxHistory) {
      this.history.shift();
      this.currentIndex--;
    }
  };
  CommandInvoker.prototype.undo = function () {
    if (this.currentIndex > -1) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
      return true;
    }
    return false;
  };
  CommandInvoker.prototype.redo = function () {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
      return true;
    }
    return false;
  };
  CommandInvoker.prototype.canUndo = function () { return this.currentIndex > -1; };
  CommandInvoker.prototype.canRedo = function () { return this.currentIndex < this.history.length - 1; };
  CommandInvoker.prototype.getHistory = function () { return this.history.map(function (cmd) { return cmd.constructor.name; }); };
  CommandInvoker.prototype.getHistorySize = function () { return this.history.length; };

  /* =========================================================
   * DECORATOR PATTERN — Padrão Estrutural GoF
   * Encadeia efeitos de acessibilidade como decoradores.
   * Cada recurso envolve o componente anterior e adiciona uma
   * responsabilidade sem alterar o componente base.
   * ======================================================= */

  function AccessibilityEffect() {}
  AccessibilityEffect.prototype.apply = function () { throw new Error('apply() deve ser implementado'); };
  AccessibilityEffect.prototype.getName = function () { return this.constructor.name || 'AccessibilityEffect'; };

  function BaseAccessibilityEffect(toggleOptions) {
    this.toggleOptions = toggleOptions;
  }
  BaseAccessibilityEffect.prototype = Object.create(AccessibilityEffect.prototype);
  BaseAccessibilityEffect.prototype.constructor = BaseAccessibilityEffect;
  BaseAccessibilityEffect.prototype.apply = function (context) {
    this.toggleOptions.forEach(function (option) {
      if (option.key === 'reading-guide') return;
      context.html.classList.remove('ajw-' + option.key);
    });
    context.html.style.fontSize = '';
  };
  BaseAccessibilityEffect.prototype.getName = function () { return 'BaseAccessibilityEffect'; };

  function AccessibilityEffectDecorator(component) {
    this.component = component;
  }
  AccessibilityEffectDecorator.prototype = Object.create(AccessibilityEffect.prototype);
  AccessibilityEffectDecorator.prototype.constructor = AccessibilityEffectDecorator;
  AccessibilityEffectDecorator.prototype.apply = function (context) {
    this.component.apply(context);
  };
  AccessibilityEffectDecorator.prototype.getName = function () {
    return 'AccessibilityEffectDecorator';
  };

  function CssClassEffectDecorator(component, key) {
    AccessibilityEffectDecorator.call(this, component);
    this.key = key;
  }
  CssClassEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  CssClassEffectDecorator.prototype.constructor = CssClassEffectDecorator;
  CssClassEffectDecorator.prototype.apply = function (context) {
    AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.html.classList.add('ajw-' + this.key);
  };
  CssClassEffectDecorator.prototype.getName = function () {
    return 'CssClassEffectDecorator(' + this.key + ')';
  };

  function ZoomEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component);
  }
  ZoomEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  ZoomEffectDecorator.prototype.constructor = ZoomEffectDecorator;
  ZoomEffectDecorator.prototype.apply = function (context) {
    AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.html.style.fontSize = context.state.zoom === 100 ? '' : context.state.zoom + '%';
    if (context.zoomValEl) context.zoomValEl.textContent = context.state.zoom + '%';
  };
  ZoomEffectDecorator.prototype.getName = function () { return 'ZoomEffectDecorator'; };

  function ReadingGuideEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component);
  }
  ReadingGuideEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  ReadingGuideEffectDecorator.prototype.constructor = ReadingGuideEffectDecorator;
  ReadingGuideEffectDecorator.prototype.apply = function (context) {
    AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.ensureGuide(!!context.state.toggles['reading-guide']);
  };
  ReadingGuideEffectDecorator.prototype.getName = function () { return 'ReadingGuideEffectDecorator'; };

  function ReadingExitEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component);
  }
  ReadingExitEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  ReadingExitEffectDecorator.prototype.constructor = ReadingExitEffectDecorator;
  ReadingExitEffectDecorator.prototype.apply = function (context) {
    AccessibilityEffectDecorator.prototype.apply.call(this, context);
    if (context.readingExit) {
      context.readingExit.classList.toggle('visible', !!context.state.toggles['reading-mode']);
    }
  };
  ReadingExitEffectDecorator.prototype.getName = function () { return 'ReadingExitEffectDecorator'; };

  function TranslatorEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component);
  }
  TranslatorEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  TranslatorEffectDecorator.prototype.constructor = TranslatorEffectDecorator;
  TranslatorEffectDecorator.prototype.apply = function (context) {
    AccessibilityEffectDecorator.prototype.apply.call(this, context);
    if (context.state.lang !== context.state._appliedLang) {
      context.state._appliedLang = context.state.lang;
      context.applyTranslator(context.state.lang);
    }
  };
  TranslatorEffectDecorator.prototype.getName = function () { return 'TranslatorEffectDecorator'; };

  function PersistenceEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component);
  }
  PersistenceEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  PersistenceEffectDecorator.prototype.constructor = PersistenceEffectDecorator;
  PersistenceEffectDecorator.prototype.apply = function (context) {
    AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.saveState(context.state);
  };
  PersistenceEffectDecorator.prototype.getName = function () { return 'PersistenceEffectDecorator'; };

  function TutorialEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component)
  }
  TutorialEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  TutorialEffectDecorator.prototype.constructor = TutorialEffectDecorator;
  TutorialEffectDecorator.prototype.apply = function (context) {
      console.log("tutorial decorador", context.state.toggles)
      AccessibilityEffectDecorator.prototype.apply.call(this, context);

      if (context.state.toggles['tutorial']){
          context.applyTutorial("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1",
         "tutorial", function () {
          context.state.toggles['tutorial'] = false
          var btn = context.html.querySelector('[data-toggle="tutorial"]');
          if (btn) {
            btn.classList.toggle('active', context.state.toggles['tutorial']);
            btn.setAttribute('aria-pressed', String(context.state.toggles['tutorial']));
          }
          context.saveState(context.state)
          
        })
      }
      
  };


  function buildAccessibilityEffectChain(context) {
    var chain = new BaseAccessibilityEffect(TOGGLE_OPTIONS);

    TOGGLE_OPTIONS.forEach(function (option) {
      if (option.key === 'reading-guide') return;
      if (context.state.toggles[option.key]) {
        chain = new CssClassEffectDecorator(chain, option.key);
      }
    });

    chain = new ZoomEffectDecorator(chain);
    chain = new ReadingGuideEffectDecorator(chain);
    chain = new ReadingExitEffectDecorator(chain);
    chain = new TranslatorEffectDecorator(chain);
    chain = new PersistenceEffectDecorator(chain);
    chain = new TutorialEffectDecorator(chain);

    return chain;
  }

  function describeDecoratorChain(component) {
    var names = [];
    var current = component;
    while (current) {
      names.push(current.getName());
      current = current.component;
    }
    return names;
  }

  /* =========================================================
   * FACTORY — WidgetElementFactory
   * Centraliza a criação de elementos DOM.
   * Cada método é responsável por um único tipo de elemento.
   * ======================================================= */
  var WidgetElementFactory = {
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

  /* =========================================================
   * BUILDER — WidgetBuilder
   * Monta o painel em etapas encadeadas (fluent interface).
   * Cada método retorna `this` para permitir encadeamento.
   *
   * Uso:
   *   var root = new WidgetBuilder()
   *     .mountStyles()
   *     .mountRoot()
   *     .buildReadingExit()
   *     .buildFab()
   *     .buildOverlay()
   *     .buildPanel()
   *     .getRoot();
   * ======================================================= */
  function WidgetBuilder() {
    this._root = null;
    this._panel = null;
    this._body = null;
  }

  /** Injeta o CSS no <head> */
  WidgetBuilder.prototype.mountStyles = function (cssContent) {
    if (!document.getElementById('ajw-styles')) {
      document.head.appendChild(WidgetElementFactory.createStyle(cssContent));
    }
    return this;
  };

  /** Cria e anexa o elemento raiz ao <body> */
  WidgetBuilder.prototype.mountRoot = function () {
    this._root = WidgetElementFactory.createRoot();
    document.body.appendChild(this._root);
    return this;
  };

  /** Adiciona a barra de saída do modo leitura ao root */
  WidgetBuilder.prototype.buildReadingExit = function () {
    this._root.appendChild(WidgetElementFactory.createReadingExitBar());
    return this;
  };

  /** Adiciona o botão flutuante (FAB) ao root */
  WidgetBuilder.prototype.buildFab = function () {
    this._root.appendChild(WidgetElementFactory.createFab());
    return this;
  };

  /** Adiciona o overlay ao root */
  WidgetBuilder.prototype.buildOverlay = function () {
    this._root.appendChild(WidgetElementFactory.createOverlay());
    return this;
  };

  /** Constrói e anexa o painel lateral completo */
  WidgetBuilder.prototype.buildPanel = function () {
    var panel = document.createElement('aside');
    panel.className = 'ajw-panel';
    panel.id = 'ajwPanel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Recursos de acessibilidade');

    // Cabeçalho
    var header = document.createElement('div');
    header.className = 'ajw-header';
    header.innerHTML = '<h2 class="ajw-title">' + IconFactory.create('access') + ' AcessibilidadeJá</h2>';
    var closeBtn = document.createElement('button');
    closeBtn.className = 'ajw-close';
    closeBtn.id = 'ajwClose';
    closeBtn.setAttribute('aria-label', 'Fechar menu de acessibilidade');
    closeBtn.innerHTML = IconFactory.create('close');
    header.appendChild(closeBtn);
    panel.appendChild(header);

    // Corpo — montado pelas seções
    var body = document.createElement('div');
    body.className = 'ajw-body';
    this._body = body;
    this._buildSections(body);
    panel.appendChild(body);

    // Rodapé
    var footer = document.createElement('div');
    footer.className = 'ajw-footer';
    var resetBtn = document.createElement('button');
    resetBtn.className = 'ajw-reset';
    resetBtn.id = 'ajwReset';
    resetBtn.textContent = 'Redefinir tudo';
    var credit = document.createElement('div');
    credit.className = 'ajw-credit';
    credit.textContent = 'Powered by AcessibilidadeJá';
    footer.appendChild(resetBtn);
    footer.appendChild(credit);
    panel.appendChild(footer);

    this._panel = panel;
    this._root.appendChild(panel);
    return this;
  };

  /**
   * Itera sobre TOGGLE_OPTIONS agrupando por seção,
   * injeta título de seção quando muda, e insere o zoom
   * logo após o início da seção "Leitura".
   * @private
   */
  WidgetBuilder.prototype._buildSections = function (body) {
    var currentSection = null;

    TOGGLE_OPTIONS.forEach(function (option) {
      if (option.section !== currentSection) {
        currentSection = option.section;
        body.appendChild(WidgetElementFactory.createSectionTitle(currentSection));

        // Controle de zoom fica no topo da seção Leitura
        if (currentSection === 'Leitura') {
          body.appendChild(WidgetElementFactory.createZoomControl());
        }
      }
      body.appendChild(WidgetElementFactory.createToggleButton(option));
    });

    // Seção Tradutor (última, sem toggle)
    body.appendChild(WidgetElementFactory.createSectionTitle('Tradutor'));
    body.appendChild(WidgetElementFactory.createLanguageSelector());
  };

  /** Retorna o elemento raiz construído */
  WidgetBuilder.prototype.getRoot = function () {
    return this._root;
  };

  /* =========================================================
   * CSS
   * ======================================================= */
  var WIDGET_CSS = (function () {
    var isRight  = CFG.position.indexOf('right')  > -1;
    var isBottom = CFG.position.indexOf('bottom') > -1;

    return [
      '.ajw-root,.ajw-root *{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}',

      /* FAB */
      '.ajw-fab{position:fixed;' + (isBottom ? 'bottom:20px' : 'top:20px') + ';' + (isRight ? 'right:20px' : 'left:20px') + ';',
      'width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;',
      'background:#1B5E6E;color:#fff;box-shadow:0 8px 24px rgba(27,94,110,.35);',
      'display:flex;align-items:center;justify-content:center;z-index:2147483646;',
      'transition:transform .2s ease}',
      '.ajw-fab:hover{transform:scale(1.08)}',
      '.ajw-fab:focus-visible{outline:3px solid #7CD0E5;outline-offset:3px}',
      '.ajw-fab svg{width:32px;height:32px}',

      /* Overlay (clique fora fecha; leve, pois o painel é flutuante) */
      '.ajw-overlay{position:fixed;inset:0;background:rgba(0,0,0,.12);z-index:2147483646;',
      'opacity:0;pointer-events:none;transition:opacity .25s ease}',
      '.ajw-overlay.open{opacity:1;pointer-events:auto}',

      /* Painel — janela flutuante compacta (ancorada perto do botão) */
      '.ajw-panel{position:fixed;' + (isBottom ? 'bottom:88px' : 'top:88px') + ';' + (isRight ? 'right:20px' : 'left:20px') + ';',
      'width:300px;max-width:calc(100vw - 40px);max-height:min(70vh,540px);background:#fff;color:#1a2a30;',
      'border-radius:18px;overflow:hidden;box-shadow:0 16px 48px rgba(0,0,0,.24);z-index:2147483647;',
      'transform:translateY(12px) scale(.96);opacity:0;pointer-events:none;',
      'transition:transform .25s cubic-bezier(.2,.8,.2,1),opacity .25s ease;display:flex;flex-direction:column}',
      '.ajw-panel.open{transform:translateY(0) scale(1);opacity:1;pointer-events:auto}',

      /* Cabeçalho */
      '.ajw-header{padding:14px 16px;border-bottom:1px solid #e6eef0;display:flex;align-items:center;justify-content:space-between}',
      '.ajw-title{font-size:16px;font-weight:700;color:#1B5E6E;margin:0;display:flex;gap:8px;align-items:center}',
      '.ajw-close{background:none;border:none;cursor:pointer;padding:6px;color:#1B5E6E;border-radius:8px}',
      '.ajw-close:hover{background:#eef5f7}',
      '.ajw-close:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',

      /* Corpo */
      '.ajw-body{padding:12px;overflow-y:auto;flex:1}',

      /* Botões de toggle — CORRIGIDO: espaço entre "solid" e "rgb" */
      '.ajw-item{display:flex;align-items:center;gap:10px;width:100%;padding:9px 12px;margin-bottom:6px;',
      'border:1px solid rgb(66,191,223);background:#fff;border-radius:12px;cursor:pointer;text-align:left;',
      'color:#1a2a30;font-size:13px;font-weight:500;transition:all .15s}',
      '.ajw-item:hover{border-color:#1B5E6E;background:#f3fafc}',
      '.ajw-item:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',
      '.ajw-item.active{background:#1B5E6E;color:#fff;border-color:#1B5E6E}',
      '.ajw-item svg{width:20px;height:20px;flex-shrink:0}',

      /* Seção */
      '.ajw-section-title{font-size:11px;font-weight:700;color:#5a7680;text-transform:uppercase;letter-spacing:.08em;margin:10px 6px 6px}',

      /* Row (zoom / tradutor) */
      '.ajw-row{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;',
      'border:1px solid #e6eef0;border-radius:14px;margin-bottom:8px}',
      '.ajw-row label{font-size:14px;font-weight:500}',

      /* Stepper */
      '.ajw-stepper{display:flex;align-items:center;gap:6px}',
      '.ajw-stepper button{width:28px;height:28px;border-radius:50%;border:1px solid #1B5E6E;',
      'background:#fff;color:#1B5E6E;cursor:pointer;font-size:16px;font-weight:700}',
      '.ajw-stepper button:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',
      '.ajw-stepper span{min-width:36px;text-align:center;font-weight:600;font-size:13px}',

      /* Select */
      '.ajw-select{width:100%;padding:8px 10px;border-radius:10px;border:1px solid #cbd9dd;background:#fff;font-size:14px}',
      '.ajw-select:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',

      /* Rodapé */
      '.ajw-footer{padding:14px;border-top:1px solid #e6eef0}',
      '.ajw-reset{width:100%;padding:12px;border-radius:14px;border:1px solid #1B5E6E;',
      'background:#fff;color:#1B5E6E;cursor:pointer;font-weight:600;font-size:14px}',
      '.ajw-reset:hover{background:#1B5E6E;color:#fff}',
      '.ajw-reset:focus-visible{outline:2px solid #1B5E6E;outline-offset:2px}',
      '.ajw-credit{text-align:center;font-size:11px;color:#7a8e94;margin-top:10px}',

      /* ── Efeitos aplicados no <html> ── */
      'html.ajw-contrast-light{filter:contrast(1.2) brightness(1.1)!important;background:#fff!important}',
      'html.ajw-contrast-dark,html.ajw-contrast-dark body{background:#000!important;color:#fff!important}',
      'html.ajw-contrast-dark a{color:#7CD0E5!important}',
      'html.ajw-contrast-dark img,html.ajw-contrast-dark video{filter:brightness(.85)!important}',
      'html.ajw-grayscale{filter:grayscale(100%)!important}',
      'html.ajw-highlight-links a{background:#FFEB3B!important;color:#000!important;text-decoration:underline!important;padding:0 2px;border-radius:3px}',
      'html.ajw-pause-anim *,html.ajw-pause-anim *::before,html.ajw-pause-anim *::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important}',
      'html.ajw-dyslexia,html.ajw-dyslexia body,html.ajw-dyslexia *{font-family:"OpenDyslexic","Comic Sans MS","Trebuchet MS",sans-serif!important;letter-spacing:.08em!important;word-spacing:.16em!important;line-height:1.7!important}',
      'html.ajw-reading-mode main,html.ajw-reading-mode article,html.ajw-reading-mode body{background:#fdf6e3!important;color:#073642!important}',
      'html.ajw-reading-mode aside:not(.ajw-panel),html.ajw-reading-mode nav:not(.ajw-root nav),html.ajw-reading-mode video,html.ajw-reading-mode iframe{display:none!important}',
      'html.ajw-big-cursor,html.ajw-big-cursor *{cursor:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><path fill="%23000" stroke="%23fff" stroke-width="2" d="M8 4l28 16-13 3 7 14-5 3-7-14-10 8z"/></svg>\') 4 4,auto!important}',

      /* Barra de saída do modo leitura */
      '.ajw-reading-exit{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:2147483647;',
      'display:none;align-items:center;gap:12px;padding:10px 18px;background:#1B5E6E;color:#fff;border-radius:999px;',
      'box-shadow:0 6px 24px rgba(27,94,110,.45);font-size:14px;font-weight:600;',
      'max-width:calc(100vw - 24px);flex-wrap:wrap;justify-content:center}',
      '.ajw-reading-exit.visible{display:flex}',
      '.ajw-reading-exit-btn{background:#fff;color:#1B5E6E;border:none;padding:7px 16px;border-radius:999px;',
      'cursor:pointer;font-weight:700;font-size:13px;white-space:nowrap}',
      '.ajw-reading-exit-btn:hover{opacity:.92}',
      '.ajw-reading-exit-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}',

      /* Guia de leitura */
      '.ajw-reading-guide{position:fixed;left:0;right:0;height:60px;background:rgba(0,0,0,.55);',
      'pointer-events:none;z-index:2147483645;transition:top .05s linear}',
      '.ajw-reading-guide::before,.ajw-reading-guide::after{content:"";position:absolute;left:0;right:0;',
      'height:9999px;background:rgba(0,0,0,.55);pointer-events:none}',
      '.ajw-reading-guide::before{bottom:100%}',
      '.ajw-reading-guide::after{top:100%}',
      /* Navegação por teclado: destaque de foco e skip-link */
      'html.ajw-keyboard-nav :focus{outline:3px solid #FFB84D;outline-offset:3px}',
      '.ajw-skip-link{position:fixed;left:12px;top:12px;padding:8px 12px;background:#1B5E6E;color:#fff;border-radius:6px;transform:translateY(-140%);transition:transform .15s ease;z-index:2147483650;}',
      '.ajw-skip-link:focus{transform:translateY(0);box-shadow:0 6px 18px rgba(0,0,0,.25)}',
      'html.ajw-keyboard-nav .ajw-skip-link{transform:translateY(0)}',

      /* OVERLAY */
      '.ajw-yt-overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);',
      'display:flex;align-items:center;justify-content:center;',
      'z-index:2147483647;}',

      /* MODAL */
      '.ajw-yt-modal{width:min(960px,92vw);background:#000;',
      'border-radius:12px;overflow:hidden;',
      'box-shadow:0 20px 60px rgba(0,0,0,.6);}',

      /* HEADER */
      '.ajw-yt-header{display:flex;justify-content:space-between;',
      'align-items:center;padding:10px 14px;background:#111;',
      'color:#fff;border-bottom:1px solid rgba(255,255,255,.08)}',

      '.ajw-yt-title{font-size:14px;opacity:.9}',

      /* CLOSE */
      '.ajw-yt-close{background:transparent;border:none;',
      'color:#fff;font-size:20px;cursor:pointer;',
      'width:36px;height:36px;display:flex;',
      'align-items:center;justify-content:center;',
      'border-radius:8px;transition:background .2s}',

      '.ajw-yt-close:hover{background:rgba(255,255,255,.1)}',

      /* IFRAME */
      '.ajw-yt-iframe{width:100%;height:540px;display:block;background:#000}',

      /* RESPONSIVO */
      '@media (max-width:600px){',
      '.ajw-yt-iframe{height:240px}',
      '}',
    ].join('');
  }());

  /* =========================================================
   * ESTADO — persistência via localStorage
   * ======================================================= */
  function defaultState() {
    return { toggles: {}, zoom: 100, lang: '' };
  }

  function loadState() {
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

  function saveState(state) {
    try {
      // _appliedLang é controle interno, não precisa ser persistido
      var toSave = { toggles: state.toggles, zoom: state.zoom, lang: state.lang };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) { /* silencia quota ou modo privado */ }
  }

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
  var tutorial_btn = root.querySelector('[data-toggle="tutorial"]');;

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
   * modal tutorial
   * Cria um modal com um video do youtube ensinando a usar a ferramenta
   * ======================================================= */
function applyTutorial(youtubeUrl, title, onClose) {
    console.log("ABRI O VIDEO")
    function extractVideoId(url) {
       var match = url.match(/(?:youtube\.com.*v=|youtu\.be\/)([^&?/]+)/);
       return match ? match[1] : null;
     }

     var videoId = extractVideoId(youtubeUrl);

     if (!videoId) {
       throw new Error('URL do YouTube inválida');
     }

     // 1. Cria o overlay de fundo
     var overlay = document.createElement('div');
     overlay.className = 'ajw-yt-overlay';

     // 2. Injeta todo o HTML interno de forma limpa (Modal, Header e o seu Iframe original)
     overlay.innerHTML = `
       <div class="ajw-yt-modal" role="dialog" aria-modal="true" aria-label="${title || 'Vídeo do YouTube'}">
         <div class="ajw-yt-header">
           <span class="ajw-yt-title">${title || 'YouTube'}</span>
           <button class="ajw-yt-close" aria-label="Fechar vídeo">✕</button>
         </div>
         <iframe 
           class="ajw-yt-iframe"
           width="560" 
           height="315" 
           src="https://www.youtube.com/embed/nl5nr8r-ESI?si=rLFkUpCRcwYwHyGH" 
           title="${title || 'YouTube video player'}" 
           frameborder="0" 
           allow="web-share"
           referrerpolicy="strict-origin-when-cross-origin" 
           allowfullscreen>
         </iframe>
       </div>
     `;

     // 3. Captura os elementos criados via string para aplicar a lógica de fechar
     var iframe = overlay.querySelector('iframe');
     var closeBtn = overlay.querySelector('.ajw-yt-close');

     function close() {
        onClose()
       iframe.src = ''; // Para o vídeo imediatamente ao fechar
       overlay.remove();
       document.removeEventListener('keydown', escHandler);
     }

     function escHandler(e) {
       if (e.key === 'Escape') close();
     }

     // Eventos para fechar o modal
     closeBtn.addEventListener('click', close);
     overlay.addEventListener('click', function (e) {
       // Garante que só fecha se clicar no fundo (overlay), e não dentro do modal
       if (e.target === overlay) close();
     });
     document.addEventListener('keydown', escHandler);

     document.body.append(overlay)
}


  /* =========================================================
   * TRADUTOR (Google Translate)
   * Usa cookie strategy. Protegido contra loop de reload:
   * só recarrega se o script já existe E o idioma mudou.
   * ======================================================= */
  function applyTranslator(lang) {
    if (!lang) {
      var target = document.getElementById('google_translate_element');
      if (target) target.remove();
      _clearTranslateCookies();
      return;
    }

    _setTranslateCookie(lang);

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

  function _setTranslateCookie(lang) {
    var val = '/auto/' + lang;
    var host = location.hostname.replace(/^www\./, '');
    document.cookie = 'googtrans=' + val + '; path=/';
    document.cookie = 'googtrans=' + val + '; path=/; domain=.' + host;
  }

  function _clearTranslateCookies() {
    var exp = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
    var host = location.hostname.replace(/^www\./, '');
    document.cookie = 'googtrans=; ' + exp + '; path=/';
    document.cookie = 'googtrans=; ' + exp + '; path=/; domain=.' + host;
    sessionStorage.removeItem('ajw_translate_reloaded');
  }

  /* =========================================================
   * DOM FACADE — ManipuladorDOM (Facade pattern)
   * Encapsula operações de seleção/foco e a criação do skip-link
   * ======================================================= */
  function createDomFacade() {
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

  var domFacade = createDomFacade();

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
      applyTutorial: applyTutorial
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
    _clearTranslateCookies();
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
  window.AcessibilidadeJa = {
    open:  openPanel,
    close: closePanel,
    reset: function () {
      state = defaultState();
      saveState(state);
      _clearTranslateCookies();
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

}());
