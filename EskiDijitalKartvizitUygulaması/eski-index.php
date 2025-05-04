<?php 
require("ust.php");

if($durum =="0"){
header('location: aktif?kart_id='.$kart_id.'');
?>

<!--  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<div align="center"><img src="<?php echo"$logo";?>" height="100"></div><br>
					<div class="card" style="background:#0066cc; color:#ffffff;">
					<div class="card-body">
					<div align="center">
					<br><br>
							<h1>BU HESAP AKTİF DEĞİLDİR</h1>
					<br><br>
					</div>
					</div>
					</div>
<br><br>
					<div class="card" style="background:#00cfb3; color:#000000;">
					<div class="card-body">
					<div align="center">
					<br><br>
					<a href="aktivasyon?kart_id=<?php echo"$kart_id";?>" style="color:#fff; text-decoration:none;"><h1>AKTİVASYON İÇİN TIKLAYINIZ</h1></a>
					<br><br>
					</div>
					</div>
					</div>

            </div>
          </div>
        </div>
      </div>
    </section>
  </main> -->
<?php
}elseif($durum =="2"){
?>
<div align="center">
<img src="<?php echo"$logo";?>">
              <div class="alert alert-danger bg-danger text-light border-0 alert-dismissible fade show" role="alert">
                BU HESAP DURDULMUŞTUR.
              </div>
<?PHP
}else{

$gale= $baglan->prepare("SELECT * FROM `galeri` WHERE  `kart_id` =?");
$gale ->execute(array($kart_id));
$res = $gale->fetch(PDO::FETCH_ASSOC);
$galeri	= $res["id"];

$islemler= $baglan->prepare("SELECT * FROM `kartvizit` WHERE  `kart_id` =?");
$islemler ->execute(array($kart_id));
$yaz = $islemler->fetch(PDO::FETCH_ASSOC);
extract($yaz);
if (empty($kart_id)){
 echo'<meta http-equiv="refresh" content="0;URL=giris">';
}elseif(empty($id)){
 echo'<meta http-equiv="refresh" content="0;URL=giris">';
}else{
?>
<link href="assets/css/<?php echo"$tema";?>.css?v=<?php echo"$sayilar";?>" rel="stylesheet">

              <div class="modal fade" id="banka" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Banka Bilgileri</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>

                    <div class="modal-body">
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
echo"<B>$banka</B><br>";
echo"<B>$hesap</B><br>";
echo"$iban";
?>
&nbsp;&nbsp;<button id="shareOther" class="btn btn-dark btn-sm" onclick="banka<?php echo"$b_id";?>()">Kopyala</button><br>
<script>
  function banka<?php echo"$b_id";?>(){
    var text = "<?php echo"$iban";?>";
navigator.clipboard.writeText(text).then(function() {
  Swal.fire("Bilgi",'<?php echo"$iban";?> Kopyalandı.','success');
}, function(err) {
  console.error('Hata', err);
});
  }
</script>
<?php
} ?>
					  
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="galeri" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Resim Galerisi</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
<?php if(empty($galeri)){}else{?>
              <div id="carouselExampleControls" class="carousel slide mx-auto" data-bs-ride="carousel" style="width:90%; border:2px Solid; border-radius:5px !important;">
                <div class="carousel-inner">
<?php 
$resimcek = $baglan->prepare("SELECT * FROM `galeri` WHERE `kart_id` =? limit 0,1");
$resimcek ->execute(array($kart_id));
$res = $resimcek->fetch(PDO::FETCH_ASSOC);
$pictures	=$res["resim"];
?>
                  <div class="carousel-item active">
                    <img src="assets/galeri/<?php echo"$pictures";?>" class="d-block w-100" alt="...">
                  </div>
<?php 
$urun = $baglan->prepare("SELECT * FROM `galeri` WHERE `kart_id` =?");
$urun ->execute(array($kart_id));
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
$gal =$u["resim"];
?>
                  <div class="carousel-item">
                    <img src="assets/galeri/<?php echo"$gal";?>" class="d-block w-100" alt="...">
                  </div>
<?php }?>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Önceki</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="visually-hidden">Sonraki</span>
                </button>
              </div><br><br><br><br>
<?php } ?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="hakkimda" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Hakkımda</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hakkimda"; ?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="fatura" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Fatura Bilgileri</h5>
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
echo"<b>$firma</b><br><b>Vergi Dairesi:</b> $vergidairesi<br><b>Vergi Numarası:</b> $vergino<br> $adresim";
}
					  ?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="dokuman" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Dökümanlar</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
