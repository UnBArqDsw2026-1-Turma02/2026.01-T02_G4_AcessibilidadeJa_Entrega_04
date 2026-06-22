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

[![Assistir ao tutorial no YouTube](https://img.youtube.com/vi/nl5nr8r-ESI/0.jpg)](https://www.youtube.com/watch?v=nl5nr8r-ESI)

> Clique na imagem acima ou acesse: <https://www.youtube.com/watch?v=nl5nr8r-ESI>

## Usando como extensão de navegador

Além de poder ser embutido em um site via `<script>`, o **Acessibilidade Já** também pode ser instalado como **extensão de navegador** (Manifest V3), funcionando em **qualquer site** que você visitar, sem alterar o código das páginas. Compatível com navegadores baseados em Chromium (Chrome, Edge, Brave, Opera, Vivaldi).

**Instalar (modo desenvolvedor):**

1. Abra `chrome://extensions` (no Edge: `edge://extensions`).
2. Ative o **Modo do desenvolvedor**.
3. Clique em **Carregar sem compactação** e selecione a pasta `extensao-navegador/`.
4. Abra um site comum: o botão flutuante aparece no canto inferior direito; o ícone da extensão abre o popup (ativar/desativar, abrir menu, restaurar).

Para gerar o pacote `.zip` (distribuir ou publicar na loja): `cd extensao-navegador && ./build.sh`. Detalhes completos em [`extensao-navegador/README.md`](extensao-navegador/README.md).

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

![demonstraWidget](/docs/images/demonstraWidget.png)


## Licença

Este projeto é **open source** e está licenciado sob a **Licença MIT**.

