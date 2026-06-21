'use strict';

const test = require('node:test');
const assert = require('node:assert');

const Strategy = require('../src/patterns/strategy');
const Template = require('../src/patterns/template-method');
const Decorator = require('../src/patterns/decorator');

function makeContext() {
  const classes = new Set();
  return {
    html: {
      classList: {
        add: (c) => classes.add(c),
        remove: (c) => classes.delete(c),
        contains: (c) => classes.has(c),
      },
      style: { fontSize: '' },
    },
    state: {},
    saved: null,
    saveState(s) { this.saved = s; },
    has: (c) => classes.has(c),
  };
}

test('Strategy: framework opera sobre a abstração (reuso caixa-preta)', () => {
  const ctx = makeContext();
  const r = Strategy.runStrategy(new Strategy.ContrastStrategy('contrast-dark'), ctx);
  assert.ok(ctx.has('ajw-contrast-dark'), 'classe de contraste aplicada');
  assert.match(r, /contraste/);
});

test('Strategy: nova estratégia do cliente sem alterar o framework (hot spot)', () => {
  const ctx = makeContext();
  Strategy.runStrategy(new Strategy.FontScalingStrategy(120), ctx);
  assert.strictEqual(ctx.html.style.fontSize, '120%');
});

test('Strategy: runStrategy rejeita quem não estende a abstração', () => {
  assert.throws(() => Strategy.runStrategy({ apply() {} }, makeContext()));
});

test('FEATURE (Matheus) Strategy: escala de cinza alterna via hot spot', () => {
  const ctx = makeContext();
  const s = new Strategy.GrayscaleStrategy();
  let r = Strategy.runStrategy(s, ctx);
  assert.ok(ctx.has('ajw-grayscale'), 'grayscale aplicado');
  assert.match(r, /aplicada/);
  r = Strategy.runStrategy(s, ctx);
  assert.ok(!ctx.has('ajw-grayscale'), 'grayscale removido no segundo apply');
  assert.match(r, /removida/);
});

test('Template Method: esqueleto frozen executa os passos na ordem fixa', () => {
  const ctx = makeContext();
  const trace = new Template.LowVisionProfile().applyProfile(ctx);
  assert.deepStrictEqual(trace, ['reset', 'primary:contrast-dark', 'extra:font-130', 'persist']);
  assert.ok(ctx.has('ajw-contrast-dark'));
  assert.strictEqual(ctx.html.style.fontSize, '130%');
});

test('Template Method: dois clientes reutilizam o MESMO frozen spot', () => {
  const a = new Template.LowVisionProfile().applyProfile(makeContext());
  const b = new Template.DyslexiaProfile().applyProfile(makeContext());
  assert.strictEqual(a[0], b[0]);
  assert.strictEqual(a[3], b[3]);
  assert.notStrictEqual(a[1], b[1]);
});

test('Template Method: inversão de controle chama persist (frozen) e salva estado', () => {
  const ctx = makeContext();
  new Template.DyslexiaProfile().applyProfile(ctx);
  assert.notStrictEqual(ctx.saved, null);
});

test('Decorator: composição encadeia efeitos sem alterar o componente base', () => {
  const ctx = makeContext();
  const efeito = new Decorator.ZoomEffectDecorator(
    new Decorator.CssClassEffectDecorator(new Decorator.BaseAccessibilityEffect(), 'contrast-dark'),
    140
  );
  const trace = efeito.apply(ctx);
  assert.deepStrictEqual(trace, ['base', 'css:contrast-dark', 'zoom:140']);
  assert.ok(ctx.has('ajw-contrast-dark'));
  assert.strictEqual(ctx.html.style.fontSize, '140%');
});

test('FEATURE (Matheus) Decorator: destacar links compõe sem alterar os demais', () => {
  const ctx = makeContext();
  const efeito = new Decorator.HighlightLinksEffectDecorator(
    new Decorator.CssClassEffectDecorator(new Decorator.BaseAccessibilityEffect(), 'contrast-dark')
  );
  const trace = efeito.apply(ctx);
  assert.deepStrictEqual(trace, ['base', 'css:contrast-dark', 'links:highlight']);
  assert.ok(ctx.has('ajw-highlight-links'));
  assert.ok(ctx.has('ajw-contrast-dark'));
});