<?php 
$cat= $baglan->prepare("SELECT * FROM `katalog` WHERE  `kart_id` =?");
$cat ->execute(array($kart_id));
while ($catx = $cat->fetch(PDO::FETCH_ASSOC)){
extract($catx);
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="<?php echo"$link";?>" ><img src="assets/img/katalog.png" height="50px"></a>
<br>
<a href="<?php echo"$link";?>" class="text-dark text-decoration-none" style="font-size:8pt;">DÖKÜMAN</a>
</div>
</div>
<?php
}
?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="maps" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Harita Seçimi</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" align="center">
<a href="http://maps.apple.com/?q=<?php echo"$adres";?>"><img src="assets/images/apple-maps.png" height="128px"></a> &nbsp;&nbsp;&nbsp;
<a href="https://www.google.com/maps/search/<?php echo"$adres";?>"><img src="assets/images/google-maps.png" height="128px"></a> 
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal fade" id="qr" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">QR Kod</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" align="center">
<img src="https://chart.googleapis.com/chart?cht=qr&chl=<?php echo"$domain";?>index?kart_id=<?php echo"$kart_id"?>&chs=160x160&chld=L|0" class="qr-code img-thumbnail img-responsive" />
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
		
    <section class="section profile">
      <div class="row">
      <div class="col-xl-4 mx-auto">
