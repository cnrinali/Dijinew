<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">BANKA BİLGİLERİM</h5>

<?php
if($yetki =='1'){
	?>
	
              <table class="table table-borderless datatable">
                <thead>
                  <tr>
                        <th scope="col">İsim Soyisim</th>
                        <th scope="col">Banka Adı</th>
                        <th scope="col">Hesap Sahibi</th>
                        <th scope="col">İban Bilgisi</th>
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
$urun_listele 	= $baglan->prepare("SELECT * FROM  `banka` WHERE `kart_id` =?");
$urun_listele	->execute(array($kart_id));
while($row 			= $urun_listele->fetch(PDO::FETCH_ASSOC)){
$banka			= $row["iban"];
$iban			= $row["banka"];
$hesap			= $row["hesap"];
$id				= $row["id"];
if(isset($id)){
?>
					<tr>
                        <td><?php echo"$isim $soyisim";?></td>
                        <td><?php echo"$banka";?></td>
                        <td><?php echo"$hesap";?></td>
                        <td><?php echo"$iban";?></td>
                        <td>
						<h1><a href="bguncelle.php?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						<a href="bankasil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil"><i class="bx bx-trash"></i></a></h1></td>
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
                        <th scope="col">Banka Adı</th>
                        <th scope="col">Hesap Sahibi</th>
                        <th scope="col">İban Bilgisi</th>
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
$urun_listele 	= $baglan->prepare("SELECT * FROM  `banka` WHERE `kart_id` =?");
$urun_listele	->execute(array($kart_id));
while($row 			= $urun_listele->fetch(PDO::FETCH_ASSOC)){
$banka			= $row["iban"];
$iban			= $row["banka"];
$hesap			= $row["hesap"];
$id				= $row["id"];
if(isset($id)){
?>
					<tr>
<?php if($paket !=="1"){ ?>
                        <td><?php echo"$isim $soyisim";?></td>
<?php }?>
                        <td><?php echo"$banka";?></td>
                        <td><?php echo"$hesap";?></td>
                        <td><?php echo"$iban";?></td>
                        <td>
						<?php 
						if($uye_id =="112"){}else{
						?>
						<h1>
						<a href="bguncelle.php?id=<?php echo"$id";?>" alt="Güncelle" title="Güncelle"><i class="bx bx-edit-alt"></i></a>
						<a href="bankasil.php?id=<?php echo"$id";?>" alt="Sil" title="Sil" onclick="return confirm('Silinecektir Onaylıyor Musunuz? Geri Dönüşü Yoktur.')"><i class="bx bx-trash"></i></a>
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
				  <h5 class="card-title">BANKA BİLGİSİ EKLE</h5>
<?php 
extract($_POST);
if(empty($_POST)){
if($uye_id =="112"){}else{
?>				
    <form name="form" action="" method="POST">
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
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Banka Adı</b></label>
                      <div class="col-md-8 col-lg-9">
<select name="banka" class="form-control" required>
  <option value="">Banka Seçimi</option>
  <option value="Garanti Bankası">Garanti Bankası</option>
  <option value="Deniz Bank">Deniz Bank</option>
  <option value="Halk Bankası">Halk Bankası</option>
  <option value="Akbank">Akbank</option>
  <option value="HSBC Bankası">HSBC Bankası</option>
  <option value="İNG Bank">İNG Bank</option>
  <option value="İş Bankası">İş Bankası</option>
  <option value="QNB Finans Bankası">QNB Finans Bankası</option>
  <option value="Kuveyt Türk Bankası">Kuveyt Türk Bankası</option>
  <option value="Şeker Bank">Şeker Bank</option>
  <option value="TEB Bankası">TEB Bankası</option>
  <option value="Ziraat Bankası">Ziraat Bankası</option>
  <option value="Yapı Kredi Bankası">Yapı Kredi Bankası</option>
  <option value="Vakıfbank">Vakıfbank</option>
  <option value="Oyak Bank">Oyak Bank</option>
  <option value="Türkiye Finans Bankası">Türkiye Finans Bankası</option>
  <option value="PTT Bank">PTT Bank</option>
</select>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Hesap Sahibi</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="hesap" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Iban Bilgisi</b></label>
                      <div class="col-md-8 col-lg-9">
                        <input name="iban" type="text" class="form-control" id="isim" required>
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
     $deger 	= count($_POST['kart_id']); 
     for ($i 	= 0; $i < $deger; $i++){
	 $banka 	= $_POST['banka'];
	 $hesap 	= $_POST['hesap'];
	 $iban 		= $_POST['iban'];
	 $kart_id 	= $_POST['kart_id'][$i];
$sql = $baglan->prepare("INSERT INTO `banka` SET kart_id=?, banka=?, hesap=?, iban=?");
$kayit = $sql->execute(array($kart_id,$banka,$hesap,$iban));
	 }
if (isset ($kayit)){
/* LOG */
$islem ="Banka Bilgisi Eklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: banka');	
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