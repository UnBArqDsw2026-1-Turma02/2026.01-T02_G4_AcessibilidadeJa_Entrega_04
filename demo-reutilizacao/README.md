# Demo de Reutilização de Software — AcessibilidadeJá (Entrega 04)

Aplicação **executável** que evidencia, rodando, os fundamentos de **Reutilização
de Software / Framework** da disciplina (aula da Profa. Milene Serrano): _hot spots_,
_frozen spots_, **inversão de controle (Hollywood)**, reuso **caixa-preta** e reuso
**por serviço (REST)**.

Sobe **back-end + front-end no mesmo lugar, com um único comando** e **sem instalar
dependências** (usa apenas o `http` e o test runner nativos do Node).

## Pré-requisitos

- Node.js **18+** (testado no Node 22).
- Nada de `npm install`: o projeto não tem dependências externas.

## Como rodar (passo a passo)

```bash
# 1. entre na pasta da demo
cd demo-reutilizacao

# 2. suba back + front juntos
npm start
#   (equivalente a: node server.js)

# 3. abra no navegador
#    http://localhost:3000
```

Para mudar a porta: `PORT=8080 npm start`.

## Como ver os testes passando ("mostrar rodando")

```bash
cd demo-reutilizacao
npm test
#   (equivalente a: node --test test/*.test.js)
```

Saída esperada: **10 testes, 10 passando** — exercitam Strategy, Template Method,
Decorator e o serviço REST.

## O que observar na tela

A demo tem duas páginas:

### 1. `/` — o plugin real num site de exemplo (a prova de reutilização)

A página inicial é o **"Blog Viagem & Café"**, um site de terceiro **comum, sem
nenhuma linha de acessibilidade própria**. A única coisa adicionada a ele foi
**uma linha** no fim do HTML:

```html
<script src="/widget/acessibilidadeja.js" defer></script>
```

Ao abrir, repare no **botão flutuante de acessibilidade** no canto inferior direito:
ele foi **injetado pelo plugin** (reuso **caixa-preta / drop-in**, sem o site
conhecer o interior do widget). Clicando nele abre o painel com contraste, escala de
cinza, zoom, fonte para dislexia, destacar links, guia de leitura, etc.

> Validação automatizada: o plugin foi testado com Chrome headless dropando-o no
> site de exemplo — o botão (`ajw-fab`) e o painel são injetados corretamente.

### Testar o plugin em sites reais (Mercado Livre e OLX)

Como o widget é um plugin **drop-in**, ele pode ser injetado em **qualquer site já no
ar**. Para demonstrar em produção usamos dois sites reais:

- https://www.mercadolivre.com.br/
- https://www.olx.com.br/

Passo a passo:

1. Abra o site (ex.: Mercado Livre) no navegador.
2. Abra o **Console do DevTools** (F12 → aba *Console*).
3. Cole e execute o snippet abaixo:

```js
var s = document.createElement('script');
s.src = 'https://cdn.jsdelivr.net/gh/UnBArqDsw2026-1-Turma02/2026.01-T02_G4_AcessibilidadeJa_Entrega_04@feat/reutilizacao-software/projetocomgofs/public/widget/acessibilidadeja.js';
s.defer = true;
document.body.appendChild(s);
```

4. O **botão flutuante de acessibilidade** aparece no canto inferior direito do site
   real, e a **janela flutuante** abre com os recursos — provando o reuso drop-in.

> O snippet carrega o widget via jsDelivr direto do repositório (URL https, funciona
> em sites seguros). Após o merge na `main`, troque `@feat/reutilizacao-software` por `@main`.
> Versão clicável (bookmarklet): crie um favorito com a URL
> `javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/UnBArqDsw2026-1-Turma02/2026.01-T02_G4_AcessibilidadeJa_Entrega_04@feat/reutilizacao-software/projetocomgofs/public/widget/acessibilidadeja.js';s.defer=true;document.body.appendChild(s);})()`

### 2. `/padroes.html` — os padrões de reutilização isolados

Exercita, com log na tela, os mesmos padrões usados internamente pelo widget:

| Botão | Padrão / Reuso evidenciado |
| :--- | :--- |
| Alto contraste / Aumentar fonte / **Escala de cinza** | **Strategy** — hot spot trocado em runtime |
| Botões de **perfis** (carregados do back) | **Template Method** + **reuso por serviço REST** (`/api/perfis`) |
| Contraste + Zoom / **Contraste + Destacar links** | **Decorator** — efeitos compostos por composição |

As features "Escala de cinza" e "Destacar links" foram **adicionadas nesta entrega** (ver `FEATURES.md`).

## Mapa do código

```
demo-reutilizacao/
├── server.js                 # BACK: serve o front + serviço REST /api/perfis + widget + módulos
├── widget/
│   └── acessibilidadeja.js   # PLUGIN real (drop-in), servido em /widget/
├── public/                   # FRONT
│   ├── index.html            #   site de exemplo (Blog) que inclui o plugin por <script>
│   ├── padroes.html          #   página técnica: padrões isolados com log
│   ├── app.js                #   liga os hot spots aos botões da página de padrões
│   └── styles.css            #   classes aplicadas pelo framework (ajw-*)
├── src/patterns/             # FRAMEWORK reutilizável (UMD: roda no Node e no browser)
│   ├── strategy.js           #   GoF Strategy        — hot spot
│   ├── template-method.js    #   GoF Template Method — frozen spot + hot spots
│   └── decorator.js          #   GoF Decorator       — reuso por composição
└── test/                     # "mostrar rodando": testes dos padrões e do serviço
    ├── patterns.test.js
    └── service.test.js
```

## Relação com o que já existe no projeto

- Reaproveita a modelagem dos padrões já documentados em `docs/ArquiteturaReutilizacao/4.2`
  e dos módulos em `projetocomgofs/public/widget/`.
- Complementa o código demonstrativo da **Entrega 03** (`demonstraPadrao/` com testes
  Jest de Strategy/Singleton/Facade), agora com **back + front executando juntos**.