<?php if($tema =="gri"){ ?>
		   <div class="card-body profile-card pt-1 d-flex flex-column align-items-center" style="margin-top: -90px;">
<?php
if(empty($resim)){
echo'<img src="assets/img/digikart.png" alt="Profile" class="rounded" style="border:3px solid #fff; box-shadow: 0 5px 7px 0 rgba(100, 100, 100, 0.2);">';
}else{
echo'<img src="'.$resim.'" alt="Profile" class="rounded" style="box-shadow: 0 5px 7px 0 rgba(100, 100, 100, 0.2);">';
}
?>
			  <h2><?php echo"$isim $soyisim";?></h2>
              <h6><?php echo"$unvan";?></h6>
<?php if ($uyelikid == $cek_id){ ?>
<a href="yonetim"><button type="button" class="btn btn-danger">Profili Düzenle</button></a>
<?php } ?>
<div align="center" class="social-links mt-2">
<?php
if(empty($hakkimda)){}else{
?>
<button type="button" data-bs-toggle="modal" data-bs-target="#hakkimda" class="btn btn-dark btn btn">Hakkımda</button>
<?php }?>
<button type="button" class="btn btn-dark btn add-to-contact-btn btn">Rehber Kayıt</button>
<script>
    var VCARD_DETAILS = [
	{"value":"<?php echo"$gsm";?>","label":"","type":"phone"},
	{"value":"<?php echo"$telefon";?>","label":"","type":"phone"},
	{"value":"<?php echo"$email";?>","label":"","type":"email"},
	{"value":"<?php echo"$web";?>/","label":"","type":"website"},
	{"value":"<?php echo"$domain";?>index?kart_id=<?php echo"$kart_id";?>","label":"Dijital Kartvizit","type":"website"},
	{"value":"<?php echo"$adres";?>","label":"Adres","type":"address"},
	],
    TITLE = "<?php echo"$isim $soyisim";?>",
    SUB_TITLE = "<?php echo"$unvan";?>",
    LOGO = "<?php echo"$domain$resim";?>",
	LOGO_64_ENCODED = "<?php echo base64_encode(file_get_contents($resim)) ;?>",
    DESCRIPTION = "<?php echo"$title";?> Kartvizit Tasarımıdır",
    DETAILS_FIELD_LIMIT = 999;
</script>
<script src="assets/js/jquery.min.js?ver=0.001"></script>
<script src="assets/js/kartvizit.js?ver=<?php echo"$sayilar";?>"></script>
</div>
</div>
<div class="cizgi">&nbsp;</div>
<div align="center" class="social-links mt-1">
<div class="col-md-2 col-2 mb-2" style="float:left; margin-left:10px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="tel:+9<?php echo"$telefon";?>"><img src="assets/images/phone.png" height="30px"></a>
<br>
<a href="tel:+9<?php echo"$telefon";?>" class="text-dark text-decoration-none" style="font-size:9pt;">TELEFON</a>
</div>
</div>
<div class="col-md-2 col-2 mb-2" style="float:left; margin-left:10px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="tel:+9<?php echo"$gsm";?>"><img src="assets/images/sphone.png" height="30px"></a>
<br> 
<a href="tel:+9<?php echo"$gsm";?>" class="text-dark text-decoration-none" style="font-size:9pt;">GSM</a>
</div>
</div>
<div class="col-md-2 col-2 mb-2" style="float:left; margin-left:10px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="mailto:<?php echo"$email";?>"><img src="assets/images/mail.png" height="30px"></a>
<br>
<a href="mailto:<?php echo"$email";?>" class="text-dark text-decoration-none" style="font-size:9pt;">MAİL</a>
</div>
</div>
<div class="col-md-2 col-2 mb-2" style="float:left; margin-left:10px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="#" data-bs-toggle="modal" data-bs-target="#maps" style="text-decoration:none;"><img src="assets/images/map.png" height="30px"></a>
<br>
<a href="#" data-bs-toggle="modal" data-bs-target="#maps" class="text-dark text-decoration-none" style="font-size:9pt;">KONUM</a>
</div>
</div>
<div class="col-md-2 col-2 mb-2" style="float:left; margin-left:10px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="http://<?php echo"$web"; ?>"><img src="assets/images/web.png" height="30px"></a>
<br>
<a href="http://<?php echo"$web"; ?>" class="text-dark text-decoration-none" style="font-size:9pt;">WEB</a>
</div>
</div>
</div>
            </div>
          </div>
          </div>
        </div>
		<br>
            <div class="card-body" style="background:#fff; padding:5px; height:50px;">
              <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li class="nav-item" role="presentation">
                  <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Sosyal Medya</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Resim Galeri</button>
                </li>
                <li class="nav-item" role="presentation">
                  <button class="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Döküman</button>
                </li>
              </ul>
			</div><br>
<div class="tab-content pt-2" id="myTabContent">
<div class="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="home-tab" style="height:750px;">
<?php
$ssyl= $baglan->prepare("SELECT * FROM `sosyal_medya` WHERE  `kart_id` =?");
$ssyl ->execute(array($kart_id));
while ($medya = $ssyl->fetch(PDO::FETCH_ASSOC)){
extract($medya);

if($sosyal == "whatsapp") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=whatsapp&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/whatsapp.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">WHATSAPP</a>
</div>
</div>
<?php }
if($sosyal == "whatsappkatalog") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=whatsappkatalog&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/whatsappbusiness.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">BUSİNESS</a>
</div>
</div>
<?php }
if($sosyal == "telegram") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=telegram&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/telegram.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">TELEGRAM</a>
</div>
</div>
<?php }
if($sosyal == "facebook") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=facebook&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/facebook.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">FACEBOOK</a>
</div>
</div>
<?php }
if($sosyal == "twitter") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=twitter&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/twitter.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">TWİTTER</a>
</div>
</div>
<?php }
if($sosyal == "instagram") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=instagram&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/instagram.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">İNSTAGRAM</a>
</div>
</div>
<?php }
if($sosyal == "youtube") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=youtube&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/youtube.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">YOUTUBE</a>
</div>
</div>
<?php }
if($sosyal == "linkedin") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=linkedin&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/linkedin.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">LINKEDIN</a>
</div>
</div>
<?php }
if($sosyal == "pinterest") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=pinterest&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/pinterest.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">PİNTEREST</a>
</div>
</div>
<?php }
if($sosyal == "skype") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="#" data-bs-toggle="modal" data-bs-target="#basicModal" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/skype.png" height="50px"></a>
              <div class="modal fade" id="basicModal" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Skype Adresi</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hesap";?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">SKYPE</a>
</div>
</div>
<?php }
if($sosyal == "snapchat") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=snapchat&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/snapchat.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">SNAPCHAT</a>
</div>
</div>
<?php }
if($sosyal == "sahibinden") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=sahibinden&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/sahibinden.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">SAHİBİNDEN</a>
</div>
</div>
<?php }
if($sosyal == "n11") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=n11&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/n11.png?v=0.1" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">N11</a>
</div>
</div>
<?php }
if($sosyal == "trendyol") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=trendyol&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/trendyol.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">TRENDYOL</a>
</div>
</div>
<?php }
if($sosyal == "hepsiburada") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=hepsiburada&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/hepsiburada.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">HEPSİBURADA</a>
</div>
</div>
<?php }
if($sosyal == "hepsiemlak") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=hepsiemlak&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/hepsiemlak.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">HEPSİEMLAK</a>
</div>
</div>
<?php }
if($sosyal == "arabam") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=arabam&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/arabam.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">ARABAM</a>
</div>
</div>
<?php }
if($sosyal == "letgo") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=letgo&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/letgo.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">LETGO</a>
</div>
</div>
<?php }
if($sosyal == "wechat") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="#" data-bs-toggle="modal" data-bs-target="#basicModal1" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/wechat.png" height="50px"></a>

              <div class="modal fade" id="basicModal1" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Wechat Adresi</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hesap";?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">WECHAT</a>
