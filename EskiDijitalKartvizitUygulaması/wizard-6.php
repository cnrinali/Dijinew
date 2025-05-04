<?php 
include 'businessheader.php';
$kart_id		=$_GET["kart_id"];
?>
  <main id="kapsa" class="kapsa">
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
				   <div class="text-center"><a href="business?kart_id=<?php echo"$kart_id";?>"><button class="btn btn-ligh" style="border:1px solid #000;">Sihirbazdan Çık</button></a></div>
<?PHP
}else{
	
$link = strstr($videolink, '=');
$linkim = ltrim($link,"=");  

$sql = $baglan->prepare("INSERT INTO `video` SET `kart_id`=?,`videolink`=?");
$kayit = $sql->execute(array($kart_id,$linkim));
if (isset ($kayit)){
?>
<div align="center">
<h3>İşlem Başarılı. Tebrikler Kurulumu Tamamladınız.</h3> <br><br>
<a href="business?kart_id=<?php echo"$kart_id";?>"><button type="button" class="btn btn-dark">Kartviziti Görüntüle</button></a>&nbsp;&nbsp;
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