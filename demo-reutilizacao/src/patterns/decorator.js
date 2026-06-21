(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.AJDecorator = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function AccessibilityEffect() {}
  AccessibilityEffect.prototype.apply = function () {
    throw new Error('apply(context) deve ser implementado');
  };

  function BaseAccessibilityEffect() {}
  BaseAccessibilityEffect.prototype = Object.create(AccessibilityEffect.prototype);
  BaseAccessibilityEffect.prototype.constructor = BaseAccessibilityEffect;
  BaseAccessibilityEffect.prototype.apply = function (context) {
    context.html.style.fontSize = '';
    return ['base'];
  };

  function AccessibilityEffectDecorator(component) {
    this.component = component;
  }
  AccessibilityEffectDecorator.prototype = Object.create(AccessibilityEffect.prototype);
  AccessibilityEffectDecorator.prototype.constructor = AccessibilityEffectDecorator;
  AccessibilityEffectDecorator.prototype.apply = function (context) {
    return this.component.apply(context);
  };

  function CssClassEffectDecorator(component, key) {
    AccessibilityEffectDecorator.call(this, component);
    this.key = key;
  }
  CssClassEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  CssClassEffectDecorator.prototype.constructor = CssClassEffectDecorator;
  CssClassEffectDecorator.prototype.apply = function (context) {
    var trace = AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.html.classList.add('ajw-' + this.key);
    return trace.concat('css:' + this.key);
  };

  function ZoomEffectDecorator(component, percent) {
    AccessibilityEffectDecorator.call(this, component);
    this.percent = percent || 120;
  }
  ZoomEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  ZoomEffectDecorator.prototype.constructor = ZoomEffectDecorator;
  ZoomEffectDecorator.prototype.apply = function (context) {
    var trace = AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.html.style.fontSize = this.percent === 100 ? '' : this.percent + '%';
    return trace.concat('zoom:' + this.percent);
  };

  function HighlightLinksEffectDecorator(component) {
    AccessibilityEffectDecorator.call(this, component);
    this.key = 'highlight-links';
  }
  HighlightLinksEffectDecorator.prototype = Object.create(AccessibilityEffectDecorator.prototype);
  HighlightLinksEffectDecorator.prototype.constructor = HighlightLinksEffectDecorator;
  HighlightLinksEffectDecorator.prototype.apply = function (context) {
    var trace = AccessibilityEffectDecorator.prototype.apply.call(this, context);
    context.html.classList.add('ajw-' + this.key);
    return trace.concat('links:highlight');
  };

  return {
    AccessibilityEffect: AccessibilityEffect,
    BaseAccessibilityEffect: BaseAccessibilityEffect,
    AccessibilityEffectDecorator: AccessibilityEffectDecorator,
    CssClassEffectDecorator: CssClassEffectDecorator,
    ZoomEffectDecorator: ZoomEffectDecorator,
    HighlightLinksEffectDecorator: HighlightLinksEffectDecorator,
  };
});
