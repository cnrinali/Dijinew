<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				  <h5 class="card-title" Style="color:#000;">BANKA BİLGİLERİ</h5>
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
<input name="kart_id" type="hidden" value="<?php echo"$kart_id";?>">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label"><b>Banka Adı</b></label>
                      <div class="col-md-8 col-lg-9">
<select name="banka" class="form-control" required>
  <option value="">Banka Seçimi</option>
  <option value="Garanti Bankası">Garanti Bankası</option>
  <option value="Deniz Bank">Deniz Bank</option>
  <option value="Halk Bankası">Halk Bankası</option>
  <option value="Akbank Bank">Akbank</option>
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
		                   	<br>
				   <div class="text-center"><a href="sihirbaz-3.php"><button class="btn btn-light" style="border:1px solid #000;">Bu Adımı Atla</button></a></div>
<?php 
}else{
$tarih 		=date('d.m.Y',time());
$sql = $baglan->prepare("INSERT INTO `banka` SET kart_id=?, banka=?, hesap=?, iban=?");
$kayit = $sql->execute(array($kart_id,$banka,$hesap,$iban));
if (isset ($kayit)){
/* LOG */
$islem ="Banka Bilgisi Eklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
?>
<div align="center">
<h3>Banka Bilginiz Oluşturuldu.</h3> <br>Diğer Banka Bilgilerinizi Kartvizitinizi Oluşturduktan Sonra Panelinizden Ekleyebilirsiniz.<br><br>
<a href="sihirbaz-3"><button type="button" class="btn btn-dark">Sonraki Adım</button></a><br>
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