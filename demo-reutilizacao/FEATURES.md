# Features de Reutilização — Entrega 04

Funcionalidades construídas **por extensão do framework** (sem alterar o núcleo),
evidenciando reutilização de software.

| # | Feature | Padrão / Mecanismo de reuso | Responsável | Status |
| :-: | :--- | :--- | :--- | :--- |
| 1 | Destacar links | **Decorator** (composição) | Matheus | pronta |
| 2 | Escala de cinza | **Strategy** (hot spot) | Matheus | pronta |
| 3 | Modo leitura | **Strategy** (hot spot) | Lucas | a fazer |
| 4 | Perfil "Idoso / Leitura ampliada" | **Template Method** (frozen spot) | Lucas | a fazer |

---

## Feature 1 — Destacar links (Matheus) · Decorator

**Reutilização:** adiciona uma responsabilidade nova **por composição**, encadeando
um novo decorador aos já existentes, **sem modificar** `BaseAccessibilityEffect`
nem os outros decoradores.

- Código: `src/patterns/decorator.js` → `HighlightLinksEffectDecorator`
- Front: botão "Contraste + Destacar links" em `public/index.html` + `public/app.js`
- CSS: `html.ajw-highlight-links a { ... }` em `public/styles.css`
- Teste: `test/patterns.test.js` → _"FEATURE (Matheus) Decorator: destacar links..."_

Verificação:
```bash
npm test    # o teste do decorator confirma a cadeia ['base','css:contrast-dark','links:highlight']
```

## Feature 2 — Escala de cinza (Matheus) · Strategy

**Reutilização:** uma nova estratégia concreta especializa o **hot spot**
`apply(context)`; o framework (`runStrategy`) opera sobre a abstração e **não conhece**
a classe concreta (reuso **caixa-preta**).

- Código: `src/patterns/strategy.js` → `GrayscaleStrategy` (com toggle on/off)
- Front: botão "Escala de cinza" em `public/index.html` + `public/app.js`
- CSS: `html.ajw-grayscale { filter: grayscale(100%); }`
- Teste: `test/patterns.test.js` → _"FEATURE (Matheus) Strategy: escala de cinza..."_

---

## Features 3 e 4 (Lucas)

A serem implementadas pelo Lucas, por extensão do framework (Strategy e Template
Method), seguindo o mesmo molde das features 1 e 2 acima.
