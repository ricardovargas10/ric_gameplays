<?php
// Últimos vídeos longos (sem Shorts e sem lives) de um canal do YouTube, pelo feed público. Sem chave.
// /api/videos.php?canal=gameplays|lives|vlogs  -> [{ id, titulo, url, thumb, data }]
// Guarda a resposta por 15 minutos em dados/, para não bater no YouTube a cada visita.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: public, max-age=300');

$CANAIS = [
  'gameplays' => 'UCeeHV2yqONpm0lqA4dCTVzg', // @ric_gameplays
  'lives'     => 'UCknl-RBDoO-246RVlc6P5GA', // @ric_lives
  'vlogs'     => 'UClLCVzD7PatYtOXOvvGMKRA', // @o_ricardocarvalho
];
$canal = $_GET['canal'] ?? 'gameplays';
if (!isset($CANAIS[$canal])) { http_response_code(400); echo '{"erro":"canal desconhecido"}'; exit; }

$dados = __DIR__ . '/dados';
if (!is_dir($dados)) mkdir($dados, 0755, true);
if (!is_file($dados . '/.htaccess')) file_put_contents($dados . '/.htaccess', "Require all denied\n");
$cache = "$dados/videos-$canal.json";
if (is_file($cache) && time() - filemtime($cache) < 900) { readfile($cache); exit; }

// lista "UULF" = só os vídeos longos do canal; no canal de lives, "UULV" = só as transmissões
$url = 'https://www.youtube.com/feeds/videos.xml?playlist_id=' . ($canal === 'lives' ? 'UULV' : 'UULF') . substr($CANAIS[$canal], 2);
$ch = curl_init($url);
curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_FOLLOWLOCATION => true, CURLOPT_USERAGENT => 'Mozilla/5.0']);
$xml = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if (!$xml || $status !== 200) {
  // YouTube fora do ar: devolve o último que deu certo, se tiver
  if (is_file($cache)) { readfile($cache); exit; }
  http_response_code(502); echo '[]'; exit;
}

$doc = @simplexml_load_string($xml);
$lista = [];
if ($doc) {
  foreach ($doc->entry as $e) {
    $yt = $e->children('http://www.youtube.com/xml/schemas/2015');
    $id = (string) $yt->videoId;
    if (!preg_match('/^[\w-]{6,20}$/', $id)) continue;
    $lista[] = [
      'id' => $id,
      'titulo' => (string) $e->title,
      'url' => "https://www.youtube.com/watch?v=$id",
      'thumb' => "https://i.ytimg.com/vi/$id/hqdefault.jpg",
      'data' => (string) $e->published,
    ];
  }
}
$json = json_encode($lista, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
file_put_contents($cache, $json);
echo $json;
