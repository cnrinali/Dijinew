<?php
SESSION_START();
OB_START();
require("baglan.php");
$kart_id =$_GET["kart_id"];
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
<script>
function boslukEngelle() {
    if (event.keyCode == 32) {
        return false;
    }
}
</script>
</head>
<div class="container">
<section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center">
<div class="row justify-content-center">
<div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
<div class="card mb-3" style="border-radius: 40px; background: rgb(0 0 0 / 100%); margin-top:10px;">
<div class="card-body">
<?php
if (empty($_POST)){
?>
<div class="pt-4 pb-2" align="center">
<img src="tema-1-assets/img/dijitacowhite.png?v=0.1" style="height:150px;">
<h5 class="card-title text-center pb-0 fs-4" style="color:#fff;">Aktivasyon Formu</h5>
<p class="text-center small" style="color:#fff;">Aktive Olmak İçin Lütfen Aşağıda ki Bilgileri Doldurunuz</p>
</div>
<form class="row g-3" style="color:#ffffff;" action="" method="POST">
<input type="hidden" name="kart_id" class="form-control" value="<?php echo"$kart_id";?>" required>
<input type="hidden" name="durum" class="form-control" value="1" required>
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
<input type="text" name="username" onkeypress="return boslukEngelle()" style="text-transform: lowercase;" class="form-control" id="Kullanıcıadı" required>
<div class="invalid-feedback">Lütfen kullanıcı adınızı giriniz.</div>
</div>
</div>
<div class="col-12">
<label for="Şifre" class="form-label">Şifre</label>
<input type="text" name="password" class="form-control" id="Şifre" required>
<div class="invalid-feedback">Lütfen Şifrenizi giriniz.</div>
</div>
<div class="col-12">
<label for="Kullanıcıadı" class="form-label">Telefon</label>
<div class="input-group has-validation">
<input type="number" name="telefon" class="form-control" pattern="\d*" id="telefon" required> 
<div class="invalid-feedback">Lütfen Telefon Numaranızı Boşluksuz giriniz. </div>
</div>
</div>
<div class="col-12">
<label for="Kullanıcıadı" class="form-label">E-Posta</label>
<div class="input-group has-validation">
<input type="email" name="email" class="form-control" id="email" required>
<div class="invalid-feedback">Lütfen E-Posta Adresinizi giriniz. </div>
</div>
</div>
<div class="col-12">
<input type="checkbox" name="onay" required>
KVKK kapsamı detaylarına <a href="https://www.dijitaco.com/kvkk" style="color:#fff; font-weight:bold;" target="_blank">"Kişisel Verilerin Korunması ve İşlenmesi Şartları"</a> yer aldığı sayfamızdan ulaşabilirsiniz.
</div>
<div class="col-12">
<button class="btn btn-light w-100" type="submit">Aktivasyon</button>
</div>
</form>
<?php 
}else{
$isim	 	= $_POST['isim'];
$soyisim 	= $_POST['soyisim'];
$kart_id 	= $_POST['kart_id'];
$durum 		= $_POST['durum'];
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
echo'<h5 class="card-title text-light text-center pb-0 fs-4">Bu Mail Adresi ile Kayıt Mevcut<br>Şifrenizi Unuttuysanız Lütfen Şifremi Unuttum Linkine Tıklayınız.</h5>';
} else {
$sql = $baglan->prepare("INSERT INTO `uye` SET isim=?,soyisim=?,telefon=?,email=?,kullaniciadi=?,password=?,yetki=?,paket=?,tarih=?");
$kayit = $sql->execute(array($isim,$soyisim,$telefon,$email,$username,$sifre,'0','1',$tarih));

$uyesor = $baglan->prepare("SELECT * FROM `uye` ORDER BY `uye`.`id` DESC");
$uyesor ->execute(array($email));
$idcek	=$uyesor->fetch(PDO::FETCH_ASSOC);
$uyeidim			= $idcek["id"];


function trr_cevir($username) {
global $baglan;
$s=str_replace("â€™","_",$username);
$s=str_replace("â€?","_",$s);
$s=str_replace("â€œ","_",$s);
$s=str_replace("â€˜","_",$s);
$s=str_replace("â€™","_",$s);
$s=str_replace("ç","c",$s);
$s=str_replace("Ã§","c",$s);
$s=str_replace("ş","s",$s);
$s=str_replace("ÅŸ","s",$s);
$s=str_replace("ı","i",$s);
$s=str_replace("Ä±","i",$s);
$s=str_replace("ö","o",$s);
$s=str_replace("Ã¶","o",$s);
$s=str_replace("ğ","g",$s);
$s=str_replace("ÄŸ","g",$s);
$s=str_replace("ü","u",$s);
$s=str_replace("Ã¼","u",$s);
$s=str_replace("Ç","C",$s);
$s=str_replace("Ã‡","C",$s);
$s=str_replace("Ş","S",$s);
$s=str_replace("İ","I",$s);
$s=str_replace("Ä°","I",$s);
$s=str_replace("Ö","O",$s);
$s=str_replace("Ã–","O",$s);
$s=str_replace("Ğ","G",$s);
$s=str_replace(" ","",$s);
$s=str_replace("Ü","U",$s);
$s=str_replace("Ãœ","U",$s);
return $s;}

$profil =trr_cevir($username);

$guncelle =$baglan->prepare("UPDATE `kartvizit` SET `uye_id`=?,`profil`=?,`isim`=?,`soyisim`=?,`telefon`=?,`email`=?,`durum`=?,`kart_id`=? WHERE `kart_id`=?");
$guncelle ->execute(array($uyeidim,$profil,$isim,$soyisim,$telefon,$email,$durum,$kart_id,$kart_id));
/* LOG */
$islem ="Yeni Üye Kaydı Yapıldı ($isim $soyisim)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array('1',$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
if (isset ($kayit)){
	
$mesaj ='Sayın '.$isim.' '.$soyisim.' DijitaCO’yu Tercih Ettiğiniz İçin Teşekkür Ederiz. Satın Aldığınız Son Kartvizit. Giriş Paneliniz : https://vcard.dijitaco.com/giris Kullanıcı Adı : '.$username.' Şifre : '.$parola.'  Hesabınıza Giriş Yaptıktan Sonra Dijital Kartlvizitlerinizi Özelleştirebilirsiniz.';

/* SMS GÖNDERİMİ */
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_URL => 'https://api.netgsm.com.tr/sms/send/get',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => array('usercode' => '8503089932','password' => 'y4.6CFM3','gsmno' => ''.$telefon.'','message' => ''.$mesaj.'','msgheader' => '8503089932','filter' => '0','startdate' => '230520221650','stopdate' => '230520221830','dil' => 'TR'),
));

