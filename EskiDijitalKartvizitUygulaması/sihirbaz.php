<?php 
include 'header.php';
extract($_POST);
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title" Style="color:#000;">KİŞİSEL BİLGİLER</h5>	
<?php 
if(empty($_POST)){
$id		=$_GET["id"];
$urun 	= $baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$urun  ->execute(array($id));
$u = $urun->fetch(PDO::FETCH_ASSOC);
extract($u);
?>
                  <form name="urun" action="" method="POST" enctype="multipart/form-data">
					<input name="id" type="hidden" value="<?php echo"$id";?>">
				  <input name="kart_id" type="hidden" class="form-control" id="kart_id" value="<?php echo"$kart_id";?>">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>İsim</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="isim" type="text" class="form-control" id="isim" value="<?php echo"$isim";?>" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Soyisim</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="soyisim" type="text" class="form-control" id="soyisim" value="<?php echo"$soyisim";?>" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Ünvan</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="unvan" type="text" class="form-control" id="unvan" placeholder="Örnek : CEO" value="<?php echo"$unvan";?>">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Profil Resmi</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="resim" class="form-control" type="file" id="formFile">
					</div>
                    </div>	
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Hakkımda</b></label>
                      <div class="col-md-8 col-lg-9">
						<textarea name="hakkimda" class="ckeditor"><?php echo"$hakkimda";?></textarea>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Telefon</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="telefon" type="number" class="form-control" id="telefon" value="<?php echo"$telefon";?>" placeholder="Örnek : 02122121212">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Cep Telefonu</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="gsm" type="number" class="form-control" id="gsm" value="<?php echo"$gsm";?>" placeholder="Örnek : 05415319425" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>E-Posta</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="email" type="text" class="form-control" id="email" value="<?php echo"$email";?>" placeholder="info@dijitaco.com" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Web Adresi</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="web" type="text" class="form-control" id="web" value="<?php echo"$web";?>" placeholder="Örnek: www.dijitaco.com">
                      </div>
                    </div>						
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Adres</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="adres" type="text" class="form-control" id="adres" value="<?php echo"$adres";?>" placeholder="Lütfen Adresinizi Yazın">
                      </div>
                    </div>			<input type="hidden" name="action" value="image" />
                    <div class="text-center"><button type="submit" class="btn btn-dark">Güncelle</button></div>
					  </form>
                   	<br>
				   <div class="text-center"><a href="sihirbaz-1"><button class="btn btn-light" style="border:1px solid #000;">Bu Adımı Atla</button></a></div>
                  <!-- End Profile Edit Form -->
				  
<?php 
}else{
$tarih 		=date('d.m.Y',time());

if(empty($_FILES['resim']['name'])){
$tema 		="siyah";
$arkaresim 	="black.png";
$guncelle =$baglan->prepare("UPDATE `kartvizit` SET `isim`=?,`soyisim`=?,`unvan`=?,`telefon`=?,`gsm`=?,`email`=?,`adres`=?,`web`=?,`hakkimda`=?,`tema`=?,`arkaresim`=? WHERE `id`=?");
$guncelle ->execute(array($isim,$soyisim,$unvan,$telefon,$gsm,$email,$adres,$web,$hakkimda,$tema,$arkaresim,$id));

/* LOG */
$islem ="Kartvizit Güncelleme Yapıldı ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
}else{

/* Resim Yükleme */
$addfrontchar = substr(0,3);
$addfrontchar = strtoupper($addfrontchar);
$chars = array("1","2","3","4","5","6","7","8","9","0");
$max_chars = count($chars) - 1;
srand((double)microtime()*1000000);
for($i = 0; $i < 4; $i++)
{
$randnum = ($i == 0) ? $chars[rand(0, 
$max_chars)] : $randnum . $chars[rand(0, $max_chars)];
}
$addcatid = $sayilar;
$createprodnum = $addfrontchar . $randnum . $addcatid;

require 'class.upload.php';
$dir_dest = (isset($_GET['dir']) ? $_GET['dir'] : 'assets/images/');
$dir_pics = (isset($_GET['pics']) ? $_GET['pics'] : $dir_dest);
$action = (isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : ''));
 if ($action == 'image') {
    $handle = new Upload($_FILES['resim']);
    $handle->image_resize            = true;
    $handle->image_ratio_y           = true;
    $handle->image_x                 = 600;
    $handle->file_new_name_body      = ''.$createprodnum.'';
    $handle->process($dir_dest);
    if ($handle->processed) {
    $info = getimagesize($handle->file_dst_pathname);
	$yeniad ='' . $handle->file_dst_name . '';
	$resimyolu =''.$dir_pics.'/' . $handle->file_dst_name . '';
        } else {
        }
}
/* Resim Yükleme */

$tema 		="siyah";
$arkaresim 	="black.png";
$guncelle =$baglan->prepare("UPDATE `kartvizit` SET `isim`=?,`soyisim`=?,`unvan`=?,`telefon`=?,`gsm`=?,`email`=?,`adres`=?,`resim`=?,`web`=?,`hakkimda`=?,`tema`=?,`arkaresim`=? WHERE `id`=?");
$guncelle ->execute(array($isim,$soyisim,$unvan,$telefon,$gsm,$email,$adres,$resimyolu,$web,$hakkimda,$tema,$arkaresim,$id));
}

if (isset ($guncelle)){
	
/* LOG */
$islem ="Kartvizit Güncelleme Yapıldı ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */

?>
<div align="center">
<h3>Kişisel Bilgileriniz Oluşturuldu.</h3> <br><br>
<a href="sihirbaz-1"><button type="button" class="btn btn-dark">Sonraki Adım</button></a><br>
</div>
<?php
}else{
?>
<div align="center"><h3>İşlem Başarısız Lütfen Geri Tuşuna Basıp Eksikleri Gideriniz.</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}?>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>