</div>
</div>
<?php }
if($sosyal == "tiktok") {
?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="istatistik?kart_id=<?php echo"$kart_id"; ?>&bilgi=arabam&hesap=<?php echo"$hesap"; ?>" style="text-decoration:none;"><img src="assets/images/tiktok.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">TİKTOK</a>
</div>
</div>
<?php }} ?>
<div class="col-3 mb-2" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="#" data-bs-toggle="modal" data-bs-target="#qr" style="text-decoration:none;"><img src="assets/images/qr.png" height="50px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">QR KOD</a>
</div>
</div>
</div>

<div class="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="profile-tab">
<?php 
$urun = $baglan->prepare("SELECT * FROM `galeri` WHERE `kart_id` =?");
$urun ->execute(array($kart_id));
while($u = $urun->fetch(PDO::FETCH_ASSOC)){
extract($u);
?>
		<div class="card-body">
          <div class="card">
            <img src="assets/galeri/<?php echo"$resim";?>" class="card-img-top">
			<?php 
			if(empty($baslik)){}else{
			?>
            <div class="card-body">
              <h5 class="card-title"><?php echo"$baslik";?></h5>
              <p class="card-text"><?php echo"$aciklama";?></p>
            </div>
			<?php }?>
          </div>
          </div>
<?php }?>
</div>
<div class="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="contact-tab">

<?php 
$cat= $baglan->prepare("SELECT * FROM `katalog` WHERE  `kart_id` =?");
$cat ->execute(array($kart_id));
while ($catx = $cat->fetch(PDO::FETCH_ASSOC)){
extract($catx);
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="shadow bg-white p-2 text-center" style="border-radius:10px !important;">
<a href="<?php echo"$link";?>" ><img src="assets/img/katalog.png" height="50px"></a>
<br>
<a href="<?php echo"$link";?>" class="text-dark text-decoration-none" style="font-size:8pt;">DÖKÜMAN</a>
</div>
</div>
<?php
}
?>
</div>

