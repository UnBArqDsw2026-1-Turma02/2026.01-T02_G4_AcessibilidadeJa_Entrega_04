# Acessibilidade Já

**Código da Disciplina**: FGA0208<br>
**Número do Grupo**: 04<br>
**Entrega**: 04<br>

## Equipe

<table>
  <tr>
  <td align="center"><a href="https://github.com/Felipe-Brandim"><img style="border-radius: 50%;" src="https://github.com/Felipe-Brandim.png" width="100px;" alt=""/><br /><sub><b>Felipe Brandim</b></sub></a><br />
  <td align="center"><a href="https://github.com/daramariabs"><img style="border-radius: 50%;" src="https://github.com/daramariabs.png" width="100px;" alt=""/><br /><sub><b>Dara Maria</b></sub></a><br />
  <td align="center"><a href="https://github.com/pfc15"><img style="border-radius: 50%;" src="https://github.com/pfc15.png" width="100px;" alt=""/><br /><sub><b>Pedro Cruz</b></sub></a><br />
  <td align="center"><a href="https://github.com/Fernandavazgit1 "><img style="border-radius: 50%;" src="https://github.com/Fernandavazgit1.png" width="100px;" alt=""/><br /><sub><b>Fernanda Vaz</b></sub></a><br />
  <td align="center"><a href="https://github.com/mrodrigues14 "><img style="border-radius: 50%;" src="https://github.com/mrodrigues14.png" width="100px;" alt=""/><br /><sub><b>Matheus Rodrigues</b></sub></a><br />
  <td align="center"><a href="https://github.com/lucasbbranco"><img style="border-radius: 50%;" src="https://github.com/lucasbbranco.png" width="100px;" alt=""/><br /><sub><b>Lucas Branco</b></sub></a><br />
    <td align="center"><a href="https://github.com/enzo-fb"><img style="border-radius: 50%;" src="https://github.com/enzo-fb.png" width="100px;" alt=""/><br /><sub><b>Enzo Fernandes</b></sub></a><br />
    <td align="center"><a href="https://github.com/fabiofonteles1 "><img style="border-radius: 50%;" src="https://github.com/fabiofonteles1.png" width="100px;" alt=""/><br /><sub><b>Fábio Fonteles</b></sub></a><br />
    <td align="center"><a href="https://github.com/isaacbatista26 "><img style="border-radius: 50%;" src="https://github.com/isaacbatista26.png" width="100px;" alt=""/><br /><sub><b>Isaac Batista</b></sub></a><br />
  </tr>
</table>

## Sobre:

Queremos por meio desse projeto trazer uma solução open source para problemas de acessibilidade em aplicações web.

A intenção é criar widgets de acessibilidade que possam ser facilmente utilizados em sites diversos, ficando a critério do desenvolvedor a escolha da nossa ferramenta. Uma vez que ele a escolhe e a implementa no código, os usuários poderão usufruir livremente de seus benefícios;contribuindo dessa forma para um mundo digital um pouco mais acessível.

## Vídeo de tutorial

<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%;border-radius:8px;">
  <iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
    src="https://www.youtube.com/embed/nl5nr8r-ESI"
    title="Acessibilidade Já - tutorial"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen></iframe>
</div>

> Caso o vídeo não carregue acima, acesse diretamente: <https://www.youtube.com/embed/nl5nr8r-ESI>

## Usando como extensão de navegador

Além de poder ser embutido em um site via `<script>`, o **Acessibilidade Já** também pode ser instalado como **extensão de navegador** (Manifest V3), passando a funcionar em **qualquer site** que você visitar — sem precisar alterar o código das páginas. Compatível com navegadores baseados em Chromium (**Chrome, Edge, Brave, Opera, Vivaldi**).

**Como instalar (modo desenvolvedor):**

1. Abra `chrome://extensions` (no Edge: `edge://extensions`).
2. Ative o **Modo do desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactação** (*Load unpacked*).
4. Selecione a pasta `extensao-navegador/` deste repositório.
5. Abra um site comum: o **botão flutuante** aparece no canto inferior direito. Clique nele (ou no ícone da extensão) para abrir o menu de acessibilidade.

**Como usar:**

- **Botão flutuante**: abre o menu com todos os recursos (contraste, escala de cinza, destacar links, modo leitura, guia de leitura, fonte para dislexia, cursor grande, pausar animações, **tamanho do texto** e **tradução de idioma**).
- **Ícone da extensão** (barra do navegador): permite **ativar/desativar** nesta página, **abrir o menu** e **restaurar** as configurações.
- As preferências ficam salvas por site.

> Observações: páginas internas do navegador (`chrome://`, lojas de extensão) não recebem o widget, por restrição do próprio navegador — teste em um site comum. Em sites com política de segurança (CSP) muito restritiva, a **tradução** (que depende de carregar o serviço do Google) pode não estar disponível.

Para gerar o pacote `.zip` distribuível (ou para publicar na loja), rode:

```bash
cd extensao-navegador
./build.sh
```

Instruções completas em `extensao-navegador/README.md`.

<!-- ## Exemplos da Terceira Entrega:

 Diagrama de Fachada:

<p align="center">
  <img src="images/fachada.png" alt="Diagrama de Fachada" />
</p>

Diagrama de Estratégia:

<p align="center">
  <img src="images/strategy.png" alt="Diagrama de estratégia" />
</p> -->

# Passo a passo para executar nossa aplicação:

- Para visualizar o pages localmente após clonar o repositório e entrar na pasta, o comando é:

`mkdocs serve`

- **Pra ver nossos testes todos passando, primeiro é necessário estar com o servidor web rodando!**

Para iniciar o servidor web é muito simples, basta já ter feito o `npm install` uma vez e será seguro dar o `npm run dev`, com o servidor de pé, basta digitar `npm run test`e o jest será chamado para realizar as baterias de teste.

Essas baterias são importantes para ver a demonstração de alguns padrões escolhidos.

## Demonstração do Widget funcionando:

Nessa versão do projeto foi adicionado uma demonstração ainda em aperfeiçoamento, mas bem interessante de como nossa ferramenta irá funcionar na prática.

Para visualizar basta entrar na pasta `projetocomgofs` e dentro dela rodar os seguintes comandos:

1. `npm install`
2. `npm run dev`
3. acessar o `http://localhost:5173/`.

![demonstraWidget](images/demonstraWidget.png)


## Licença

Este projeto é **open source** e está licenciado sob a **Licença MIT**.

## Histórico de versões

| Versão | Data       | Descrição         | Autor(es)                                           |
| :----: | :--------- | :---------------- | :-------------------------------------------------- |
| `1.0`  | 15/06/2026 | Criação da página | [Felipe Brandim](https://github.com/Felipe-Brandim) |
