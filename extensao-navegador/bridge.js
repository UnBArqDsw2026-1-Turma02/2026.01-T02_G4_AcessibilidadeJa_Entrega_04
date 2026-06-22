/*
 * Acessibilidade Ja - bridge da extensao de navegador.
 *
 * Roda como content script ANTES do widget (acessibilidadeja.js), no mesmo
 * mundo isolado. Faz a ponte entre o popup da extensao e a API publica do
 * widget (window.AcessibilidadeJa), e aplica o estado de ativacao salvo.
 */
(function () {
  'use strict';

  var ENABLED_KEY = 'ajEnabled';

  function getRoot() {
    return document.querySelector('.ajw-root');
  }

  function applyEnabled(enabled) {
    var root = getRoot();
    if (!root) return;
    root.style.display = enabled ? '' : 'none';
    if (!enabled && window.AcessibilidadeJa && typeof window.AcessibilidadeJa.close === 'function') {
      window.AcessibilidadeJa.close();
    }
  }

  function readEnabled(callback) {
    try {
      chrome.storage.local.get([ENABLED_KEY], function (data) {
        var enabled = data && data[ENABLED_KEY] === false ? false : true; // padrao: ligado
        callback(enabled);
      });
    } catch (e) {
      callback(true);
    }
  }

  // Aplica o estado salvo assim que o widget terminar de montar.
  readEnabled(function (enabled) {
    if (enabled) return;
    // O widget monta de forma sincrona ao carregar; tenta aplicar logo e,
    // por seguranca, novamente apos o proximo tick.
    applyEnabled(false);
    setTimeout(function () { applyEnabled(false); }, 0);
  });

  // Canal de mensagens vindas do popup.
  chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (!msg || !msg.type) return;
    var api = window.AcessibilidadeJa;

    switch (msg.type) {
      case 'AJ_GET_STATE':
        readEnabled(function (enabled) {
          sendResponse({ ok: true, enabled: enabled, available: !!api });
        });
        return true; // resposta assincrona

      case 'AJ_SET_ENABLED':
        var value = !!msg.value;
        try {
          var obj = {};
          obj[ENABLED_KEY] = value;
          chrome.storage.local.set(obj);
        } catch (e) { /* ignora */ }
        applyEnabled(value);
        if (value && api && typeof api.open === 'function') api.open();
        sendResponse({ ok: true, enabled: value });
        return false;

      case 'AJ_OPEN':
        if (api && typeof api.open === 'function') { api.open(); sendResponse({ ok: true }); }
        else sendResponse({ ok: false });
        return false;

      case 'AJ_CLOSE':
        if (api && typeof api.close === 'function') { api.close(); sendResponse({ ok: true }); }
        else sendResponse({ ok: false });
        return false;

      case 'AJ_RESET':
        if (api && typeof api.reset === 'function') { api.reset(); sendResponse({ ok: true }); }
        else sendResponse({ ok: false });
        return false;

      default:
        return false;
    }
  });
}());