</div>
<?php
}elseif($tema =="beyaz"){
?>
<div class="card-profil profile-card pt-4" style="margin-top: -90px;">
<?php
if(empty($resim)){
echo'<img src="assets/img/digikart.png" alt="Profile" class="rounded" style="border:3px solid #fff; box-shadow: 0 5px 7px 0 rgba(100, 100, 100, 0.2);">';
}else{
echo'<img src="'.$resim.'" alt="Profile" class="rounded" style="border:3px solid #fff; box-shadow: 0 5px 7px 0 rgba(100, 100, 100, 0.2);">';
}
?>
</div>
<div style="margin-left:140px; margin-top: -95px;">
			  <h5><b><?php echo"$isim $soyisim";?></b></h5>
              <h6><?php echo"$unvan";?></h6>
			  <div class="social-links mt-2">
                <h1>
				<a href="#" data-bs-toggle="modal" data-bs-target="#banka" style="text-decoration:none;"><i class="ri ri-bank-fill"></i></a>
                <a href="#" id="paylas"><i class="ri ri-share-fill"></i></a>
                <a href="#" data-bs-toggle="modal" data-bs-target="#qr" style="text-decoration:none;"><i class="ri ri-qr-code-line"></i></a>
                <a href="#" data-bs-toggle="modal" data-bs-target="#fatura" style="text-decoration:none;"><i class="ri ri-file-list-3-fill"></i></a>
               <a href="#" data-bs-toggle="modal" data-bs-target="#galeri" style="text-decoration:none;"><i class="ri  ri-image-fill ri-1x"></i></a>
                <a href="#" data-bs-toggle="modal" data-bs-target="#dokuman" style="text-decoration:none;"><i class="ri ri-file-text-fill"></i></a>
				<?php if ($uyelikid == $cek_id){ ?>
				<a href="yonetim" style="text-decoration:none;"><i class="ri ri-edit-2-fill"></i></a>
				<?php } ?>
				</h1>
              </div>
</div>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="#" class="add-to-contact-btn" style="text-decoration:none;"><img src="assets/images/rehber.png" style="border-radius: 20px;box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;" height="80px"></a>
<br>
<a href="#" class="add-to-contact-btn" style="font-size:9pt;">REHBERE EKLE</a>
</div>
</div>
<script>
    var VCARD_DETAILS = [
	{"value":"<?php echo"$gsm";?>","label":"","type":"phone"},
	{"value":"<?php echo"$telefon";?>","label":"","type":"phone"},
	{"value":"<?php echo"$email";?>","label":"","type":"email"},
	{"value":"<?php echo"$web";?>/","label":"","type":"website"},
	{"value":"<?php echo"$domain";?>index?kart_id=<?php echo"$kart_id";?>","label":"Dijital Kartvizit","type":"website"},
	{"value":"<?php echo"$adres";?>","label":"Adres","type":"address"},
	],
    TITLE = "<?php echo"$isim $soyisim";?>",
    SUB_TITLE = "<?php echo"$unvan";?>",
    LOGO = "<?php echo"$domain$resim";?>",
	LOGO_64_ENCODED = "<?php echo base64_encode(file_get_contents($resim)) ;?>",
    DESCRIPTION = "<?php echo"$title";?> Kartvizit Tasarımıdır",
    DETAILS_FIELD_LIMIT = 999;
</script>
<script src="assets/js/jquery.min.js?ver=0.001"></script>
<script src="assets/js/kartvizit.js?ver=<?php echo"$sayilar";?>"></script>
<?php if(empty($telefon)){}else{ ?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="tel:<?php echo"$telefon";?>" style="text-decoration:none;"><img src="assets/images/phone.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a href="tel:<?php echo"$telefon";?>" style="font-size:8pt;">TELEFON</a>
</div>
</div>
<?php }?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="tel:<?php echo"$gsm";?>" style="text-decoration:none;"><img src="assets/images/sphone.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a href="tel:<?php echo"$gsm";?>" style="font-size:8pt;">GSM</a>
</div>
</div>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="mailto:<?php echo"$email";?>" style="text-decoration:none;"><img src="assets/images/mail.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a href="mailto:<?php echo"$email";?>" style="font-size:8pt;">E-MAIL</a>
</div>
</div>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="#" data-bs-toggle="modal" data-bs-target="#maps" class="text-dark text-decoration-none"><img src="assets/images/map.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a href="#" data-bs-toggle="modal" data-bs-target="#maps" class="text-dark text-decoration-none" style="font-size:9pt;">KONUM</a>
</div>
</div>

<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="http://<?php echo"$web"; ?>" style="text-decoration:none;"><img src="assets/images/web.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a href="http://<?php echo"$web"; ?>" style="font-size:9pt;">WEB ADRESİ</a>
</div>
</div>

<?php
$ssyl= $baglan->prepare("SELECT * FROM `sosyal_medya` WHERE  `kart_id` =?");
$ssyl ->execute(array($kart_id));
while ($medya = $ssyl->fetch(PDO::FETCH_ASSOC)){
extract($medya);
if($sosyal == "whatsapp") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://api.whatsapp.com/send?phone=+9<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/whatsapp.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">WHATSAPP</a>
</div>
</div>
<?php }
if($sosyal == "whatsappkatalog") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/whatsappbusiness.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">BUSİNESS</a>
</div>
</div>
<?php }
if($sosyal == "telegram") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://t.me/<?php echo"$hesap";?>?start" style="text-decoration:none;"><img src="assets/images/telegram.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">TELEGRAM</a>
</div>
</div>
<?php }
if($sosyal == "facebook") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://www.facebook.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/facebook.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">FACEBOOK</a>
</div>
</div>
<?php }
if($sosyal == "twitter") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://twitter.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/twitter.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">TWİTTER</a>
</div>
</div>
<?php }
if($sosyal == "instagram") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://www.instagram.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/instagram.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">İNSTAGRAM</a>
</div>
</div>
<?php }
if($sosyal == "youtube") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://www.youtube.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/youtube.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">YOUTUBE</a>
</div>
</div>
<?php }
if($sosyal == "linkedin") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://www.linkedin.com/in/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/linkedin.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">LINKEDIN</a>
</div>
</div>
<?php }
if($sosyal == "pinterest") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://pinterest.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/pinterest.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">PİNTEREST</a>
</div>
</div>
<?php }
if($sosyal == "skype") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="#" data-bs-toggle="modal" data-bs-target="#basicModal" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/skype.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
              <div class="modal fade" id="basicModal" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Skype Adresi</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hesap";?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">SKYPE</a>
