<?php
SESSION_START();
OB_START();
include 'baglan.php';
function isMobile () {
  return is_numeric(strpos(strtolower($_SERVER['HTTP_USER_AGENT']), "mobile"));
}
if (isset($isim)){
}else{
header('location: giris');	
}
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
  <link href="assets/vendor/bootstrap/css/bootstrap.min.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/boxicons/css/boxicons.min.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/quill/quill.snow.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/quill/quill.bubble.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/remixicon/remixicon.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/vendor/simple-datatables/style.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
  <link href="assets/css/style.css?v=<?php echo"$sayilar";?>" rel="stylesheet">
</head>
<body>
<?php 
if ($yetki =="1"){
?>
  <header id="header" class="header fixed-top d-flex align-items-center">
  <div class="d-flex align-items-center justify-content-between">
      <a href="yonetim" class="logo d-flex align-items-center">
        <img src="<?php echo"$logo";?>" alt="" style="min-height:65px;">
       <span class="d-none d-lg-block"></span>
      </a>
      <i class="bi bi-list toggle-sidebar-btn"></i>
    </div>
    <nav class="header-nav ms-auto">
      <ul class="d-flex align-items-center">
        <li class="nav-item dropdown pe-3">
          <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <span class="d-none d-md-block dropdown-toggle ps-2"><?php echo"$isim $soyisim";?></span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
            <li class="dropdown-header">
              <h6><?php echo"$isim $soyisim";?></h6>
			  <a href="profil?id=<?php echo"$uye_id";?>"><span style="font-size:10pt;">Profilim</span></a>
            </li>
            <li>
              <hr class="dropdown-divider">
            </li>
           <li>
              <a class="dropdown-item d-flex align-items-center" href="cikis">
                <i class="bi bi-box-arrow-right"></i>
                <span style="font-size:10pt;">Çıkış Yap</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </header> 
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li class="nav-item">
        <a class="nav-link " href="yonetim">
          <i class="bi bi-house-fill"></i>
          <span style="font-size:10pt;">Anasayfa</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#kartvizit" data-bs-toggle="collapse" href="#">
          <i class="bi bi-credit-card-2-front-fill"></i><span style="font-size:10pt;">DİJİTALKART İŞLEMLERİ</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="kartvizit" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="kurumsal">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Kurumsal Bilgi</span>
            </a>
          </li>
          <li>
            <a href="banka">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Banka Hesabı Ekle</span>
            </a>
          </li>
          <li>
            <a href="resim">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Galeri Resim Ekle</span>
            </a>
          </li>
          <li>
            <a href="slider">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Slider Ekle</span>
            </a>
          </li>
		  <li>
            <a href="sosyal">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Sosyal Medya Ekle</span>
            </a>
          </li>
		  <li>
            <a href="katalog">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Katalog Ekle</span>
            </a>
          </li>
		  <li>
            <a href="video">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Tanıtım Video Ekle</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#kart" data-bs-toggle="collapse" href="#">
          <i class="bi bi-credit-card-2-front-fill"></i><span style="font-size:10pt;">TÜM KARTVİZİTLER</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="kart" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="kartvizit.php">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Aktif Kartvizitleri Listele</span>
            </a>
          </li>
          <li>
            <a href="pasif-kart.php">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Pasif Kartvizitleri Listele</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#kurumsal" data-bs-toggle="collapse" href="#">
          <i class="bi bi-people-fill"></i><span style="font-size:10pt;">KURUMSAL ÜYE İŞLEMLERİ</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="kurumsal" class="nav-content collapse " data-bs-parent="#sidebar-nav">
            <li>
            <a href="kurumsaluyeler.php">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Kurumsal Kullanıcıları Listele</span>
            </a>
          </li>
          <li>
            <a href="kurumsaluye.php">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Kurumsal Kullanıcı Ekle</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#bayi" data-bs-toggle="collapse" href="#">
          <i class="bi bi-file-person"></i><span style="font-size:10pt;">BAYİİ İŞLEMLERİ</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="bayi" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="bayiler">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Bayileri Listele</span>
            </a>
          </li>
          <li>
            <a href="bayi">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Bayi Ekle</span>
            </a>
          </li>
          <li>
            <a href="bayi_kart">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Toplu Kartvizit Oluştur</span>
            </a>
          </li>
        </ul>
      </li>
     <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#rapor" data-bs-toggle="collapse" href="#">
          <i class="bi bi-credit-card-2-front-fill"></i><span style="font-size:10pt;">RAPOR İŞLEMLERİ</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="rapor" class="nav-content collapse " data-bs-parent="#sidebar-nav">
           <li>
            <a href="ozet_rapor">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Raporlar Özet</span>
            </a>
          </li>
<!-- <li>
            <a href="ziyaretci_rapor">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Ziyaretçi Raporları</span>
            </a>
          </li>
		<li> -->
            <a href="sosyal_rapor">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Sosyal Medya Raporları</span>
            </a>
          </li>
          <li>
            <a href="pazaryeri_rapor">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Pazaryeri Raporları</span>
            </a>
          </li>
          <li>
            <a href="diger_rapor">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Etkileşim Raporları</span>
            </a>
          </li>
          <li>
            <a href="ozel_rapor">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Özel Rapor</span>
            </a>
          </li>
        </ul>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="sms">
          <i class="bi bi-chat-square-text-fill"></i>
          <span style="font-size:10pt;">TOPLU SMS</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" href="kullanicilar">
          <i class="bi bi-people"></i>
          <span style="font-size:10pt;">BİREYSEL KULLANICILAR</span>
        </a>
      </li>
	  
      <li class="nav-item">
        <a class="nav-link collapsed" href="ayarlar">
          <i class="bi bi-sliders"></i>
          <span style="font-size:10pt;">GENEL AYARLAR</span>
        </a>
      </li>
		<li class="nav-item">
        <a class="nav-link collapsed" href="destek">
          <i class="bi bi-info-circle-fill"></i>
          <span style="font-size:10pt;">DESTEK MERKEZİ</span>
        </a>
      </li>
	        <li class="nav-item">
        <a class="nav-link collapsed" href="cikis">
          <i class="bi bi-door-open-fill"></i>
          <span style="font-size:10pt;">OTURUMU KAPAT</span>
        </a>
      </li>
    </ul>
  </aside>
<?php }

