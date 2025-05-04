<?php 
$gun	= date('Y-m-d',time());
$gun7	= date('Y-m-d', strtotime("-7 days"));
$gun30	= date('Y-m-d', strtotime("-30 days"));

$skart_id = $_GET["skart_id"];

if(isset($skart_id)){
$kart_id = $skart_id;
}else{
$kart_id = $kart_id;
}

/* Günlük Pazaryeri */
$N11_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='N11' AND `tarih` =?");
$N11_pazaryeri	->execute(array($kart_id,$gun));
$N11_toplam		= $N11_pazaryeri->fetch(PDO::FETCH_NUM);
$N11tiklama		= $N11_toplam[0];

$trendyol_pazaryeri		= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='trendyol' AND `tarih` =?");
$trendyol_pazaryeri		->execute(array($kart_id,$gun));
$trendyol_toplam		= $trendyol_pazaryeri->fetch(PDO::FETCH_NUM);
$trendyoltiklama		= $trendyol_toplam[0];

$hepsiburada_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='hepsiburada' AND `tarih` =?");
$hepsiburada_pazaryeri	->execute(array($kart_id,$gun));
$hepsiburada_toplam		= $hepsiburada_pazaryeri->fetch(PDO::FETCH_NUM);
$hepsiburadatiklama		= $hepsiburada_toplam[0];
 
$sahibinden_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='sahibinden' AND `tarih` =?");
$sahibinden_pazaryeri	->execute(array($kart_id,$gun));
$sahibinden_toplam		= $sahibinden_pazaryeri->fetch(PDO::FETCH_NUM);
$sahibindentiklama		= $sahibinden_toplam[0];

$hepsiemlak_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='hepsiemlak' AND `tarih` =?");
$hepsiemlak_pazaryeri	->execute(array($kart_id,$gun));
$hepsiemlak_toplam		= $hepsiemlak_pazaryeri->fetch(PDO::FETCH_NUM);
$hepsiemlaktiklama		= $hepsiemlak_toplam[0];

$arabam_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='arabam' AND `tarih` =?");
$arabam_pazaryeri	->execute(array($kart_id,$gun));
$arabam_toplam		= $arabam_pazaryeri->fetch(PDO::FETCH_NUM);
$arabamtiklama		= $arabam_toplam[0];

$letgo_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='letgo' AND `tarih` =?");
$letgo_pazaryeri	->execute(array($kart_id,$gun));
$letgo_toplam		= $letgo_pazaryeri->fetch(PDO::FETCH_NUM);
$letgotiklama		= $letgo_toplam[0];

$amazon_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='amazon' AND `tarih` =?");
$amazon_pazaryeri	->execute(array($kart_id,$gun));
$amazon_toplam		= $amazon_pazaryeri->fetch(PDO::FETCH_NUM);
$amazontiklama		= $amazon_toplam[0];

$ptt_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='ptt' AND `tarih` =?");
$ptt_pazaryeri	->execute(array($kart_id,$gun));
$ptt_toplam		= $ptt_pazaryeri->fetch(PDO::FETCH_NUM);
$ptttiklama		= $ptt_toplam[0];

$ciceksepeti_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='ciceksepeti' AND `tarih` =?");
$ciceksepeti_pazaryeri	->execute(array($kart_id,$gun));
$ciceksepeti_toplam		= $ciceksepeti_pazaryeri->fetch(PDO::FETCH_NUM);
$ciceksepetitiklama		= $ciceksepeti_toplam[0];

/* Günlük Pazaryeri */

/* 7 Günlük Pazaryeri */
$N11_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='N11' AND `tarih` BETWEEN ? AND ?");
$N11_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$N11_toplam_yedi		= $N11_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$N11tiklama_yedi		= $N11_toplam_yedi[0];

$trendyol_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='trendyol' AND `tarih` BETWEEN ? AND ?");
$trendyol_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$trendyol_toplam_yedi		= $trendyol_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$trendyoltiklama_yedi		= $trendyol_toplam_yedi[0];

$hepsiburada_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='hepsiburada' AND `tarih` BETWEEN ? AND ?");
$hepsiburada_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$hepsiburada_toplam_yedi		= $hepsiburada_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$hepsiburadatiklama_yedi		= $hepsiburada_toplam_yedi[0];

$sahibinden_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='sahibinden' AND `tarih` BETWEEN ? AND ?");
$sahibinden_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$sahibinden_toplam_yedi		= $sahibinden_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$sahibindentiklama_yedi		= $sahibinden_toplam_yedi[0];

