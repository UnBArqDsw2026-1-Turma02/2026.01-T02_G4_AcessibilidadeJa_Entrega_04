/*
 * Acessibilidade Ja - logica do popup da extensao.
 * Conversa com o content script (bridge.js) da aba ativa.
 */
(function () {
  'use strict';

  var toggle = document.getElementById('toggleEnabled');
  var btnOpen = document.getElementById('btnOpen');
  var btnReset = document.getElementById('btnReset');
  var note = document.getElementById('note');

  function withActiveTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      callback(tabs && tabs[0] ? tabs[0] : null);
    });
  }

  function send(type, extra, callback) {
    withActiveTab(function (tab) {
      if (!tab || !tab.id) { if (callback) callback(null); return; }
      var msg = Object.assign({ type: type }, extra || {});
      chrome.tabs.sendMessage(tab.id, msg, function (resp) {
        if (chrome.runtime.lastError) { if (callback) callback(null); return; }
        if (callback) callback(resp);
      });
    });
  }

  function setUnavailable() {
    // Paginas internas do navegador (chrome://, store, etc.) nao recebem o widget.
    toggle.disabled = true;
    btnOpen.disabled = true;
    btnReset.disabled = true;
    note.textContent = 'Esta pagina nao permite extensoes. Abra um site comum (ex.: um portal de noticias) para usar o widget.';
  }

  // Estado inicial
  send('AJ_GET_STATE', null, function (resp) {
    if (!resp) { setUnavailable(); return; }
    toggle.checked = resp.enabled !== false;
  });

  toggle.addEventListener('change', function () {
    send('AJ_SET_ENABLED', { value: toggle.checked });
  });

  btnOpen.addEventListener('click', function () {
    // Garante ativacao antes de abrir
    if (!toggle.checked) { toggle.checked = true; send('AJ_SET_ENABLED', { value: true }); }
    send('AJ_OPEN', null, function () { window.close(); });
  });

  btnReset.addEventListener('click', function () {
    send('AJ_RESET');
    window.close();
  });
}());