</div>
</div>
<?php }
if($sosyal == "snapchat") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://www.snapchat.com/add/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/snapchat.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">SNAPCHAT</a>
</div>
</div>
<?php }
if($sosyal == "sahibinden") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/sahibinden.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">SAHİBİNDEN</a>
</div>
</div>
<?php }
if($sosyal == "hepsiemlak") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/hepsiemlak.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">HEPSİEMLAK</a>
</div>
</div>
<?php }
if($sosyal == "arabam") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/arabam.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">ARABAM</a>
</div>
</div>
<?php }
if($sosyal == "wechat") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="#" data-bs-toggle="modal" data-bs-target="#basicModal1" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/wechat.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>

              <div class="modal fade" id="basicModal1" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Wechat Adresi</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hesap";?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">WECHAT</a>
</div>
</div>
<?php }
if($sosyal == "tiktok") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="https://www.tiktok.com/@<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/tiktok.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">TİKTOK</a>
</div>
</div>
<?php } 
if($sosyal == "link") {
?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="http://<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/link.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">DIŞ LİNK</a>
</div>
</div>
<?php }} ?>
<div class="col-3" style="float:left;  margin-left:25px;">
<div class="p-2 text-center">
<a href="#" data-bs-toggle="modal" data-bs-target="#qr" style="text-decoration:none;"><img src="assets/images/qr.png" style="box-shadow: rgba(0, 0, 0, 0.25) 0px 5px 15px;" height="80px"></a>
<br>
<a class="text-dark text-decoration-none" style="font-size:9pt;">QR KOD</a>
</div>
</div>
<?php
}if($tema =="siyah"){
?>
<div class="card-profil profile-card pt-4">
<?php
if(empty($resim)){
echo'<img src="assets/img/digikart.png" alt="Profile" class="rounded" style="border:3px solid #fff; box-shadow: 0 5px 7px 0 rgba(100, 100, 100, 0.2);">';
}else{
echo'<img src="'.$resim.'" alt="Profile" class="rounded" style="border-radius: 100% !important; border:3px solid #fff; box-shadow: 0 5px 7px 0 rgba(100, 100, 100, 0.2);">';
}
?>
</div>
<div style="margin-left:140px; margin-top: -95px;">
<div class="card" style="z-index: -1; background: #0066cc !important; padding-left:110px; padding-top:8px; padding-bottom:8px; margin-left:-100px; margin-top: 15px; border-radius: 100px !important;">
			  <h5><b><?php echo"$isim $soyisim";?></b></h5>
              <h6><?php echo"$unvan";?></h6>
            </div>
	 
</div>
			  <div style="margin-top: -10px;" align="center" class="social-links mt-2" >
                <h1>
				<a href="#" data-bs-toggle="modal" data-bs-target="#banka" style="text-decoration:none;"><i class="ri ri-bank-fill ri-1x"></i></a>
                <a href="#" id="paylas"><i class="ri ri-share-fill ri-1x"></i></a>
                <a href="#" data-bs-toggle="modal" data-bs-target="#qr" style="text-decoration:none;"><i class="ri ri-qr-code-line ri-1x"></i></a>
                <a href="#" data-bs-toggle="modal" data-bs-target="#fatura" style="text-decoration:none;"><i class="ri ri-file-list-3-fill ri-1x"></i></a>
               <a href="#" data-bs-toggle="modal" data-bs-target="#galeri" style="text-decoration:none;"><i class="ri  ri-image-fill ri-1x"></i></a>
                <a href="#" data-bs-toggle="modal" data-bs-target="#dokuman" style="text-decoration:none;"><i class="ri ri-file-text-fill ri-1x"></i></a>
				<?php if ($uyelikid == $uye_id){ ?>
				<a href="yonetim" style="text-decoration:none;"><i class="ri ri-edit-2-fill ri-1x"></i></a>
				<?php } ?>
				</h1>
              </div>
<?php if($ua['name'] =="Apple Safari"){?>
<div class="col-3" style="float:left;">
<div class="p-2 text-center">
<button type="button" class="add-to-contact-btn" style="margin-left:-8px; border:none; background-color:#fbfbfb;"><img src="assets/images/rehber.png" height="68px"></button>
<br>
<a href="#" class="add-to-contact-btn" style="font-size:8pt; margin-left:-2px;">REHBERE EKLE</a>
</div>
</div>
<?php }else{?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<button type="button" class="add-to-contact-btn" style="border:none; background-color:#fbfbfb;"><img src="assets/images/rehber.png" height="68px"></button>
<br>
<a href="#" class="add-to-contact-btn" style="font-size:8pt;">REHBERE EKLE</a>
</div>
</div>
<?php }?>
<script>
    var VCARD_DETAILS = [
	{"value":"<?php echo"$gsm";?>","label":"","type":"phone"},
	{"value":"<?php echo"$telefon";?>","label":"","type":"phone"},
	{"value":"<?php echo"$email";?>","label":"","type":"email"},
	{"value":"<?php echo"$web";?>/","label":"","type":"website"},
	{"value":"<?php echo"$domain";?>index?kart_id=<?php echo"$kart_id";?>","label":"Dijital Kartvizit","type":"website"},
	{"value":"<?php echo"$adres";?>","label":"Adres","type":"address"},
	],
    TITLE = "<?php echo"$isim $soyisim";?>",
    SUB_TITLE = "<?php echo"$unvan";?>",
    LOGO = "<?php echo"$domain$resim";?>",
	LOGO_64_ENCODED = "<?php echo base64_encode(file_get_contents($resim)) ;?>",
    DESCRIPTION = "<?php echo"$title";?> Kartvizit Tasarımıdır",
    DETAILS_FIELD_LIMIT = 999;
</script>
<script src="assets/js/jquery.min.js?ver=0.001"></script>
<script src="assets/js/kartvizit.js?ver=<?php echo"$sayilar";?>"></script>
<?php if(empty($telefon)){}else{ ?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="tel:+9<?php echo"$telefon";?>" style="text-decoration:none;"><img src="assets/images/phone.png" height="70px"></a>
<br>
<a href="tel:+9<?php echo"$telefon";?>" style="font-size:8pt;">TELEFON</a>
</div>
</div>
<?php }?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="tel:+9<?php echo"$gsm";?>" style="text-decoration:none;"><img src="assets/images/sphone.png" height="70px"></a>
<br>
<a href="tel:+9<?php echo"$gsm";?>" style="font-size:8pt;">GSM</a>
</div>
</div>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="mailto:<?php echo"$email";?>" style="text-decoration:none;"><img src="assets/images/mail.png" height="70px"></a>
<br>
<a href="mailto:<?php echo"$email";?>" style="font-size:8pt;">E-MAIL</a>
</div>
</div>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="#" data-bs-toggle="modal" data-bs-target="#maps" style="text-decoration:none;"><img src="assets/images/map.png" height="70px"></a>
<br>
<a href="#" data-bs-toggle="modal" data-bs-target="#maps" style="font-size:8pt;">KONUM</a>
</div>
</div>

<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="http://<?php echo"$web"; ?>" style="text-decoration:none;"><img src="assets/images/web.png" height="70px"></a>
<br>
<a href="http://<?php echo"$web"; ?>" style="font-size:9pt;">WEB ADRESİ</a>
</div>
</div>

<?php
$ssyl= $baglan->prepare("SELECT * FROM `sosyal_medya` WHERE  `kart_id` =?");
$ssyl ->execute(array($kart_id));
while ($medya = $ssyl->fetch(PDO::FETCH_ASSOC)){
extract($medya);
if($sosyal == "whatsapp") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://wa.me/+9<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/whatsapp.png" height="70px"></a>
<br>
<a href="https://wa.me/+9<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">WHATSAPP</a>
</div>
</div>
<?php }
if($sosyal == "whatsappkatalog") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://wa.me/+9<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/whatsappbusiness.png" height="70px"></a>
<br>
<a href="https://wa.me/+9<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">BUSİNESS</a>
</div>
</div>
<?php }
if($sosyal == "telegram") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://t.me/<?php echo"$hesap";?>?start" style="text-decoration:none;"><img src="assets/images/telegram.png" height="70px"></a>
<br>
<a href="https://t.me/<?php echo"$hesap";?>?start" class="text-decoration-none" style="font-size:9pt;">TELEGRAM</a>
</div>
</div>
<?php }
if($sosyal == "facebook") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://www.facebook.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/facebook.png" height="70px"></a>
<br>
<a href="https://www.facebook.com/<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">FACEBOOK</a>
</div>
</div>
<?php }
if($sosyal == "twitter") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://twitter.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/twitter.png" height="70px"></a>
<br>
<a href="https://twitter.com/<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">TWİTTER</a>
</div>
</div>
<?php }
if($sosyal == "instagram") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://www.instagram.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/instagram.png" height="70px"></a>
<br>
<a href="https://www.instagram.com/<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">İNSTAGRAM</a>
</div>
</div>
<?php }
if($sosyal == "youtube") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://www.youtube.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/youtube.png" height="70px"></a>
<br>
<a href="https://www.youtube.com/<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">YOUTUBE</a>
</div>
</div>
<?php }
if($sosyal == "linkedin") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://www.linkedin.com/in/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/linkedin.png" height="70px"></a>
<br>
<a href="https://www.linkedin.com/in/<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">LINKEDIN</a>
</div>
</div>
<?php }
if($sosyal == "pinterest") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://pinterest.com/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/pinterest.png" height="70px"></a>
<br>
<a href="https://pinterest.com/<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">PİNTEREST</a>
</div>
</div>
<?php }
if($sosyal == "skype") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="#" data-bs-toggle="modal" data-bs-target="#basicModal" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/skype.png" height="70px"></a>
              <div class="modal fade" id="basicModal" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Skype Adresi</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hesap";?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