$hepsiemlak_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='hepsiemlak' AND `tarih` BETWEEN ? AND ?");
$hepsiemlak_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$hepsiemlak_toplam_yedi		= $hepsiemlak_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$hepsiemlaktiklama_yedi		= $hepsiemlak_toplam_yedi[0];

$arabam_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='arabam' AND `tarih` BETWEEN ? AND ?");
$arabam_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$arabam_toplam_yedi		= $arabam_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$arabamtiklama_yedi		= $arabam_toplam_yedi[0];

$letgo_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='letgo' AND `tarih` BETWEEN ? AND ?");
$letgo_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$letgo_toplam_yedi		= $letgo_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$letgotiklama_yedi		= $letgo_toplam_yedi[0];

$amazon_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='amazon' AND `tarih` BETWEEN ? AND ?");
$amazon_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$amazon_toplam_yedi		= $amazon_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$amazontiklama_yedi		= $amazon_toplam_yedi[0];

$ptt_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='ptt' AND `tarih` BETWEEN ? AND ?");
$ptt_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$ptt_toplam_yedi		= $ptt_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$ptttiklama_yedi		= $ptt_toplam_yedi[0];

$ciceksepeti_pazaryeri_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='ciceksepeti' AND `tarih` BETWEEN ? AND ?");
$ciceksepeti_pazaryeri_yedi	->execute(array($kart_id,$gun7,$gun));
$ciceksepeti_toplam_yedi		= $ciceksepeti_pazaryeri_yedi->fetch(PDO::FETCH_NUM);
$ciceksepetitiklama_yedi		= $ciceksepeti_toplam_yedi[0];
/* 7 Günlük Pazaryeri */

/* 30 Günlük Pazaryeri */
$N11_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='N11' AND `tarih` BETWEEN ? AND ?");
$N11_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$N11_toplam_otuz		= $N11_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$N11tiklama_otuz		= $N11_toplam_otuz[0];

$trendyol_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='trendyol' AND `tarih` BETWEEN ? AND ?");
$trendyol_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$trendyol_toplam_otuz		= $trendyol_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$trendyoltiklama_otuz		= $trendyol_toplam_otuz[0];

$hepsiburada_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='hepsiburada' AND `tarih` BETWEEN ? AND ?");
$hepsiburada_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$hepsiburada_toplam_otuz		= $hepsiburada_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$hepsiburadatiklama_otuz		= $hepsiburada_toplam_otuz[0];

$sahibinden_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='sahibinden' AND `tarih` BETWEEN ? AND ?");
$sahibinden_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$sahibinden_toplam_otuz		= $sahibinden_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$sahibindentiklama_otuz		= $sahibinden_toplam_otuz[0];

$hepsiemlak_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='hepsiemlak' AND `tarih` BETWEEN ? AND ?");
$hepsiemlak_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$hepsiemlak_toplam_otuz		= $hepsiemlak_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$hepsiemlaktiklama_otuz		= $hepsiemlak_toplam_otuz[0];

$arabam_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='arabam' AND `tarih` BETWEEN ? AND ?");
$arabam_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$arabam_toplam_otuz		= $arabam_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$arabamtiklama_otuz		= $arabam_toplam_otuz[0];

$letgo_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='letgo' AND `tarih` BETWEEN ? AND ?");
$letgo_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$letgo_toplam_otuz		= $letgo_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$letgotiklama_otuz		= $letgo_toplam_otuz[0];

$amazon_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='amazon' AND `tarih` BETWEEN ? AND ?");
$amazon_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$amazon_toplam_otuz		= $amazon_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$amazontiklama_otuz		= $amazon_toplam_otuz[0];

$ptt_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='ptt' AND `tarih` BETWEEN ? AND ?");
$ptt_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$ptt_toplam_otuz		= $ptt_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$ptttiklama_otuz		= $ptt_toplam_otuz[0];

$ciceksepeti_pazaryeri_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='ciceksepeti' AND `tarih` BETWEEN ? AND ?");
$ciceksepeti_pazaryeri_otuz	->execute(array($kart_id,$gun30,$gun));
$ciceksepeti_toplam_otuz		= $ciceksepeti_pazaryeri_otuz->fetch(PDO::FETCH_NUM);
$ciceksepetitiklama_otuz		= $ciceksepeti_toplam_otuz[0];
/* 30 Günlük Pazaryeri */



