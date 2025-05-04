<?php
SESSION_START();
OB_START();
include 'baglan.php';

$dil		= $_GET["dil"];

if(empty($dil)){$dil ="tr";}else{$dil ="$dil";}

$kart_id = $_GET["kart_id"];
$profil	 = $_GET["profil"];
if(isset($kart_id)){
$cek		= $baglan->prepare("SELECT * FROM `kartvizit` WHERE  `kart_id` =?");
$cek 		->execute(array($kart_id));
$bul 		= $cek->fetch(PDO::FETCH_ASSOC);
$id			= $bul["id"];
$durum		= $bul["durum"];
$hakkimda	= $bul["hakkimda"];
$tema		= $bul["tema"];
$uyelikid	= $bul["uye_id"];
$favicon	= $bul["resim"];
$tarih		= $bul["tarih"];
$adres		= $bul["adres"];
}elseif(isset($profil)){
$cek		= $baglan->prepare("SELECT * FROM `kartvizit` WHERE  `profil` =?");
$cek 		->execute(array($profil));
$bul 		= $cek->fetch(PDO::FETCH_ASSOC);
$id			= $bul["id"];
$kart_id	= $bul["kart_id"];
$durum		= $bul["durum"];
$hakkimda	= $bul["hakkimda"];
$tema		= $bul["tema"];
$uyelikid	= $bul["uye_id"];
$favicon	= $bul["resim"];
$tarih		= $bul["tarih"];
$adres		= $bul["adres"];
}
if($durum =="0"){
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Kurulum Sihirbazı</title>
    
    <!-- Styles -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600,700&display=swap" rel="stylesheet">
    <link href="assets/css/bootstrap.css?v=0.5" rel="stylesheet">
    <link href="assets/css/fontawesome-all.css" rel="stylesheet">
	<link href="assets/css/aktivasyon.css?v=0.5" rel="stylesheet">
	<style>
	.button {
	display: inline-block;
	width: 100%;
	height: 3.5rem;
	border: 1px solid #a91265;
	border-radius: 32px;
	background-color: #fff;
	color: #000;
	font-weight: 600;
	font-size: 0.875rem;
	line-height: 0;
	cursor: pointer;
	transition: all 0.2s;
}
.button:hover {
	border: 1px solid #ffffff;
	background-color: #000;
	color: #ffffff;
}
	</style>
	<!-- Favicon  -->
</head>
<body style="background-image: url('assets/img/aktivasyon.png?v=0.1');">
    
    <!-- Header -->
    <header id="header" class="header">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="text-container">
<img src="assets/img/logosiyah.png" style="max-height:200px;" class="img-fluid"><br><h3 style="color:#000;">DAHA YEŞİL BİR DOĞA İÇİN "DİJİTACO"</h3><br>
                        <h4 style="color:#000;">Kurulum Sihirbazı</h4>
                        <p class="p-large" style="color:#000;">
Değerli Müşterimiz,</br>
"<b>Yeni Nesil Dijital Kartvizit DijitaCO'yu</b>" <br>Tercih Ettiğiniz İçin Teşekkür Ederiz.<br>
Kuruluma Başlamak İçin Hazırız.<br> Kurulum'u Başlatmak İçin Butona Tıklayınız.
						</p>
                        
                        <!-- Sign Up Form -->
                            <div class="form-group">
                                <button type="submit" onclick="location.href='wizard?kart_id=<?php echo"$kart_id"?>'" class="form-control button">KURULUMU BAŞLAT</button><br><br>
                            </div>
                        <!-- end of sign up form -->
                    </div> <!-- end of text-container -->
                </div> <!-- end of col -->
            </div> <!-- end of row -->
        </div> <!-- end of container -->
       
    </header> <!-- end of header -->
    <!-- end of header -->
    <!-- Scripts -->
</body>
</html>
<?php
}else{
$vid= $baglan->prepare("SELECT * FROM `video` WHERE  `kart_id` =?");
$vid ->execute(array($kart_id));
$vidx = $vid->fetch(PDO::FETCH_ASSOC);
$videolink = $vidx["videolink"];


/* KONTROLLER */
$faturasorgu	= $baglan->prepare("SELECT count(id) FROM `kurumsal` WHERE `kart_id` =?");
$faturasorgu	->execute(array($kart_id));
$fatura_sor		= $faturasorgu->fetch(PDO::FETCH_NUM);
$f_sor			= $fatura_sor[0];

$resimsorgu		= $baglan->prepare("SELECT count(id) FROM `galeri` WHERE `kart_id` =?");
$resimsorgu		->execute(array($kart_id));
$resim_sor		= $resimsorgu->fetch(PDO::FETCH_NUM);
$r_sor			= $resim_sor[0];

$dokumansorgu	= $baglan->prepare("SELECT count(id) FROM `katalog` WHERE `kart_id` =?");
$dokumansorgu	->execute(array($kart_id));
$dokuman_sor	= $dokumansorgu->fetch(PDO::FETCH_NUM);
$d_sor			= $dokuman_sor[0];
/* KONTROLLER */


if(isset($kart_id)){
/* istatistik */
$tarih 		=date('Y-m-d',time());
$ziyaretcikayit = $baglan->prepare("INSERT INTO `ziyaretci` SET kart_id=?, tarih=?, gercekip=?, sehir=?, ulke=?, tarayici=?, platform=?");
$ziyaretcikaydet = $ziyaretcikayit->execute(array($kart_id, $tarih, $gercekip, $sehir, $ulke, $webbrowser, $webplatform));
/* istatistik */
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<html translate="no">
<meta name="google" content="notranslate">
<meta http-equiv="Content-Language" content="en">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
<title><?php echo"$title";?></title>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no" />
<meta name="description" content="<?php echo"$description";?>">
<link rel="canonical" href="<?php echo $_SERVER['SERVER_NAME'];?>" />
<link rel="next" href="<?php echo $_SERVER['SERVER_NAME'];?> />
<meta property="og:locale" content="tr_TR" />
<meta property="og:type" content="website" />
<meta property="og:title" content="<?php echo"$title";?>" />
<meta property="og:description" content="<?php echo"$description";?>" />
<meta property="og:url" content="<?php $_SERVER['SERVER_NAME'];?>" />
<meta property="og:site_name" content="<?php echo"$title";?>" />
<meta property="og:image" content="<?php echo"$logo";?>" />
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo"$favicon";?>" >
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo"$favicon";?>">
<link rel="shortcut icon" sizes="196x196" href="<?php echo"$favicon";?>">
<link rel="stylesheet" href="tema-1-assets/css/business.css?v=<?php echo"$sayilar";?>">
<link rel="stylesheet" href="tema-1-assets/css/bootstrap.min.css?v=<?php echo"$sayilar";?>">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body>
              <div class="modal fade" id="fatura" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" style="color:#43a4ec;">
					  <?php if($dil =="tr"){echo"Fatura Bilgileri";}elseif($dil =="en"){echo"Billing Information";}elseif($dil =="ru"){echo"Платежная информация";}elseif($dil =="sa"){echo"معلومات الفواتير";}?>
					  </h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php 
$fir= $baglan->prepare("SELECT * FROM `kurumsal` WHERE  `kart_id` =?");
$fir ->execute(array($kart_id));
while ($firm = $fir->fetch(PDO::FETCH_ASSOC)){
$firma			= $firm["firma"];
$vergidairesi	= $firm["vergidairesi"];
$vergino		= $firm["vergino"];
$adresim		= $firm["adres"];
if($dil =="tr"){
echo"<b>Firma Adı : </b>$firma<br><b>Vergi Dairesi:</b> $vergidairesi<br><b>Vergi Numarası:</b> $vergino<br> <b>Adres:</b> $adresim<br><hr>";
}elseif($dil =="en"){
echo"<b>$firma</b><br><b>Tax Administration:</b> $vergidairesi<br><b>Tax number:</b> $vergino<br> $adresim<br><hr>";
}elseif($dil =="ru"){
echo"<b>$firma</b><br><b>Налоговая администрация:</b> $vergidairesi<br><b>Налоговый номер:</b> $vergino<br> $adresim<br><hr>";
}elseif($dil =="sa"){
echo"<b>$firma</b><br><b>مكتب الضرائب:</b> $vergidairesi<br><b>الرقم الضريبي:</b> $vergino<br> $adresim<br><hr>";
}
}
					  ?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php if($dil =="tr"){echo"Kapat";}elseif($dil =="en"){echo"Close";}elseif($dil =="ru"){echo"Закрывать";}elseif($dil =="sa"){echo"أغلق";}?></button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="galeri" tabindex="-1">
                <div class="modal-dialog modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" style="color:#43a4ec;"><?php if($dil =="tr"){echo"Ürünler & İlanlar";}elseif($dil =="en"){echo"Products & Classifieds";}elseif($dil =="ru"){echo"Товары и объявления";}elseif($dil =="sa"){echo"المنتجات والإعلانات المبوبة";}?></h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
<?php
$resimm 		= $baglan->prepare("SELECT * FROM `galeri` WHERE `kart_id` =?");
$resimm 		->execute(array($kart_id));
while($us = $resimm->fetch(PDO::FETCH_ASSOC)){
$gal 		=$us["resim"];
$galbaslik 	=$us["baslik"];
$galaciklama =$us["aciklama"];
?>
		<div class="card-body">
          <div class="card">
            <img src="assets/galeri/<?php echo"$gal";?>" class="card-img-top">
			<?php 
			if(empty($galbaslik)){}else{
			?>
            <div class="card-body">
              <h5 class="card-title"><?php echo"$galbaslik";?></h5>
              <p class="card-text"><?php echo"$galaciklama";?></p>
            </div>
			<?php }?>
          </div>
          </div>
<?php }?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php if($dil =="tr"){echo"Kapat";}elseif($dil =="en"){echo"Close";}elseif($dil =="ru"){echo"Закрывать";}elseif($dil =="sa"){echo"أغلق";}?></button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="qr" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">QR</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" align="center">
<img src="https://chart.googleapis.com/chart?cht=qr&chl=<?php echo"$domain";?>index?kart_id=<?php echo"$kart_id"?>&chs=160x160&chld=L|0" class="qr-code img-thumbnail img-responsive" />
                    </div>
                    <div class="modal-footer">
<button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php if($dil =="tr"){echo"Kapat";}elseif($dil =="en"){echo"Close";}elseif($dil =="ru"){echo"Закрывать";}elseif($dil =="sa"){echo"أغلق";}?></button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="hakkimda" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" style="color:#43a4ec;"><?php if($dil =="tr"){echo"HAKKIMDA";}elseif($dil =="en"){echo"ABOUT ME";}elseif($dil =="ru"){echo"ОБО МНЕ";}elseif($dil =="sa"){echo"ْعَنِّي";}?></h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hakkimda"; ?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php if($dil =="tr"){echo"Kapat";}elseif($dil =="en"){echo"Close";}elseif($dil =="ru"){echo"Закрывать";}elseif($dil =="sa"){echo"أغلق";}?></button>
                    </div>
                  </div>
                </div>
              </div>
			                <div class="modal fade" id="maps" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" style="color:#43a4ec;"><?php if($dil =="tr"){echo"HARİTA SEÇİMİ";}elseif($dil =="en"){echo"MAP SELECTION";}elseif($dil =="ru"){echo"ВЫБОР КАРТЫ";}elseif($dil =="sa"){echo"اختيار الخريطة";}?></h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=apple&hesap=<?php echo"$adres"; ?>"><img src="assets/images/apple-maps.png?v=0.001" height="128px"></a> &nbsp;&nbsp;&nbsp;
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=map&hesap=<?php echo"$adres"; ?>"><img src="assets/images/google-maps.png?v=0.001" height="128px"></a> 
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php if($dil =="tr"){echo"Kapat";}elseif($dil =="en"){echo"Close";}elseif($dil =="ru"){echo"Закрывать";}elseif($dil =="sa"){echo"أغلق";}?></button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="dokuman" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" style="color:#43a4ec;"><?php if($dil =="tr"){echo"Dökümanlar";}elseif($dil =="en"){echo"Documents";}elseif($dil =="ru"){echo"документы";}elseif($dil =="sa"){echo"وثائق";}?></h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
<?php 
$cat= $baglan->prepare("SELECT * FROM `katalog` WHERE  `kart_id` =?");
$cat ->execute(array($kart_id));
while ($catx = $cat->fetch(PDO::FETCH_ASSOC)){
extract($catx);
?>
<div class="col-3 p-2" style="float:left;">
<a href="<?php echo"$link";?>"><img src="assets/images/dokuman.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a href="<?php echo"$link";?>" class="text-dark text-decoration-none" style="font-size:8pt;"><?php echo"$baslik";?></a>
</div>
<?php
}
?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php if($dil =="tr"){echo"Kapat";}elseif($dil =="en"){echo"Close";}elseif($dil =="ru"){echo"Закрывать";}elseif($dil =="sa"){echo"أغلق";}?></button>
                    </div>
                  </div>
                </div>
              </div>
<div class="ustmenu" align="center">
<div class="dropdown"  class="form-control">
<button class="btn-dil btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false" style="color: #787879;border: 1px solid #787879;
    border-radius: 25px;
    margin-top: 2px;
">
<ion-icon name="globe-outline"></ion-icon>
<span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
</button>
<div class="dropdown-menu">
		<a class="dropdown-item" href="index.php?kart_id=<?php echo"$kart_id";?>&dil=tr"><img src="assets/img/turkish.png?v=0.001" style="height:10px;">&nbsp;Türkçe</a>
		<a class="dropdown-item" href="index.php?kart_id=<?php echo"$kart_id";?>&dil=en"><img src="assets/img/english.png?v=0.001" style="height:10px;">&nbsp;English</a>
		<a class="dropdown-item" href="index.php?kart_id=<?php echo"$kart_id";?>&dil=ru"><img src="assets/img/russian.png?v=0.001" style="height:10px;">&nbsp;Russian</a>
		<a class="dropdown-item" href="index.php?kart_id=<?php echo"$kart_id";?>&dil=sa"><img src="assets/img/arabia.png?v=0.001" style="height:10px;">&nbsp;Arabia</a>
</div>
</div>
</div>
<?php
if (empty($kart_id)){
header('location: giris');	
}elseif(empty($id)){
header('location: giris');		
}elseif($durum =="2"){
?>
<img src="<?php echo"$logo";?>">
              <div class="alert alert-danger bg-danger text-light border-0 alert-dismissible fade show" role="alert">
                <?php if($dil =="tr"){echo"BU HESAP DURDULMUŞTUR.";}elseif($dil =="en"){echo"THIS ACCOUNT HAS BEEN STOPPED.";}elseif($dil =="ru"){echo"ЭТОТ АККАУНТ БЫЛ ЗАКРЫТ.";}elseif($dil =="sa"){echo"تم إيقاف هذا الحساب.";}?>
              </div>
<?PHP
}else{
$islemler= $baglan->prepare("SELECT * FROM `kartvizit` WHERE  `kart_id` =?");
$islemler ->execute(array($kart_id));
$yaz = $islemler->fetch(PDO::FETCH_ASSOC);
extract($yaz);
?>
<div id="cerceve" > 
<div id="govde" >
			<div class="banner-image"><!--Banner Başlangıç-->
				<div class="banner-image-main">
				<div class="dilsec">&nbsp;&nbsp;<?php if($dil =="tr"){echo"Dil Seçimi";}elseif($dil =="en"){echo"Language";}elseif($dil =="ru"){echo"Язык";}elseif($dil =="sa"){echo"اختيار اللغة";}?></div>
					<div class="logo" align="center"><br>
              <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                    <img src="<?php echo"$arkaresim";?>" class="d-block w-100" style ="max-height:220px; max-width:370px;" alt="...">
                  </div>
<?php
$sliderim= $baglan->prepare("SELECT * FROM `slider` WHERE  `kart_id` =?");
$sliderim ->execute(array($kart_id));
while ($slide = $sliderim->fetch(PDO::FETCH_ASSOC)){
?>
                  <div class="carousel-item">
                    <img src="/assets/slider/<?php echo $slide["slider"];?>" class="d-block w-100" style ="max-height:220px;  max-width:370px;" alt="...">
                  </div>
<?php
}
?>	  
                </div>
              </div><!-- End Slides with indicators -->
					</div>
				</div>
				<div class="media align-items-left justify-content-left profile-head">
					<div class="profile-qr-code">
						<img src="<?php if(empty($resim)){echo"tema-1-assets/img/boslogo.jpg";}else{echo"$resim";}?>" id="logo_preview" alt="user" class="img-thumbnail">
					</div>
				</div>
				<div class="align-items-right" style="margin-left:150px; margin-top:-30px; position: relative;">
				<h3 class="name"><?php echo"$isim $soyisim";?> <?php if ($uyelikid == $cek_id){ ?><a href="yonetim.php" alt="Kartviziti Düzenle" title="Kartviziti Düzenle"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></a><?php } ?>
				
				</h3>
					<div class="headeris">
					<span><?php echo"$unvan";?></span>
					</div>
			</div>
			</div>
		<div class="section full mb-2"><!--Menü Başlangıç-->
            <div class="tab-contents">
                <div class="tab-pane fade show active" id="feed" role="tabpanel">
                    <div class="mt-2 pr-2 pl-2">
                        <div class="row kategori">
<?php if($ua['name'] =="Apple Safari"){?>	
<div class="col-3 p-2 text-center" style="float:left;">
<button type="button" class="add-to-contact-btn" style="margin-left:-8px; border:none; background-color:#f9fafb;"><img src="assets/images/rehber.png?v=0.001" style="border:none;" height="70px"></button>
<br>
<a style="font-size:8pt;"><?php if($dil =="tr"){echo"REHBERE EKLE";}elseif($dil =="en"){echo"ADD CONTACT";}elseif($dil =="ru"){echo"Контакты Регистрация";}elseif($dil =="sa"){echo"سجل الهاتف";}?></a>
</div>
<?php }else{?>
<div class="col-3 p-2" align="center">
<button type="button" class="add-to-contact-btn" style="border:none; background-color:#f9fafb;"><img src="assets/images/rehber.png?v=0.001" style="border:none;" height="70px"></button>
<br>
<a style="font-size:8pt;"><?php if($dil =="tr"){echo"REHBERE EKLE";}elseif($dil =="en"){echo"ADD CONTACT";}elseif($dil =="ru"){echo"Контакты Регистрация";}elseif($dil =="sa"){echo"سجل الهاتف";}?></a>
</div>
<?php }?>
<script>
    var VCARD_DETAILS = [
	{"value":"<?php echo"$gsm";?>","label":"","type":"phone"},
	{"value":"<?php echo"$telefon";?>","label":"","type":"phone"},
	{"value":"<?php echo"$email";?>","label":"","type":"email"},
	{"value":"<?php echo"$web";?>","label":"","type":"website"},
	{"value":"<?php echo"$domain";?><?php echo"$profil";?>.co","label":"Dijital Kartvizit","type":"website"},
	{"value":"<?php echo"$adres";?>","label":"Adres","type":"address"},
	],
    TITLE = "<?php echo"$isim $soyisim";?>",
    SUB_TITLE = "<?php echo"$unvan";?>",
    LOGO = "<?php echo"$domain$resim";?>",
	LOGO_64_ENCODED = "<?php echo base64_encode(file_get_contents($resim)) ;?>",
    DESCRIPTION = "<?php echo"$title";?>",
    DETAILS_FIELD_LIMIT = 999;
</script>
<script src="assets/js/jquery.min.js?ver=0.001"></script>
<script src="assets/js/kartvizit.js?ver=<?php echo"$sayilar";?>"></script>
<?php
if(empty($hakkimda)) {}else{
?>
<div class="col-3 p-2" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#hakkimda" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/hakkimda.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;"><?php if($dil =="tr"){echo"HAKKIMDA";}elseif($dil =="en"){echo"ABOUT ME";}elseif($dil =="ru"){echo"ОБО МНЕ";}elseif($dil =="sa"){echo"ْعَنِّي";}?></a>
</div>
<?php }
if(empty($telefon)) {}else{
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=telefon&hesap=<?php echo"$telefon"; ?>" style="text-decoration:none;"><img src="assets/images/sphone.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=telefon&hesap=<?php echo"$telefon"; ?>" style="font-size:8pt;"><?php if($dil =="tr"){echo"TELEFON";}elseif($dil =="en"){echo"TELEPHONE";}elseif($dil =="ru"){echo"ТЕЛЕФОН";}elseif($dil =="sa"){echo"هاتف";}?></a>
</div>
<?php } 
if(empty($gsm)) {}else{
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=cep&hesap=<?php echo"$gsm"; ?>" style="text-decoration:none;"><img src="assets/images/phone.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=cep&hesap=<?php echo"$gsm"; ?>" style="font-size:8pt;"><?php if($dil =="tr"){echo"GSM";}elseif($dil =="en"){echo"MOBILE TELEPHONE";}elseif($dil =="ru"){echo"ТЕЛЕФОН";}elseif($dil =="sa"){echo"هاتف";}?></a>
</div>
<?php } 
if(empty($email)) {}else{
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=mail&hesap=<?php echo"$email"; ?>" style="text-decoration:none;"><img src="assets/images/mail.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=mail&hesap=<?php echo"$email"; ?>" style="font-size:8pt;"><?php if($dil =="tr"){echo"E-POSTA";}elseif($dil =="en"){echo"E-MAIL";}elseif($dil =="ru"){echo"почта";}elseif($dil =="sa"){echo"بريد";}?></a>
</div>
<?php } ?>
<div class="col-3 p-2" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#maps" class="text-dark text-decoration-none"><img src="assets/images/map.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a href="#" data-bs-toggle="modal" data-bs-target="#maps" class="text-dark text-decoration-none" style="font-size:8pt;"><?php if($dil =="tr"){echo"KONUM";}elseif($dil =="en"){echo"MAP";}elseif($dil =="ru"){echo"карта";}elseif($dil =="sa"){echo"خريطة";}?></a>
</div>
<?php
if(empty($web)) {}else{
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=web&hesap=<?php echo"$web"; ?>" style="text-decoration:none;"><img src="assets/images/web.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=web&hesap=<?php echo"$web"; ?>" style="font-size:8pt;"><?php if($dil =="tr"){echo"WEB SİTESİ";}elseif($dil =="en"){echo"WEB ADDRESS";}elseif($dil =="ru"){echo"веб-адрес";}elseif($dil =="sa"){echo"شبكة";}?></a>
</div>
<?php }
if(empty($videolink)) {}else{
?>
<div class="col-3 p-2" align="center">
<a href="#" class="youtube-link item appitem" youtubeid="<?php echo"$videolink";?>"><img src="assets/images/video.png?v=0.002" style="border:none;" height="70px"></a>
<br>
<a href="#" class="youtube-link item appitem" youtubeid="<?php echo"$videolink";?>" style="font-size:8pt;"><?php if($dil =="tr"){echo"TANITIM VİDEO";}elseif($dil =="en"){echo"PROMOTIONAL VIDEO";}elseif($dil =="ru"){echo"РЕКЛАМНЫЙ РОЛИК";}elseif($dil =="sa"){echo"فيديو ترويجي";}?></a>
</div>
<?php }?>
<div class="col-3 p-2" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#qr" style="text-decoration:none;"><img src="assets/images/qr.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">QR</a>
</div>
<?php
if($f_sor !=="0") {
?>
<div class="col-3 p-2" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#fatura" style="text-decoration:none;"><img src="assets/images/fatura.png?V=0.1" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;"><?php if($dil =="tr"){echo"FATURA B.";}elseif($dil =="en"){echo"BILLING INFORMATION";}elseif($dil =="ru"){echo"Платежная информация";}elseif($dil =="sa"){echo"معلومات الفواتير";}?></a>
</div>
<?php }
if($r_sor !=="0") {
?> 
<div class="col-3 p-2" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#galeri" style="text-decoration:none;"><img src="assets/images/galeri.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;"><?php if($dil =="tr"){echo"ÜRÜNLER";}elseif($dil =="en"){echo"PRODUCTS & CLASSFIELDS";}elseif($dil =="ru"){echo"Товары и объявления";}elseif($dil =="sa"){echo"المنتجات والإعلانات المبوبة";}?></a>
</div> 
<?php }?>
<div class="col-3 p-2" align="center">
<a href="#" id="paylas"><img src="assets/images/paylas.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;"><?php if($dil =="tr"){echo"PAYLAŞ";}elseif($dil =="en"){echo"CARDVISIT SHARE";}elseif($dil =="ru"){echo"ДЕЛИТЬСЯ";}elseif($dil =="sa"){echo"شارك بطاقة عملك";}?></a>
</div>
<?PHP
if($d_sor !=="0") {
?> 
 <div class="col-3 p-2" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#dokuman" style="text-decoration:none;"><img src="assets/images/dokuman.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;"><?php if($dil =="tr"){echo"DÖKÜMANLAR";}elseif($dil =="en"){echo"DOCUMENTS";}elseif($dil =="ru"){echo"документы";}elseif($dil =="sa"){echo"وثائق";}?></a>
</div>
<?php }

$ssyl= $baglan->prepare("SELECT * FROM `sosyal_medya` WHERE  `kart_id` =?");
$ssyl ->execute(array($kart_id));
while ($medya = $ssyl->fetch(PDO::FETCH_ASSOC)){
extract($medya);
if($sosyal == "link") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=web&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/link.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=web&hesap=<?php echo"$hesap"; ?>" style="font-size:8pt;"><?php if($dil =="tr"){echo"WEB SİTESİ";}elseif($dil =="en"){echo"WEB ADDRESS";}elseif($dil =="ru"){echo"веб-адрес";}elseif($dil =="sa"){echo"شبكة";}?></a>
</div>
<?php }
if($sosyal == "whatsapp") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=whatsapp&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/whatsapp.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">WHATSAPP</a>
</div>
<?php }
if($sosyal == "whatsappkatalog") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=whatsappkatalog&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/whatsappbusiness.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">BUSINESS WHATSAPP</a>
</div>
<?php }
if($sosyal == "telegram") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=telegram&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/telegram.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">TELEGRAM</a>
</div>
<?php }
if($sosyal == "facebook") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=facebook&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/facebook.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">FACEBOOK</a>
</div>
<?php }
if($sosyal == "twitter") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=twitter&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/twitter.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">TWITTER</a>
</div>
<?php }
if($sosyal == "instagram") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=instagram&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/instagram.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">INSTAGRAM</a>
</div>
<?php }
if($sosyal == "youtube") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=youtube&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/youtube.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">YOUTUBE</a>
</div>
<?php }
if($sosyal == "linkedin") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=linkedin&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/linkedin.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">LINKEDIN</a>
</div>
<?php }
if($sosyal == "pinterest") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=pinterest&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/pinterest.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">PINTEREST</a>
</div>
<?php }
if($sosyal == "skype") {
?>
<div class="col-3 p-2" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#skype" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/skype.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">SKYPE</a>
              <div class="modal fade" id="skype" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" style="color:#43a4ec;">SKYPE</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hesap";?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php if($dil =="tr"){echo"Kapat";}elseif($dil =="en"){echo"Close";}elseif($dil =="ru"){echo"Закрывать";}elseif($dil =="sa"){echo"أغلق";}?></button>
                    </div>
                  </div>
                </div>
              </div>

</div>
<?php }
if($sosyal == "snapchat") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=snapchat&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/snapchat.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">SNAPCHAT</a>
</div>
<?php }
if($sosyal == "sahibinden") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=sahibinden&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/sahibinden.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">SAHİBİNDEN</a>
</div>
<?php }
if($sosyal == "n11") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=n11&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/n11.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">N11</a>
</div>
<?php }
if($sosyal == "trendyol") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=trendyol&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/trendyol.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">TRENDYOL</a>
</div>
<?php }
if($sosyal == "hepsiburada") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=hepsiburada&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/hepsiburada.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">HEPSİBURADA</a>
</div>
<?php }
if($sosyal == "ptt") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=ptt&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/pttavm.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">PTT AVM</a>
</div>
<?php }
if($sosyal == "amazon") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=amazon&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/amazon.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">AMAZON</a>
</div>
<?php }
if($sosyal == "hepsiemlak") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=hepsiemlak&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/hepsiemlak.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">HEPSİEMLAK</a>
</div>
<?php }
if($sosyal == "arabam") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=arabam&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/arabam.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">ARABAM</a>
</div>
<?php }
if($sosyal == "letgo") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=letgo&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/letgo.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">LETGO</a>
</div>
<?php }
if($sosyal == "wechat") {
?>
<div class="col-3 p-2" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#wechat" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/wechat.png?v=0.1" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">WECHAT</a>
              <div class="modal fade" id="wechat" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" style="color:#43a4ec;">WECHAT</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hesap";?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"><?php if($dil =="tr"){echo"Kapat";}elseif($dil =="en"){echo"Close";}elseif($dil =="ru"){echo"Закрывать";}elseif($dil =="sa"){echo"أغلق";}?></button>
                    </div>
                  </div>
                </div>
              </div>
</div>
<?php }
if($sosyal == "tiktok") {
?>
<div class="col-3 p-2" align="center">
<a href="istatistik.php?kart_id=<?php echo"$kart_id"; ?>&bilgi=tiktok&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/tiktok.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:8pt;">TİKTOK</a>
</div>
<?php }} ?>
 
