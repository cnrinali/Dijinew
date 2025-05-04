<?php
function GetIP(){
  if(getenv("HTTP_CLIENT_IP")) {
    $ip = getenv("HTTP_CLIENT_IP");
  } elseif(getenv("HTTP_X_FORWARDED_FOR")) {
    $ip = getenv("HTTP_X_FORWARDED_FOR");
    if (strstr($ip, ',')) {
      $tmp = explode (',', $ip);
      $ip = trim($tmp[0]);
    }
  } else {
    $ip = getenv("REMOTE_ADDR");
  }
  return $ip;
}
	function ip_adresi_alma()  
	{  
		if (!empty($_SERVER['HTTP_CLIENT_IP']))  
		{  
			$ip	= $_SERVER['HTTP_CLIENT_IP'];  
		}  
		elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){  
			$ip	= $_SERVER['HTTP_X_FORWARDED_FOR'];  
		}  
		else{  
			$ip	= $_SERVER['REMOTE_ADDR'];  
		}  
		return $ip;  
	}  
function getBrowser() 
 { 
     $u_agent = $_SERVER['HTTP_USER_AGENT']; 
     $bname = 'Bilinmiyor';
     $platform = 'Bilinmiyor';
     $version= "";

     //Hangi platformdan gelmiş, Linux, Windows, MacOSX?
     if (preg_match('/linux/i', $u_agent)) {
         $platform = 'linux';
     }
     elseif (preg_match('/macintosh|mac os x/i', $u_agent)) {
         $platform = 'mac';
     }
     elseif (preg_match('/windows|win32/i', $u_agent)) {
         $platform = 'windows';
     }
     
     //Sonra tarayıcıya göz atalım
     if(preg_match('/MSIE/i',$u_agent) && !preg_match('/Opera/i',$u_agent)) 
     { 
         $bname = 'Internet Explorer'; 
         $ub = "MSIE"; 
     } 
     elseif(preg_match('/Firefox/i',$u_agent)) 
     { 
         $bname = 'Mozilla Firefox'; 
         $ub = "Firefox"; 
     } 
     elseif(preg_match('/Chrome/i',$u_agent)) 
     { 
         $bname = 'Google Chrome'; 
         $ub = "Chrome"; 
     } 
     elseif(preg_match('/Safari/i',$u_agent)) 
     { 
         $bname = 'Apple Safari'; 
         $ub = "Safari"; 
     } 
     elseif(preg_match('/Opera/i',$u_agent)) 
     { 
         $bname = 'Opera'; 
         $ub = "Opera"; 
     } 
     elseif(preg_match('/Netscape/i',$u_agent)) 
     { 
         $bname = 'Netscape'; 
         $ub = "Netscape"; 
     } 
     
     // Tarayıcının versiyon numarasını tespit edelim.
	 //burada düzenli ifadeler kullanarak bakıyoruz.
     $known = array('Version', $ub, 'other');
     $pattern = '#(?<browser>' . join('|', $known) .
     ')[/ ]+(?<version>[0-9.|a-zA-Z.]*)#';
     if (!preg_match_all($pattern, $u_agent, $matches)) {
         // buraya kadar bulamadık, aramaya devam
     }
     

     $i = count($matches['browser']);
     if ($i != 1) {

         if (strripos($u_agent,"Version") < strripos($u_agent,$ub)){
             $version= $matches['version'][0];
         }
         else {
             $version= $matches['version'][1];
         }
     }
     else {
         $version= $matches['version'][0];
     }
     
     if ($version==null || $version=="") {$version="?";}
     
     return array(
         'userAgent' => $u_agent,
         'name'      => $bname,
         'version'   => $version,
         'platform'  => $platform,
         'pattern'    => $pattern
     );
 } 

$ua=getBrowser();
$tarayici= "Web tarayıcı: " . $ua['name'] . " " . $ua['version'] . " " .$ua['platform'];

$proxyip = GetIP();
$gercekip = ip_adresi_alma();
/* $uzak_adres = @unserialize(file_get_contents('http://www.geoplugin.net/php.gp?ip='.$gercekip)); 
 $sehir = $uzak_adres['geoplugin_city'];
$ulke = $uzak_adres['geoplugin_countryName']; */
$sehir="Yok";
$ulke ="Yok";

if(isset($_COOKIE["kullanici"])){
$sor 		=$baglan->prepare("SELECT * FROM `uye` WHERE `kullaniciadi` =? AND `password` =?");  
$sor		->execute(array($_COOKIE["kullanici"],$_COOKIE["sifre"])); 
}else{
	
if(isset($_SESSION["kullanici"])){
$skullanici = $_SESSION["kullanici"];
}
if(isset($_SESSION["sifre"])){
$ssifre = $_SESSION["sifre"];
}
$sor 		=$baglan->prepare("SELECT * FROM `uye` WHERE `kullaniciadi` =? AND `password` =?");  
$sor		->execute(array($skullanici,$ssifre)); 
}
$uyebilgi	= $sor->fetch(PDO::FETCH_ASSOC);
if ($sor->rowCount() > 0){
$isim		= $uyebilgi["isim"];
$soyisim	= $uyebilgi["soyisim"];
$uye_id		= $uyebilgi["id"];
$cek_id		= $uyebilgi["id"];
$yetki		= $uyebilgi["yetki"];
$paket		= $uyebilgi["paket"];
}

$ksor 		= $baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id`=?");
$ksor		->execute(array($uye_id));  
$kuyebilgi	= $ksor->fetch(PDO::FETCH_ASSOC);
if ($ksor->rowCount() > 0){
$kart_id	= $kuyebilgi["kart_id"];
$kkart_id	= $kuyebilgi["id"];
$profil	= $kuyebilgi["profil"];
$bitis	= $kuyebilgi["bitis"];
$kartdurumu	= $kuyebilgi["durum"];
}
$lisans			= $baglan->prepare("SELECT * FROM `ayar` WHERE `id`=?");
$lisans			->execute(array('1'));
$lisansal		= $lisans->fetch(PDO::FETCH_ASSOC);
$ayarid			= $lisansal["id"];
$domain			= $lisansal["domain"];
$title			= $lisansal["title"];
$description	= $lisansal["description"];
$alt			= $lisansal["alt"];
$logo			= $lisansal["logo"];
$sunucu			= $lisansal["sunucu"];
$port			= $lisansal["port"];
$mailuser		= $lisansal["mailuser"];
$mailsifre		= $lisansal["mailsifre"];


	$addfrontchar = substr(0,3);
	$addfrontchar = strtoupper($addfrontchar);
	$chars = array("1","2","3","4","5","6","7","8","9","0");
	$max_chars = count($chars) - 1;	srand((double)microtime()*1000000);
	for($i = 0; $i < 3; $i++){$randnum = ($i == 0) ? $chars[rand(0, $max_chars)] : $randnum . $chars[rand(0, $max_chars)];}
	$addcatid = "123";
	$sayilar = $addfrontchar . $randnum . 
	$addcatid;
	
?>