/* Günlük sosyal */
$whatsapp_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` LIKE '%whatsapp%' AND `tarih` =?");
$whatsapp_sosyal	->execute(array($kart_id,$gun));
$whatsapp_toplam		= $whatsapp_sosyal->fetch(PDO::FETCH_NUM);
$whatsapptiklama		= $whatsapp_toplam[0];

$facebook_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='facebook' AND `tarih` =?");
$facebook_sosyal	->execute(array($kart_id,$gun));
$facebook_toplam		= $facebook_sosyal->fetch(PDO::FETCH_NUM);
$facebooktiklama		= $facebook_toplam[0];

$twitter_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='twitter' AND `tarih` =?");
$twitter_sosyal	->execute(array($kart_id,$gun));
$twitter_toplam		= $twitter_sosyal->fetch(PDO::FETCH_NUM);
$twittertiklama		= $twitter_toplam[0];
 
$instagram_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='instagram' AND `tarih` =?");
$instagram_sosyal	->execute(array($kart_id,$gun));
$instagram_toplam		= $instagram_sosyal->fetch(PDO::FETCH_NUM);
$instagramtiklama		= $instagram_toplam[0];

$telegram_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='telegram' AND `tarih` =?");
$telegram_sosyal	->execute(array($kart_id,$gun));
$telegram_toplam		= $telegram_sosyal->fetch(PDO::FETCH_NUM);
$telegramtiklama		= $telegram_toplam[0];

$snapchat_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='snapchat' AND `tarih` =?");
$snapchat_sosyal	->execute(array($kart_id,$gun));
$snapchat_toplam		= $snapchat_sosyal->fetch(PDO::FETCH_NUM);
$snapchattiklama		= $snapchat_toplam[0];

$tiktok_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='tiktok' AND `tarih` =?");
$tiktok_sosyal	->execute(array($kart_id,$gun));
$tiktok_toplam		= $tiktok_sosyal->fetch(PDO::FETCH_NUM);
$tiktoktiklama		= $tiktok_toplam[0];


/* Günlük sosyal */

/* 7 Günlük sosyal */
$whatsapp_sosyal_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` LIKE '%whatsapp%' AND `tarih` BETWEEN ? AND ?");
$whatsapp_sosyal_yedi	->execute(array($kart_id,$gun7,$gun));
$whatsapp_toplam_yedi		= $whatsapp_sosyal_yedi->fetch(PDO::FETCH_NUM);
$whatsapptiklama_yedi		= $whatsapp_toplam_yedi[0];

$facebook_sosyal_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='facebook' AND `tarih` BETWEEN ? AND ?");
$facebook_sosyal_yedi	->execute(array($kart_id,$gun7,$gun));
$facebook_toplam_yedi		= $facebook_sosyal_yedi->fetch(PDO::FETCH_NUM);
$facebooktiklama_yedi		= $facebook_toplam_yedi[0];

$twitter_sosyal_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='twitter' AND `tarih` BETWEEN ? AND ?");
$twitter_sosyal_yedi	->execute(array($kart_id,$gun7,$gun));
$twitter_toplam_yedi		= $twitter_sosyal_yedi->fetch(PDO::FETCH_NUM);
$twittertiklama_yedi		= $twitter_toplam_yedi[0];

$instagram_sosyal_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='instagram' AND `tarih` BETWEEN ? AND ?");
$instagram_sosyal_yedi	->execute(array($kart_id,$gun7,$gun));
$instagram_toplam_yedi		= $instagram_sosyal_yedi->fetch(PDO::FETCH_NUM);
$instagramtiklama_yedi		= $instagram_toplam_yedi[0];

$telegram_sosyal_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='telegram' AND `tarih` BETWEEN ? AND ?");
$telegram_sosyal_yedi	->execute(array($kart_id,$gun7,$gun));
$telegram_toplam_yedi		= $telegram_sosyal_yedi->fetch(PDO::FETCH_NUM);
$telegramtiklama_yedi		= $telegram_toplam_yedi[0];

$snapchat_sosyal_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='snapchat' AND `tarih` BETWEEN ? AND ?");
$snapchat_sosyal_yedi	->execute(array($kart_id,$gun7,$gun));
$snapchat_toplam_yedi		= $snapchat_sosyal_yedi->fetch(PDO::FETCH_NUM);
$snapchattiklama_yedi		= $snapchat_toplam_yedi[0];

$tiktok_sosyal_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='tiktok' AND `tarih` BETWEEN ? AND ?");
$tiktok_sosyal_yedi	->execute(array($kart_id,$gun7,$gun));
$tiktok_toplam_yedi		= $tiktok_sosyal_yedi->fetch(PDO::FETCH_NUM);
$tiktoktiklama_yedi		= $tiktok_toplam_yedi[0];
/* 7 Günlük sosyal */

