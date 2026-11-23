// Peças de dados que várias páginas usam: vídeos do YouTube, datas, capas, status do jogo e últimos votos.
import { esc, slug } from "./componentes.js";

/* "há 3 dias" */
export function quando(iso) {
  const d = (Date.now() - new Date(iso)) / 86400000;
  if (!(d >= 0)) return "";
  if (d < 1) return "hoje";
  if (d < 2) return "ontem";
  if (d < 30) return `há ${Math.floor(d)} dias`;
  const m = Math.floor(d / 30);
  return m < 12 ? `há ${m} ${m === 1 ? "mês" : "meses"}` : `há ${Math.floor(m / 12)} ${m < 24 ? "ano" : "anos"}`;
}

/* vídeos longos de um canal (gameplays, lives ou vlogs), pela Hostinger; guardados na página por 5 min */
const cacheVideos = {};
export async function videos(canal = "gameplays") {
  if (!cacheVideos[canal]) cacheVideos[canal] = fetch(`/api/videos.php?canal=${canal}`).then(r => (r.ok ? r.json() : [])).catch(() => []);
  return cacheVideos[canal];
}
export function cartaoVideo(v) {
  return `
    <a class="video" href="${esc(v.url)}" target="_blank" rel="noopener">
      <span class="capa"><img src="${esc(v.thumb)}" alt="" loading="lazy"></span>
      <h3>${esc(v.titulo)}</h3>
      <p>${quando(v.data)}</p>
    </a>`;
}

/* capa com reserva: mostra o nome enquanto carrega ou se a imagem falhar */
export function capaHTML(url, nome, { vertical = false, reserva = "" } = {}) {
  const r = reserva && reserva !== url ? ` data-reserva="${esc(reserva)}"` : "";
  return `<span class="capa${vertical ? " capa--vertical" : ""}"><span class="capa-reserva">${esc(nome)}</span>${url ? `<img src="${esc(url)}" alt="" loading="lazy"${r}>` : ""}</span>`;
}
/* imagem que falha: tenta a reserva; sem reserva, fica o nome do jogo */
document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName !== "IMG") return;
  if (img.dataset.reserva) { img.src = img.dataset.reserva; delete img.dataset.reserva; } else img.remove();
}, true);

/* capa 16:9 do jogo com nome e modo (Início, Jogos, página do jogo, telão) */
export function capaJogo(j) {
  return `
    <a class="capa-jogo" href="/jogos/${slug(j.nome)}">
      ${capaHTML(j.capa || j.capaVertical, j.nome)}
      <strong>${esc(j.nome)}</strong>
      <span>${esc(j.tipo || "")}</span>
    </a>`;
}

/* frequentes: os "Frequente" antes dos "De vez em quando" */
export const ordenarFrequentes = lista => [...lista].sort((a, b) => (b.frequencia === "Frequente") - (a.frequencia === "Frequente"));

/* o que o jogo é no canal, em uma frase */
export function statusNoCanal(j) {
  if (j.frequente) return j.frequencia === "Frequente"
    ? "Frequente, jogado toda semana nas lives. Não entra na votação das séries."
    : "Jogado de vez em quando nas lives, sem entrar na votação das séries.";
  if (j.status === "Jogando") return "Em andamento: é uma das séries sendo jogadas agora nas lives.";
  if (j.ordemMeta != null) return `Bateu a meta da votação e é a ${j.ordemMeta + 1}ª da fila.`;
  if (j.opcao) return `Na votação: ${j.votos} de ${j.metaVotos} votos da meta. Resgate "Série: ${j.nome}" com RicPoints na Twitch.`;
  if (j.status === "Feito") return "Zerado no canal: a série chegou ao fim.";
  if (j.status === "Pausado") return "Pausado por enquanto. Pode voltar.";
  if (j.status === "Joguei no off") return "Jogado fora das lives.";
  return "Na lista de jogos do canal.";
}
export function pilulaStatus(j) {
  if (j.frequente) return j.frequencia === "Frequente" ? "Frequente" : "De vez em quando";
  if (j.status === "Jogando") return "Jogando";
  if (j.ordemMeta != null) return "Na fila";
  if (j.opcao) return "Na votação";
  if (j.status === "Feito") return "Zerado";
  if (j.status === "Pausado") return "Pausado";
  return null;
}

/* últimos votos: votos seguidos da mesma pessoa no mesmo jogo viram um item só, com a quantidade */
export function agruparVotos(lista) {
  const grupos = [];
  for (const u of lista) {
    const g = grupos.find(x => x.quem === u.quem && x.jogoId === u.jogoId);
    if (g) { g.conta++; g.n = Math.max(g.n || 0, u.n || 0); } else grupos.push({ ...u, conta: 1 });
  }
  return grupos.map(g => ({ ...g, total: Math.max(g.n || 0, g.conta) }));
}
export const textoVotos = n => `${n} ${n === 1 ? "voto" : "votos"}`;

/* servidores de Hytale em que o Ric joga (endereço: preencher quando tiver) */
export const SERVIDORES_HYTALE = [
  { nome: "O Condado", texto: "O servidor da comunidade, onde as lives de Hytale acontecem.", endereco: null },
  { nome: "Hytale Roleplay", texto: "Servidor de interpretação, com personagem e história própria.", endereco: null }
];
export function servidoresHTML(grande = false) {
  return SERVIDORES_HYTALE.map(s => `
    <div class="servidor${grande ? " servidor--grande" : ""}">
      <p class="servidor-nome">${esc(s.nome)}</p>
      ${grande ? `<p class="servidor-texto">${esc(s.texto)}</p>` : ""}
      <p class="servidor-endereco">Endereço: ${s.endereco ? `<code>${esc(s.endereco)}</code> <button type="button" class="copiar" data-copiar="${esc(s.endereco)}">Copiar</button>` : "<span>em breve</span>"}</p>
    </div>`).join("");
}
document.addEventListener("click", e => {
  const b = e.target.closest?.("[data-copiar]");
  if (!b) return;
  navigator.clipboard?.writeText(b.dataset.copiar).then(() => { b.textContent = "Copiado"; setTimeout(() => (b.textContent = "Copiar"), 1600); });
});
