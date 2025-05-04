<?php 
include 'header.php';
$k_id		=$_GET["k_id"];
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
<?php
$tarih 		=date('d.m.Y',time());
$bitis 		=date('d.m.Y', strtotime("+3650 days"));
$guncelle =$baglan->prepare("UPDATE `kartvizit` SET `tarih`=?,`bitis`=? WHERE `id`=?");
$guncelle ->execute(array($tarih,$bitis,$k_id));
if (isset ($guncelle)){
?>
<div align="center"><h3>Yenileme Başarılı.</h3> <br><br>
<a href="yonetim.php?"><button type="button" class="btn btn-dark">Geri Dön</button></a></div>
<?php
}else{
?>
<div align="center"><h3>Yenileme Başarısız</h3> <img src="assets/img/error.gif?v=0.1" border="0" height="64px"></div>
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