<script src="assets/js/kopyala.js" type="text/javascript"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@10"></script>
<?php
$bankam= $baglan->prepare("SELECT * FROM `banka` WHERE  `kart_id` =?");
$bankam ->execute(array($kart_id));
while ($banks = $bankam ->FETCH(PDO::FETCH_ASSOC)){
$banka	= $banks["banka"];
$hesap	= $banks["hesap"]; 
$b_id	= $banks["id"];
$iban	= $banks["iban"];

if($banka =="Garanti Bankası"){
	
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;" id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/garanti.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="Deniz Bank"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;" id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/deniz.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="Halk Bankası"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/halkbank.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="Akbank"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/akbank.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="HSBC Bankası"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/hsbc.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="ING Bank"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/ing.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="İş Bankası"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/is.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="QNB Finans Bankası"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/qnb.png?v=0.1" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="Kuveyt Türk Bankası"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/kuveyt.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="Şeker Bank"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/seker.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="TEB Bankası"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/teb.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="Ziraat Bankası"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/ziraat.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php 
}elseif($banka =="Yapı Kredi Bankası"){
?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/ykredi.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php
}elseif($banka =="PTT Bank"){
	?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/pttbank.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php 
}elseif($banka =="Türkiye Finans Bankası"){
	?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/turkiyefinans.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php 
}elseif($banka =="Vakıfbank"){
	?>
<div class="col-3 p-2" align="center">
<a style="text-decoration:none; cursor: pointer;"  id="shareOther" onclick="banka<?php echo"$b_id";?>()"><img src="tema-1-assets/img/banka/vakif.png?v=0.001" style="border:none;" height="70px"></a>
<br>
<a id="shareOther" onclick="banka<?php echo"$b_id";?>()" style="font-size:8pt;"><?php echo"$hesap";?></a>
</div>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("<?php if($dil =="tr"){echo"Başarılı";}elseif($dil =="en"){echo"Success";}elseif($dil =="ru"){echo"Успешный";}elseif($dil =="sa"){echo"ناجح";}?>",' <?php echo"$iban";?> <?php if($dil =="tr"){echo"Kopyalandı";}elseif($dil =="en"){echo"Copied";}elseif($dil =="ru"){echo"Скопировано";}elseif($dil =="sa"){echo"نسخ";}?>','success');
}, function(err) {
  console.error('Error', err);
});
  }
