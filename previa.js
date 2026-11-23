// Prévia do site novo no PC (http://localhost:3100), sem tocar no site no ar nem no servidor de votos.
// Serve public/, repassa /api/* para o servidor de votos (porta 3000) e faz /api/videos.php como a Hostinger faz.
// Uso: node previa.js
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
const PORTA = 3100;
const TIPOS = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".json": "application/json" };
const CANAIS = { gameplays: "UCeeHV2yqONpm0lqA4dCTVzg", lives: "UCknl-RBDoO-246RVlc6P5GA", vlogs: "UClLCVzD7PatYtOXOvvGMKRA" };

async function videos(canal) {
  const id = CANAIS[canal] || CANAIS.gameplays;
  const xml = await (await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${canal === "lives" ? "UULV" : "UULF"}${id.slice(2)}`)).text();
  return xml.split("<entry>").slice(1).map(e => {
    const v = e.match(/<yt:videoId>([^<]+)/)?.[1];
    const des = s => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    return { id: v, titulo: des(e.match(/<title>([^<]+)/)?.[1] || ""), url: `https://www.youtube.com/watch?v=${v}`, thumb: `https://i.ytimg.com/vi/${v}/hqdefault.jpg`, data: e.match(/<published>([^<]+)/)?.[1] };
  });
}

http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/live.php" || url.pathname === "/api/numeros.php") { try { res.writeHead(200, { "Content-Type": "application/json" }); res.end(await (await fetch("https://lives.temeron.com.br" + url.pathname)).text()); } catch { res.writeHead(502); res.end("{}"); } return; }
  if (url.pathname === "/api/videos.php") {
    try { res.writeHead(200, { "Content-Type": "application/json" }); res.end(JSON.stringify(await videos(url.searchParams.get("canal")))); }
    catch { res.writeHead(502); res.end("[]"); }
    return;
  }
  if (url.pathname.startsWith("/api/")) { // placar ao vivo: o servidor de votos responde
    const p = http.request({ host: "127.0.0.1", port: 3000, path: req.url, method: req.method, headers: { ...req.headers, host: "localhost:3000" } }, r => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
    p.on("error", () => {
      if (url.pathname !== "/api/ao-vivo") { res.writeHead(502); res.end(); return; }
      // servidor de votos desligado: usa o placar publicado no site, no mesmo formato do servidor
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store" });
      let visto = 0;
      const buscar = async () => {
        try {
          const d = await (await fetch("https://lives.temeron.com.br/api/placar.php?t=" + Date.now())).json();
          if (d.atualizado !== visto && d.placar) { visto = d.atualizado; res.write(`event: estado\ndata: ${JSON.stringify({ ...d.placar, biblioteca: d.biblioteca || [] })}\n\n`); }
        } catch {}
      };
      buscar();
      const t = setInterval(buscar, 3000);
      req.on("close", () => clearInterval(t));
    });
    req.pipe(p);
    return;
  }
  let arq = path.join(RAIZ, /^\/jogos\/[a-z0-9-]+\/?$/.test(url.pathname) ? "jogo.html" : decodeURIComponent(url.pathname));
  if (!arq.startsWith(RAIZ)) { res.writeHead(403); res.end(); return; }
  if (fs.existsSync(arq) && fs.statSync(arq).isDirectory()) arq = path.join(arq, "index.html");
  if (!fs.existsSync(arq) && fs.existsSync(arq + ".html")) arq += ".html";
  if (!fs.existsSync(arq)) { res.writeHead(404); res.end("não achei"); return; }
  res.writeHead(200, { "Content-Type": TIPOS[path.extname(arq)] || "application/octet-stream", "Cache-Control": "no-store" });
  fs.createReadStream(arq).pipe(res);
}).listen(PORTA, "127.0.0.1", () => console.log(`Prévia em http://localhost:${PORTA}`));
