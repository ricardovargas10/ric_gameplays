// Gêneros dos jogos pela base da Twitch (IGDB, que é da Twitch). Usa o app da Twitch que a votação já tem
// (Client ID e Secret do admin), com uma chave de app que não mexe no login do canal.
const TRADUCAO = {
  // gêneros
  "Adventure": "Aventura", "Role-playing (RPG)": "RPG", "Shooter": "Tiro", "Platform": "Plataforma", "Puzzle": "Quebra-cabeça",
  "Racing": "Corrida", "Sport": "Esporte", "Strategy": "Estratégia", "Simulator": "Simulação", "Indie": "Indie", "Fighting": "Luta",
  "Arcade": "Arcade", "Hack and slash/Beat 'em up": "Hack and slash", "Real Time Strategy (RTS)": "Estratégia em tempo real",
  "Turn-based strategy (TBS)": "Estratégia por turnos", "Tactical": "Tático", "Music": "Música", "Card & Board Game": "Cartas e tabuleiro",
  "MOBA": "MOBA", "Point-and-click": "Point-and-click", "Visual Novel": "Visual novel", "Quiz/Trivia": "Quiz", "Pinball": "Pinball",
  // temas
  "Action": "Ação", "Fantasy": "Fantasia", "Science fiction": "Ficção científica", "Horror": "Terror", "Thriller": "Suspense",
  "Survival": "Sobrevivência", "Historical": "Histórico", "Stealth": "Furtivo", "Comedy": "Comédia", "Sandbox": "Sandbox",
  "Open world": "Mundo aberto", "Warfare": "Guerra", "Mystery": "Mistério", "Party": "Festa", "Drama": "Drama",
  "Kids": "Infantil", "Educational": "Educativo", "Business": "Negócios", "Romance": "Romance", "4X (explore, expand, exploit, and exterminate)": "4X",
  "Non-fiction": "Não ficção"
};
const IGNORAR = new Set(["Erotic"]);

export function criarIgdb(getApp) {
  let chave = null, validade = 0;

  async function token() {
    if (chave && Date.now() < validade) return chave;
    const { clientId, clientSecret } = getApp();
    if (!clientId || !clientSecret) throw new Error("Twitch sem Client ID e Secret no admin");
    const r = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`, { method: "POST" });
    const d = await r.json();
    if (!r.ok || !d.access_token) throw new Error(d.message || "Twitch recusou a chave de app");
    chave = d.access_token;
    validade = Date.now() + (d.expires_in - 3600) * 1000;
    return chave;
  }

  const limpar = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  // devolve { nome, generos: [...] } do jogo mais parecido com o nome, ou null
  async function buscar(nome) {
    const r = await fetch("https://api.igdb.com/v4/games", {
      method: "POST",
      headers: { "Client-ID": getApp().clientId, "Authorization": "Bearer " + await token(), "Content-Type": "text/plain" },
      body: `search "${String(nome).replace(/"/g, "")}"; fields name,genres.name,themes.name,total_rating_count; where version_parent = null; limit 10;`
    });
    if (r.status === 401) { chave = null; throw new Error("chave de app expirada"); }
    if (!r.ok) throw new Error("IGDB respondeu " + r.status);
    const lista = await r.json();
    if (!lista.length) return null;
    const alvo = limpar(nome);
    const exato = lista.find(g => limpar(g.name) === alvo);
    const melhor = exato || [...lista].sort((a, b) => (b.total_rating_count || 0) - (a.total_rating_count || 0))[0];
    const nomes = [...(melhor.genres || []), ...(melhor.themes || [])].map(x => x.name).filter(n => !IGNORAR.has(n));
    const generos = [...new Set(nomes.map(n => TRADUCAO[n] || n))];
    return { nome: melhor.name, generos };
  }

  return { buscar };
}
