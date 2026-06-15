/*!
 * AcessibilidadeJa - Exemplo isolado do GoF Decorator
 * Este arquivo documenta a modelagem usada em acessibilidadeja.js.
 */
(function () {
  'use strict';

  function AccessibilityEffect() {}
  AccessibilityEffect.prototype.apply = function () {
    throw new Error('apply() deve ser implementado');
  };
  AccessibilityEffect.prototype.getName = function () {
    return this.constructor.name || 'AccessibilityEffect';
  };

  function BaseAccessibilityEffect(toggleOptions) {
    this.toggleOptions = toggleOptions || [];
  }
  BaseAccessibilityEffect.prototype = Object.create(AccessibilityEffect.prototype);
  BaseAccessibilityEffect.prototype.constructor = BaseAccessibilityEffect;
  BaseAccessibilityEffect.prototype.apply = function (context) {
    this.toggleOptions.forEach(function (option) {
      if (option.key !== 'reading-guide') {
        context.html.classList.remove('ajw-' + option.key);
      }
    });
    context.html.style.fontSize = '';
  };

  function AccessibilityEffectDecorator(component) {
    this.component = component;
  }
  AccessibilityEffectDecorator.prototype = Object.create(AccessibilityEffect.prototype);
  AccessibilityEffectDecorator.prototype.constructor = AccessibilityEffectDecorator;
  AccessibilityEffectDecorator.prototype.apply = function (context) {
    this.component.apply(context);
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

  function ZoomEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component);
  }
  ZoomEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  ZoomEffectDecorator.prototype.constructor = ZoomEffectDecorator;
  ZoomEffectDecorator.prototype.apply = function (context) {
    AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.html.style.fontSize = context.state.zoom === 100 ? '' : context.state.zoom + '%';
  };

  function ReadingGuideEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component);
  }
  ReadingGuideEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  ReadingGuideEffectDecorator.prototype.constructor = ReadingGuideEffectDecorator;
  ReadingGuideEffectDecorator.prototype.apply = function (context) {
    AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.ensureGuide(!!context.state.toggles['reading-guide']);
  };

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

  window.AcessibilidadeJaDecoratorPattern = {
    AccessibilityEffect: AccessibilityEffect,
    BaseAccessibilityEffect: BaseAccessibilityEffect,
    AccessibilityEffectDecorator: AccessibilityEffectDecorator,
    CssClassEffectDecorator: CssClassEffectDecorator,
    ZoomEffectDecorator: ZoomEffectDecorator,
    ReadingGuideEffectDecorator: ReadingGuideEffectDecorator,
    TranslatorEffectDecorator: TranslatorEffectDecorator,
  };
}());
