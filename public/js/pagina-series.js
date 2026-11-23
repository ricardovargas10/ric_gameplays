// Votação (/series): placar ao vivo, quem está na frente e os últimos votos.
// Mantém a roleta do painel de votação: no voto novo, o número mostra o nome de quem votou e depois o total.
import { conectar, ordenar, porcentagemMeta } from "./ao-vivo.js";
import { esc } from "./componentes.js";
import { contar, antesDeReordenar } from "./animacoes.js";
import { Roleta } from "./roleta.js";

const $ = id => document.getElementById(id);
const linhas = new Map(); // id do jogo -> { el, roleta }

function img(url, nome, cls = "") {
  return url ? `<img src="${esc(url)}" alt="" loading="lazy" class="${cls}">` : `<span class="capa-reserva">${esc(nome)}</span>`;
}

/* ---------- placar ---------- */
function desenharRanking(opcoes) {
  const box = $("ranking");
  const ordem = ordenar(opcoes);
  if (!ordem.length) { box.innerHTML = `<li class="ranking-vazio">Nenhuma série na votação agora.</li>`; linhas.clear(); return ordem; }
  if (!linhas.size) box.innerHTML = "";
  const deslizar = antesDeReordenar(box);
  const ids = new Set(ordem.map(j => j.id));
  for (const [id, l] of linhas) if (!ids.has(id)) { l.el.remove(); linhas.delete(id); }

  ordem.forEach((j, i) => {
    let l = linhas.get(j.id);
    if (!l) {
      const el = document.createElement("li");
      el.className = "rank";
      el.innerHTML = `
        <span class="rank-pos"></span>
        <span class="capa rank-capa"></span>
        <div class="rank-meio">
          <span class="rank-nome"></span>
          <span class="rank-trilho"><i></i></span>
          <span class="rank-fila" hidden></span>
        </div>
        <div class="rank-votos">
          <span class="rank-numero"></span>
          <span class="rank-pct"><span class="n"></span>% da meta</span>
        </div>`;
      l = { el, roleta: new Roleta(el.querySelector(".rank-numero")) };
      linhas.set(j.id, l);
    }
    const { el } = l;
    const pct = porcentagemMeta(j);
    const lider = i === 0 && j.votos > 0;
    el.classList.toggle("rank--lider", lider);
    el.classList.toggle("rank--batida", j.ordemMeta != null);
    el.querySelector(".rank-pos").textContent = i + 1;
    el.querySelector(".rank-nome").textContent = j.nome;
    const capa = el.querySelector(".rank-capa");
    if (capa.dataset.url !== (j.capa || "")) { capa.dataset.url = j.capa || ""; capa.innerHTML = img(j.capa, j.nome); }
    el.querySelector(".rank-trilho i").style.width = pct + "%";
    contar(el.querySelector(".rank-pct .n"), pct);
    l.roleta.definir(j.votos);
    const fila = el.querySelector(".rank-fila");
    fila.hidden = j.ordemMeta == null;
    if (j.ordemMeta != null) fila.textContent = `Meta batida · ${j.ordemMeta + 1}º da fila`;
    box.appendChild(el);
  });
  deslizar();
  return ordem;
}

/* ---------- quem está na frente ---------- */
function desenharLider(ordem) {
  const [a, b] = ordem;
  const capa = $("liderCapa");
  if (!a || !a.votos) {
    $("liderNome").textContent = "Nenhum voto ainda";
    $("liderInfo").textContent = "O primeiro voto abre a corrida.";
    capa.innerHTML = `<span class="capa-reserva">Nenhum voto ainda</span>`; capa.dataset.url = "";
    return;
  }
  const url = a.fundo || a.capa || "";
  if (capa.dataset.url !== url) { capa.dataset.url = url; capa.innerHTML = img(url, a.nome); }
  $("liderRotulo").textContent = a.ordemMeta != null ? "Meta batida · próxima da fila" : "Na frente";
  $("liderNome").textContent = a.nome;
  const frente = b ? a.votos - b.votos : a.votos;
  $("liderInfo").textContent = `${a.votos} de ${a.metaVotos} votos da meta (${porcentagemMeta(a)}%)` + (b ? ` · ${frente} à frente da segunda` : "");
}

/* ---------- últimos votos: nome, jogo e quantos votos a pessoa deu ---------- */
let recentes = [];
let assinaturaFeed = "";
function agrupar(lista) {
  const grupos = [];
  for (const u of lista) {
    const g = grupos.find(x => x.quem === u.quem && x.jogoId === u.jogoId);
    if (g) { g.conta++; g.n = Math.max(g.n || 0, u.n || 0); } else grupos.push({ ...u, conta: 1 });
  }
  return grupos.map(g => ({ ...g, total: Math.max(g.n || 0, g.conta) }));
}
function desenharFeed(destacar) {
  const grupos = agrupar(recentes).slice(0, 6);
  const assinatura = JSON.stringify(grupos.map(g => [g.quem, g.jogoId, g.total]));
  if (!destacar && assinatura === assinaturaFeed) return;
  assinaturaFeed = assinatura;
  $("feed").innerHTML = grupos.length ? grupos.map(g => `
    <li class="${destacar && g.quem === destacar.quem && g.jogoId === destacar.jogoId ? "feed--novo" : ""}">
      <span class="feed-inicial">${esc((g.quem || "?").slice(0, 1).toUpperCase())}</span>
      <span class="feed-texto"><b>${esc(g.quem)}</b> votou em <b>${esc(g.jogo)}</b></span>
      <span class="chip-n">${g.total} ${g.total === 1 ? "voto" : "votos"}</span>
    </li>`).join("") : `<li class="feed-vazio">Os votos aparecem aqui na hora.</li>`;
}

conectar({
  aoEstado: s => {
    const ordem = desenharRanking(s.opcoes || []);
    desenharLider(ordem);
    contar($("total"), s.total || 0);
    if (ordem[0]?.metaVotos) document.querySelectorAll(".meta-votos").forEach(e => { e.textContent = ordem[0].metaVotos; });
    if (s.custo) document.querySelectorAll(".custo-voto").forEach(e => { e.textContent = s.custo; });
    recentes = (s.ultimos || []).slice();
    desenharFeed();
  },
  // voto novo: o número da série vira o nome de quem votou (roleta) e a pessoa sobe no feed
  aoVoto: v => {
    if ((v.lista || "principal") !== "principal") return;
    linhas.get(v.jogoId)?.roleta.votar(v.quem, v.votos);
    recentes = [{ quem: v.quem, jogoId: v.jogoId, jogo: v.jogo, n: v.n, t: v.t }, ...recentes.filter(u => u.t !== v.t)].slice(0, 30);
    desenharFeed(v);
  }
});
