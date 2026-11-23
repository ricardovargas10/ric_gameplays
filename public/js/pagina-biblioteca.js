// Biblioteca (/biblioteca): busca, filtros e ordenação de todos os jogos do Notion.
// No computador é uma tabela; no celular a mesma lista vira cartões.
import { conectar } from "./ao-vivo.js";
import { esc, slug } from "./componentes.js";
import { capaHTML } from "./util.js";

const $ = id => document.getElementById(id);
const jaTem = j => j.adquirido === "Sim" || j.adquirido === "Família Steam";
const anoDe = j => Number(String(j.lancamento || "").match(/\d{4}/)?.[0]) || null;
const FILTROS = {
  "Todos": () => true,
  "Séries na votação": j => !!j.opcao,
  "Frequentes": j => !!j.frequente,
  "Já tem": jaTem,
  "Não tem": j => !jaTem(j)
};
const estado = { busca: "", filtro: "Todos", genero: null, ordem: "nome", dir: 1, jogos: [], ranking: [] };
const pilula = (sim, destaque) => `<span class="pilula${sim && destaque ? " pilula--destaque" : ""}">${sim ? "Sim" : "Não"}</span>`;

function montarFiltros() {
  $("filtros").innerHTML = Object.keys(FILTROS).map(f => `<button type="button" class="filtro" aria-pressed="${estado.filtro === f}">${f}</button>`).join("");
}
$("filtros").addEventListener("click", e => {
  const b = e.target.closest(".filtro");
  if (!b) return;
  estado.filtro = b.textContent;
  montarFiltros();
  desenhar();
});
// gêneros (da Twitch), do que mais aparece na lista para o que menos aparece
function rankingGeneros(jogos) {
  const conta = new Map();
  jogos.forEach(j => (j.generos || []).forEach(g => conta.set(g, (conta.get(g) || 0) + 1)));
  return [...conta].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
function montarGeneros() {
  $("generos").innerHTML = estado.ranking.slice(0, 12).map(([g, n]) =>
    `<button type="button" class="filtro" data-genero="${esc(g)}" aria-pressed="${estado.genero === g}">${esc(g)}<small>${n}</small></button>`).join("");
}
$("generos").addEventListener("click", e => {
  const b = e.target.closest(".filtro");
  if (!b) return;
  estado.genero = estado.genero === b.dataset.genero ? null : b.dataset.genero;
  montarGeneros();
  desenhar();
});
const generosOrdenados = j => [...(j.generos || [])].sort((a, b) => estado.ranking.findIndex(r => r[0] === a) - estado.ranking.findIndex(r => r[0] === b));
$("busca").addEventListener("input", e => { estado.busca = e.target.value.trim().toLowerCase(); desenhar(); });
document.querySelectorAll(".ordenar").forEach(b => b.addEventListener("click", () => {
  estado.dir = estado.ordem === b.dataset.ordem ? -estado.dir : 1;
  estado.ordem = b.dataset.ordem;
  desenhar();
}));

function ordenar(lista) {
  const chave = {
    nome: j => j.nome.toLowerCase(),
    ano: j => anoDe(j) || (estado.dir > 0 ? 9999 : 0), // sem ano vai para o fim
    tem: j => (jaTem(j) ? 0 : 1),
    votacao: j => (j.opcao ? 0 : 1)
  }[estado.ordem];
  return [...lista].sort((a, b) => (chave(a) > chave(b) ? 1 : chave(a) < chave(b) ? -1 : a.nome.localeCompare(b.nome)) * estado.dir);
}

function desenhar() {
  document.querySelectorAll(".ordenar").forEach(b => b.setAttribute("aria-sort", b.dataset.ordem === estado.ordem ? (estado.dir > 0 ? "ascending" : "descending") : "none"));
  const lista = ordenar(estado.jogos.filter(j => (!estado.busca || j.nome.toLowerCase().includes(estado.busca)) && FILTROS[estado.filtro](j) && (!estado.genero || (j.generos || []).includes(estado.genero))));
  $("corpo").innerHTML = lista.length ? lista.map(j => `
    <tr>
      <td><a class="tabela-jogo" href="/jogos/${slug(j.nome)}">${capaHTML(j.capa, j.nome)}<span>${esc(j.nome)}</span></a></td>
      <td>${esc(generosOrdenados(j).join(", ") || "—")}</td>
      <td>${anoDe(j) || "—"}</td>
      <td>${pilula(jaTem(j))}</td>
      <td>${pilula(!!j.opcao, true)}</td>
    </tr>`).join("") : `<tr><td colspan="5" style="color: var(--muted)">Nenhum jogo com esse filtro.</td></tr>`;
  $("listaCelular").innerHTML = lista.map(j => `
    <li>
      <a href="/jogos/${slug(j.nome)}">
        ${capaHTML(j.capa, j.nome)}
        <span class="bl-texto"><b>${esc(j.nome)}</b><span>${esc([generosOrdenados(j).slice(0, 2).join(", "), anoDe(j)].filter(Boolean).join(" · "))}</span></span>
        ${pilula(jaTem(j))}
      </a>
    </li>`).join("");
  $("conta").textContent = `${estado.jogos.length} jogos na lista · atualizado direto do Notion`;
}

montarFiltros();
let assinatura = "";
conectar({
  aoEstado: s => {
    const a = JSON.stringify((s.biblioteca || []).map(j => [j.id, j.nome, j.opcao, j.frequente, j.adquirido, j.capa, j.generos, j.lancamento]));
    if (a === assinatura) return;
    assinatura = a;
    estado.jogos = s.biblioteca || [];
    estado.ranking = rankingGeneros(estado.jogos);
    montarGeneros();
    desenhar();
  }
});