$response = curl_exec($curl);
curl_close($curl);
/* SMS GÖNDERİMİ */
	
setcookie("kullanici", $username, time()+3600*24);
setcookie("sifre", $sifre, time()+3600*24);
?>
<div class="pt-4 pb-2" align="center">
<img src="tema-1-assets/img/dijitacowhite.png?v=0.1" style="height:150px;">
<p class="text-center small" style="color:#fff;">Üyeliğiniz Başarılı Bir Şekilde Oluşturuldu.</p>
</div>

<div class="text-light" style="margin-left:30px; float:left; font-size:20px; color:#ffffff;" >
<b>Kullanıcı Adı:</b> <?php echo"$username";?><br>
<b>Şifre: </b><?php echo"$parola";?><br><br>
</div>
<div align="center" class="text-light text-center"><a href="sihirbaz?id=<?php echo"$uyeidim";?>"><button type="button" class="btn btn-light">Kartvizit Sihirbazı</button></div></a>
</h5>
<?php
}else{
?>
<div align="center" class="text-light text-center"><h3>Üyeliğiniz Oluşturulurken Hata Oluştu.</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-light">Panele Dön</button></a></div>
<?php	
}
}
}
?>
</div>
</div>
</div>
</div>
</section>
</div>
</main>
<?php require("footer.php"); ?>