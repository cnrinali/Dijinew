<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
<?php
$id			= $_GET["id"];
$delete		= $baglan->prepare("DELETE FROM `kartvizit` WHERE `id` =?");
$delete ->execute(array($id));
if (isset ($delete)){
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="$id Numaralı Kartvizit Silindi";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: kartvizit');
}else{
?>
<div align="center"><h3>Silme İşlemi Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
 ?>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
<?php include 'footer.php';?>