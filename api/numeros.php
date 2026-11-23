<?php
// Números do canal para a página Anuncie, atualizados sozinhos.
// Discord, YouTube e TikTok: lidos aqui das páginas públicas, guardados por 6 horas.
// Twitch (seguidores, média de espectadores, horas ao vivo) e Instagram: vêm do PC do Ric, pelo placar.php.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=600');

$dados = __DIR__ . '/dados';
if (!is_dir($dados)) mkdir($dados, 0755, true);
if (!is_file($dados . '/.htaccess')) file_put_contents($dados . '/.htaccess', "Require all denied\n");
$cache = "$dados/numeros-publicos.json";
$UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

function baixar($url, $ua) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_USERAGENT => $ua, CURLOPT_HTTPHEADER => ['Accept-Language: pt-BR,pt;q=0.9']]);
  $r = curl_exec($ch);
  $ok = curl_getinfo($ch, CURLINFO_HTTP_CODE) === 200;
  curl_close($ch);
  return $ok ? $r : null;
}
// "1,2 mil" -> 1200; "101" -> 101
function numeroBr($t) {
  $t = trim($t);
  $mil = stripos($t, 'mil') !== false;
  $n = (float) str_replace(',', '.', str_replace('.', '', preg_replace('/[^0-9.,]/', '', $t)));
  return (int) round($mil ? $n * 1000 : $n);
}

$antigo = is_file($cache) ? (json_decode(file_get_contents($cache), true) ?: []) : [];
$publico = $antigo;
if (!is_file($cache) || time() - filemtime($cache) > 6 * 3600) {
  // Discord: o convite público diz quantos membros o servidor tem
  $d = json_decode((string) baixar('https://discord.com/api/v10/invites/4jtUT4HGaC?with_counts=true', $UA), true);
  if (!empty($d['approximate_member_count'])) $publico['discord'] = (int) $d['approximate_member_count'];

  // YouTube: o número que vem logo depois do @ do próprio canal (a página mostra também os canais ligados)
  foreach (['ric_gameplays', 'ric_lives', 'o_ricardocarvalho'] as $h) {
    $html = baixar("https://www.youtube.com/@$h", $UA);
    if (!$html) continue;
    preg_match_all('/@' . preg_quote($h, '/') . '[^0-9"]{0,12}([0-9][0-9.,]*(?: mil)?) inscritos?/u', $html, $m);
    if (!empty($m[1])) $publico['youtube'][$h] = max(array_map('numeroBr', $m[1]));
  }

  // TikTok: a página pública traz o followerCount
  $html = baixar('https://www.tiktok.com/@ric_gameplays', $UA);
  if ($html && preg_match('/"followerCount":(\d+)/', $html, $m)) $publico['tiktok'] = (int) $m[1];

  $publico['lido'] = time() * 1000;
  file_put_contents($cache, json_encode($publico, JSON_UNESCAPED_UNICODE));
}

// o que o PC mandou (Twitch e Instagram)
$estado = is_file("$dados/estado.json") ? (json_decode(file_get_contents("$dados/estado.json"), true) ?: []) : [];
$doPc = $estado['numeros'] ?? [];

echo json_encode([
  'discord' => $publico['discord'] ?? null,
  'youtube' => $publico['youtube'] ?? new stdClass(),
  'tiktok' => $publico['tiktok'] ?? null,
  'twitch' => $doPc['twitch'] ?? null,
  'instagram' => $doPc['instagram'] ?? null,
  'atualizado' => max($publico['lido'] ?? 0, $doPc['atualizado'] ?? 0),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
