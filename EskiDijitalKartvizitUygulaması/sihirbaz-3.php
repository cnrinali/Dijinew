<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title" Style="color:#000;">ÜRÜNLERİNİZ</h5>
<?php
extract($_POST);
if(empty($_POST)){
	
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul -> execute(array($uye_id));
$listele	=$kullanicibul->FETCH(PDO::FETCH_ASSOC);
$kart_id		=$listele["kart_id"];
?>
    <form action="" method="post" enctype="multipart/form-data">
<input name="kart_id" type="hidden" value="<?php echo"$kart_id";?>">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Görsel Seçiniz</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="resim" class="form-control" type="file" id="formFile">
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Görsel İçin Başlık Yazınız</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="baslik" class="form-control" type="text" id="formFile" Placeholder="Zorunlu Alan Değildir.">
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Görsel İçin Açıklama Yazınız</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="aciklama" class="form-control" type="text" id="formFile" Placeholder="Zorunlu Alan Değildir.">
                      </div>
                    </div>
                    <div class="text-center"><input type="hidden" name="action" value="image" />
                      <button type="submit" class="btn btn-dark">Yükle</button>
                    </div>
    </form>
		                   	<br>
				   <div class="text-center"><a href="sihirbaz-4"><button class="btn btn-light" style="border:1px solid #000;">Bu Adımı Atla</button></a></div>
<?php 
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
$dir_dest = (isset($_GET['dir']) ? $_GET['dir'] : 'assets/galeri/');
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
$sql 	= $baglan->prepare("INSERT INTO `galeri` SET kart_id=?,resim=?,baslik=?,aciklama=?");
$kayit  = $sql ->execute(array($kart_id,$yeniad,$baslik,$aciklama));
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="Galeriye Resim Yüklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
if (isset ($kayit)){
?>
<div align="center">
<h3>Ürününüz Oluşturuldu.</h3><br>Diğer Ürün Bilgilerinizi Kartvizitinizi Oluşturduktan Sonra Panelinizden Ekleyebilirsiniz.<br><br>
<a href="sihirbaz-4"><button type="button" class="btn btn-dark">Sonraki Adım</button></a><br>
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
    </section>
  </main>
<?php include 'footer.php';?>