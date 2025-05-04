<?php
SESSION_START();
OB_START();
require("baglan.php");

$kart_id = $_GET["kart_id"];
$profil	 = $_GET["profil"];

if(isset($kart_id)){
	
$cek	= $baglan->prepare("SELECT * FROM `kartvizit` WHERE  `kart_id` =?");
$cek ->execute(array($kart_id));
$bul 	= $cek->fetch(PDO::FETCH_ASSOC);
$id		= $bul["id"];
$durum	= $bul["durum"];
$tema	= $bul["tema"];
$uyelikid	= $bul["uye_id"];
$cisim		=$bul["isim"];
$csisim		=$bul["soyisim"];
}elseif(isset($profil)){
	
$cek	= $baglan->prepare("SELECT * FROM `kartvizit` WHERE  `profil` =?");
$cek ->execute(array($profil));
$bul 		= $cek->fetch(PDO::FETCH_ASSOC);
$id			= $bul["id"];
$kart_id	= $bul["kart_id"];
$durum		= $bul["durum"];
$tema		= $bul["tema"];
$uyelikid	= $bul["uye_id"];

}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Content-Language" content="en">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title><?php echo"$cisim $csisim";?> Dijital Kartvizit</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
<meta name="msapplication-tap-highlight" content="no">
<meta property="og:locale" content="tr_TR" />
<meta property="og:type" content="website" />
<meta property="og:title" content="<?php echo"$title";?>" />
<meta property="og:description" content="<?php echo"$description";?>" />
<meta property="og:site_name" content="<?php echo"$title";?>" />
<meta property="og:image" content="<?php echo"$logo";?>" />
<meta property="og:image:width" content="" />
<meta property="og:image:height" content="" />
<meta property="og:image:type" content="image/jpeg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="" /> 
<link href="assets/img/logosiyah.png" rel="icon">
<link href="assets/img/logosiyah.png" rel="apple-touch-icon">
<link href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
<link href="assets/vendor/bootstrap/css/bootstrap.min.css?v=0.1" rel="stylesheet">
<link href="assets/vendor/bootstrap-icons/bootstrap-icons.css?v=0.1" rel="stylesheet">
<link href="assets/vendor/boxicons/css/boxicons.min.css?v=0.1" rel="stylesheet">
<link href="assets/vendor/remixicon/remixicon.css?v=0.1" rel="stylesheet">
<link href="assets/vendor/simple-datatables/style.css?v=0.1" rel="stylesheet">

</head>

  <style>
.altmenu {
 position: fixed;
 bottom: 0px;
 left: 0px;
 width: 100%;
 height: 50px;
 padding:5px;
 background-color: #ffffff;
 color:#000000;
}
.altlink{
  font-size: 20px;
  display: inline-block;
  color: rgba(1, 41, 112, 0.5);
  line-height: 0;
  margin-right: 10px;
  padding:2px;
  transition: 0.3s;
  width:100%;
}
  </style>