if ($yetki =="0" AND $paket =="1"){
?>
<header id="header" class="fixed-top">
<div class="card-body" style="margin-top:15px;">
<a href="yonetim"><img src="assets/img/logosiyah.png" style="max-height:50px;" class="img-fluid"></a>
<h3 class="card-title" align="right" style="margin-top:-65px;"><a href="<?php echo"$domain";?><?php echo"$profil";?>.co">
<button type="button" class="btn btn-dark"><i class="bx bxs-credit-card"></i>&nbsp;&nbsp;<b>DİJİTACO'NU GÖRÜNTÜLE</b></button></a></h3></div>
</header>
<?php }?>

<?php 
if ($yetki =="0" AND $paket !=="1"){
?>

<header id="header" class="fixed-top">
<div class="card-body" style="margin-top:15px;">
<a class="toggle-sidebar-btn"><img src="assets/img/logosiyah.png" style="max-height:50px;" class="img-fluid"></a>
<h3 class="card-title" align="right" style="margin-top:-65px;"><a href="yonetim">
<button type="button" class="btn btn-dark"><i class="bx bxs-credit-card"></i>&nbsp;&nbsp;<b><b>DİJİTACO</b> KURUMSAL PRO PANELİ</b></button></a></h3></div>
</header>
  <aside id="sidebar" class="sidebar">
    <ul class="sidebar-nav" id="sidebar-nav">
      <li class="nav-item">
        <a class="nav-link " href="yonetim">
          <i class="bi bi-grid"></i>
          <span>ANASAYFA</span>
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#kartvizit" data-bs-toggle="collapse" href="#">
          <i class="bi bi-file-earmark-person"></i><span>DİJİTACO KURUMSAL</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="kartvizit" class="nav-content collapse " data-bs-parent="#sidebar-nav">
          <li>
            <a href="kartvizit">
              <i class="bi bi-circle"></i><span>DijitaCO'ları Listele</span>
            </a>
          </li>
           <li>
            <a href="kurumsal">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Firma Bilgilerim</span>
            </a>
          </li>
          <li>
            <a href="banka">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Banka Bilgilerim</span>
            </a>
          </li>
          <li>
            <a href="resim">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Ürün Bilgilerim</span>
            </a>
          </li>
          <li>
            <a href="slider">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Slider Bilgilerim</span>
            </a>
          </li>
		  <li>
            <a href="sosyal">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Platform Bilgilerim</span>
            </a>
          </li>
		  <li>
            <a href="katalog">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Döküman Bilgilerim</span>
            </a>
          </li>
		  <li>
            <a href="video">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Tanıtım Videom</span>
            </a>
          </li>
        </ul>
      </li>
     <li class="nav-item">
        <a class="nav-link collapsed" data-bs-target="#rapor" data-bs-toggle="collapse" href="#">
          <i class="bi bi-credit-card-2-front-fill"></i><span>KURUMSAL RAPORLAMA</span><i class="bi bi-chevron-down ms-auto"></i>
        </a>
        <ul id="rapor" class="nav-content collapse " data-bs-parent="#sidebar-nav">
           <li>
            <a href="ozet_rapor.php">
              <i class="bi bi-circle"></i><span>Ziyaretçi | Etkileşim</span>
            </a>
          </li>
<!-- <li>
            <a href="ziyaretci_rapor">
              <i class="bi bi-circle"></i><span style="font-size:10pt;">Ziyaretçi Raporları</span>
            </a>
          </li>
		<li> -->
		<li>
            <a href="sosyal_rapor.php">
              <i class="bi bi-circle"></i><span>Sosyal Medya Raporlarım</span>
            </a>
          </li>
          <li>
            <a href="pazaryeri_rapor.php">
              <i class="bi bi-circle"></i><span>Pazaryeri Raporlarım</span>
            </a>
          </li>
          <li>
            <a href="diger_rapor.php">
              <i class="bi bi-circle"></i><span>Etkileşim Raporlarım</span>
            </a>
          </li>
          <li>
            <a href="ozel_rapor.php">
              <i class="bi bi-circle"></i><span>Özel Raporlama</span>
            </a>
          </li>
        </ul>
      </li>
		<li class="nav-item">
        <a class="nav-link collapsed" href="destek">
          <i class="bi bi-card-list"></i>
          <span>DESTEK MERKEZİ</span>
        </a>
      </li>
		<li class="nav-item">
        <a class="nav-link collapsed" href="profil?id=<?php echo"$uye_id";?>">
          <i class="bi bi-file-earmark-lock2-fill"></i>
          <span>PROFİLİM</span>
        </a>
      </li>
<li class="nav-item">
        <a class="nav-link collapsed" href="cikis">
          <i class="bi bi-card-list"></i>
          <span>OTURUMU KAPAT</span>
        </a>
      </li><!-- End Register Page Nav -->
    </ul>
  </aside>
<?php }?>
