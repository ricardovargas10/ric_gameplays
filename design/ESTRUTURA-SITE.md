# Site do Ric Gameplays: estrutura para o Claude Design

Este documento diz **o que** o site tem e **de onde vem cada dado**. O visual é todo do Claude Design.
O site é estático (HTML, CSS e JS) e roda na Hostinger, que só tem PHP. Os dados ao vivo vêm de `/api/placar.php`, atualizado pelo PC do Ric.

## Regras que valem para o site inteiro

- **Discord em destaque.** Chamada sempre "Entre para a nossa comunidade", link https://discord.gg/4jtUT4HGaC. Aparece no topo, no rodapé e no fim das páginas principais.
- **Live todos os dias às 19h**, na Twitch (twitch.tv/ric_gameplays) e no YouTube (youtube.com/@ric_lives). A Kick não aparece.
- **Votação sem roxo.** Positivo (meta batida, subiu) em verde, negativo em vermelho.
- **Patrocínio separado da Temeron.** Os espaços de patrocinador levam o selo "Patrocínio". A Temeron aparece só como "meu estúdio" na página Sobre, nunca como patrocinadora.
- **Moeda do canal:** RicPoints (pontos do canal na Twitch).
- **Celular primeiro.** Muita gente abre pelo link do chat.

## Mapa do site

| Página | Endereço | Para quê |
|---|---|---|
| Início | `/` | Apresentar o canal, levar para a live, o Discord e a votação |
| Jogos | `/jogos` | Tudo o que o Ric joga: agora, na fila, na votação, frequentes, já zerados |
| Página do jogo | `/jogos/<nome-do-jogo>` | Uma por jogo, para aparecer no Google |
| Votação | `/series` | Placar ao vivo da próxima série |
| Telão | `/telao` | Tela 1920x1080 que vai para a live (o Ric transmite o site) |
| Biblioteca | `/biblioteca` | Todos os jogos da lista, com filtros |
| Vídeos | `/videos` | Vídeos dos canais do YouTube |
| Links | `/links` | Página de links da bio (substitui ric-gameplays-link-bio.vercel.app) |
| Sobre | `/sobre` | Quem é o Ric, setup, horário |
| Apoie | `/apoie` | LivePix e formas de ajudar o canal |
| Anuncie | `/anuncie` | Para marcas: contato e mídia kit |

## Página a página

### Início `/`
1. Topo: nome, foto do Ric, selo "Ao vivo todos os dias às 19h" e botões Twitch e YouTube.
2. Botão grande do Discord: "Entre para a nossa comunidade".
3. Jogando agora: as séries com Status "Jogando".
4. Votação: quem está na frente e o link para `/series`.
5. Frequentes: os jogos de sempre.
6. Espaço de patrocínio (só aparece se houver patrocinador).
7. Rodapé.

### Jogos `/jogos`
Seções nesta ordem:
- **Jogando agora:** Status "Jogando", tirando os frequentes.
- **Na fila:** séries que bateram a meta, na ordem em que bateram (campo `ordemMeta`). A posição não muda mais.
- **Votação:** as séries com "Na votação?" marcado, com votos e % da meta.
- **Frequentes:** Categoria "Frequente" ou "De vez em quando". Dentro dela fica o bloco **Jogue comigo**, com os servidores de Hytale em que o Ric joga: **O Condado** e **Hytale Roleplay** (falta o endereço de cada um).
- **Já zerados:** Status "Feito".
- **Pausados:** Status "Pausado" (hoje, Green Hell).

### Página do jogo `/jogos/<nome>`
Fundo, capa, nome, sinopse, gêneros, lançamento, desenvolvedora, botão da loja, status no canal (jogando, zerado, na votação, frequente) e, quando houver, os vídeos daquele jogo. Hytale ganha página mais completa: é a aposta de busca do canal.