/* 30 Günlük sosyal */
$whatsapp_sosyal_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` LIKE '%whatsapp%' AND `tarih` BETWEEN ? AND ?");
$whatsapp_sosyal_otuz	->execute(array($kart_id,$gun30,$gun));
$whatsapp_toplam_otuz		= $whatsapp_sosyal_otuz->fetch(PDO::FETCH_NUM);
$whatsapptiklama_otuz		= $whatsapp_toplam_otuz[0];

$facebook_sosyal_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='facebook' AND `tarih` BETWEEN ? AND ?");
$facebook_sosyal_otuz	->execute(array($kart_id,$gun30,$gun));
$facebook_toplam_otuz		= $facebook_sosyal_otuz->fetch(PDO::FETCH_NUM);
$facebooktiklama_otuz		= $facebook_toplam_otuz[0];

$twitter_sosyal_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='twitter' AND `tarih` BETWEEN ? AND ?");
$twitter_sosyal_otuz	->execute(array($kart_id,$gun30,$gun));
$twitter_toplam_otuz		= $twitter_sosyal_otuz->fetch(PDO::FETCH_NUM);
$twittertiklama_otuz		= $twitter_toplam_otuz[0];

$instagram_sosyal_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='instagram' AND `tarih` BETWEEN ? AND ?");
$instagram_sosyal_otuz	->execute(array($kart_id,$gun30,$gun));
$instagram_toplam_otuz		= $instagram_sosyal_otuz->fetch(PDO::FETCH_NUM);
$instagramtiklama_otuz		= $instagram_toplam_otuz[0];

$telegram_sosyal_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='telegram' AND `tarih` BETWEEN ? AND ?");
$telegram_sosyal_otuz	->execute(array($kart_id,$gun30,$gun));
$telegram_toplam_otuz		= $telegram_sosyal_otuz->fetch(PDO::FETCH_NUM);
$telegramtiklama_otuz		= $telegram_toplam_otuz[0];

$snapchat_sosyal_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='snapchat' AND `tarih` BETWEEN ? AND ?");
$snapchat_sosyal_otuz	->execute(array($kart_id,$gun30,$gun));
$snapchat_toplam_otuz		= $snapchat_sosyal_otuz->fetch(PDO::FETCH_NUM);
$snapchattiklama_otuz		= $snapchat_toplam_otuz[0];

$tiktok_sosyal_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='tiktok' AND `tarih` BETWEEN ? AND ?");
$tiktok_sosyal_otuz	->execute(array($kart_id,$gun30,$gun));
$tiktok_toplam_otuz		= $tiktok_sosyal_otuz->fetch(PDO::FETCH_NUM);
$tiktoktiklama_otuz		= $tiktok_toplam_otuz[0];

/* 30 Günlük Diğer */

$ziyaret_diger	= $baglan->prepare("SELECT count(id) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` =?");
$ziyaret_diger	->execute(array($kart_id,$gun));
$ziyaret_toplam		= $ziyaret_diger->fetch(PDO::FETCH_NUM);
$ziyarettiklama		= $ziyaret_toplam[0];

$telefon_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` IN ('telefon','cep') AND `tarih` =?");
$telefon_diger	->execute(array($kart_id,$gun));
$telefon_toplam		= $telefon_diger->fetch(PDO::FETCH_NUM);
$telefontiklama		= $telefon_toplam[0];

$mail_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='mail' AND `tarih` =?");
$mail_diger	->execute(array($kart_id,$gun));
$mail_toplam		= $mail_diger->fetch(PDO::FETCH_NUM);
$mailtiklama		= $mail_toplam[0];

$konum_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` IN ('apple','map') AND `tarih` =?");
$konum_diger	->execute(array($kart_id,$gun));
$konum_toplam		= $konum_diger->fetch(PDO::FETCH_NUM);
$konumtiklama		= $konum_toplam[0];
 
$web_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='web' AND `tarih` =?");
$web_diger	->execute(array($kart_id,$gun));
$web_toplam		= $web_diger->fetch(PDO::FETCH_NUM);
$webtiklama		= $web_toplam[0];

$linkedin_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='linkedin' AND `tarih` =?");
$linkedin_diger	->execute(array($kart_id,$gun));
$linkedin_toplam		= $linkedin_diger->fetch(PDO::FETCH_NUM);
$linkedintiklama		= $linkedin_toplam[0];

$youtube_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='youtube' AND `tarih` =?");
$youtube_diger	->execute(array($kart_id,$gun));
$youtube_toplam		= $youtube_diger->fetch(PDO::FETCH_NUM);
$youtubetiklama		= $youtube_toplam[0];

