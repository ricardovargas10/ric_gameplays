/* Animações do site inteiro. Carregado por componentes.js, então vale em todas as páginas.
   - Revelar ao rolar: blocos aparecem subindo, um depois do outro nas grades.
   - Números contando até o valor novo (votos e porcentagens).
   - Topo ganha sombra quando a página rola.
   - Imagens aparecem com fade quando terminam de carregar.
   - Listas que mudam de ordem deslizam para a posição nova (votação).
   Quem pediu menos movimento no sistema (prefers-reduced-motion) vê tudo parado. */

const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- revelar ao rolar ---------- */
const ALVOS = ".hero-texto > *, .hero-figura, .faixa-discord, .secao-topo, .cartao, .grade > *, .pilha > *, .linha-botoes > *, .rodape-colunas > div";
const observador = "IntersectionObserver" in window && !calmo
  ? new IntersectionObserver(entradas => {
      entradas.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add("revelado");
        observador.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 })
  : null;

function preparar(raiz = document) {
  if (!observador) return;
  raiz.querySelectorAll(ALVOS).forEach(el => {
    if (el.dataset.revelar) return;
    el.dataset.revelar = "1";
    // nas grades e listas, cada item entra um pouco depois do anterior
    const irmaos = el.parentElement ? [...el.parentElement.children] : [];
    const i = Math.min(irmaos.indexOf(el), 8);
    el.style.setProperty("--atraso", `${Math.max(0, i) * 70}ms`);
    el.classList.add("revelar");
    observador.observe(el);
  });
}

/* ---------- números contando ---------- */
export function contar(el, para, sufixo = "") {
  const de = Number(el.dataset.valor ?? para);
  el.dataset.valor = para;
  if (calmo || de === para) { el.textContent = para + sufixo; return; }
  const inicio = performance.now(), dur = 700;
  const passo = agora => {
    const t = Math.min(1, (agora - inicio) / dur);
    const suave = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(de + (para - de) * suave) + sufixo;
    if (t < 1) requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
}

/* ---------- lista que muda de ordem desliza (técnica FLIP) ---------- */
export function antesDeReordenar(container) {
  const pos = new Map();
  [...container.children].forEach(el => pos.set(el, el.getBoundingClientRect().top));
  return () => {
    if (calmo) return;
    [...container.children].forEach(el => {
      const antes = pos.get(el);
      if (antes == null) return;
      const delta = antes - el.getBoundingClientRect().top;
      if (!delta) return;
      el.animate([{ transform: `translateY(${delta}px)` }, { transform: "translateY(0)" }], { duration: 550, easing: "cubic-bezier(.2,.8,.2,1)" });
    });
  };
}

/* ---------- imagens com fade ao carregar ---------- */
function fadeImagem(img) {
  if (img.dataset.fade) return;
  img.dataset.fade = "1";
  if (img.complete && img.naturalWidth) return;
  img.classList.add("carregando");
  img.addEventListener("load", () => img.classList.remove("carregando"), { once: true });
  img.addEventListener("error", () => img.classList.remove("carregando"), { once: true });
}

/* ---------- topo com sombra ao rolar ---------- */
function sombraTopo() {
  const topo = document.querySelector(".topo");
  if (topo) topo.classList.toggle("rolou", scrollY > 8);
}
addEventListener("scroll", sombraTopo, { passive: true });

/* conteúdo que chega depois (placar, vídeos, capas) também anima */
function varrer(raiz = document) {
  preparar(raiz);
  raiz.querySelectorAll?.("img").forEach(fadeImagem);
}
new MutationObserver(lista => {
  for (const m of lista) m.addedNodes.forEach(n => { if (n.nodeType === 1) { varrer(n.parentElement || document); if (n.tagName === "IMG") fadeImagem(n); } });
}).observe(document.documentElement, { childList: true, subtree: true });

/* ---------- rolagem suave (Lenis) ----------
   Só com mouse (no celular o toque já é suave), nunca no telão e nunca para quem pediu menos movimento. */
if (!calmo && matchMedia("(pointer: fine)").matches && !document.getElementById("tela")) {
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js";
  s.onload = () => {
    if (!window.Lenis) return;
    const lenis = new window.Lenis({ duration: 1.1, easing: t => 1 - Math.pow(1 - t, 3), anchors: true });
    const quadro = t => { lenis.raf(t); requestAnimationFrame(quadro); };
    requestAnimationFrame(quadro);
    lenis.on("scroll", sombraTopo);
  };
  document.head.append(s);
}

document.documentElement.classList.add("animado");
varrer();
sombraTopo();
