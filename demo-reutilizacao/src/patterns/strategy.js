(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = api;
  } else {
    root.AJStrategy = api;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function AbstractAccessibilityStrategy() {}
  AbstractAccessibilityStrategy.prototype.apply = function () {
    throw new Error('apply(context) deve ser implementado pela estratégia concreta');
  };
  AbstractAccessibilityStrategy.prototype.getName = function () {
    return this.name || 'AbstractAccessibilityStrategy';
  };

  function ContrastStrategy(key) {
    this.name = 'ContrastStrategy';
    this.key = key || 'contrast-dark';
  }
  ContrastStrategy.prototype = Object.create(AbstractAccessibilityStrategy.prototype);
  ContrastStrategy.prototype.constructor = ContrastStrategy;
  ContrastStrategy.prototype.apply = function (context) {
    context.html.classList.add('ajw-' + this.key);
    return 'contraste aplicado: ' + this.key;
  };

  function FontScalingStrategy(percent) {
    this.name = 'FontScalingStrategy';
    this.percent = percent || 120;
  }
  FontScalingStrategy.prototype = Object.create(AbstractAccessibilityStrategy.prototype);
  FontScalingStrategy.prototype.constructor = FontScalingStrategy;
  FontScalingStrategy.prototype.apply = function (context) {
    context.html.style.fontSize = this.percent === 100 ? '' : this.percent + '%';
    return 'fonte ajustada: ' + this.percent + '%';
  };

  function GrayscaleStrategy() {
    this.name = 'GrayscaleStrategy';
    this.key = 'grayscale';
  }
  GrayscaleStrategy.prototype = Object.create(AbstractAccessibilityStrategy.prototype);
  GrayscaleStrategy.prototype.constructor = GrayscaleStrategy;
  GrayscaleStrategy.prototype.apply = function (context) {
    var has = context.html.classList.contains('ajw-' + this.key);
    if (has) {
      context.html.classList.remove('ajw-' + this.key);
      return 'escala de cinza removida';
    }
    context.html.classList.add('ajw-' + this.key);
    return 'escala de cinza aplicada';
  };

  function runStrategy(strategy, context) {
    if (!(strategy instanceof AbstractAccessibilityStrategy)) {
      throw new Error('runStrategy espera uma AbstractAccessibilityStrategy');
    }
    return strategy.apply(context);
  }

  return {
    AbstractAccessibilityStrategy: AbstractAccessibilityStrategy,
    ContrastStrategy: ContrastStrategy,
    FontScalingStrategy: FontScalingStrategy,
    GrayscaleStrategy: GrayscaleStrategy,
    runStrategy: runStrategy,
  };
});
