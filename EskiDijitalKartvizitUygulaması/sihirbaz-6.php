<?php 
include 'header.php';
?>
  <main id="main" class="main">
    <section class="section">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-body">
				<h5 class="card-title">TANITIM VİDEO</h5>
				  <h5 class="card-title">VİDEO EKLE(YOUTUBE)</h5>
<?php 
extract($_POST);
if(empty($_POST)){
?>				
    <form name="form" action="" method="POST" enctype="multipart/form-data">
<?php 
$kullanicibul	=$baglan->prepare("SELECT * FROM `kartvizit` WHERE `uye_id` =?");
$kullanicibul->execute(array($uye_id));
$listele	= $kullanicibul->FETCH(PDO::FETCH_ASSOC);
$kart_id		=$listele["kart_id"];
?>
<input name="kart_id" type="hidden" value="<?php echo"$kart_id";?>">
                    <div class="row mb-3">
					<label for="fullName" class="col-md-4 col-lg-3 col-form-label">Video Adresi Yaz</label>
                      <div class="col-md-8 col-lg-9">
						<input name="videolink" class="form-control" type="text" placeholder="Ör: https://www.youtube.com/watch?v=XJx5UyzRQaE)">
                      </div>
                    </div>
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Yükle</button>
                    </div>
    </form>
	                   	<br>
				   <div class="text-center"><a href="yonetim"><button class="btn btn-ligh" style="border:1px solid #000;">Sihirbazdan Çık</button></a></div>
<?PHP
}else{
	
$link = substr("$videolink", -11);

	 $linkadresi 		= "$link";
	 $kart_id 		= $_POST['kart_id'];
	 
$sql = $baglan->prepare("INSERT INTO `video` SET `kart_id`=?,`videolink`=?");
$kayit = $sql->execute(array($kart_id,$linkadresi));
if (isset ($kayit)){
/* LOG */
$tarih 		=date('d.m.Y',time());
$islem ="Video Yüklendi ($kart_id)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
?>
<div align="center">
<h3>İşlem Başarılı. Tebrikler Sihirbazı Tamamladınız.</h3> <br><br>
<a href="<?php echo"$domain";?>/index.php?kart_id=<?php echo"$kart_id";?>"><button type="button" class="btn btn-dark">Kartviziti Görüntüle</button></a>&nbsp;&nbsp;
<a href="yonetim.php"><button type="button" class="btn btn-dark">Panele Dön</button></a><br>
</div>
<?php
}else{
?>
<div align="center"><h3>İşlem Başarısız Lütfen Geri Tuşuna Basıp Eksikleri Gideriniz.</h3> <img src="assets/img/error.gif?v=0.1" border="0" height="64px"></div>
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