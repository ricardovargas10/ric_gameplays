/* Componentes do site: escreva uma vez, use em todas as páginas.
   São custom elements: <ric-topo pagina="jogos"></ric-topo> e <ric-rodape></ric-rodape>.
   Mudou o menu ou um link do rodapé? Mude SÓ aqui. (Sistema do Claude Design.) */

import "./animacoes.js"; // animações valem em todas as páginas

/* ---------- Dados que mais de um componente usa ---------- */
const CANAL = {
  arroba: '@ric_gameplays',
  discord: 'https://discord.gg/4jtUT4HGaC',
  discordChamada: 'Entre para a nossa comunidade',
  twitch: 'https://twitch.tv/ric_gameplays',
  livepix: 'https://livepix.gg/ricgameplays',
  spotify: 'https://open.spotify.com/playlist/2mQninpIxtRe11WPOM6ceH',
  email: 'ricchico.games@gmail.com',
  horario: 'Ao vivo todos os dias às 19h',
  youtube: {
    gameplays: 'https://youtube.com/@ric_gameplays',
    lives: 'https://youtube.com/@ric_lives',
    vlogs: 'https://youtube.com/@o_ricardocarvalho'
  },
  redes: {
    instagram: 'https://instagram.com/ric_gameplays',
    tiktok: 'https://tiktok.com/@ric_gameplays',
    x: 'https://x.com/ric_gameplays',
    threads: 'https://www.threads.com/@ric_gameplays'
  },
  /* patrocinador ativo: { nome, texto, url, imagem }. Vazio = o espaço some do site. */
  patrocinio: null
};

const MENU = [
  { id: 'inicio',     rotulo: 'Início',     href: '/' },
  { id: 'jogos',      rotulo: 'Jogos',      href: '/jogos' },
  { id: 'series',     rotulo: 'Votação',    href: '/series' },
  { id: 'videos',     rotulo: 'Vídeos',     href: '/videos' },
  { id: 'biblioteca', rotulo: 'Biblioteca', href: '/biblioteca' },
  { id: 'sobre',      rotulo: 'Sobre',      href: '/sobre' },
  { id: 'anuncie',    rotulo: 'Anuncie',    href: '/anuncie' }
];

const ICONES = {
  discord: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.865-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.028C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .078-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.041.107c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.029 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.029ZM8.02 15.331c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.956 2.418-2.157 2.418Zm7.975 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.332-.946 2.418-2.157 2.418Z"/></svg>',
  instagram: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/></svg>',
  tiktok: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z"/></svg>',
  x: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>',
  threads: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.85 13.85 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221Z"/></svg>',
  site: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3Z"/></svg>',
  twitch: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 2 2 6.5V20h5v3h3.5l3-3H19l3-3V2H4Zm16 12-2.5 2.5h-5L10 19v-2.5H6V4h14v10Zm-7-7h2v5h-2V7Zm-5 0h2v5H8V7Z"/></svg>',
  youtube: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12s0-3.3-.4-4.9a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.7 2 12 2 12s0 3.3.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8C22 15.3 22 12 22 12ZM10 15.5v-7l6 3.5-6 3.5Z"/></svg>',
  spotify: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.6.6 0 0 1-.9.2c-2.4-1.5-5.4-1.8-8.9-1a.6.6 0 1 1-.3-1.2c3.8-.9 7.1-.5 9.8 1.1.3.2.4.6.3.9Zm1.2-2.7a.8.8 0 0 1-1.1.3c-2.7-1.7-6.9-2.2-10.1-1.2a.8.8 0 1 1-.5-1.5c3.7-1.1 8.3-.6 11.4 1.3.4.2.5.7.3 1.1Zm.1-2.8C14.7 9 9.4 8.8 6.3 9.7a1 1 0 1 1-.6-1.8c3.5-1.1 9.4-.9 13.1 1.3a1 1 0 0 1-1 1.7Z"/></svg>',
  livepix: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.2 5 6.6 5c2 0 3.6 1.1 4.4 2.7h2C13.8 6.1 15.4 5 17.4 5 20.8 5 23 8.3 21.5 11.8 19.5 16.4 12 21 12 21Z"/></svg>',
  sol: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  lua: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg>',
  menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  fechar: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>'
};