<br>
<a href="#" class="text-decoration-none" style="font-size:9pt;">SKYPE</a>
</div>
</div>
<?php }
if($sosyal == "snapchat") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://www.snapchat.com/add/<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/snapchat.png" height="70px"></a>
<br>
<a href="https://www.snapchat.com/add/<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">SNAPCHAT</a>
</div>
</div>
<?php }
if($sosyal == "sahibinden") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/sahibinden.png" height="70px"></a>
<br>
<a href="<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">SAHİBİNDEN</a>
</div>
</div>
<?php }
if($sosyal == "hepsiemlak") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/hepsiemlak.png" height="70px"></a>
<br>
<a href="<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">HEPSİEMLAK</a>
</div>
</div>
<?php }
if($sosyal == "arabam") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/arabam.png" height="70px"></a>
<br>
<a href="<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">ARABAM</a>
</div>
</div>
<?php }
if($sosyal == "wechat") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="#" data-bs-toggle="modal" data-bs-target="#basicModal1" style="text-decoration:none; margin-left:-5px;"><img src="assets/images/wechat.png" height="70px"></a>

              <div class="modal fade" id="basicModal1" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Wechat Adresi</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <?php echo"$hesap";?>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                    </div>
                  </div>
                </div>
              </div>
<br>
<a href="#" class="text-decoration-none" style="font-size:9pt;">WECHAT</a>
</div>
</div>
<?php }
if($sosyal == "tiktok") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="https://www.tiktok.com/@<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/tiktok.png" height="70px"></a>
<br>
<a href="https://www.tiktok.com/@<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">TİKTOK</a>
</div>
</div>
<?php }
if($sosyal == "link") {
?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="http://<?php echo"$hesap";?>" style="text-decoration:none;"><img src="assets/images/link.png" height="70px"></a>
<br>
<a href="http://<?php echo"$hesap";?>" class="text-decoration-none" style="font-size:9pt;">DIŞ LİNK</a>
</div>
</div>
<?php }} ?>
<div class="col-3" style="float:left; margin-left:-1px;">
<div class="p-2 text-center">
<a href="#" data-bs-toggle="modal" data-bs-target="#qr" style="text-decoration:none;"><img src="assets/images/qr.png" height="70px"></a>
<br>
<a href="#" class="text-decoration-none" style="font-size:9pt;">QR KOD</a>
</div>
</div>

