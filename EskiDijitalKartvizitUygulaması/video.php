<?php 
include 'header.php';
?>

  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">TANITIM VİDEO</h5>
<?php
if($yetki =='1'){
	?>
	               <table class="table table-borderless"> 
					<thead>
                      <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Video</th>
                        <th scope="col" style="min-width:100px;">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
	<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit`");
$kullanicibul ->execute();
while ($listele	= $kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
$urun_listele 	= $baglan->prepare("SELECT * FROM  `video` WHERE`kart_id` =?");
$urun_listele ->execute(array($kart_id));
while ($row 	= $urun_listele->fetch(PDO::FETCH_ASSOC)){
$videolink			= $row["videolink"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><a href="https://www.youtube.com/embed/<?php echo"$videolink";?>" target="_blank" class="btn btn-dark btn btn"><i class="bi bi-play-btn-fill"></i> Video</a></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<h1>
						<a href="videosil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('Silinecektir Onaylıyor Musunuz? Geri Dönüşü Yoktur.')"><i class="bx bx-trash"></i>
						</a>
						</h1>
						<?php }?>
						</td>
                      </tr>
<?php
}
}
}
?>
                     </tbody>
                  </table>
<?php
}elseif($yetki =='0'){
	?>
	               <table class="table table-borderless" style="font-size:9pt;"> 
					<thead>
                      <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Video</th>
                        <th scope="col" style="min-width:100px;">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
	<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul->execute(array($uye_id));
while($listele		=$kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
$urun_listele 	= $baglan->prepare("SELECT * FROM  `video` WHERE`kart_id` =?");
$urun_listele -> execute(array($kart_id));
while ($row 	= $urun_listele->fetch(PDO::FETCH_ASSOC)){
$videolink			= $row["videolink"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><a href="https://www.youtube.com/embed/<?php echo"$videolink";?>" target="_blank" class="btn btn-dark btn btn"><i class="bi bi-play-btn-fill"></i> Video</a></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<h1>
						<a href="videosil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('Silinecektir Onaylıyor Musunuz? Geri Dönüşü Yoktur.')">
						<i class="bx bx-trash"></i>
						</a>
						</h1>
						<?php }?>
						</td>
                      </tr>
<?php 
}
}
}
?>
                     </tbody>
                  </table>
<?php
}
?>
				  <h5 class="card-title">TANITIM VİDEO (Youtube) EKLE</h5>
<?php 
extract($_POST);
if(empty($_POST)){
?>
						<?php 
						if($uye_id =="112"){}else{
						?>
    <form name="form" action="" method="POST" enctype="multipart/form-data">
	<?php 
						}
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
					<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Video Adresi Yaz</label>
                      <div class="col-md-8 col-lg-9">
						<input name="videolink" class="form-control" type="text" placeholder="Ör: https://www.youtube.com/watch?v=XJx5UyzRQaE)">
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Ekle</button>
                    </div>
    </form>
<?PHP
}else{
if($uye_id =="64"){
echo'
<div align="center"><h3>Demo Hesap İşleme Kapalıdır.<br>Lütfen Geri Dönmek İçin Tıklayınız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';
}else{
	
$link = substr("$videolink", -11);


     $deger 		= count($_POST['kart_id']); 
     for ($i 		= 0; $i < $deger; $i++){
	 $linkadresi 		= "$link";
	 $kart_id 		= $_POST['kart_id'][$i];
	 
$sql = $baglan->prepare("INSERT INTO `video` SET `kart_id`=?,`videolink`=?");
$kayit = $sql->execute(array($kart_id,$linkadresi));
	 }
if (isset($kayit)){
header('location: video');
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="Video Yüklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
}else{
echo'<div align="center"><h3>Video Yüklenemedi</h3> <img src="assets/img/error.gif?v=0.1" border="0" height="64px"></div>';
}
}
}
?>
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