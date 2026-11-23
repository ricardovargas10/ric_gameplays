// Jogos (/jogos): jogando agora, na fila, na votação, frequentes (com os servidores de Hytale), zerados e pausados.
import { conectar, ordenar } from "./ao-vivo.js";
import { esc, slug } from "./componentes.js";
import { capaHTML, capaJogo, ordenarFrequentes, servidoresHTML } from "./util.js";
import { desenharBarras } from "./barras.js";

const $ = id => document.getElementById(id);
$("servidores").innerHTML = servidoresHTML();

const assinaturas = {};
function mudou(chave, dados) {
  const a = JSON.stringify(dados);
  if (assinaturas[chave] === a) return false;
  assinaturas[chave] = a;
  return true;
}
const mostrar = (id, sim) => { $(id).hidden = !sim; };

function cartaoJogo(j, pilula) {
  return `
    <a class="cartao cartao--limpo cartao-link" href="/jogos/${slug(j.nome)}">
      ${capaHTML(j.capa, j.nome)}
      <span style="display: block; padding: var(--e-5)">
        <span class="pilula pilula--destaque">${pilula}</span>
        <h3 style="font-size: var(--t-d3); margin: var(--e-3) 0 6px">${esc(j.nome)}</h3>
        <span style="display: block; font-size: var(--t-peq); color: var(--muted)">${esc([j.tipo, j.plataforma].filter(Boolean).join(" · "))}</span>
      </span>
    </a>`;
}
function itemLista(j, { pos, direita } = {}) {
  return `
    <li>
      <a href="/jogos/${slug(j.nome)}">
        ${pos != null ? `<span class="lista-pos">${pos}</span>` : ""}
        ${capaHTML(j.capa, j.nome)}
        <span class="lista-nome">${esc(j.nome)}</span>
        <span class="lista-direita">${direita || ""}</span>
      </a>
    </li>`;
}

conectar({
  aoEstado: s => {
    const todos = s.biblioteca || [];

    const jogando = s.jogandoAgora || [];
    mostrar("secJogando", jogando.length);
    if (mudou("jogando", jogando.map(j => [j.id, j.capa]))) $("jogando").innerHTML = jogando.map(j => cartaoJogo(j, "Jogando")).join("");

    const fila = (s.opcoes || []).filter(j => j.ordemMeta != null).sort((a, b) => a.ordemMeta - b.ordemMeta);
    mostrar("secFila", fila.length);
    if (mudou("fila", fila.map(j => [j.id, j.ordemMeta]))) $("fila").innerHTML = fila.map(j => itemLista(j, { pos: j.ordemMeta + 1, direita: `<span class="pilula pilula--destaque">Meta batida</span>` })).join("");

    desenharBarras($("votacao"), (s.opcoes || []).filter(j => j.ordemMeta == null));

    const freq = ordenarFrequentes(s.frequentes || []);
    if (mudou("freq", freq.map(j => [j.id, j.capaVertical, j.capa]))) {
      $("listaFrequentes").innerHTML = freq.map(capaJogo).join("");
    }

    const zerados = todos.filter(j => j.status === "Feito" && !j.frequente);
    mostrar("secZerados", zerados.length);
    if (mudou("zerados", zerados.map(j => j.id))) $("zerados").innerHTML = zerados.map(j => itemLista(j, { direita: esc(j.tipo || "") })).join("");

    const pausados = todos.filter(j => j.status === "Pausado" && !j.frequente);
    mostrar("secPausados", pausados.length);
    if (mudou("pausados", pausados.map(j => j.id))) $("pausados").innerHTML = pausados.map(j => itemLista(j, { direita: esc(j.tipo || "") })).join("");

    // seções vazias somem; as que ficam continuam alternando branco e cinza
    document.querySelectorAll("main > .secao").forEach((sec, i, todas) => {
      const visiveis = [...todas].filter(x => !x.hidden);
      sec.classList.toggle("secao--cinza", visiveis.indexOf(sec) % 2 === 1);
    });
  }
});
