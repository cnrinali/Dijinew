<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">DÖKÜMAN BİLGİLERİM</h5>
<?php
if($yetki =='1'){
?>

	               <table class="table table-borderless"> 
					<thead>
                      <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Başlık</th>
                        <th scope="col">Döküman</th>
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
$urun_listele 	= $baglan->prepare("SELECT * FROM  `katalog` WHERE`kart_id` =?");
$urun_listele ->execute(array($kart_id));
while ($row 	= $urun_listele->fetch(PDO::FETCH_ASSOC)){
$link			= $row["link"];
$baslik			= $row["baslik"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$baslik";?></td>
                        <td><a href="<?php echo"$link";?>" style="text-decoration:none;"><img src="assets/img/pdfkatalog.png?v=0.1" height="40px"></a></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<?php if (isMobile()) { ?>
						<h1><a href="katalogsil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a></h1>
						<?php }else{ ?>
						<h1><a href="katalogsil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a></h1>
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
                        <th scope="col">Başlık</th>
                        <th scope="col">Döküman</th>
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
$urun_listele 	= $baglan->prepare("SELECT * FROM  `katalog` WHERE`kart_id` =?");
$urun_listele -> execute(array($kart_id));
while ($row 	= $urun_listele->fetch(PDO::FETCH_ASSOC)){
$link			= $row["link"];
$baslik			= $row["baslik"];
$id				= $row["id"];
if(isset($id)){
?>
                      <tr>
<?php if($paket !=="1"){ ?>
                        <td><?php echo"$isim $soyisim";?></td>
<?php }?>

                        <td><?php echo"$baslik";?></td>
                        <td><a href="<?php echo"$link";?>" style="text-decoration:none;"><img src="assets/img/pdfkatalog.png?v=0.1" height="40px"></a></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<?php if (isMobile()) { ?>
						<h1><a href="katalogsil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a></h1>
						<?php }else{ ?>
						<h1><a href="katalogsil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a></h1>
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
}
?>

				  <h5 class="card-title">DÖKÜMAN EKLE</h5>
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
					<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Döküman Başlık</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="baslik" class="form-control" type="text" required>
                      </div>
                    </div>
                    <div class="row mb-3">
					<label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>PDF Formatında Döküman Seçiniz</b></label>
                      <div class="col-md-8 col-lg-9">
						<input name="resim" class="form-control" type="file" id="formFile">
                      </div>
                    </div>
                    <div class="text-center">
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

if(preg_match('/(.*)\.(.*)/',$_FILES['resim']['name'],$dizi) ) {
$format=$dizi[2];
}
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
$dosyaUzantisi = pathinfo($_FILES['resim']['name'], PATHINFO_EXTENSION);
if ($dosyaUzantisi != "pdf") { # Dosya uzantı kontrolü
echo'<div align="center"><h3>Yalnızca (PDF) Uzantılı Dosyalar Yüklenebilir</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>';
} else {
$addcatid = $sayilar;
$createprodnum = $addfrontchar . $randnum . 
$addcatid;
$new_name="".$createprodnum.".".$format."";
$kaynak		= $_FILES["resim"]["tmp_name"];   // Yüklenen dosyanın adı
$klasor		= "assets/katalog/"; // Hedef klasörümüz
$yukle		= $klasor.basename($new_name);
if ( move_uploaded_file($kaynak, $yukle) )
{
$dosya		= "assets/katalog/" . $new_name;
echo'<div align="center"><h3>Katalog Yüklendi</h3> 
<a href="katalog"><button type="button" class="btn btn-dark">Sayfayı Yenile</button></a></div>
';
     $deger 	= count($_POST['kart_id']); 
     for ($i 	= 0; $i < $deger; $i++){
	 $baslik 	= $_POST['baslik'];
	 $dosyam 	= "$dosya";
	 $kart_id 	= $_POST['kart_id'][$i];
	 
$sql = $baglan->prepare("INSERT INTO `katalog` SET `kart_id`=?,`link`=?,`baslik`=?");
$kayit = $sql->execute(array($kart_id,$dosyam,$baslik));
	 }
	 
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="Katalog Yüklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
}else{
echo'<div align="center"><h3>Katalog Yüklenemedi</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>';
}
}
}
}
?>
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