$pinterest_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='pinterest' AND `tarih` =?");
$pinterest_diger	->execute(array($kart_id,$gun));
$pinterest_toplam		= $pinterest_diger->fetch(PDO::FETCH_NUM);
$pinteresttiklama		= $pinterest_toplam[0];


/* Günlük diger */

/* 7 Günlük diger */

$ziyaret_diger_yedi	= $baglan->prepare("SELECT count(id) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` BETWEEN ? AND ?");
$ziyaret_diger_yedi	->execute(array($kart_id,$gun7,$gun));
$ziyaret_toplam_yedi		= $ziyaret_diger_yedi->fetch(PDO::FETCH_NUM);
$ziyarettiklama_yedi		= $ziyaret_toplam_yedi[0];

$telefon_diger_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` IN ('telefon','cep') AND `tarih` BETWEEN ? AND ?");
$telefon_diger_yedi	->execute(array($kart_id,$gun7,$gun));
$telefon_toplam_yedi		= $telefon_diger_yedi->fetch(PDO::FETCH_NUM);
$telefontiklama_yedi		= $telefon_toplam_yedi[0];

$mail_diger_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='mail' AND `tarih` BETWEEN ? AND ?");
$mail_diger_yedi	->execute(array($kart_id,$gun7,$gun));
$mail_toplam_yedi		= $mail_diger_yedi->fetch(PDO::FETCH_NUM);
$mailtiklama_yedi		= $mail_toplam_yedi[0];

$konum_diger_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` IN ('apple','map') AND `tarih` BETWEEN ? AND ?");
$konum_diger_yedi	->execute(array($kart_id,$gun7,$gun));
$konum_toplam_yedi		= $konum_diger_yedi->fetch(PDO::FETCH_NUM);
$konumtiklama_yedi		= $konum_toplam_yedi[0];

$web_diger_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='web' AND `tarih` BETWEEN ? AND ?");
$web_diger_yedi	->execute(array($kart_id,$gun7,$gun));
$web_toplam_yedi		= $web_diger_yedi->fetch(PDO::FETCH_NUM);
$webtiklama_yedi		= $web_toplam_yedi[0];

$linkedin_diger_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='linkedin' AND `tarih` BETWEEN ? AND ?");
$linkedin_diger_yedi	->execute(array($kart_id,$gun7,$gun));
$linkedin_toplam_yedi		= $linkedin_diger_yedi->fetch(PDO::FETCH_NUM);
$linkedintiklama_yedi		= $linkedin_toplam_yedi[0];

$youtube_diger_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='youtube' AND `tarih` BETWEEN ? AND ?");
$youtube_diger_yedi	->execute(array($kart_id,$gun7,$gun));
$youtube_toplam_yedi		= $youtube_diger_yedi->fetch(PDO::FETCH_NUM);
$youtubetiklama_yedi		= $youtube_toplam_yedi[0];

$pinterest_diger_yedi	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='pinterest' AND `tarih` BETWEEN ? AND ?");
$pinterest_diger_yedi	->execute(array($kart_id,$gun7,$gun));
$pinterest_toplam_yedi		= $pinterest_diger_yedi->fetch(PDO::FETCH_NUM);
$pinteresttiklama_yedi		= $pinterest_toplam_yedi[0];


/* 7 Günlük diger */

/* 30 Günlük diger */

$ziyaret_diger_otuz	= $baglan->prepare("SELECT count(id) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` BETWEEN ? AND ?");
$ziyaret_diger_otuz	->execute(array($kart_id,$gun30,$gun));
$ziyaret_toplam_otuz		= $ziyaret_diger_otuz->fetch(PDO::FETCH_NUM);
$ziyarettiklama_otuz		= $ziyaret_toplam_otuz[0];

$telefon_diger_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` IN ('telefon','cep') AND `tarih` BETWEEN ? AND ?");
$telefon_diger_otuz	->execute(array($kart_id,$gun30,$gun));
$telefon_toplam_otuz		= $telefon_diger_otuz->fetch(PDO::FETCH_NUM);
$telefontiklama_otuz		= $telefon_toplam_otuz[0];

$mail_diger_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='mail' AND `tarih` BETWEEN ? AND ?");
$mail_diger_otuz	->execute(array($kart_id,$gun30,$gun));
$mail_toplam_otuz		= $mail_diger_otuz->fetch(PDO::FETCH_NUM);
$mailtiklama_otuz		= $mail_toplam_otuz[0];

$konum_diger_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` IN ('apple','map') AND `tarih` BETWEEN ? AND ?");
$konum_diger_otuz	->execute(array($kart_id,$gun30,$gun));
$konum_toplam_otuz		= $konum_diger_otuz->fetch(PDO::FETCH_NUM);
$konumtiklama_otuz		= $konum_toplam_otuz[0];

