// Início: últimos vídeos, placar da votação ao vivo e os jogos de sempre.
// Os dados vêm de ao-vivo.js (no PC, direto do servidor de votos; no site, de /api/placar.php).
import { conectar } from "./ao-vivo.js";
import { ICONES, esc } from "./componentes.js";
import { videos, cartaoVideo, capaJogo, ordenarFrequentes, agruparVotos, textoVotos } from "./util.js";
import { desenharBarras } from "./barras.js";

const $ = id => document.getElementById(id);

// ícones nos botões (o HTML fica limpo; o desenho mora em componentes.js)
$("btnTwitch").insertAdjacentHTML("afterbegin", ICONES.twitch);
$("btnYt").insertAdjacentHTML("afterbegin", ICONES.youtube);
$("btnSpotify").insertAdjacentHTML("afterbegin", ICONES.spotify);
$("btnDiscord").insertAdjacentHTML("afterbegin", ICONES.discord);
$("btnLivepix").insertAdjacentHTML("afterbegin", ICONES.livepix);

/* ---------- Últimos vídeos ---------- */
videos("gameplays").then(lista => {
  $("videos").innerHTML = lista.length
    ? lista.slice(0, 3).map(cartaoVideo).join("")
    : `<p style="color: var(--muted)">Os vídeos não carregaram agora. <a href="https://youtube.com/@ric_gameplays" target="_blank" rel="noopener">Ver no YouTube</a></p>`;
});

/* ---------- Últimos votos: nome, jogo e quantos votos a pessoa deu ---------- */
let recentes = [];
let assinaturaUltimos = "";
function desenharUltimos(destacar) {
  const grupos = agruparVotos(recentes).slice(0, 6);
  // o placar chega logo depois do voto: se nada mudou, não redesenha (a pílula acesa continua acesa)
  const assinatura = JSON.stringify(grupos.map(g => [g.quem, g.jogoId, g.total]));
  if (!destacar && assinatura === assinaturaUltimos) return;
  assinaturaUltimos = assinatura;
  $("ultimosBox").hidden = !grupos.length;
  $("ultimos").innerHTML = grupos.map(g => `
    <span class="chip${destacar && g.quem === destacar.quem && g.jogoId === destacar.jogoId ? " chip--novo" : ""}">
      <b>${esc(g.quem)}</b><span style="color: var(--muted)">${esc(g.jogo)}</span><span class="chip-n">${textoVotos(g.total)}</span>
    </span>`).join("");
}

/* ---------- Os jogos de sempre ---------- */
let assinaturaFreq = "";
function desenharFrequentes(lista = []) {
  const ordem = ordenarFrequentes(lista).slice(0, 4); // uma linha de capas 16:9
  const assinatura = JSON.stringify(ordem.map(j => [j.id, j.capaVertical, j.capa]));
  if (assinatura === assinaturaFreq) return;
  assinaturaFreq = assinatura;
  $("frequentes").innerHTML = ordem.map(capaJogo).join("");
}

conectar({
  aoEstado: s => {
    const ordem = desenharBarras($("votacao"), s.opcoes || []);
    if (ordem[0]?.metaVotos) document.querySelectorAll(".meta-votos").forEach(e => { e.textContent = ordem[0].metaVotos; });
    recentes = (s.ultimos || []).slice();
    desenharUltimos();
    desenharFrequentes(s.frequentes);
  },
  // voto novo: a pílula da pessoa sobe para a frente e acende
  aoVoto: v => {
    if ((v.lista || "principal") !== "principal") return;
    recentes = [{ quem: v.quem, jogoId: v.jogoId, jogo: v.jogo, n: v.n, t: v.t }, ...recentes.filter(u => u.t !== v.t)].slice(0, 30);
    desenharUltimos(v);
  }
});
