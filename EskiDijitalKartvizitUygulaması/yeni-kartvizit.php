<?php 
include 'header.php';
extract($_POST);
	$addfrontchar = substr(0,3);
	$addfrontchar = strtoupper($addfrontchar);
	$chars = array("1","2","3","4","5","6","7","8","9","0","A","B","C","D","E");
	$max_chars = count($chars) - 1;	srand((double)microtime()*1000000);
	for($i = 0; $i < 25; $i++){$randnum = ($i == 0) ? $chars[rand(0, $max_chars)] : $randnum . $chars[rand(0, $max_chars)];}
	$addcatid = $cat_id;
	$kart_id = $addfrontchar . $randnum . 
	$addcatid;

$say = $baglan->prepare("SELECT count(id) FROM `kartvizit` WHERE `uye_id` =?;");
$say ->execute(array($uye_id));
$sayim = $say->fetchColumn(); 
$toplam = $sayim;
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">YENİ KARTVİZİT</h5>	
<?php

if($paket == "0"){
?>
<div align="center"><h3>Üyeliğiniz Henüz Onaylanmadı<br>Lütfen Yetkili ile irtibata Geçiniz</h3> <img src="assets/img/error.gif?v=0.1" border="0" height="128px"></div>
<?php
}elseif($toplam >= $paket){
?>
<div align="center"><h3>Maksimum Kartvizit Sayısına Ulaştınız<br>Lütfen Paketinizi Yükseltmek İçin İrtibata Geçiniz</h3> <img src="assets/img/error.gif?v=0.1" border="0" height="128px"></div>
<?php
}elseif(empty($_POST)){
?>
                  <form name="urun" action="" method="POST" enctype="multipart/form-data">
<?php 
if($yetki =='1'){
?>
				   <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Üye Seç</label>
                      <div class="col-md-8 col-lg-9">
            <select name="uyeid" class="form-control" required>
			<option value="">Üye Seçiniz</option>
			<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `uye`");
$kullanicibul ->execute();
while ($listele	=$kullanicibul->FETCH(PDO::FETCH_ASSOC)){
$uyeid			=$listele["id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
			?>
			<option value="<?php echo"$uyeid";?>"><?php echo"$isim $soyisim";?></option>
<?php }?>
			</select>
                       </div>
                    </div>
<?php
}elseif($yetki =='0'){
?>
				   <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Kartvizit Seç</label>
                      <div class="col-md-8 col-lg-9">
            <select name="uyeid" class="form-control" required>
			<option value="">Kartvizit Seçiniz</option>
			<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `uye` WHERE `id`=?");
$kullanicibul ->execute(array($uye_id));
while ($listele	=$kullanicibul->FETCH(PDO::FETCH_ASSOC)){
$uyeid			=$listele["id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
			?>
			<option value="<?php echo"$uyeid";?>"><?php echo"$isim $soyisim";?></option>
<?php }?>
			</select>
                       </div>
                    </div>
<?php
}
?>

				  <input name="kart_id" type="hidden" class="form-control" id="kart_id" value="<?php echo"$kart_id";?>">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">İsim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="isim" type="text" class="form-control" id="isim" placeholder="Lütfen İsminizi Yazın" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Soyisim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="soyisim" type="text" class="form-control" id="soyisim" placeholder="Lütfen Soy İsminizi Yazın" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Ünvan</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="unvan" type="text" class="form-control" id="unvan" placeholder="Lütfen Ünvan Yazın">
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Profil Resmi</label>
                      <div class="col-md-8 col-lg-9">
						<input name="resim" class="form-control" type="file" id="formFile">
                      </div>
                    </div>					
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Hakkımda</label>
                      <div class="col-md-8 col-lg-9">
						<textarea name="hakkimda" class="ckeditor"></textarea>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Telefon</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="telefon" type="number" class="form-control" id="telefon" placeholder="Lütfen Telefon Numaranızı Yazın">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Cep Telefonu</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="gsm" type="number" class="form-control" id="gsm" placeholder="Lütfen Cep Telefon Numaranızı Yazın" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">E-Posta</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="email" type="text" class="form-control" id="email" placeholder="Lütfen Mail Adresinizi Yazın" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Web Adresi</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="web" type="text" class="form-control" id="web" placeholder="ör: www.site.com.tr">
                      </div>
                    </div>						
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Adres</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="adres" type="text" class="form-control" id="adres" placeholder="Lütfen Adresinizi Yazın">
                      </div>
                    </div>
<!--                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Tema Renk Seçimi</label>
                      <div class="col-md-8 col-lg-9">
            <select name="tema" class="form-control" required>
			<option value="<?php echo"$tema";?>"><?php echo"$tema";?></option>
			<option value="default">Beyaz</option>
			<option value="dark">Siyah</option>
			<option value="gri">Gri</option>
			</select>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Arka Plan Seçimi</label>
                      <div class="col-md-8 col-lg-9">
            <select name="arkaresim" class="form-control" required>
			<option value="grey.png">Gri</option>
			<option value="black.png">Siyah</option>
			<option value="red.png">Kırmızı</option>
			<option value="blue.png">Mavi</option>
			<option value="orange.png">Turuncu</option>
			</select>
                      </div>
                    </div>-->
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Ekle</button>
                    </div>
                  </form><!-- End Profile Edit Form -->
<?php 
}else{
$tarih 		=date('d.m.Y',time());
$bayi_id	= "1";
$durum		= "1";
$tema ="siyah";
$arkaresim ="black.png";
if(empty($_FILES['resim']['name'])){

$logom = $baglan->prepare("SELECT * FROM `ayar`");
$logom ->execute();
$logocu	=$logom->fetch(PDO::FETCH_ASSOC);
$varsayilan_logo			= $logocu["logo"];

$sor = $baglan->prepare("SELECT * FROM `kartvizit` WHERE `email` =? AND `gsm` =? AND `soyisim` =?");
$sor ->execute(array($email,$gsm,$soyisim));
$uyevarmi	=$sor->fetch(PDO::FETCH_ASSOC);
$id			= $uyevarmi["id"];
if(isset($id)){
echo'
<div align="center"><h3>Girdiğiniz Bilgilerde Kartvizit Mevcut</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';	
}else{
$sql = $baglan->prepare("INSERT INTO `kartvizit` SET `uye_id`=?,`bayi_id`=?,`durum`=?, `kart_id`=?, `isim`=?, `soyisim`=?, `unvan`=?, `hakkimda`=?, `telefon`=?, `gsm`=?, `resim`=?, `email`=?, `web`=?, `adres`=?, `tarih`=?, `tema`=?, `arkaresim`=?");
$kayit = $sql->execute(array($uyeid,$bayi_id,$durum,$kart_id,$isim,$soyisim,$unvan,$hakkimda,$telefon,$gsm,$varsayilan_logo,$email,$web,$adres,$tarih,$tema,$arkaresim)); 
if (isset ($kayit)){

/* LOG */
$islem ="Yeni Kartvizit Kaydı Yapıldı ($isim $soyisim)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */

?>
<div align="center"><h3>Kartvizit Kaydı Başarılı</h3> <br><h6><b>Kart ID :</b> <?php echo"$kart_id";?> <br><br><img src="https://chart.googleapis.com/chart?cht=qr&chl=<?php echo"$domain";?>/index?kart_id=<?php echo"$kart_id"?>&chs=160x160&chld=L|0" class="qr-code img-thumbnail img-responsive" /></h6><br>
<a href="<?php echo"$domain";?>/index.php?kart_id=<?php echo"$kart_id";?>"><button type="button" class="btn btn-dark">Kartviziti Görüntüle</button></a><br>
<a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a><br>
<?php
}else{
?>
<div align="center"><h3>Kartvizit Kaydı Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}

}else{

/* Resim Yükleme */
if(preg_match('/(.*)\.(.*)/',$_FILES['resim']['name'],$dizi) ) {
$format=$dizi[2];
}
$addfrontchar = substr($title,0,3);
$addfrontchar = strtoupper($addfrontchar);
$chars = array("1","2","3","4","5","6","7","8","9","0");
$max_chars = count($chars) - 1;
srand((double)microtime()*1000000);
for($i = 0; $i < 4; $i++)
{
$randnum = ($i == 0) ? $chars[rand(0, 
$max_chars)] : $randnum . $chars[rand(0, $max_chars)];
}
$dosyaUzantisi = pathinfo($_FILES['resim']['name'], PATHINFO_EXTENSION);
if ($dosyaUzantisi != "jpg" && $dosyaUzantisi != "png") { # Dosya uzantı kontrolü
echo "Sadece jpg ve png uzantılı dosyalar yüklenebilir.";
} else {
$addcatid = $cat_id;
$createprodnum = $addfrontchar . $randnum . 
$addcatid;
$new_name="".$createprodnum.".".$format."";
$kaynak		= $_FILES["resim"]["tmp_name"];   // Yüklenen dosyanın adı
$klasor		= "assets/img/"; // Hedef klasörümüz
$yukle		= $klasor.basename($new_name);
if ( move_uploaded_file($kaynak, $yukle) )
{
$dosya		= "assets/img/" . $new_name;
}
/* Resim Yükleme */
}
$sor = $baglan->prepare("SELECT * FROM `kartvizit` WHERE `email` =? AND `gsm` =? AND `soyisim` =?");
$sor ->execute(array($email,$gsm,$soyisim));
$uyevarmi	=$sor->fetch(PDO::FETCH_ASSOC);
$id			= $uyevarmi["id"];
if(isset($id)){
echo'
<div align="center"><h3>Girdiğiniz Bilgilerde Kartvizit Mevcut</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';	
}else{
$sql = $baglan->prepare("INSERT INTO `kartvizit` SET `uye_id`=?, `bayi_id`=?, `durum`=?, `kart_id`=?, `isim`=?, `soyisim`=?, `unvan`=?, `hakkimda`=?, `telefon`=?, `gsm`=?, `resim`=?, `email`=?, `web`=?, `adres`=?, `tarih`=?, `tema`=?, `arkaresim`=?");
$kayit = $sql->execute(array($uyeid,$bayi_id,$durum,$kart_id,$isim,$soyisim,$unvan,$hakkimda,$telefon,$gsm,$dosya,$email,$web,$adres,$tarih,$tema,$arkaresim)); 
if (isset ($kayit)){

/* LOG */
$islem ="Yeni Kartvizit Kaydı Yapıldı ($isim $soyisim)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */

?>
<div align="center"><h3>Kartvizit Kaydı Başarılı</h3> <br><h6><b>Kart ID :</b> <?php echo"$kart_id";?> <br><br><img src="https://chart.googleapis.com/chart?cht=qr&chl=<?php echo"$domain";?>/index?kart_id=<?php echo"$kart_id"?>&chs=160x160&chld=L|0" class="qr-code img-thumbnail img-responsive" /></h6><br>
<a href="<?php echo"$domain";?>/index.php?kart_id=<?php echo"$kart_id";?>"><button type="button" class="btn btn-dark">Kartviziti Görüntüle</button></a>&nbsp;&nbsp;
<a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a><br>
</div>
<?php
}else{
?>
<div align="center"><h3>Kartvizit Kaydı Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
}
}?>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>