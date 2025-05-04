<?php 
include 'header.php';
?>
  <main id="main" class="main">

    <section class="section profile">
      <div class="row">
        <div class="col-xl-12">

          <div class="card">
            <div class="card-body pt-3">
<?php
extract($_POST);
if($uye_id =="64"){
echo'
<div align="center"><h3>Demo Hesap İşleme Kapalıdır.<br>Lütfen Geri Dönmek İçin Tıklayınız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';
}elseif (empty($_POST)){
echo'<div align="center"><h3>Güncelleme Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>';
}ELSE{
$guncelle =$baglan->prepare("UPDATE `uye` SET `isim`=?,`soyisim`=?,`telefon`=?,`email`=? WHERE `id`=?");
$guncelle->execute(array($isim,$soyisim,$telefon,$email,$id));
if (isset ($guncelle)){
	
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="Profil Güncellemesi Yapıldı ($isim $soyisim)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: profil');

}else{
?>
<div align="center"><h3>Güncelleme Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
?>
            </div>
          </div>

        </div>
      </div>
    </section>

  </main><!-- End #main -->
<?php include 'footer.php';?>