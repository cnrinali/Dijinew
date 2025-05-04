<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				  <h5 class="card-title" Style="color:#000;">FİRMA BİLGİLERİ</h5>
<?php
extract($_POST);
if(empty($_POST)){
?>				
<form name="form" action="" method="POST">
<?php 
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul	->execute(array($uye_id));
$listele		=$kullanicibul->fetch(PDO::FETCH_ASSOC);
$kart_id		=$listele["kart_id"];
?>
<input name="kartid" type="hidden" value="<?php echo"$kart_id";?>">
				<div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Firma Ünvanı</b></label>
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
	                   	<br>
				   <div class="text-center"><a href="sihirbaz-2"><button class="btn btn-light" style="border:1px solid #000;">Bu Adımı Atla</button></a></div>
<?php 
}else{
$tarih 		=date('d.m.Y',time());
$sql = $baglan->prepare("INSERT INTO `kurumsal` SET kart_id=?,firma=?,vergidairesi=?,vergino=?,adres=? ");
$kayit = $sql ->execute(array($kart_id,$firma,$vergidairesi,$vergino,$adres));

if (isset ($kayit)){

/* LOG */
$islem ="Kurumsal İçerik Eklendi ($kartid)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */

?>
<div align="center">
<h3>Firma Bilgileriniz Oluşturuldu.</h3> <br><br>
<a href="sihirbaz-2"><button type="button" class="btn btn-dark">Sonraki Adım</button></a><br>
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