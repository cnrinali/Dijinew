<?php 
include 'header.php';
extract($_POST);
$id	=$_GET["id"];
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">BANKA BİLGİ</h5>
<?php 
if(empty($_POST)){
$kartvizitbul	=$baglan->prepare("SELECT * FROM `banka` WHERE `id` =?");
$kartvizitbul ->execute(array($id));
$klistele		=$kartvizitbul ->fetch(PDO::FETCH_ASSOC);
$kart_id		=$klistele["kart_id"];
$banka			=$klistele["banka"];
$iban			=$klistele["iban"];

$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `kart_id` =?");
$kullanicibul	->execute(array($kart_id));
$listele		=$kullanicibul->fetch(PDO::FETCH_ASSOC);
$kart_id		=$listele["kart_id"];
$isim			=$listele["isim"];
$soyisim		=$listele["soyisim"];
?>				
    <form name="form" action="" method="POST">
				   <div class="row mb-3">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Kartvizit</label>
                      <div class="col-md-8 col-lg-9">
						<input name="id" type="hidden" value="<?php echo"$id";?>">
                        <?php echo"$kart_id - $isim - $soyisim";?>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Banka Adı</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="banka" type="text" class="form-control" id="isim" value="<?php echo"$banka";?>" required>
                      </div>
                    </div>
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Iban Adresi</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="iban" type="text" class="form-control" id="isim" value="<?php echo"$iban";?>" required>
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Güncelle</button>
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

$guncelle =$baglan->prepare("UPDATE `banka` SET `banka`=?,`iban`=? WHERE `id`=?");
$guncelle ->execute(array($banka,$iban,$id));
if (isset ($guncelle)){

/* LOG */
$islem ="Banka Bilgisi Güncellendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: banka');	
}else{
?>
<div align="center"><h3>Güncelleme Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
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
<?php include 'footer.php';?>