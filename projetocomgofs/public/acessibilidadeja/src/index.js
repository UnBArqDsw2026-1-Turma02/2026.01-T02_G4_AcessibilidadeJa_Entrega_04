/*!
 * AcessibilidadeJá - Widget de Acessibilidade v2.0
 * Ponto de entrada (ESM). Inclua em qualquer site:
 *   <script type="module" src="https://seudominio.com/widget/src/index.js"></script>
 * Opcional, configure antes de carregar:
 *   <script>window.AcessibilidadeJaConfig = { position: 'bottom-right', lang: 'pt-BR' }</script>
 *
 * Este arquivo apenas garante o singleton e inicializa o widget;
 * toda a lógica está dividida nos módulos desta pasta (src/).
 */
import { initWidget } from './widget.js';

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
   * API PÚBLICA
   * ======================================================= */
  window.AcessibilidadeJa = initWidget();
}());
