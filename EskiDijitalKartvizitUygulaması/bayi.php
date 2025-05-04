<?php 
include 'header.php';
?>
  <main id="main" class="main">

    <section class="section profile">
      <div class="row">
        <div class="col-xl-12">

          <div class="card">
		  
            <div class="card-body pt-3">
			<h5 class="card-title">Yeni Bayi</h5>
                  <?php
				  if(empty($_POST)){
				  ?>
                  <form name="form" action="" method="POST">
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">İsim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="isim" type="text" class="form-control" id="isim" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Soyisim</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="soyisim" type="text" class="form-control" id="soyisim" required>
                      </div>
                    </div>

                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Bayi İsmi</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="bayi_adi" type="text" class="form-control" id="bayi_adi" required>
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">Telefon</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="telefon" type="number" class="form-control" id="telefon" required>
                      </div>
                    </div>
					
                    <div class="row mb-3">
                      <label for="fullName" class="col-md-4 col-lg-3 col-form-label">E-Posta</label>
                      <div class="col-md-8 col-lg-9">
                        <input name="email" type="text" class="form-control" id="email" required>
                      </div>
                    </div>
				
                    <div class="text-center">
                      <button type="submit" class="btn btn-dark">Ekle</button>
                    </div>
                  </form>
				  <?PHP }else{
$isim	 	= $_POST['isim'];
$soyisim 	= $_POST['soyisim'];
$telefon 	= $_POST['telefon'];
$email 	 	= $_POST['email'];
$bayi_adi	= $_POST['bayi_adi'];

$tarih 		=date('d.m.Y',time());
$sor = $baglan->prepare("SELECT * FROM `bayi` WHERE `email` =?");
$sor	->execute(array($email));
$uyevarmi	=$sor->fetch(PDO::FETCH_ASSOC);
$id			= $uyevarmi["id"];
if(isset($id)){
echo'<h5 class="card-title text-center pb-0 fs-4">Bu Mail Adresi ile Kayıt Mevcut<br><br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></h5>';
} else {
$sql = $baglan->prepare("INSERT INTO `bayi` SET isim=?, soyisim=?, bayi_adi=?, telefon=?, email=?");
$kayit = $sql->execute(array($isim,$soyisim,$bayi_adi,$telefon,$email));

if (isset ($kayit)){
	
/* LOG */

$islem ="Yeni Bayi Kaydı Yapıldı ($bayi_adi)";
$logkayit = $baglan->prepare("INSERT INTO `log` SET uye_id=?, islem=?, tarih=?,proxyip=?,gercekip=?,sehir=?,ulke=?,tarayici=?");
$rec = $logkayit->execute(array($uye_id,$islem,$tarih,$proxyip,$gercekip,$sehir,$ulke,$tarayici));
/* LOG */
header('location: bayiler');	
}else{
?>
<div align="center"><h3>Bayi Kaydı Başarısız</h3> <br><br><a href="yonetim"><button type="button" class="btn btn-dark">Panele Dön</button></a></div>
<?php	
}
}
				  }?>
            </div>
          </div>

        </div>
      </div>
    </section>

  </main><!-- End #main -->
<?php include 'footer.php';?>