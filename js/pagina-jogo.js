// Página de um jogo (/jogos/<nome-do-jogo>): ficha, status no canal, servidores (Hytale), vídeos e outros jogos.
import { conectar } from "./ao-vivo.js";
import { esc, slug } from "./componentes.js";
import { capaHTML, capaJogo, statusNoCanal, pilulaStatus, servidoresHTML, videos, cartaoVideo, ordenarFrequentes } from "./util.js";

const $ = id => document.getElementById(id);
const alvo = decodeURIComponent(location.pathname.replace(/\/+$/, "").split("/").pop() || "");
let desenhado = "";

function meta(nome, conteudo) {
  let m = document.querySelector(`meta[name="${nome}"]`);
  if (!m) { m = document.createElement("meta"); m.name = nome; document.head.append(m); }
  m.content = conteudo;
}
const data = d => {
  if (!d) return "—";
  const t = new Date(d);
  return isNaN(t) ? d : t.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
};

function naoAchou() {
  document.title = "Jogo não encontrado · Ric Gameplays";
  $("conteudo").innerHTML = `
    <section class="container pagina-topo">
      <p class="olho">Não achei esse jogo</p>
      <h1 class="pagina-titulo">Esse jogo não está na lista do canal.</h1>
      <p class="lead">Pode ter mudado de nome. Veja todos os jogos na biblioteca.</p>
      <div class="linha"><a class="botao botao--principal" href="/biblioteca">Abrir a biblioteca</a><a class="botao botao--secundario" href="/jogos">Ver os jogos</a></div>
    </section>`;
}

function desenhar(j, todos) {
  const chave = JSON.stringify([j.id, j.status, j.votos, j.opcao, j.ordemMeta, j.capa, j.fundo, j.sinopse]);
  if (chave === desenhado) return;
  const primeira = !desenhado;
  desenhado = chave;

  document.title = `${j.nome} · Ric Gameplays`;
  meta("description", `${j.nome} no canal Ric Gameplays, ao vivo todo dia às 19h na Twitch e no YouTube. ${statusNoCanal(j)}`);

  $("fundo").outerHTML = capaHTML(j.fundo || j.capa, j.nome).replace('class="capa"', 'class="capa jogo-fundo" id="fundo"');
  $("capaVertical").innerHTML = capaHTML(j.capa || j.capaVertical, j.nome);
  const loja = $("loja");
  loja.hidden = !j.lojaUrl;
  if (j.lojaUrl) { loja.href = j.lojaUrl; loja.textContent = j.lojaNome || "Ver na loja"; }

  const pilulas = [pilulaStatus(j)].filter(Boolean).map(p => `<span class="pilula pilula--destaque">${esc(p)}</span>`)
    .concat([j.tipo, j.plataforma].filter(Boolean).map(p => `<span class="pilula">${esc(p)}</span>`));
  $("pilulas").innerHTML = pilulas.join("");
  $("nome").textContent = j.nome;
  $("sinopse").textContent = j.sinopse || "";
  $("generos").textContent = (j.generos || []).join(", ") || "—";
  $("lancamento").textContent = data(j.lancamento);
  $("desenvolvedora").textContent = j.desenvolvedora || "—";
  $("modo").textContent = j.tipo || "—";
  $("status").textContent = statusNoCanal(j);

  const hytale = slug(j.nome) === "hytale";
  $("secServidores").hidden = !hytale;
  if (hytale) $("servidores").innerHTML = servidoresHTML(true);

  // outros jogos: os frequentes e as séries da votação, sem este
  const outros = ordenarFrequentes(todos.filter(x => x.frequente)).concat(todos.filter(x => x.opcao || x.status === "Jogando"))
    .filter((x, i, a) => x.id !== j.id && a.findIndex(y => y.id === x.id) === i).slice(0, 4);
  $("outros").innerHTML = outros.map(capaJogo).join("");

  if (primeira) {
    // vídeos com o nome do jogo no título
    const termo = slug(j.nome).replace(/-/g, " ");
    videos("gameplays").then(lista => {
      const achados = lista.filter(v => slug(v.titulo).replace(/-/g, " ").includes(termo)).slice(0, 3);
      $("secVideos").hidden = !achados.length;
      $("tituloVideos").textContent = `Vídeos de ${j.nome}`;
      $("videos").innerHTML = achados.map(cartaoVideo).join("");
    });
  }
}

conectar({
  aoEstado: s => {
    const todos = s.biblioteca || [];
    if (!todos.length) return;
    const j = todos.find(x => slug(x.nome) === alvo);
    if (!j) { if (!desenhado) { desenhado = "nada"; naoAchou(); } return; }
    desenhar(j, todos);
  }
});