### Votação `/series`
Já existe e funciona. Mostra a série em andamento, o placar ao vivo com % da meta e quem votou por último. Cada série tem a mesma meta (hoje 40 votos de 250 RicPoints); quem bate a meta trava a posição e entra na fila. Para votar: resgatar "Série: nome da série" com RicPoints na Twitch.

### Telão `/telao`
Já existe. É a tela que vai para a live, em 1920x1080 fixo: placar grande, roleta com o nome de quem votou e vitrine dos frequentes (`/telao?lista=frequentes`). Precisa caber sem rolar.

### Biblioteca `/biblioteca`
Já existe. Tabela com Jogo, Gêneros, Lançamento, Já tem, Na votação. Filtros: Todos, Séries na votação, Frequentes, Já tem, Não tem.

### Vídeos `/videos`
Últimos vídeos de cada canal do YouTube: Gameplays (@ric_gameplays), Lives (@ric_lives) e Vlogs (@o_ricardocarvalho). Os dados ainda não existem: dá para puxar pelo feed público de cada canal, sem chave.

### Links `/links`
Uma coluna de botões, para celular. Ordem: Discord, Twitch, YouTube Lives, YouTube Gameplays, TikTok, Instagram, Twitter/X, YouTube Vlogs, LivePix, Playlist dos inscritos (Spotify), Site.

### Sobre `/sobre`
Quem é o Ric, o horário (todo dia às 19h), o setup e a Temeron como "meu estúdio".
Setup: PC Pichau Perséfone III (i5-14400F, RTX 3050 6GB, 32GB DDR4, SSD 512GB + 1TB), monitor AOC Agon G50 27" 144Hz, Samsung 27" CF390 curvo, portátil REHISK 15.6" na vertical, Stream Deck Ulanzi D200, microfone Fifine AM8 com braço Knup, teclado Aula Wind FZ058, mouse Havit MS1001S V2, webcam Emeet C60e 4K, fone QCY H3.

### Apoie `/apoie`
LivePix (https://livepix.gg/ricgameplays), como ganhar e usar RicPoints, Discord.

### Anuncie `/anuncie`
Para marcas. Formatos (falta definir), números do canal (falta definir), contato: ricchico.games@gmail.com. Separado da Temeron.

## Rodapé (todas as páginas)
- Assista ao vivo: Twitch ric_gameplays, YouTube @ric_lives.
- Redes sociais: Instagram ric_gameplays, TikTok @ric_gameplays, Twitter/X ric_gameplays.
- Canais do YouTube: Gameplays @ric_gameplays, Vlogs @o_ricardocarvalho.
- Comunidade: Discord "Entre para a nossa comunidade", LivePix "Apoie o canal", Spotify "Playlist dos inscritos".
- "Ao vivo todos os dias às 19h".

## Dados que o site já recebe (`/api/placar.php`)

```
{ placar: {
    opcoes:       [jogo...]   séries na votação
    frequentes:   [jogo...]
    jogandoAgora: [jogo...]
    total:        votos somados
    ultimos:      [{ quem, jogo, jogoId, t }]   últimos votos
    aoVivo:       true/false
  },
  biblioteca: [jogo...],      todos os jogos do Notion
  atualizado: hora em ms }
```

Cada `jogo` traz: `nome, status, frequente, opcao (na votação), votos, metaVotos, ordemMeta (posição na fila), capa, capaVertical, fundo, sinopse, generos, lancamento, desenvolvedora, lojaUrl, lojaNome, tipo (modo: Solo, Coop, Competitivo, Survival), plataforma, adquirido`.
Status possíveis: Pensando, Quero jogar, Jogando, Pausado, Joguei no off, Feito.

## Falta decidir ou conseguir
- Endereço dos servidores de Hytale O Condado e Hytale Roleplay.
- Formatos e números da página Anuncie.
- Domínio próprio (o Ric compra; até lá o site fica em lives.temeron.com.br).
- Para depois: aviso de "ao vivo agora" de verdade (hoje `aoVivo` só diz se o PC está conectado à Twitch), último vídeo e número de inscritos.
