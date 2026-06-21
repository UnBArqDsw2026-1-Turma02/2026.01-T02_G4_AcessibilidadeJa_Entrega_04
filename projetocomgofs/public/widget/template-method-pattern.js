/*!
 * AcessibilidadeJa - Reutilização de Software: GoF Template Method (Framework)
 *
 * Espelha o segundo exemplo de framework empacotado em JAR do material da disciplina
 * (templateMethod.Template, com templateMethod() final + operation2()/operation3(),
 * estendido por ConcreteTemplateMethod), aplicado ao domínio do widget.
 *
 * FUNDAMENTOS DE REUTILIZAÇÃO DEMONSTRADOS:
 *  - Frozen spot (parte fixa reutilizada): applyProfile() é o esqueleto imutável.
 *    Equivale a 'public final void templateMethod()' — a sequência não muda.
 *  - Hot spots (pontos de extensão): applyPrimaryEffect()/applyExtraEffect() são
 *    sobrescritos pelo cliente. Equivalem a operation2()/operation3().
 *  - Inversão de controle (Princípio de Hollywood): applyProfile() chama os métodos
 *    sobrescritos pelo cliente — o framework chama o cliente, não o contrário.
 *
 * Arquivo demonstrativo/documental, no mesmo formato de decorator-pattern.js.
 */
(function () {
  'use strict';

  /* =========================================================
   * FRAMEWORK — esqueleto reutilizável
   * Equivale a: class Template
   * ======================================================= */
  function AccessibilityProfileTemplate() {}

  /* FROZEN SPOT — passo a passo fixo. NÃO sobrescrever.
   * Equivale a 'public final void templateMethod()'. Em JS não existe 'final';
   * o contrato de imutabilidade é documentado e respeitado pelas subclasses. */
  AccessibilityProfileTemplate.prototype.applyProfile = function (context) {
    this.reset(context);              // passo fixo (frozen)
    this.applyPrimaryEffect(context); // hot spot (definido pelo cliente)
    this.applyExtraEffect(context);   // hot spot (definido pelo cliente)
    this.persist(context);            // passo fixo (frozen)
  };

  /* Passos fixos reutilizados por qualquer perfil */
  AccessibilityProfileTemplate.prototype.reset = function (context) {
    context.html.style.fontSize = '';
  };
  AccessibilityProfileTemplate.prototype.persist = function (context) {
    if (context.saveState) context.saveState(context.state);
  };

  /* HOT SPOTS — ganchos com implementação padrão vazia, sobrescrevíveis pelo cliente.
   * Equivalem a operation2()/operation3() do template. */
  AccessibilityProfileTemplate.prototype.applyPrimaryEffect = function () {
    /* cada perfil define seu efeito principal */
  };
  AccessibilityProfileTemplate.prototype.applyExtraEffect = function () {
    /* cada perfil define um efeito adicional */
  };

  /* =========================================================
   * CLIENTE — estende o framework e sobrescreve APENAS os hot spots,
   * reutilizando o esqueleto (frozen spot) sem reimplementá-lo.
   * Equivale a: class ConcreteTemplateMethod extends Template
   * ======================================================= */
  function LowVisionProfile() {}
  LowVisionProfile.prototype = Object.create(AccessibilityProfileTemplate.prototype);
  LowVisionProfile.prototype.constructor = LowVisionProfile;
  LowVisionProfile.prototype.applyPrimaryEffect = function (context) {
    context.html.classList.add('ajw-contrast-dark');
  };
  LowVisionProfile.prototype.applyExtraEffect = function (context) {
    context.html.style.fontSize = '130%';
  };

  window.AcessibilidadeJaTemplateMethodPattern = {
    AccessibilityProfileTemplate: AccessibilityProfileTemplate,
    LowVisionProfile: LowVisionProfile,
  };
}());
