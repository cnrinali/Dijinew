<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">FİRMA BİLGİLERİM</h5>
              
<?php
if($yetki =='1'){
?>

			  <table class="table table-borderless datatable">
                <thead>
                  <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Firma</th>
                        <th scope="col">Vergi D.</th>
                        <th scope="col">Vergi N.</th>
                        <th scope="col">Adres</th>
                        <th scope="col" style="min-width:100px;">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit`");
$kullanicibul	->execute();
while($listele	=$kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];

$urun_listele 	= $baglan->prepare("SELECT * FROM  `kurumsal` WHERE `kart_id` =?");
$urun_listele	->execute(array($kart_id));
while($row 			= $urun_listele->fetch(PDO::FETCH_ASSOC)){
$firma			= $row["firma"];
$vergidairesi	= $row["vergidairesi"];
$vergino		= $row["vergino"];
$adres			= $row["adres"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$firma";?></td>
                        <td><?php echo"$vergidairesi";?></td>
                        <td><?php echo"$vergino";?></td>
                        <td><?php echo"$adres";?></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<?php if (isMobile()) { ?>
						<h1><a href="kguncelle.php?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a><a href="kurumsalsil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a></h1>
						<?php }else{ ?>
						<h1><a href="kguncelle.php?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a><a href="kurumsalsil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a></h1>
						<?php } }?>
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
<?php if($paket !=="1"){ ?>
                        <th scope="col">İsim Soyisim</th>
<?php }?>
						<th scope="col">Firma</th>
                        <th scope="col">Vergi D.</th>
                        <th scope="col">Vergi N.</th>
                        <th scope="col">Adres</th>
                        <th scope="col" style="min-width:100px;">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
<?php
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul	->execute(array($uye_id));
while($listele		=$kullanicibul->fetch(PDO::FETCH_ASSOC)){
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];

$urun_listele 	= $baglan->prepare("SELECT * FROM  `kurumsal` WHERE `kart_id` =?");
$urun_listele	->execute(array($kart_id));
while($row 		= $urun_listele->fetch(PDO::FETCH_ASSOC)){
$firma			= $row["firma"];
$vergidairesi	= $row["vergidairesi"];
$vergino		= $row["vergino"];
$adres			= $row["adres"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
<?php if($paket !=="1"){ ?>
                        <td><?php echo"$isim $soyisim";?></td>
<?php }?>
                        <td><?php echo"$firma";?></td>
                        <td><?php echo"$vergidairesi";?></td>
                        <td><?php echo"$vergino";?></td>
                        <td><?php echo"$adres";?></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<h1>
						<a href="kguncelle.php?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						<a href="kurumsalsil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a>
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
				  <h5 class="card-title">FİRMA BİLGİLERİNİ EKLE</h5>
<?php
extract($_POST);
if(empty($_POST)){
?>
						<?php 
						if($uye_id =="112"){}else{
						?>
    <form name="form" action="" method="POST">
						<?php }
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
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Firma</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="firma" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Vergi Dairesi</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="vergidairesi" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Vergi Numarası</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="vergino" type="number" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Adres</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="adres" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Ekle</button>
                    </div>
    </form>
<?php 
}else{
if($uye_id =="64"){
echo'
<div align="center"><h3>Demo Hesap İşleme Kapalıdır.<br>Lütfen Geri Dönmek İçin Tıklayınız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';
}else{
$tarih 		=date('d.m.Y',time());

     $deger 		= count($_POST['kart_id']); 
     for ($i 		= 0; $i < $deger; $i++){
	 $firma 		= $_POST['firma'];
	 $vergidairesi 	= $_POST['vergidairesi'];
	 $vergino 		= $_POST['vergino'];
	 $adres 		= $_POST['adres'];
	 $kart_id 		= $_POST['kart_id'][$i];
	 
$sql = $baglan->prepare("INSERT INTO `kurumsal` SET kart_id=?,firma=?,vergidairesi=?,vergino=?,adres=? ");
$kayit = $sql ->execute(array($kart_id,$firma,$vergidairesi,$vergino,$adres));
	 }
if (isset ($kayit)){

/* LOG */
$islem ="Kurumsal İçerik Eklendi ($kartid)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: kurumsal');
}else{
?>
<div align="center"><h3>Kayıt Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
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