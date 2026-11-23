<?php
// A live da Twitch está no ar? Para a página de links trocar o "último vídeo" pelo cartão "Ao vivo agora".
// Usa o decapi.me (lê a Twitch sem login). Guarda a resposta por 60 segundos.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=30');

$dados = __DIR__ . '/dados';
if (!is_dir($dados)) mkdir($dados, 0755, true);
if (!is_file($dados . '/.htaccess')) file_put_contents($dados . '/.htaccess', "Require all denied\n");
$cache = "$dados/live.json";
if (is_file($cache) && time() - filemtime($cache) < 60) { readfile($cache); exit; }

function ler($u) {
  $ch = curl_init($u);
  curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 6, CURLOPT_USERAGENT => 'site-ric-gameplays']);
  $r = curl_exec($ch);
  $ok = curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200;
  curl_close($ch);
  return $ok ? trim((string) $r) : null;
}
$login = 'ric_gameplays';
$uptime = ler("https://decapi.me/twitch/uptime/$login");
$aoVivo = $uptime !== null && stripos($uptime, 'offline') === false && stripos($uptime, 'error') === false;
$r = ['aoVivo' => $aoVivo, 'url' => "https://twitch.tv/$login"];
if ($aoVivo) {
  $r['titulo'] = ler("https://decapi.me/twitch/title/$login");
  $r['jogo'] = ler("https://decapi.me/twitch/game/$login");
  $r['tempo'] = $uptime;
  $r['thumb'] = "https://static-cdn.jtvnw.net/previews-ttv/live_user_{$login}-640x360.jpg?t=" . time();
}
$json = json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($uptime !== null) file_put_contents($cache, $json);
echo $json;
