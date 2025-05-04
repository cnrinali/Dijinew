<?php 
include 'header.php';
extract($_POST);
$id	=$_GET["id"];
$durum	=$_GET["durum"];
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">HESAP DONDUR</h5>
	
<?php
$tarih 		=date('d.m.Y',time());
if($uye_id =="64"){
echo'
<div align="center"><h3>Demo Hesap İşleme Kapalıdır.<br>Lütfen Geri Dönmek İçin Tıklayınız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
';
}else{
$guncelle =$baglan->prepare("UPDATE `kartvizit` SET `durum`=? WHERE `id`=?");
$guncelle ->execute(array($durum,$id));
if (isset ($guncelle)){

/* LOG */
$islem ="Kart Düzenlemesi Yapıldı ($id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: yonetim');	

}else{
?>
<div align="center"><h3>İşlem Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
?>
              </div>
            </div>
          </div>
        </div>
    </section>
  </main>
<?php include 'footer.php';?>