<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
		      <div class="alert alert-info alert-dismissible fade show" role="alert">
                <i class="bi bi-info-circle me-1"></i>
                Yalnızca Slider İçeriği Güncellenebilir. Slider Değiştirmek İçin Silip Tekrar Yüklemeniz Gerekir.
              </div>
            <div class="card-body">
				<h5 class="card-title">SLİDER BİLGİLERİM</h5>
				<div class="table-responsive">
			     <table class="table table-borderless datatable">
                    <thead>
                      <tr>
                        <th scope="col">Slider</th>
                        <th scope="col">Kullanıcı</th>
                        <th scope="col">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
<?php
if($yetki =='1'){
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit`");
$kullanicibul -> execute();
while ($listele	=$kullanicibul->FETCH(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
$urun_listele 	= $baglan->prepare("SELECT * FROM  `slider` WHERE `kart_id` =?");
$urun_listele -> execute(array($kart_id));
while ($row = $urun_listele->FETCH(PDO::FETCH_ASSOC)){
$slider			= $row["slider"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
                        <td><img src="<?php echo"$domain";?>/assets/slider/<?php echo"$slider";?>" height="40"></td>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td>
						<h1>
						<a href="slidersil?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('slider Silinecektir Onaylıyor Musunuz?')"><i class="bx bx-trash"></i></a>
						</h1>
						</td>
					</tr>
<?php
}
}
}
?>
</tbody>
</table>
</div>
<?php
}elseif($yetki =='0'){
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul -> execute(array($uye_id));
while ($listele	=$kullanicibul->FETCH(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
$urun_listele 	= $baglan->prepare("SELECT * FROM  `slider` WHERE`kart_id` =?");
$urun_listele -> execute(array($kart_id));
while ($row = $urun_listele->FETCH(PDO::FETCH_ASSOC)){
$slider			= $row["slider"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
                        <td><img src="<?php echo"$domain";?>/assets/slider/<?php echo"$slider";?>" height="40"></td>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$baslik";?></td>
                        <td>
						<h1>
						<a href="slidersil?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('slider Silinecektir Onaylıyor Musunuz?')"><i class="bx bx-trash"></i></a>
						</h1>
						</td>
					</tr>
<?php
}
}
}
?>
</tbody>
</table>
</div>
<?php
}
?>
<div class="clearfix"></div>
<br>
<?php 
extract($_POST);
if(empty($_POST)){
?>	
<form action="" method="post" enctype="multipart/form-data">
<?php 
if($yetki =='1'){
?>
				   <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Kartvizit Seç</b></label>
                      <div class="col-md-8 col-lg-9">
            <select name="kart_id[]" id="multiple-checkboxes" multiple="multiple" class="form-control" required>

			<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit`");
$kullanicibul	->execute();
while($listele	=$kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
			?>
			<option value="<?php echo"$kart_id";?>"><?php echo"$isim $soyisim";?></option>
<?php }?>
			</select>
                       </div>
                    </div>
<?php
}elseif($yetki =='0'){
if($paket =='1'){
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul	->execute(array($uye_id));
$listele	=$kullanicibul->fetch(PDO::FETCH_ASSOC);
$kart_id		=$listele["kart_id"];
?>
<input name="kart_id[]" type="hidden" value="<?php echo"$kart_id";?>">
<?php 
}else{
?>
				   <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Kartvizit Seç</b></label>
                      <div class="col-md-8 col-lg-9">
            <select name="kart_id[]" id="multiple-checkboxes" multiple="multiple" class="form-control" required>

			<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul	->execute(array($uye_id));
while($listele	=$kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
			?>
			<option value="<?php echo"$kart_id";?>"><?php echo"$isim $soyisim";?></option>
<?php }?>
			</select>
                       </div>
                       </div>
<?php
}
}
?>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Görsel Seçiniz</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="resim" class="form-control" type="file" id="formFile">
                      </div>
                    </div>
                    <div class="text-center"><input type="hidden" name="action" value="image" />
                      <button type="submit" class="btn btn-dark">Yükle</button>
                    </div>
    </form>
<?PHP
}else{
if($uye_id =="64"){
echo'
<div align="center"><h3>Demo Hesap İşleme Kapalıdır.<br>Lütfen Geri Dönmek İçin Tıklayınız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';
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
$dir_dest = (isset($_GET['dir']) ? $_GET['dir'] : 'assets/slider/');
$dir_pics = (isset($_GET['pics']) ? $_GET['pics'] : $dir_dest);
$action = (isset($_POST['action']) ? $_POST['action'] : (isset($_GET['action']) ? $_GET['action'] : ''));
 if ($action == 'image') {
    $handle = new Upload($_FILES['resim']);
    $handle->image_resize            = true;
    $handle->image_ratio_y           = false;
    $handle->image_x                 = 370;
    $handle->image_y 				 = 220;
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

     $deger 		= count($_POST['kart_id']); 
     for ($i 		= 0; $i < $deger; $i++){
	 $yeniadim 		= "$yeniad";
	 $kart_id 		= $_POST['kart_id'][$i];
$sql 	= $baglan->prepare("INSERT INTO `slider` SET kart_id=?,slider=?");
$kayit  = $sql ->execute(array($kart_id,$yeniadim));
	 }
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="Slider Yüklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
if(isset($kayit)){
header('location: slider');
}else{
echo'<div align="center"><h3>Resimler Yüklenemedi</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>';
}
}
}?>
              </div>
            </div>
          </div>
        </div>
    </section>
  </main>
      <script src="assets/multiple/jquery.js?v=<?php echo"$sayilar";?>"></script>
  <link rel="stylesheet" href="assets/multiple/bootstrap.min.css?v=<?php echo"$sayilar";?>">
  <script type="text/javascript" src="assets/multiple/bootstrap.min.js?v=<?php echo"$sayilar";?>"></script>
  <script src="assets/multiple/bootstrap-multiselect.js?v=<?php echo"$sayilar";?>"></script>
  <link rel="stylesheet" href="assets/multiple/bootstrap-multiselect.css?v=<?php echo"$sayilar";?>">
<script>
    $(document).ready(function() {
        $('#multiple-checkboxes').multiselect({
          includeSelectAllOption: true,
        });
    });
</script>
<?php include 'footer.php';?>