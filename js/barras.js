// Barras da votação (Início e Jogos): nome, "N de 40 votos", % da meta e a barra.
// O líder fica em vermelho com brilho; os números contam; quem passa outro desliza para a posição nova.
import { ordenar, porcentagemMeta } from "./ao-vivo.js";
import { contar, antesDeReordenar } from "./animacoes.js";

const linhasPorCaixa = new WeakMap();

export function desenharBarras(box, opcoes) {
  let linhas = linhasPorCaixa.get(box);
  if (!linhas) { linhas = new Map(); linhasPorCaixa.set(box, linhas); }
  const ordem = ordenar(opcoes);
  if (!ordem.length) { box.innerHTML = `<p style="color: var(--muted)">Nenhuma série na votação agora.</p>`; linhas.clear(); return ordem; }
  if (!linhas.size) box.innerHTML = "";
  const deslizar = antesDeReordenar(box);
  const ids = new Set(ordem.map(j => j.id));
  for (const [id, el] of linhas) if (!ids.has(id)) { el.remove(); linhas.delete(id); }
  ordem.forEach((j, i) => {
    let el = linhas.get(j.id);
    if (!el) {
      el = document.createElement("div");
      el.className = "voto-item";
      el.innerHTML = `
        <div class="linha voto-linha">
          <h3 class="voto-nome"></h3>
          <span class="voto-conta"><span class="n"></span> de <span class="meta"></span> votos</span>
          <span class="voto-pct"></span>
        </div>
        <ric-barra pct="0"></ric-barra>`;
      linhas.set(j.id, el);
    }
    const pct = porcentagemMeta(j);
    const antes = Number(el.dataset.votos ?? j.votos);
    el.dataset.votos = j.votos;
    el.querySelector(".voto-nome").textContent = j.nome;
    contar(el.querySelector(".voto-conta .n"), j.votos);
    el.querySelector(".voto-conta .meta").textContent = j.metaVotos;
    contar(el.querySelector(".voto-pct"), pct, "%");
    if (j.votos > antes) { el.classList.remove("voto-subiu"); void el.offsetWidth; el.classList.add("voto-subiu"); }
    const barra = el.querySelector("ric-barra");
    barra.setAttribute("pct", pct);
    barra.toggleAttribute("lider", i === 0 && j.votos > 0);
    el.classList.toggle("voto-lider", i === 0 && j.votos > 0);
    box.appendChild(el);
  });
  deslizar();
  return ordem;
}
