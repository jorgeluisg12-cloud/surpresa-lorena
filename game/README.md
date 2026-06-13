# De Parauapebas até Você ❤️

Mini game romântico em HTML5 Canvas + JavaScript puro (sem frameworks),
pronto para publicar no GitHub Pages.

## Como jogar

Abra `index.html` em qualquer navegador (celular ou desktop). Use:

- **◀ / ▶** — pequenos ajustes de posição/velocidade
- **⤴ (Pular)** — pula (e é usado para encontrar os corações escondidos)
- No teclado: setas ← →, espaço/↑ para pular

A jornada percorre 5 capítulos (Parauapebas → A Estrada → A Distância →
Quase Lá → Marabá), com corações, memórias, easter eggs e conquistas,
terminando no reencontro com o Jorge.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub.
2. Envie todos os arquivos desta pasta (mantendo a estrutura `assets/`).
3. Em **Settings → Pages**, selecione a branch `main` e a pasta raiz `/`.
4. Acesse a URL gerada — funciona direto no navegador do celular.

## Como personalizar tudo (sem tocar no código do jogo)

Todo o conteúdo está em **`config.js`**:

- Textos de introdução, mensagens dos corações e dos capítulos
- As 4 memórias (título + texto) do Capítulo 4
- As conquistas
- A posição dos 5 corações escondidos (easter eggs)
- O nome do arquivo de música final
- Caminhos das imagens (sprites) opcionais

## Adicionando sua própria arte (opcional)

Por padrão, Lorena e Jorge são desenhados automaticamente em pixel art
diretamente no `script.js` (não precisa de nenhuma imagem para o jogo
funcionar).

Se quiser usar sua própria arte, basta colocar arquivos PNG com fundo
transparente nestes caminhos (os mesmos definidos em `config.js`):

```
assets/sprites/lorena_idle.png
assets/sprites/lorena_run1.png
assets/sprites/lorena_run2.png
assets/sprites/lorena_jump.png
assets/sprites/lorena_cheer.png
assets/sprites/jorge_idle.png
assets/sprites/jorge_wave.png
```

O jogo detecta automaticamente se a imagem existe e a usa no lugar do
desenho padrão.

## Adicionando a música final

Coloque o arquivo de música ("Partilhar - Rubel", ou qualquer outra
música que preferir) em:

```
assets/audio/musica-final.mp3
```

e ajuste o nome em `CONFIG.music` dentro de `config.js`, se necessário.
O botão "▶ Tocar" aparece na tela final (autoplay é bloqueado pelos
navegadores, por isso o botão).

## Estrutura de arquivos

```
index.html      → estrutura da página e elementos de interface
style.css        → toda a estilização (telas, botões, mensagens)
config.js        → TODO o conteúdo editável (textos, memórias, etc.)
script.js        → lógica do jogo (motor, física, renderização)
assets/
  sprites/        → (opcional) imagens dos personagens
  backgrounds/     → (opcional) imagens de fundo
  icons/           → (opcional) ícones
  audio/           → música do reencontro final
```

Feito com carinho. ❤️
