/*!
 * effects.js
 * DECORATOR PATTERN — Padrão Estrutural GoF
 * Encadeia efeitos de acessibilidade como decoradores.
 * Cada recurso envolve o componente anterior e adiciona uma
 * responsabilidade sem alterar o componente base.
 */
import { TOGGLE_OPTIONS } from '../config/config.js';

export function AccessibilityEffect() {}
AccessibilityEffect.prototype.apply = function () { throw new Error('apply() deve ser implementado'); };
AccessibilityEffect.prototype.getName = function () { return this.constructor.name || 'AccessibilityEffect'; };

export function BaseAccessibilityEffect(toggleOptions) {
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

export function AccessibilityEffectDecorator(component) {
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

export function CssClassEffectDecorator(component, key) {
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

export function ZoomEffectDecorator(component) {
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

export function ReadingGuideEffectDecorator(component) {
  AccessibilityEffectDecorator.call(this, component);
}
ReadingGuideEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
ReadingGuideEffectDecorator.prototype.constructor = ReadingGuideEffectDecorator;
ReadingGuideEffectDecorator.prototype.apply = function (context) {
  AccessibilityEffectDecorator.prototype.apply.call(this, context);
  context.ensureGuide(!!context.state.toggles['reading-guide']);
};
ReadingGuideEffectDecorator.prototype.getName = function () { return 'ReadingGuideEffectDecorator'; };

export function ReadingExitEffectDecorator(component) {
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

export function TranslatorEffectDecorator(component) {
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

export function PersistenceEffectDecorator(component) {
  AccessibilityEffectDecorator.call(this, component);
}
PersistenceEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
PersistenceEffectDecorator.prototype.constructor = PersistenceEffectDecorator;
PersistenceEffectDecorator.prototype.apply = function (context) {
  AccessibilityEffectDecorator.prototype.apply.call(this, context);
  context.saveState(context.state);
};
PersistenceEffectDecorator.prototype.getName = function () { return 'PersistenceEffectDecorator'; };

export function buildAccessibilityEffectChain(context) {
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

  return chain;
}

export function describeDecoratorChain(component) {
  var names = [];
  var current = component;
  while (current) {
    names.push(current.getName());
    current = current.component;
  }
  return names;
}
