<?php 
include 'businessheader.php';
extract($_POST);
?>
  <main id="kapsa" class="kapsa">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title" Style="color:#000;">KİŞİSEL BİLGİLER</h5>	
<?php 
if(empty($_POST)){
$kart_id		=$_GET["kart_id"];
$urun 	= $baglan->prepare("SELECT * FROM `kartvizit` WHERE `kart_id` =?");
$urun  ->execute(array($kart_id));
$u = $urun->fetch(PDO::FETCH_ASSOC);
extract($u);
?>
                  <form name="urun" action="" method="POST" enctype="multipart/form-data">
					<input name="id" type="hidden" value="<?php echo"$id";?>">
				  <input name="kart_id" type="hidden" class="form-control" id="kart_id" value="<?php echo"$kart_id";?>">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>İsim</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="isim" type="text" class="form-control" id="isim" placeholder="Lütfen İsminizi Yazın" value="<?php echo"$isim";?>" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Soyisim</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="soyisim" type="text" class="form-control" id="soyisim" placeholder="Lütfen Soy İsminizi Yazın" value="<?php echo"$soyisim";?>" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Ünvan</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="unvan" type="text" class="form-control" id="unvan" value="<?php echo"$unvan";?>" placeholder="Lütfen Ünvan Yazın">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Firma Logo (375x225 Piksel Önerilir)</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="arkaresim" class="form-control" type="file" id="formFile">
					</div>
                    </div>	
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Profil Resmi (600x600 Kare Önerilir)</b></label>
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
                        <input name="telefon" type="number" class="form-control" id="telefon" value="<?php echo"$telefon";?>" placeholder="Lütfen Telefon Numaranızı Yazın">
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Cep Telefonu</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="gsm" type="number" class="form-control" id="gsm" value="<?php echo"$gsm";?>" placeholder="Lütfen Cep Telefon Numaranızı Yazın" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>E-Posta</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="email" type="text" class="form-control" id="email" value="<?php echo"$email";?>" placeholder="Lütfen Mail Adresinizi Yazın" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Web Adresi</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="web" type="text" class="form-control" id="web" value="<?php echo"$web";?>" placeholder="Lütfen Web Adresinizi Yazın">
                      </div>
                    </div>						
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Adres</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="adres" type="text" class="form-control" id="adres" value="<?php echo"$adres";?>" placeholder="Lütfen Adresinizi Yazın">
                      </div>
                    </div>
                    <div class="text-center">
					<input type="hidden" name="maction" value="image" />
					<input type="hidden" name="action" value="imagem" />
                      <button type="submit" class="btn btn-dark">Güncelle</button>
                    </div>
                  </form><!-- End Profile Edit Form -->
<?php 
}else{
	
require 'class.upload.php';
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
$dir_dest = (isset($_GET['dir']) ? $_GET['dir'] : 'assets/images/');
$dir_pics = (isset($_GET['pics']) ? $_GET['pics'] : $dir_dest);
$action = (isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : ''));	
$maction = (isset($_POST['maction']) ? $_POST['maction'] : (isset($_GET['maction']) ? $_GET['maction'] : ''));		
	
$tarih 		=date('d.m.Y',time());
$tema ="siyah";
if(empty($_FILES['resim']['name'])){
$urun 	= $baglan->prepare("SELECT * FROM `kartvizit` WHERE `id` =?");
$urun  ->execute(array($id));
$u = $urun->fetch(PDO::FETCH_ASSOC);
$profilresim 	=$u["resim"];
}else{
/* Resim Yükleme */
 if ($maction == 'image') {
    $handle = new Upload($_FILES['resim']);
    $handle->image_resize            = true;
    $handle->image_ratio_y           = true;
    $handle->image_x                 = 600;
    $handle->file_new_name_body      = ''.$createprodnum.'';
    $handle->process($dir_dest);
    if ($handle->processed) {
    $info = getimagesize($handle->file_dst_pathname);
	$profilresim =''.$dir_pics.'/' . $handle->file_dst_name . '';
        } else {
        }
}
/* Resim Yükleme */
}

if(empty($_FILES['arkaresim']['name'])){
$urun 	= $baglan->prepare("SELECT * FROM `kartvizit` WHERE `id` =?");
$urun  ->execute(array($id));
$u = $urun->fetch(PDO::FETCH_ASSOC);
$arkaresmim 	=$u["arkaresim"];
}else{
/* Resim Yükleme */
 if ($action == 'imagem') {
    $handlee = new Upload($_FILES['arkaresim']);
    $handlee->image_resize            = true;
    $handlee->image_ratio_y           = false;
    $handlee->image_x                 = 370;
    $handlee->image_y 				 = 220;
    $handlee->file_new_name_body      = ''.$createprodnum.'';
    $handlee->process($dir_dest);
    if ($handlee->processed) {
    $info = getimagesize($handlee->file_dst_pathname);
	$arkaresmim =''.$dir_pics.'/' . $handlee->file_dst_name . '';
        } else {
        }
}
/* Resim Yükleme */
}
$durum 	="1";
$guncelle =$baglan->prepare("UPDATE `kartvizit` SET `isim`=?,`soyisim`=?,`unvan`=?,`telefon`=?,`gsm`=?,`email`=?,`adres`=?,`resim`=?,`web`=?,`hakkimda`=?,`tema`=?, `arkaresim`=?, `durum`=? WHERE `id`=?");
$guncelle ->execute(array($isim,$soyisim,$unvan,$telefon,$gsm,$email,$adres,$profilresim,$web,$hakkimda,$tema,$arkaresmim,$durum,$id));
if (isset ($guncelle)){
?>
<div align="center">
<h3>Kişisel Bilgileriniz Oluşturuldu.</h3> <br><br>
<a href="wizard-1?kart_id=<?php echo"$kart_id";?>"><button type="button" class="btn btn-dark">Sonraki Adım</button></a><br>
</div>
<?php
}else{
?>
<div align="center"><h3>İşlem Başarısız Lütfen Geri Tuşuna Basıp Eksikleri Gideriniz.</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
?>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>