$web_diger_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='web' AND `tarih` BETWEEN ? AND ?");
$web_diger_otuz	->execute(array($kart_id,$gun30,$gun));
$web_toplam_otuz		= $web_diger_otuz->fetch(PDO::FETCH_NUM);
$webtiklama_otuz		= $web_toplam_otuz[0];

$linkedin_diger_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='linkedin' AND `tarih` BETWEEN ? AND ?");
$linkedin_diger_otuz	->execute(array($kart_id,$gun30,$gun));
$linkedin_toplam_otuz		= $linkedin_diger_otuz->fetch(PDO::FETCH_NUM);
$linkedintiklama_otuz		= $linkedin_toplam_otuz[0];

$youtube_diger_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='youtube' AND `tarih` BETWEEN ? AND ?");
$youtube_diger_otuz	->execute(array($kart_id,$gun30,$gun));
$youtube_toplam_otuz		= $youtube_diger_otuz->fetch(PDO::FETCH_NUM);
$youtubetiklama_otuz		= $youtube_toplam_otuz[0];

$pinterest_diger_otuz	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='pinterest' AND `tarih` BETWEEN ? AND ?");
$pinterest_diger_otuz	->execute(array($kart_id,$gun30,$gun));
$pinterest_toplam_otuz		= $pinterest_diger_otuz->fetch(PDO::FETCH_NUM);
$pinteresttiklama_otuz		= $pinterest_toplam_otuz[0];


/* 30 Günlük diger */

/* Ziyaretçi Tekil Günlük */
$ziyaretci_tekil		= $baglan->prepare("SELECT count(distinct gercekip) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` =?");
$ziyaretci_tekil		->execute(array($kart_id,$gun));
$ziyaretci_toplam_tekil	= $ziyaretci_tekil->fetch(PDO::FETCH_NUM);
$ziyaretcitekilsayi		= $ziyaretci_toplam_tekil[0];
/* Ziyaretçi Tekil Günlük */

/* Ziyaretçi Tekil 7 Günlük */
$ziyaretci_tekil_yedi			= $baglan->prepare("SELECT count(distinct gercekip) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` BETWEEN ? AND ?");
$ziyaretci_tekil_yedi			->execute(array($kart_id, $gun, $gun7));
$ziyaretci_toplam_tekil_yedi	= $ziyaretci_tekil_yedi->fetch(PDO::FETCH_NUM);
$ziyaretcitekilsayi_yedi		= $ziyaretci_toplam_tekil_yedi[0];
/* Ziyaretçi Tekil 7 Günlük */

/* Ziyaretçi Tekil 30 Günlük */
$ziyaretci_tekil_otuz			= $baglan->prepare("SELECT count(distinct gercekip) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` BETWEEN ? AND ?");
$ziyaretci_tekil_otuz			->execute(array($kart_id, $gun, $gun30));
$ziyaretci_toplam_tekil_otuz	= $ziyaretci_tekil_otuz->fetch(PDO::FETCH_NUM);
$ziyaretcitekilsayi_otuz		= $ziyaretci_toplam_tekil_otuz[0];
/* Ziyaretçi Tekil 30 Günlük */

/* Ziyaretçi Çoğul Günlük */
$ziyaretci_cogul		= $baglan->prepare("SELECT count(id) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` =?");
$ziyaretci_cogul		->execute(array($kart_id,$gun));
$ziyaretci_toplam_cogul	= $ziyaretci_cogul->fetch(PDO::FETCH_NUM);
$ziyaretcicogulsayi			= $ziyaretci_toplam_cogul[0];
/* Ziyaretçi Çoğul Günlük */

/* Ziyaretçi Çoğul 7 Günlük */
$ziyaretci_cogul_yedi			= $baglan->prepare("SELECT count(id) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` BETWEEN ? AND ?");
$ziyaretci_cogul_yedi			->execute(array($kart_id, $gun, $gun7));
$ziyaretci_toplam_cogul_yedi	= $ziyaretci_cogul_yedi->fetch(PDO::FETCH_NUM);
$ziyaretcicogulsayi_yedi		= $ziyaretci_toplam_cogul_yedi[0];
/* Ziyaretçi Çoğul 7 Günlük */

