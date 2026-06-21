/*!
 * config.js
 * Configuração global do widget, chave de storage e definição
 * das opções de toggle do menu (via OptionPrototype).
 */

export var CFG = Object.assign(
  { position: 'bottom-right', lang: 'pt-BR' },
  window.AcessibilidadeJaConfig || {}
);

export var STORAGE_KEY = 'acessibilidadeja:state:v2';

/* =========================================================
 * PROTOTYPE
 * Objeto base clonado para cada opção de toggle do menu.
 * OptionPrototype.clone(props) → novo objeto com defaults + overrides.
 * ======================================================= */
export var OptionPrototype = {
  type: 'toggle',
  section: '',
  key: '',
  icon: '',
  label: '',
  clone: function (props) {
    return Object.assign(Object.create(null), this, props || {});
  },
};

export var TOGGLE_OPTIONS = [
  OptionPrototype.clone({ section: 'Visualização',  key: 'contrast-light',  icon: 'contrast_light', label: 'Contraste claro'      }),
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
