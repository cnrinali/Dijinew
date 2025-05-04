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
<title><?php echo"$title";?></title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
<meta name="description" content="<?php echo"$description";?>">
<meta name="msapplication-tap-highlight" content="no">
<link rel="canonical" href="<?php echo $_SERVER['SERVER_NAME'];?>" />
<link rel="next" href="<?php echo $_SERVER['SERVER_NAME'];?> />
<meta property="og:locale" content="tr_TR" />
<meta property="og:type" content="website" />
<meta property="og:title" content="<?php echo"$title";?>" />
<meta property="og:description" content="<?php echo"$description";?>" />
<meta property="og:url" content="<?php $_SERVER['SERVER_NAME'];?>" />
<meta property="og:site_name" content="<?php echo"$title";?>" />
<meta property="og:image" content="<?php echo"$logo";?>" />
<meta property="og:image:width" content="" />
<meta property="og:image:height" content="" />
<meta property="og:image:type" content="image/jpeg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="" /> 
<link href="assets/img/favicon.png?v=0.3" rel="icon">
<link href="assets/img/apple-touch-icon.png?v=0.3" rel="apple-touch-icon">
<link href="https://fonts.gstatic.com" rel="preconnect">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Nunito:300,300i,400,400i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">
<link href="assets/vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">
<link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
<link href="assets/vendor/boxicons/css/boxicons.min.css" rel="stylesheet">
<link href="assets/vendor/remixicon/remixicon.css" rel="stylesheet">
<link href="assets/vendor/simple-datatables/style.css" rel="stylesheet">
<link href="assets/css/style.css?v=2" rel="stylesheet">
</head>
<body>
<main>
<div class="container">
<section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
<div class="container">
<div class="row justify-content-center">
<div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
<div class="d-flex justify-content-center py-4">
<a href="index" class="logo d-flex align-items-center w-auto"><img src="<?php echo"$logo";?>" alt=""><span class="d-none d-lg-block"><?php echo"$title";?> Kartvizit Yazılımı</span></a>
</div>
<div class="card mb-3">
<div class="card-body">
<div class="pt-4 pb-2">
<h5 class="card-title text-center pb-0 fs-4">Hesap Kayıt Formu</h5>
<p class="text-center small">Kayıt Olmak İçin Lütfen Aşağıda ki Bilgileri Doldurunuz</p>
</div>
<?php
if (empty($_POST)){
?>
<form class="row g-3 needs-validation" action="" method="POST">
<div class="col-12">
<label for="Kullanıcıadı" class="form-label">İsim</label>
<div class="input-group has-validation">
<input type="text" name="isim" class="form-control" id="Kullanıcıadı" required>
<div class="invalid-feedback">Lütfen adınızı giriniz.</div>
</div>
</div>
<div class="col-12">
<label for="Kullanıcıadı" class="form-label">Soyisim</label>
<div class="input-group has-validation">
<input type="text" name="soyisim" class="form-control" id="Kullanıcıadı" required>
<div class="invalid-feedback">Lütfen Soy Adınızı giriniz.</div>
</div>
</div>
<div class="col-12">
<label for="Kullanıcıadı" class="form-label">Kullanıcı Adı</label>
<div class="input-group has-validation">
<input type="text" name="username" class="form-control" id="Kullanıcıadı" required>
<div class="invalid-feedback">Lütfen kullanıcı adınızı giriniz.</div>
</div>
</div>
<div class="col-12">
<label for="Şifre" class="form-label">Şifre</label>
<input type="password" name="password" class="form-control" id="Şifre" required>
<div class="invalid-feedback">Lütfen Şifrenizi giriniz.</div>
</div>
<div class="col-12">
<label for="Kullanıcıadı" class="form-label">Telefon</label>
<div class="input-group has-validation">
<input type="number" name="telefon" class="form-control" id="Kullanıcıadı" required>
<div class="invalid-feedback">Lütfen Telefon Numaranızı Boşluksuz giriniz. </div>
</div>
</div>
<div class="col-12">
<label for="Kullanıcıadı" class="form-label">E-Posta</label>
<div class="input-group has-validation">
<input type="email" name="email" class="form-control" id="Kullanıcıadı" required>
<div class="invalid-feedback">Lütfen E-Posta Adresinizi giriniz. </div>
</div>
</div>
<div class="col-12">
<input type="checkbox" name="onay" required>
KVKK kapsamı detaylarına <a href="../kvkk-sozlesmesi.html" target="_blank">Kişisel Verilerin Korunması ve İşlenmesi Şartları</a> yer aldığı sayfamızdan ulaşabilirsiniz.
</div>
<div class="col-12">
<button class="btn btn-dark w-100" type="submit">Kayıt</button>
</div>
</form>
<?php 
}else{
$isim	 	= $_POST['isim'];
$soyisim 	= $_POST['soyisim'];
$telefon 	= $_POST['telefon'];
$email 	 	= $_POST['email'];
$username	= $_POST['username'];
$parola 	= $_POST['password'];

$tarih 		=date('d.m.Y',time());
$sifre =md5($parola);
$sor = $baglan->prepare("SELECT * FROM `uye` WHERE `email` = '$email'");
$sor ->execute(array($email));
$uyevarmi	=$sor->fetch(PDO::FETCH_ASSOC);
$id			= $uyevarmi["id"];
if(isset($id)){
echo'<h5 class="card-title text-center pb-0 fs-4">Bu Mail Adresi ile Kayıt Mevcut<br>Şifrenizi Unuttuysanız Lütfen Şifremi Unuttum Linkine Tıklayınız.</h5>';
} else {
	
$sql = $baglan->prepare("INSERT INTO `uye` SET isim=?,soyisim=?,telefon=?,email=?,kullaniciadi=?,password=?,yetki=?,paket=?,tarih=?");
$kayit = $sql->execute(array($isim,$soyisim,$telefon,$email,$username,$sifre,'0','0',$tarih));

/* LOG */
$islem ="Yeni Üye Kaydı Yapıldı ($isim $soyisim)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array('1',$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */

if (isset ($kayit)){
?>
<div align="center"><h3>Üye Kaydı Başarılı.</h3> <H4>Lütfen Not Ediniz<br>Kullanıcı Adı: <?php echo"$username";?><br>Şifre: <?php echo"$parola";?><br>
 <a href="giris"><button type="button" class="btn btn-dark">Giriş</button></a>
 </h4><img src="assets/img/ok.gif?v=0.1" border="0" height="64px"></div>
<?php
}else{
?>
<div align="center"><h3>Üye Kaydı Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
}
?><br>
<div align="center" class="credits"><a href="sifirla">Şifremi Unuttum</a></div>
</div>
</div>
<div class="credits"><?php echo"$alt";?></div>
</div>
</div>
</div>
</section>
</div>
</main>
<?php require("footer.php"); ?>