/* Ziyaretçi Çoğul 30 Günlük */
$ziyaretci_cogul_otuz			= $baglan->prepare("SELECT count(id) FROM `ziyaretci` WHERE `kart_id` =? AND `tarih` BETWEEN ? AND ?");
$ziyaretci_cogul_otuz			->execute(array($kart_id, $gun, $gun30));
$ziyaretci_toplam_cogul_otuz	= $ziyaretci_cogul_otuz->fetch(PDO::FETCH_NUM);
$ziyaretcicogulsayi_otuz		= $ziyaretci_toplam_cogul_otuz[0];
/* Ziyaretçi Çoğul 30 Günlük */

/* Günlük sosyal */
$whatsapp_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` LIKE '%whatsapp%'");
$whatsapp_sosyal	->execute(array($kart_id));
$whatsapp_toplam	= $whatsapp_sosyal->fetch(PDO::FETCH_NUM);
$whatsapptoplam	= $whatsapp_toplam[0];

$facebook_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='facebook'");
$facebook_sosyal	->execute(array($kart_id));
$facebook_toplam	= $facebook_sosyal->fetch(PDO::FETCH_NUM);
$facebooktoplam	= $facebook_toplam[0];

$twitter_sosyal		= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='twitter'");
$twitter_sosyal		->execute(array($kart_id));
$twitter_toplam		= $twitter_sosyal->fetch(PDO::FETCH_NUM);
$twittertoplam		= $twitter_toplam[0];
 
$instagram_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='instagram'");
$instagram_sosyal	->execute(array($kart_id));
$instagram_toplam	= $instagram_sosyal->fetch(PDO::FETCH_NUM);
$instagramtoplam	= $instagram_toplam[0];

$telegram_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='telegram'");
$telegram_sosyal	->execute(array($kart_id));
$telegram_toplam	= $telegram_sosyal->fetch(PDO::FETCH_NUM);
$telegramtoplam	= $telegram_toplam[0];

$snapchat_sosyal	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='snapchat'");
$snapchat_sosyal	->execute(array($kart_id));
$snapchat_toplam	= $snapchat_sosyal->fetch(PDO::FETCH_NUM);
$snapchattoplam	= $snapchat_toplam[0];

$tiktok_sosyal		= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='tiktok'");
$tiktok_sosyal		->execute(array($kart_id));
$tiktok_toplam		= $tiktok_sosyal->fetch(PDO::FETCH_NUM);
$tiktoktoplam		= $tiktok_toplam[0];

/* Günlük sosyal */

/* Toplam Pazaryeri */
$N11_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='N11'");
$N11_pazaryeri	->execute(array($kart_id));
$N11_toplam		= $N11_pazaryeri->fetch(PDO::FETCH_NUM);
$N11toplam		= $N11_toplam[0];

$trendyol_pazaryeri		= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='trendyol'");
$trendyol_pazaryeri		->execute(array($kart_id));
$trendyol_toplam		= $trendyol_pazaryeri->fetch(PDO::FETCH_NUM);
$trendyoltoplam		= $trendyol_toplam[0];

$hepsiburada_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='hepsiburada'");
$hepsiburada_pazaryeri	->execute(array($kart_id));
$hepsiburada_toplam		= $hepsiburada_pazaryeri->fetch(PDO::FETCH_NUM);
$hepsiburadatoplam		= $hepsiburada_toplam[0];
 
$sahibinden_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='sahibinden'");
$sahibinden_pazaryeri	->execute(array($kart_id));
$sahibinden_toplam		= $sahibinden_pazaryeri->fetch(PDO::FETCH_NUM);
$sahibindentoplam		= $sahibinden_toplam[0];

$hepsiemlak_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='hepsiemlak'");
$hepsiemlak_pazaryeri	->execute(array($kart_id));
$hepsiemlak_toplam		= $hepsiemlak_pazaryeri->fetch(PDO::FETCH_NUM);
$hepsiemlaktoplam		= $hepsiemlak_toplam[0];

$arabam_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='arabam'");
$arabam_pazaryeri	->execute(array($kart_id));
$arabam_toplam		= $arabam_pazaryeri->fetch(PDO::FETCH_NUM);
$arabamtoplam		= $arabam_toplam[0];

$letgo_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='letgo'");
$letgo_pazaryeri	->execute(array($kart_id));
$letgo_toplam		= $letgo_pazaryeri->fetch(PDO::FETCH_NUM);
$letgotoplam		= $letgo_toplam[0];

$amazon_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='amazon'");
$amazon_pazaryeri	->execute(array($kart_id));
$amazon_toplam		= $amazon_pazaryeri->fetch(PDO::FETCH_NUM);
$amazontoplam		= $amazon_toplam[0];

$ptt_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='ptt'");
$ptt_pazaryeri	->execute(array($kart_id));
$ptt_toplam		= $ptt_pazaryeri->fetch(PDO::FETCH_NUM);
$ptttoplam		= $ptt_toplam[0];

$ciceksepeti_pazaryeri	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='ciceksepeti'");
$ciceksepeti_pazaryeri	->execute(array($kart_id));
$ciceksepeti_toplam		= $ciceksepeti_pazaryeri->fetch(PDO::FETCH_NUM);
$ciceksepetitoplam		= $ciceksepeti_toplam[0];
/* Toplam Pazaryeri */

/* Toplam diger */

$ziyaret_diger	= $baglan->prepare("SELECT count(id) FROM `ziyaretci` WHERE `kart_id` =?");
$ziyaret_diger	->execute(array($kart_id));
$ziyaret_toplam		= $ziyaret_diger->fetch(PDO::FETCH_NUM);
$ziyarettoplam		= $ziyaret_toplam[0];

$telefon_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` IN ('telefon','cep')");
$telefon_diger	->execute(array($kart_id));
$telefon_toplam		= $telefon_diger->fetch(PDO::FETCH_NUM);
$telefontoplam		= $telefon_toplam[0];

