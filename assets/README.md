# Assets necessários — pasta /assets

Este site referencia os arquivos abaixo. Substitua os placeholders pelos arquivos reais antes de publicar.

## Áudio

| Arquivo | Descrição | Obrigatório? |
|---|---|---|
| `partilhar-rubel.mp3` | Música "Partilhar" — Rubel. Trilha principal, tocada via botão flutuante. | ★ Sim |
| `sfx-flip.mp3` | Som curto de "virar papel" — toca ao virar uma flashcard. | Opcional (silencioso se ausente) |
| `sfx-chime.mp3` | Som suave de "sino"/confirmação — toca ao escolher um portal. | Opcional |
| `sfx-unlock.mp3` | Som de "destravar" — toca ao abrir o cofre com sucesso. | Opcional |
| `voice-secret.mp3` | Áudio de voz gravado por Jorge — referência para o Easter Egg "A Voz" (não está conectado a um gatilho específico no JS atual; pode ser adicionado a um trecho do Capítulo III via toque prolongado). | Opcional |

## Vídeo

| Arquivo | Descrição | Obrigatório? |
|---|---|---|
| `vault-video.mp4` | Vídeo/mensagem gravada por Jorge — exibido dentro do Cofre (Tela 8) após a senha correta. | ★ Sim para a experiência completa |
| `vault-poster.jpg` | Imagem de capa (poster) do vídeo do cofre, exibida antes do play. *(placeholder já incluído)* | Recomendado |

## Imagens — Galeria

| Arquivo | Descrição / contexto sugerido | Obrigatório? |
|---|---|---|
| `foto-1.jpg` | Foto principal do casal (formato paisagem, aparece em destaque — ocupa 2 colunas). *(placeholder já incluído)* | ★ Sim |
| `foto-2.jpg` | Segunda foto do casal (quadrada). *(placeholder já incluído)* | Sim |
| `foto-3.jpg` | Foto que Jorge mais gosta de Lorena (quadrada). *(placeholder já incluído)* | Sim |
| `foto-4.jpg` | Foto de um lugar especial — sugestão: Imperatriz. *(placeholder já incluído)* | Sim |

> Os placeholders atuais são imagens neutras com a legenda do nome do arquivo, apenas para que a página renderize corretamente durante o teste. Substitua por fotos reais — recomenda-se 1200×750px (foto-1) e 900×900px (foto-2 a foto-4), formato JPG, otimizadas para web (< 300KB cada).

## Onde editar legendas e textos

- Legendas da galeria: `script.js` → constante `GALLERY`
- Senha do cofre: `script.js` → constante `VAULT_PASSWORDS` (já aceita "partilhar" e "te amo", case-insensitive)
- Todos os textos narrativos: diretamente em `index.html`
- Flashcards, quiz, 23 motivos, linha do tempo: `script.js` (constantes no topo do arquivo)

## Checklist de publicação

- [ ] Substituir `foto-1.jpg` a `foto-4.jpg` por fotos reais
- [ ] Adicionar `partilhar-rubel.mp3` (trilha principal — essencial para a experiência)
- [ ] Gravar e adicionar `vault-video.mp4` (conteúdo do Cofre)
- [ ] Gerar `vault-poster.jpg` real a partir de um frame do vídeo
- [ ] (Opcional) Adicionar sons de interface: `sfx-flip.mp3`, `sfx-chime.mp3`, `sfx-unlock.mp3`
- [ ] Testar em iPhone/Android real — autoplay de música depende de gesto do usuário (já tratado no código)
- [ ] Conceder permissão de câmera ao testar o Easter Egg "e você?" (tela final)
