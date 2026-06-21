/*!
 * builder.js
 * BUILDER — WidgetBuilder
 * Monta o painel em etapas encadeadas (fluent interface).
 * Cada método retorna `this` para permitir encadeamento.
 *
 * Uso:
 *   var root = new WidgetBuilder()
 *     .mountStyles(WIDGET_CSS)
 *     .mountRoot()
 *     .buildReadingExit()
 *     .buildFab()
 *     .buildOverlay()
 *     .buildPanel()
 *     .getRoot();
 */
import { TOGGLE_OPTIONS } from '../config/config.js';
import { IconFactory } from '../dom/icons.js';
import { WidgetElementFactory } from '../dom/elementFactory.js';

export function WidgetBuilder() {
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