$mail_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='mail'");
$mail_diger	->execute(array($kart_id));
$mail_toplam		= $mail_diger->fetch(PDO::FETCH_NUM);
$mailtoplam		= $mail_toplam[0];

$konum_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` IN ('apple','map')");
$konum_diger	->execute(array($kart_id));
$konum_toplam		= $konum_diger->fetch(PDO::FETCH_NUM);
$konumtoplam		= $konum_toplam[0];
 
$web_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='web'");
$web_diger	->execute(array($kart_id));
$web_toplam		= $web_diger->fetch(PDO::FETCH_NUM);
$webtoplam		= $web_toplam[0];

$linkedin_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='linkedin'");
$linkedin_diger	->execute(array($kart_id));
$linkedin_toplam		= $linkedin_diger->fetch(PDO::FETCH_NUM);
$linkedintoplam		= $linkedin_toplam[0];

$youtube_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='youtube'");
$youtube_diger	->execute(array($kart_id));
$youtube_toplam		= $youtube_diger->fetch(PDO::FETCH_NUM);
$youtubetoplam		= $youtube_toplam[0];

$pinterest_diger	= $baglan->prepare("SELECT count(id) FROM `istatistik` WHERE `kart_id` =? AND `bilgi` ='pinterest'");
$pinterest_diger	->execute(array($kart_id));
$pinterest_toplam		= $pinterest_diger->fetch(PDO::FETCH_NUM);
$pinteresttoplam		= $pinterest_toplam[0];

/* Toplam diger */
/* Ziyaretçi Tekil 30 Günlük */
$ziyaretci_tekil_toplam			= $baglan->prepare("SELECT count(distinct gercekip) FROM `ziyaretci` WHERE `kart_id` =?");
$ziyaretci_tekil_toplam			->execute(array($kart_id));
$ziyaretci_toplam_tekil_toplam	= $ziyaretci_tekil_toplam->fetch(PDO::FETCH_NUM);
$ziyaretcitekilsayi_toplam		= $ziyaretci_toplam_tekil_toplam[0];
/* Ziyaretçi Tekil 30 Günlük */

$ziyaretci_cogul_toplam			= $baglan->prepare("SELECT count(id) FROM `ziyaretci` WHERE `kart_id` =?");
$ziyaretci_cogul_toplam			->execute(array($kart_id));
$ziyaretci_toplam_cogul_toplam	= $ziyaretci_cogul_toplam->fetch(PDO::FETCH_NUM);
$ziyaretcicogulsayi_toplam		= $ziyaretci_toplam_cogul_toplam[0];


$toplamdiger 		= $telefontoplam + $mailtoplam + $konumtoplam + $webtoplam	+ $linkedintoplam + $youtubetoplam + $pinteresttoplam;
$toplamsosyal 		= $whatsapptoplam + $facebooktoplam + $twittertoplam + $instagramtoplam + $telegramtoplam + $snapchattoplam + $tiktoktoplam;
$toplampazaryeri 	=$N11toplam + $trendyoltoplam + $hepsiburadatoplam + $sahibindentoplam + $hepsiemlaktoplam + $arabamtoplam + $letgotoplam + $amazontoplam + $ptttoplam + $ciceksepetitoplam;
?>