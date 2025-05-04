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
<h6 class="card-title text-light text-center pb-0 fs-4">Şifre Sıfırlama Ekranı</h6>
</div>
<?php
if (empty($_POST)){
?>
<form class="row g-3" style="color:#ffffff;" action="" method="POST">
<div class="col-12 py-2">
<input type="text" name="email" style="background: rgb(255 255 255 / 100%);" class="form-control" id="email" placeholder="E-Mail Adresinizi Yazınız" required>
</div>
<div class="col-12 py-2">
<button class="btn btn-light w-100" type="submit">Sıfırla</button>
</div>
</form>
<?php 
}else{
$email 	 	= $_POST['email'];

$sor = $baglan->prepare("SELECT * FROM `uye` WHERE `email` =?");
$sor	->execute(array($email));
$uyevarmi	=$sor->fetch(PDO::FETCH_ASSOC);
$id			= $uyevarmi["id"];
if(empty($id)){
echo'<div align="center"><h3>İşlem Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>';
}else{
$addfrontchar = substr($title,0,3);
	$addfrontchar = strtoupper($addfrontchar);
	$chars = array("1","2","3","4","5","6","7","8","9","0");
	$max_chars = count($chars) - 1;	srand((double)microtime()*1000000);
	for($i = 0; $i < 5; $i++){$randnum = ($i == 0) ? $chars[rand(0, $max_chars)] : $randnum . $chars[rand(0, $max_chars)];}
	$addcatid = $cat_id;
	$sifrem = $addfrontchar . $randnum . 
	$addcatid;
$sifre =md5($sifrem);

$guncelle =$baglan->prepare("UPDATE `uye` SET `password`=? WHERE `email`=?");
$guncelle ->execute(array($sifre,$email));
/* Mail */

require("smtpmail/class.phpmailer.php");
$konu	="DijitaCO Şifre Sıfırlama Talebiniz";
$mesaj  ='Merhaba,<br><br>Şifre sıfırlama talebiniz doğrultusunda şifreniz yenilenmiştir.<br><br>Yeni Şifreniz: '.$sifrem.' <br><br>Lütfen giriş yaptıktan sonra şifrenizi değiştirmeyi unutmayınız. <br><br><a href="https://vcard.dijitaco.com/giris"><b>KULLANICI ARAYÜZÜ İÇİN TIKLAYINIZ</b></a>';

$mail = new PHPMailer();
$mail->IsSMTP();
$mail->SMTPAuth = true;
$mail->Host     = "$sunucu";
$mail->Port     = "$port";
$mail->Username = "$mailuser";
$mail->Password = "$mailsifre";
$mail->SetFrom($mail->Username, "DijitaCO Şifre Sıfırlama Talebiniz");
$mail->AddAddress("$email"); 
$mail->CharSet = "UTF-8";
$mail->Subject = "$konu";
$mail->MsgHTML("$mesaj");
if($mail->Send()) {
} else {
   echo "Mailer Error: " . $mail->ErrorInfo;
} 

/* Mail */

echo'<p class="text-center text-light small">Yeni Şifreniz E-Posta Adresinize Gönderilmiştir.<br> Spam Klasörünü Kontrol Etmeyi Unutmayınız.</p>';
}
}
?><br>
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