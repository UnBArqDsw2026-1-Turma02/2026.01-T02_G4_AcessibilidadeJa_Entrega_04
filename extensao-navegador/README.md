# Acessibilidade Ja - Extensao de Navegador

Extensao (Manifest V3) que injeta o widget **Acessibilidade Ja** em qualquer
site que voce visitar, sem precisar alterar o codigo das paginas. Reusa o mesmo
widget vanilla JS do projeto (`acessibilidadeja.js`), agora carregado como
*content script*.

Compativel com navegadores baseados em Chromium: **Google Chrome, Microsoft Edge,
Brave, Opera e Vivaldi**.

## Recursos

O botao flutuante (canto inferior direito) abre o menu com:

- Contraste claro / escuro e escala de cinza
- Destacar links
- Modo leitura e guia de leitura
- Fonte para dislexia
- Cursor grande e pausar animacoes
- Ajuste do tamanho do texto (zoom)
- Traducao de idioma

As preferencias sao salvas por site (via `localStorage`) e o estado liga/desliga
da extensao fica em `chrome.storage`.

## Instalar em modo desenvolvedor (sem loja)

1. Abra `chrome://extensions` (no Edge: `edge://extensions`).
2. Ative o **Modo do desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactacao** (*Load unpacked*).
4. Selecione a pasta `extensao-navegador/` deste repositorio.
5. Abra qualquer site comum e clique no icone da extensao, ou use o botao
   flutuante que aparece na pagina.

> Paginas internas do navegador (`chrome://`, a loja de extensoes, etc.) nao
> recebem o widget por restricao do proprio navegador. Teste em um site comum.

## Gerar o pacote .zip (para distribuir ou subir na loja)

```bash
cd extensao-navegador
./build.sh
```

Gera `dist/acessibilidadeja-extensao.zip`. Esse arquivo pode ser:

- enviado para outra pessoa instalar (ela descompacta e usa "Carregar sem compactacao"); ou
- publicado na **Chrome Web Store** / **Microsoft Edge Add-ons**.

## Estrutura

| Arquivo | Papel |
| :--- | :--- |
| `manifest.json` | Configuracao da extensao (MV3): content script + popup + permissoes |
| `acessibilidadeja.js` | O widget de acessibilidade (reusado do projeto) |
| `bridge.js` | Ponte entre o popup e a API publica do widget; aplica liga/desliga |
| `popup.html` / `popup.js` | Janelinha do icone: ativar/desativar, abrir menu, restaurar |
| `icons/` | Icones 16/48/128 px |
| `build.sh` | Empacota tudo em `dist/acessibilidadeja-extensao.zip` |

## Como funciona

O `manifest.json` registra `bridge.js` e `acessibilidadeja.js` como
*content scripts* em `<all_urls>`, executados em `document_idle`. O widget se
auto-inicializa (padrao Singleton) e monta o botao flutuante na pagina. O popup
conversa com `bridge.js` via `chrome.tabs.sendMessage`, que por sua vez chama a
API publica `window.AcessibilidadeJa` (`open`, `close`, `reset`).
