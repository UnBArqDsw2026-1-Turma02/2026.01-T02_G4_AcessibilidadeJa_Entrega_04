/*!
 * AcessibilidadeJa - Reutilização de Software: GoF Strategy (Framework)
 *
 * Espelha o exemplo de framework empacotado em JAR do material da disciplina
 * (strategy.AbstractStrategy + ConcreteStrategy, consumido por um Cliente),
 * aplicado ao domínio do widget de acessibilidade.
 *
 * FUNDAMENTOS DE REUTILIZAÇÃO DEMONSTRADOS:
 *  - Hot spot (ponto de extensão): AbstractAccessibilityStrategy.apply(context).
 *    Equivale ao método abstrato strategy.AbstractStrategy.conta().
 *  - Reuso caixa-preta: o "framework" (runStrategy) opera sobre a abstração e
 *    NÃO conhece a estratégia concreta; quem escolhe é o cliente, em tempo de execução.
 *  - Inversão de controle: o framework chama o código do cliente (apply),
 *    e não o contrário.
 *
 * Arquivo demonstrativo/documental, no mesmo formato de decorator-pattern.js:
 * documenta a modelagem reutilizável usada/aplicável em acessibilidadeja.js.
 */
(function () {
  'use strict';

  /* =========================================================
   * HOT SPOT — abstração reutilizável (parte do "framework")
   * Equivale a: public abstract class AbstractStrategy { abstract void conta(); }
   * ======================================================= */
  function AbstractAccessibilityStrategy() {}
  AbstractAccessibilityStrategy.prototype.apply = function () {
    throw new Error('apply(context) deve ser implementado pela estratégia concreta');
  };
  AbstractAccessibilityStrategy.prototype.getName = function () {
    return this.constructor.name || 'AbstractAccessibilityStrategy';
  };

  /* =========================================================
   * ESTRATÉGIA CONCRETA 1 — fornecida pelo próprio framework
   * Equivale a: class ConcreteStrategySoma extends AbstractStrategy
   * ======================================================= */
  function ContrastStrategy(key) {
    this.key = key || 'contrast-dark';
  }
  ContrastStrategy.prototype = Object.create(AbstractAccessibilityStrategy.prototype);
  ContrastStrategy.prototype.constructor = ContrastStrategy;
  ContrastStrategy.prototype.apply = function (context) {
    context.html.classList.add('ajw-' + this.key);
  };

  /* =========================================================
   * ESTRATÉGIA CONCRETA 2 — adicionada pelo CLIENTE estendendo o hot spot,
   * sem alterar o framework (este é o ganho de reutilização).
   * Equivale a: class ConcreteStratetySubtracao extends AbstractStrategy
   * ======================================================= */
  function FontScalingStrategy(percent) {
    this.percent = percent || 120;
  }
  FontScalingStrategy.prototype = Object.create(AbstractAccessibilityStrategy.prototype);
  FontScalingStrategy.prototype.constructor = FontScalingStrategy;
  FontScalingStrategy.prototype.apply = function (context) {
    context.html.style.fontSize = this.percent === 100 ? '' : this.percent + '%';
  };

  /* =========================================================
   * "FRAMEWORK" / CONTEXTO — usa a abstração, nunca a classe concreta.
   * Equivale ao Main/ClientMain dos templates:
   *     AbstractStrategy strategy = new ConcreteStratetySubtracao();
   *     strategy.conta();
   * Inversão de controle: o framework chama o código do cliente.
   * ======================================================= */
  function runStrategy(strategy, context) {
    return strategy.apply(context);
  }

  window.AcessibilidadeJaStrategyPattern = {
    AbstractAccessibilityStrategy: AbstractAccessibilityStrategy,
    ContrastStrategy: ContrastStrategy,
    FontScalingStrategy: FontScalingStrategy,
    runStrategy: runStrategy,
  };
}());