</script>
<?php 
}
}?>
               </div>
                    </div>
                </div>
            </div>
        </div><!--Menü Başlangıç-->
<?php }?>
						</div>
					
</div>
     <script>
    const paylasButon = document.getElementById("paylas");
    paylasButon.addEventListener("click", async () =>{
        if (navigator.canShare) {
            try {
                //paylaşma özelliği
                await navigator.share({
                    title:"<?php echo"$title";?>",
                    text:"<?php if($dil =="tr"){echo"Merhaba Benimle İletişime Geçmek İçin :";}elseif($dil =="en"){echo"Hello, To Contact Me:";}elseif($dil =="ru"){echo"Здравствуйте, для связи со мной:";}elseif($dil =="sa"){echo"مرحبًا ، للتواصل معي:";}?>",
                    url:"<?php echo"$domain";?><?php echo"$profil";?>.co"
                })
                console.log("")
            } catch (error) {
                console.log("")
            }
 
        } else {
            Console.log("")
        }
    });
    </script>
<script src="tema-1-assets/js/popup"></script>
<script src="tema-1-assets/js/lib/jquery-3.4.1.min.js"></script>
<script src="tema-1-assets/js/lib/popper.min.js"></script>
<script src="tema-1-assets/js/lib/bootstrap.min.js"></script>
<script type="module" src="https://unpkg.com/ionicons@5.0.0/dist/ionicons/ionicons.js"></script>
<script src="tema-1-assets/js/plugins/owl-carousel/owl.carousel.min.js"></script>
<script src="tema-1-assets/js/plugins/jquery-circle-progress/circle-progress.min.js"></script>
<script src="tema-1-assets/js/sharer.min.js"></script>
<script src="tema-1-assets/js/bootstrap.bundle.min.js"></script>
<script src="tema-1-assets/js/youtubepopup.js"></script>
</body>
</html>
<?php }?>