/* nome do jogo -> endereço da página dele: "Resident Evil 3" -> "resident-evil-3" */
function slug(nome = '') {
  return nome.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/&/g, ' e ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* ---------- Botão de tema ---------- */
class RicTema extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<button type="button" class="botao-icone" aria-label=""></button>';
    this.botao = this.querySelector('button');
    this.botao.addEventListener('click', () => window.Tema.alternar());
    document.addEventListener('tema:mudou', () => this.pintar());
    this.pintar();
  }
  pintar() {
    const escuro = window.Tema.atual() === 'escuro';
    this.botao.innerHTML = escuro ? ICONES.sol : ICONES.lua;
    const texto = escuro ? 'Mudar para o modo claro' : 'Mudar para o modo escuro';
    this.botao.setAttribute('aria-label', texto);
    this.botao.setAttribute('title', texto);
  }
}

/* ---------- Topo ---------- */
class RicTopo extends HTMLElement {
  connectedCallback() {
    const atual = this.getAttribute('pagina') || '';
    const links = MENU.map(m =>
      `<a href="${m.href}"${m.id === atual ? ' aria-current="page"' : ''}>${m.rotulo}</a>`).join('');
    this.innerHTML = `
      <header class="topo">
        <div class="container">
          <a class="marca" href="/">${CANAL.arroba}</a>
          <nav class="menu" aria-label="Páginas do site">${links}</nav>
          <ric-tema></ric-tema>
          <button type="button" class="botao-icone menu-celular" aria-label="Abrir o menu" aria-expanded="false" aria-controls="menuAberto">${ICONES.menu}</button>
          <a class="botao botao--discord botao--peq" href="${CANAL.discord}" target="_blank" rel="noopener">${ICONES.discord} Discord</a>
          <nav class="menu-aberto" id="menuAberto" aria-label="Páginas do site" hidden>${links}</nav>
        </div>
      </header>`;
    const botao = this.querySelector('.menu-celular');
    const lista = this.querySelector('.menu-aberto');
    botao.addEventListener('click', () => {
      const abrir = lista.hidden;
      lista.hidden = !abrir;
      botao.setAttribute('aria-expanded', String(abrir));
      botao.setAttribute('aria-label', abrir ? 'Fechar o menu' : 'Abrir o menu');
      botao.innerHTML = abrir ? ICONES.fechar : ICONES.menu;
    });
  }
}

/* ---------- Rodapé ---------- */
const COLUNAS = [
  ['Assista ao vivo', [
    ['Twitch · ric_gameplays', CANAL.twitch],
    ['YouTube · @ric_lives', CANAL.youtube.lives]]],
  ['Canais do YouTube', [
    ['Gameplays · @ric_gameplays', CANAL.youtube.gameplays],
    ['Vlogs · @o_ricardocarvalho', CANAL.youtube.vlogs]]],
  ['Redes sociais', [
    ['Instagram · ric_gameplays', CANAL.redes.instagram],
    ['TikTok · @ric_gameplays', CANAL.redes.tiktok],
    ['Twitter/X · ric_gameplays', CANAL.redes.x]]],
  ['Comunidade', [
    ['Discord · Comunidade', CANAL.discord],
    ['LivePix · Apoie o canal', CANAL.livepix],
    ['Spotify · Playlist dos inscritos', CANAL.spotify]]]
];

class RicRodape extends HTMLElement {
  connectedCallback() {
    const colunas = COLUNAS.map(([titulo, itens], i) => `
      <div>
        <h3 class="rotulo" style="margin-bottom: var(--e-4)">${titulo}</h3>
        <ul class="pilha" style="gap: 10px">
          ${itens.map(([rotulo, href]) => `<li><a href="${href}" target="_blank" rel="noopener">${rotulo}</a></li>`).join('')}
        </ul>
        ${i === 0 ? `<p class="selo" style="margin-top: 20px; background: none; border: 0; padding: 0"><span class="ponto"></span>${CANAL.horario}</p>` : ''}
      </div>`).join('');
    this.innerHTML = `
      <footer class="rodape">
        <div class="container">
          <div class="rodape-colunas">${colunas}</div>
          <div class="rodape-base">
            <span>© ${new Date().getFullYear()} Ric Gameplays</span>
            <a href="/anuncie" style="margin-left: auto; color: var(--muted)">Anuncie</a>
            <a href="/sobre" style="color: var(--muted)">Sobre</a>
            <a href="/links" style="color: var(--muted)">Links</a>
          </div>
        </div>
      </footer>`;
  }
}

