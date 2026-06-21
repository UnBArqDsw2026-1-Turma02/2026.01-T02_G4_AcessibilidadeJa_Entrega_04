# Issues — Módulo Reutilização de Software (Entrega 04)

Issues a abrir no repositório
`UnBArqDsw2026-1-Turma02/2026.01-T02_G4_AcessibilidadeJa_Entrega_04`,
para dar **rastreabilidade** (exigência do template 4.2: "rastro claro aos membros
participantes — quadro de participações & commits").

## Como criar uma issue (passo a passo)

**Pela interface do GitHub:**
1. Abra o repositório → aba **Issues** → botão verde **New issue**.
2. Preencha o **título** e a **descrição** (copie dos modelos abaixo).
3. Em **Assignees**, atribua ao responsável (Matheus ou Lucas).
4. Em **Labels**, use/crie: `reutilizacao`, `feature`, `documentacao`.
5. Em **Milestone**, selecione a milestone da Entrega 04 (se existir).
6. Clique em **Submit new issue**.
7. Ao abrir o PR, escreva `Closes #N` na descrição para vincular e fechar a issue.

**Pelo terminal (GitHub CLI), opcional:**
```bash
gh issue create \
  --repo UnBArqDsw2026-1-Turma02/2026.01-T02_G4_AcessibilidadeJa_Entrega_04 \
  --title "TÍTULO" --body "DESCRIÇÃO" \
  --label "reutilizacao,feature" --assignee SEU_USUARIO
```

---

## Issue 1 — Feature: Destacar links (Decorator) · Matheus ✅

**Título:** `[Reutilização] Feature: Destacar links via Decorator`

**Descrição:**
> Adicionar a funcionalidade "Destacar links" ao framework de acessibilidade
> **por composição (GoF Decorator)**, sem alterar o componente base nem os demais
> decoradores — evidenciando reuso por composição.
>
> **Tarefas**
> - [x] `HighlightLinksEffectDecorator` em `demo-reutilizacao/src/patterns/decorator.js`
> - [x] CSS `ajw-highlight-links` e botão no front
> - [x] Teste automatizado em `test/patterns.test.js`
>
> **Critério de aceite:** `npm test` passa e o efeito funciona em `npm start`.
> **Relacionada a:** Reutilização de Software (caixa-preta, hot spots).

## Issue 2 — Feature: Escala de cinza (Strategy) · Matheus ✅

**Título:** `[Reutilização] Feature: Escala de cinza via Strategy`

**Descrição:**
> Adicionar a funcionalidade "Escala de cinza" como **nova estratégia concreta
> (GoF Strategy)**, especializando o hot spot `apply(context)` sem alterar o
> framework — reuso **caixa-preta**.
>
> **Tarefas**
> - [x] `GrayscaleStrategy` (com toggle) em `src/patterns/strategy.js`
> - [x] CSS `ajw-grayscale` e botão no front
> - [x] Teste automatizado
>
> **Critério de aceite:** `npm test` passa; botão alterna o efeito em `npm start`.

## Issue 3 — Documentação do Módulo Reutilização · equipe (opcional)

**Título:** `[Reutilização] Documentar módulo (conceito + código rodando)`

**Descrição:**
> Atualizar `docs/ArquiteturaReutilizacao/4.2.ReutilizacaoDeSoftware.md` com o
> conceito (framework, hot/frozen spots, IoC, caixa-preta vs caixa-branca, framework
> vs biblioteca), o link para a demo executável (`demo-reutilizacao/`) e o histórico
> de versões/participações.
>
> **Critério de aceite:** página publicada no GitPages com tópico dedicado, exemplo
> de código e instruções de execução.
