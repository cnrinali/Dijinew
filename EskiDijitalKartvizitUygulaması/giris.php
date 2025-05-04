<?php
SESSION_START();
OB_START();
require("baglan.php");
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta http-equiv="Content-Language" content="en">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title>DijitaCO Kullanıcı Arayüzü</title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
<meta name="msapplication-tap-highlight" content="no">
<link rel="canonical" href="<?php echo $_SERVER['SERVER_NAME'];?>" />
<link rel="next" href="<?php echo $_SERVER['SERVER_NAME'];?> />
<meta property="og:title" content="<?php echo"$title";?>" />
<meta property="og:description" content="<?php echo"$description";?>" />
<meta property="og:url" content="<?php $_SERVER['SERVER_NAME'];?>" />
<meta property="og:site_name" content="<?php echo"$title";?>" />
<meta property="og:image" content="<?php echo"$logo";?>" />
<link href="assets/img/logosiyah.png" rel="icon">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
<link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
<link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
<link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
<link href="assets/vendor/simple-datatables/style.css" rel="stylesheet">
<link href="assets/css/style.css?v=2" rel="stylesheet">
</head>
<body style="color: #444444;height: 100vh;background: url(tema-1-assets/img/black2.png) 50% fixed;background-size: cover;">
<main style="display: flex;align-items: center;flex-direction: column;justify-content: center;width: 100%;min-height: 100%;">
<section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center">
<div class="container">
<div class="row justify-content-center">
<div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
<div class="card mb-3" style="border-radius: 40px; background: rgb(0 0 0 / 100%); margin-top:-30px;">
<div class="card-body" >
<div class="pt-4 pb-2" align="center">
<img src="tema-1-assets/img/dijitacowhite.png?v=0.1" style="height:150px;">
<h6 class="card-title text-light text-center pb-0 fs-4">Kullanıcı Arayüzü</h6>
</div>
<?php
if (empty($_POST)){
?>
<form class="row g-3" style="color:#ffffff;" action="" method="POST">
<div class="col-12 py-2">
<input type="text" name="username" style="background: rgb(255 255 255 / 100%);" class="form-control" id="Kullanıcıadı" placeholder="Kullanıcı Adı" required>
</div>
<div class="col-12 py-2">
<input type="password" name="password" style="background: rgb(255 255 255 / 100%);;" class="form-control" id="Şifre" placeholder="Şifre" required>
</div>
<div class="col-12 py-2">
<button class="btn btn-light w-100" type="submit">Giriş</button>
</div>
<div class="col-12">
<input type="checkbox" name="hatirla">
<label for="Şifre" class="form-label">Beni Hatırla</label>
<a href="sifirla" style="float:right;" class="text-light">Şifremi Unuttum</a> 
</div>
</form>
<?php 
}else{
$kuladi		= $_POST['username'];
$parola		= $_POST['password'];
$hatirla	= $_POST['hatirla'];
$sifre =md5($parola);

$sor = $baglan->prepare("SELECT * FROM `uye` WHERE `kullaniciadi` =? AND `password` =?");  
$sor->execute(array($kuladi,$sifre));
$uyevarmi	=$sor->fetch(PDO::FETCH_ASSOC);
$id			= $uyevarmi["id"];
if(empty($id)){
echo'<h5 class="card-title text-light text-center pb-0 fs-4">GİRİŞ BAŞARISIZ</h5>';
}else{
if(isset($hatirla)){
$_SESSION["kullanici"] = "$kuladi";
$_SESSION["sifre"] = "$sifre";

setcookie("kullanici", $kuladi, time()+3600*24*24*24);
setcookie("sifre", $sifre, time()+3600*24*24*24);
header('location: yonetim');	
}else{

$_SESSION["kullanici"] = "$kuladi";
$_SESSION["sifre"] = "$sifre";
header('location: yonetim');
}
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="$kuladi Adlı Kullanıcı Giriş Yaptı";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array('1',$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
}
}
?>
</div>
</div>
</div>
</div>
</div>
</section>
</div>
</main>
<?php require("footer.php"); ?>