# testandotrabbb

## Guia de leitura do código

Este projeto contém dois aspectos principais: o site estático tradicional e a aplicação React/TypeScript em `src/`.

### 1. Entendendo a arquitetura principal
- `src/` — ponto central do código React/TSX.
- `src/routes/` — define as rotas do aplicativo.
  - `__root.tsx` — layout compartilhado, tratamento de erros e metáforas de navegação.
  - `index.tsx` — conteúdo da rota raiz.
  - `integrar.tsx` — rota de integração.
  - `recursos.tsx` — rota de recursos.
- `src/components/` — componentes reutilizáveis e UI.
  - `AjLogo.tsx`, `SiteHeader.tsx` — componentes do cabeçalho e identidade visual.
  - `WidgetLoader.tsx` — componente para carregar widgets externos.
- `src/components/ui/` — biblioteca de componentes de interface customizados.

### 2. Fluxo do aplicativo React
1. `src/start.ts` e `src/server.ts` — entradas de aplicação (dependendo do modelo de build/SSR).
2. `src/router.tsx` — configura rotas e árvore de rotas gerada.
3. `src/routes/*` — cada arquivo exporta a página/rota correspondente.
4. `src/components/*` — componentes usados pelas rotas.

### 3. Componentes e estilos
- `src/styles.css` — estilo global da aplicação React.
- `src/components/ui/` — componentes de UI compartilhados como botões, cards, tabs, formulários e alertas.
- `src/hooks/use-mobile.tsx` — hook customizado para comportamento mobile.
- `src/lib/utils.ts` — funções utilitárias de uso geral.

### 4. Como rodar e testar o código
- Instalar dependências: `npm install`
- Rodar em modo de desenvolvimento: `npm run dev`
- Build de produção: `npm run build`
- Pré-visualizar o build: `npm run preview`

### 5. Leituras recomendadas no código
- Comece por `src/routes/__root.tsx` para entender a infraestrutura de rotas.
- Veja `src/components/ui/button.tsx` e `src/components/ui/input.tsx` para padrões de UI reutilizáveis.
- Analise `src/components/WidgetLoader.tsx` para lógica de carregamento de widget externo.
- Cheque `vite.config.js` para ver configurações de bundling e caminhos.