/* ---------- Faixa do Discord ---------- */
class RicDiscord extends HTMLElement {
  connectedCallback() {
    const texto = this.getAttribute('texto') ||
      'Avisos de live, sugestão de jogos, os servidores de Hytale e a galera do chat fora do horário.';
    this.innerHTML = `
      <div class="faixa-discord">
        <div style="flex: 999 1 420px; min-width: 0">
          <h2 style="font-size: var(--t-d2); margin-bottom: 10px">${CANAL.discordChamada}</h2>
          <p>${texto}</p>
        </div>
        <a class="botao botao--claro" href="${CANAL.discord}" target="_blank" rel="noopener">${ICONES.discord} ${CANAL.discordChamada}</a>
      </div>`;
  }
}

/* ---------- Espaço de patrocínio (só aparece com patrocinador ativo em CANAL.patrocinio) ---------- */
class RicPatrocinio extends HTMLElement {
  connectedCallback() {
    const p = CANAL.patrocinio;
    if (!p) { this.closest('.secao-patrocinio')?.remove(); this.remove(); return; }
    this.innerHTML = `
      <div class="patrocinio">
        <span class="patrocinio-selo">Patrocínio</span>
        ${p.imagem ? `<img src="${esc(p.imagem)}" alt="" class="patrocinio-img">` : ''}
        <div style="flex: 999 1 380px; min-width: 0">
          <p class="patrocinio-nome">${esc(p.nome)}</p>
          ${p.texto ? `<p style="color: var(--muted)">${esc(p.texto)}</p>` : ''}
        </div>
        <a class="botao botao--secundario botao--peq" href="${esc(p.url)}" target="_blank" rel="noopener sponsored">Conhecer</a>
      </div>`;
  }
}

/* ---------- Cartão de jogo (recebe os dados da API) ---------- */
class RicCardJogo extends HTMLElement {
  static monta(jogo) {
    const el = document.createElement('ric-card-jogo');
    el.dados = jogo;
    return el;
  }
  connectedCallback() {
    const j = this.dados || {};
    this.innerHTML = `
      <a class="cartao cartao--limpo cartao-link" href="/jogos/${j.slug || slug(j.nome)}">
        <span class="capa" style="border: 0; border-radius: 0">${j.capa ? `<img src="${esc(j.capa)}" alt="" loading="lazy">` : `<span class="capa-reserva">${esc(j.nome)}</span>`}</span>
        <span style="display: block; padding: var(--e-5)">
          ${j.status ? `<span class="pilula pilula--destaque">${esc(j.status)}</span>` : ''}
          <h3 style="font-size: var(--t-d3); margin: var(--e-3) 0 6px">${esc(j.nome)}</h3>
          <span style="display: block; font-size: var(--t-peq); color: var(--muted)">${esc(j.meta)}</span>
        </span>
      </a>`;
  }
}

/* ---------- Barra de votos ---------- */
class RicBarra extends HTMLElement {
  static get observedAttributes() { return ['pct', 'lider']; }
  connectedCallback() { this.pintar(); }
  attributeChangedCallback() { if (this.isConnected) this.pintar(); }
  pintar() {
    const pct = Math.max(0, Math.min(100, Number(this.getAttribute('pct') || 0)));
    const lider = this.hasAttribute('lider');
    let barra = this.querySelector('.barra');
    if (!barra) {
      this.innerHTML = '<span class="barra" style="display: block"><i></i></span>';
      barra = this.querySelector('.barra');
      requestAnimationFrame(() => { barra.firstChild.style.width = pct + '%'; }); // a barra cresce ao aparecer
    } else {
      barra.firstChild.style.width = pct + '%';
    }
    barra.classList.toggle('barra--lider', lider);
  }
}

customElements.define('ric-tema', RicTema);
customElements.define('ric-topo', RicTopo);
customElements.define('ric-rodape', RicRodape);
customElements.define('ric-discord', RicDiscord);
customElements.define('ric-patrocinio', RicPatrocinio);
customElements.define('ric-card-jogo', RicCardJogo);
customElements.define('ric-barra', RicBarra);

export { CANAL, MENU, ICONES, slug, esc };
