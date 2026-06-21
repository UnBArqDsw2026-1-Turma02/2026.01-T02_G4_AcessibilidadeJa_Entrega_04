(function () {
  'use strict';

  var context = {
    html: document.documentElement,
    state: {},
    saveState: function (state) {
      try { localStorage.setItem('aj-state', JSON.stringify(state)); } catch (e) {}
    },
  };

  var logEl = document.getElementById('log');
  function log(msg) {
    logEl.textContent = '› ' + msg + '\n' + logEl.textContent;
  }

  document.getElementById('btn-contraste').addEventListener('click', function () {
    var s = new AJStrategy.ContrastStrategy('contrast-dark');
    log('Strategy → ' + AJStrategy.runStrategy(s, context));
  });
  document.getElementById('btn-fonte').addEventListener('click', function () {
    var s = new AJStrategy.FontScalingStrategy(120);
    log('Strategy → ' + AJStrategy.runStrategy(s, context));
  });
  document.getElementById('btn-cinza').addEventListener('click', function () {
    var s = new AJStrategy.GrayscaleStrategy();
    log('Strategy → ' + AJStrategy.runStrategy(s, context));
  });
  document.getElementById('btn-leitura').addEventListener('click', function () {
    var s = new AJStrategy.ReadingModeStrategy();
    log('Strategy → ' + AJStrategy.runStrategy(s, context));
  });

  document.getElementById('btn-combo').addEventListener('click', function () {
    var efeito = new AJDecorator.ZoomEffectDecorator(
      new AJDecorator.CssClassEffectDecorator(
        new AJDecorator.BaseAccessibilityEffect(),
        'contrast-dark'
      ),
      140
    );
    log('Decorator → [' + efeito.apply(context).join(' → ') + ']');
  });
  document.getElementById('btn-links').addEventListener('click', function () {
    var efeito = new AJDecorator.HighlightLinksEffectDecorator(
      new AJDecorator.CssClassEffectDecorator(
        new AJDecorator.BaseAccessibilityEffect(),
        'contrast-dark'
      )
    );
    log('Decorator → [' + efeito.apply(context).join(' → ') + ']');
  });

  document.getElementById('btn-reset').addEventListener('click', function () {
    context.html.className = '';
    context.html.style.fontSize = '';
    log('reset');
  });

  var PROFILE_CTORS = {
    'baixa-visao': AJTemplateMethod.LowVisionProfile,
    'dislexia': AJTemplateMethod.DyslexiaProfile,
    'idoso': AJTemplateMethod.ElderlyProfile,
  };

  fetch('/api/perfis')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var box = document.getElementById('perfis');
      box.innerHTML = '';
      data.perfis.forEach(function (perfil) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = perfil.nome;
        btn.addEventListener('click', function () {
          var Ctor = PROFILE_CTORS[perfil.id];
          if (Ctor) {
            var trace = new Ctor().applyProfile(context);
            log('TemplateMethod(' + perfil.nome + ') → [' + trace.join(' → ') + ']');
          } else {
            if (perfil.efeito) context.html.classList.add('ajw-' + perfil.efeito);
            context.html.style.fontSize = perfil.fonte + '%';
            log('Perfil REST(' + perfil.nome + ') → fonte ' + perfil.fonte + '%');
          }
        });
        box.appendChild(btn);
      });
      log('serviço REST /api/perfis reutilizado: ' + data.perfis.length + ' perfis');
    })
    .catch(function () {
      document.getElementById('perfis').textContent = 'falha ao consumir o serviço REST';
    });
})();