<?php
}
?>
    </section>
<?php
if($tema =="beyaz"){
 }elseif($tema =="siyah"){}else{
?>
<div class="altmenu">
<div class="altlink" align="center">
<a href="#" data-bs-toggle="modal" data-bs-target="#banka" style="text-decoration:none;"><img src="assets/img/bank.png?v=0.1"  width="80px" style="border-right:1px solid #c0c0c0;"></a>
<a href="#" id="paylas"><img src="assets/img/paylasim.png?v=0.1" width="80px" style="border-right:1px solid #c0c0c0;"></a>
<a href="#" data-bs-toggle="modal" data-bs-target="#qr" style="text-decoration:none;"><img src="assets/img/QRkod.png?v=0.1" width="80px" style="border-right:1px solid #c0c0c0;"></a>
<a href="#" data-bs-toggle="modal" data-bs-target="#fatura" style="text-decoration:none;"><img src="assets/img/fatura.png?v=0.1" width="80px"></a>
</div>
 </div>
<?php
}?>
     <script>
    const paylasButon = document.getElementById("paylas");
    paylasButon.addEventListener("click", async () =>{
        if (navigator.canShare) {
            try {
                //paylaşma özelliği
                await navigator.share({
                    title:"dijitalkart Dijital Kartvizit",
                    text:"Merhaba Benimle İletişime Geçmek İçin :",
                    url:"<?php echo"$domain";?><?php echo"$profil";?>.co"
                })
                console.log("Paylaş çalıştı")
            } catch (error) {
                console.log("Bir sorun oldu")
            }
 
        } else {
            Console.log("Tarayıcı desteklemiyor")
        }
    });

    </script>
<?php } } include 'footer.php';?>